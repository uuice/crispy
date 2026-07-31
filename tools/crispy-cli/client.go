package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"
)

type Client struct {
	BaseURL    string
	Token      string
	HTTPClient *http.Client
}

func newClient(baseURL, token string) *Client {
	return &Client{
		BaseURL: strings.TrimRight(baseURL, "/"),
		Token:   token,
		HTTPClient: &http.Client{
			Timeout: 0, // agent streams can run long; per-request timeouts set where needed
		},
	}
}

func (c *Client) authHeaders(h http.Header) {
	h.Set("Authorization", "JWT "+c.Token)
	h.Set("Cookie", "payload-token="+c.Token)
}

type loginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type loginResponse struct {
	Token  string          `json:"token"`
	User   json.RawMessage `json:"user"`
	Errors []struct {
		Message string `json:"message"`
	} `json:"errors"`
	Message string `json:"message"`
}

type meResponse struct {
	User *struct {
		ID    any    `json:"id"`
		Email string `json:"email"`
		Name  string `json:"name"`
	} `json:"user"`
	Errors []struct {
		Message string `json:"message"`
	} `json:"errors"`
}

func (c *Client) Login(email, password string) (string, error) {
	body, err := json.Marshal(loginRequest{Email: email, Password: password})
	if err != nil {
		return "", err
	}

	req, err := http.NewRequest(http.MethodPost, c.BaseURL+"/api/users/login", bytes.NewReader(body))
	if err != nil {
		return "", err
	}
	req.Header.Set("Content-Type", "application/json")

	httpClient := &http.Client{Timeout: 30 * time.Second}
	res, err := httpClient.Do(req)
	if err != nil {
		return "", err
	}
	defer res.Body.Close()

	raw, err := io.ReadAll(res.Body)
	if err != nil {
		return "", err
	}

	var parsed loginResponse
	if err := json.Unmarshal(raw, &parsed); err != nil {
		return "", fmt.Errorf("login: invalid JSON (%s): %w", truncate(string(raw), 200), err)
	}
	if len(parsed.Errors) > 0 {
		return "", fmt.Errorf("login failed: %s", parsed.Errors[0].Message)
	}
	if res.StatusCode >= 400 || parsed.Token == "" {
		msg := parsed.Message
		if msg == "" {
			msg = truncate(string(raw), 200)
		}
		return "", fmt.Errorf("login failed (%d): %s", res.StatusCode, msg)
	}
	return parsed.Token, nil
}

func (c *Client) Me() (email, name string, id any, err error) {
	req, err := http.NewRequest(http.MethodGet, c.BaseURL+"/api/users/me", nil)
	if err != nil {
		return "", "", nil, err
	}
	c.authHeaders(req.Header)

	httpClient := &http.Client{Timeout: 30 * time.Second}
	res, err := httpClient.Do(req)
	if err != nil {
		return "", "", nil, err
	}
	defer res.Body.Close()

	raw, err := io.ReadAll(res.Body)
	if err != nil {
		return "", "", nil, err
	}

	var parsed meResponse
	if err := json.Unmarshal(raw, &parsed); err != nil {
		return "", "", nil, fmt.Errorf("me: invalid JSON (%s): %w", truncate(string(raw), 200), err)
	}
	if len(parsed.Errors) > 0 {
		return "", "", nil, fmt.Errorf("%s", parsed.Errors[0].Message)
	}
	if res.StatusCode >= 400 || parsed.User == nil {
		return "", "", nil, fmt.Errorf("unauthorized (%d)", res.StatusCode)
	}
	return parsed.User.Email, parsed.User.Name, parsed.User.ID, nil
}

type agentMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type agentRequest struct {
	Messages  []agentMessage `json:"messages"`
	SessionID any            `json:"sessionId,omitempty"`
}

func (c *Client) AgentStream(messages []agentMessage, sessionID any) (*http.Response, error) {
	body, err := json.Marshal(agentRequest{Messages: messages, SessionID: sessionID})
	if err != nil {
		return nil, err
	}

	req, err := http.NewRequest(http.MethodPost, c.BaseURL+"/api/ai/agent", bytes.NewReader(body))
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "text/event-stream")
	c.authHeaders(req.Header)

	res, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, err
	}
	if res.StatusCode >= 400 {
		defer res.Body.Close()
		raw, _ := io.ReadAll(io.LimitReader(res.Body, 4096))
		var errBody struct {
			Error string `json:"error"`
		}
		_ = json.Unmarshal(raw, &errBody)
		if errBody.Error != "" {
			return nil, fmt.Errorf("agent failed (%d): %s", res.StatusCode, errBody.Error)
		}
		return nil, fmt.Errorf("agent failed (%d): %s", res.StatusCode, truncate(string(raw), 300))
	}
	return res, nil
}

func truncate(s string, n int) string {
	s = strings.TrimSpace(s)
	if len(s) <= n {
		return s
	}
	return s[:n] + "…"
}
