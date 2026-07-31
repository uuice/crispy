package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"io"
	"os"
	"strings"
)

type streamEvent struct {
	Type      string          `json:"type"`
	Text      string          `json:"text,omitempty"`
	Error     string          `json:"error,omitempty"`
	SessionID json.RawMessage `json:"sessionId,omitempty"`
	ID        string          `json:"id,omitempty"`
	Name      string          `json:"name,omitempty"`
	Args      json.RawMessage `json:"args,omitempty"`
	Result    json.RawMessage `json:"result,omitempty"`
}

type streamOptions struct {
	QuietTools bool
	OnText     func(chunk string)
	OnSession  func(sessionID string)
}

func consumeAgentSSE(r io.Reader, opts streamOptions) error {
	scanner := bufio.NewScanner(r)
	scanner.Buffer(make([]byte, 0, 64*1024), 4*1024*1024)

	var block strings.Builder

	flush := func() error {
		payload := extractSSEData(block.String())
		block.Reset()
		if payload == "" {
			return nil
		}

		var ev streamEvent
		if err := json.Unmarshal([]byte(payload), &ev); err != nil {
			return nil
		}

		switch ev.Type {
		case "text":
			// Keep assistant stream unstyled so chunked SSE does not flicker ANSI resets.
			fmt.Fprint(os.Stdout, ev.Text)
			if opts.OnText != nil {
				opts.OnText(ev.Text)
			}
		case "session":
			sid := strings.Trim(string(ev.SessionID), `"`)
			if opts.OnSession != nil && sid != "" {
				opts.OnSession(sid)
			}
			fmt.Fprintln(os.Stderr, paintf(styleDim, "⬡ session %s", sid))
		case "tool_start":
			if !opts.QuietTools {
				args := compactJSON(ev.Args)
				fmt.Fprintln(os.Stderr, paintf(styleTool, "⚙ %s %s", ev.Name, args))
			}
		case "tool_result":
			if !opts.QuietTools {
				fmt.Fprintln(os.Stderr, paintf(styleDim, "✓ %s", ev.Name))
			}
		case "error":
			fmt.Fprintln(os.Stdout)
			return fmt.Errorf("%s", ev.Error)
		case "done":
			fmt.Fprintln(os.Stdout)
		}
		return nil
	}

	for scanner.Scan() {
		line := scanner.Text()
		if line == "" {
			if err := flush(); err != nil {
				return err
			}
			continue
		}
		if block.Len() > 0 {
			block.WriteByte('\n')
		}
		block.WriteString(line)
	}
	if err := scanner.Err(); err != nil {
		return err
	}
	return flush()
}

func extractSSEData(block string) string {
	var parts []string
	for _, line := range strings.Split(block, "\n") {
		line = strings.TrimRight(line, "\r")
		if strings.HasPrefix(line, "data:") {
			parts = append(parts, strings.TrimSpace(strings.TrimPrefix(line, "data:")))
		}
	}
	return strings.Join(parts, "\n")
}

func compactJSON(raw json.RawMessage) string {
	if len(raw) == 0 {
		return "{}"
	}
	var v any
	if err := json.Unmarshal(raw, &v); err != nil {
		return string(raw)
	}
	b, err := json.Marshal(v)
	if err != nil {
		return string(raw)
	}
	s := string(b)
	if len(s) > 240 {
		return s[:240] + "…"
	}
	return s
}
