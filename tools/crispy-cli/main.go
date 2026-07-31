package main

import (
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strings"
	"syscall"

	"github.com/chzyer/readline"
	"golang.org/x/term"
)

// Set at link time: -ldflags "-X main.version=0.1.0"
var version = "0.1.0"

type app struct {
	cfg        Config
	url        string
	token      string
	client     *Client
	history    []agentMessage
	sessionID  any
	quietTools bool
	rl         *readline.Instance
}

type slashCmd struct {
	Name string
	Desc string
}

var slashCommands = []slashCmd{
	{"/help", "Show commands"},
	{"/login", "Log in  /login [url] [email] [password]"},
	{"/logout", "Clear saved credentials"},
	{"/whoami", "Show current user"},
	{"/url", "Show or set server URL"},
	{"/clear", "Clear chat history & session"},
	{"/session", "Show or resume session id"},
	{"/tools", "Tool traces on|off"},
	{"/status", "Connection summary"},
	{"/quit", "Exit"},
}

func main() {
	if len(os.Args) > 1 {
		switch os.Args[1] {
		case "version", "-v", "--version":
			fmt.Println("crispy", version)
			return
		case "help", "-h", "--help":
			printHelp()
			return
		}
	}

	startupURL := ""
	for i := 1; i < len(os.Args); i++ {
		arg := os.Args[i]
		switch {
		case arg == "--url" && i+1 < len(os.Args):
			startupURL = os.Args[i+1]
			i++
		case strings.HasPrefix(arg, "--url="):
			startupURL = strings.TrimPrefix(arg, "--url=")
		default:
			fmt.Fprintln(os.Stderr, paintf(styleErr, "unknown argument: %s", arg))
			fmt.Fprintln(os.Stderr, paint(styleDim, "start with just `crispy`, then use /commands"))
			os.Exit(2)
		}
	}

	a, err := newApp(startupURL)
	if err != nil {
		fmt.Fprintln(os.Stderr, paintf(styleErr, "error: %v", err))
		os.Exit(1)
	}
	if err := a.repl(); err != nil {
		fmt.Fprintln(os.Stderr, paintf(styleErr, "error: %v", err))
		os.Exit(1)
	}
}

func newApp(startupURL string) (*app, error) {
	cfg, err := loadConfig()
	if err != nil {
		return nil, err
	}

	url := firstNonEmpty(startupURL, os.Getenv("CRISPY_URL"), cfg.URL)
	url = strings.TrimRight(strings.TrimSpace(url), "/")
	token := firstNonEmpty(os.Getenv("CRISPY_TOKEN"), cfg.Token)

	a := &app{cfg: cfg, url: url, token: token}
	a.refreshClient()
	return a, nil
}

func (a *app) refreshClient() {
	if a.url != "" && a.token != "" {
		a.client = newClient(a.url, a.token)
	} else {
		a.client = nil
	}
}

func (a *app) repl() error {
	histPath, _ := historyPath()
	if histPath != "" {
		_ = os.MkdirAll(filepath.Dir(histPath), 0o700)
	}

	completer := &slashCompleter{}

	rl, err := readline.NewEx(&readline.Config{
		Prompt:              a.prompt(),
		HistoryFile:         histPath,
		HistoryLimit:        500,
		AutoComplete:        completer,
		InterruptPrompt:     "^C",
		EOFPrompt:           "bye",
		FuncFilterInputRune: filterInput,
	})
	if err != nil {
		return err
	}
	defer rl.Close()
	a.rl = rl

	a.printBanner()
	printSlashHints("")

	for {
		rl.SetPrompt(a.prompt())
		line, err := rl.Readline()
		if err != nil {
			if err == readline.ErrInterrupt {
				continue
			}
			if err == io.EOF {
				fmt.Fprintln(os.Stderr, paint(styleDim, "bye"))
				return nil
			}
			return err
		}

		line = strings.TrimSpace(line)
		if line == "" {
			continue
		}

		// Bare "/" → show recommendations, stay in REPL.
		if line == "/" {
			printSlashHints("")
			continue
		}

		if strings.HasPrefix(line, "/") {
			quit, cmdErr := a.handleSlash(line)
			if cmdErr != nil {
				fmt.Fprintln(os.Stderr, paintf(styleErr, "✗ %v", cmdErr))
			}
			if quit {
				fmt.Fprintln(os.Stderr, paint(styleDim, "bye"))
				return nil
			}
			continue
		}

		if chatErr := a.chat(line); chatErr != nil {
			fmt.Fprintln(os.Stderr, paintf(styleErr, "✗ %v", chatErr))
		}
	}
}

func (a *app) prompt() string {
	return paint(styleBrand, "› ")
}

func filterInput(r rune) (rune, bool) {
	switch r {
	case readline.CharCtrlZ:
		return r, false
	}
	return r, true
}

// slashCompleter provides Tab completion for /commands (and /tools args).
type slashCompleter struct{}

func (c *slashCompleter) Do(line []rune, pos int) (newLine [][]rune, length int) {
	s := string(line[:pos])
	if !strings.HasPrefix(strings.TrimLeft(s, " \t"), "/") {
		return nil, 0
	}

	parts := splitArgs(s)
	if len(parts) == 0 {
		return nil, 0
	}

	// Completing command name.
	if len(parts) == 1 && !strings.HasSuffix(s, " ") {
		prefix := parts[0]
		var items [][]rune
		for _, cmd := range slashCommands {
			if strings.HasPrefix(cmd.Name, prefix) {
				items = append(items, []rune(strings.TrimPrefix(cmd.Name, prefix)))
			}
		}
		return items, len([]rune(prefix))
	}

	cmd := strings.ToLower(parts[0])
	if cmd == "/tools" {
		argPrefix := ""
		if len(parts) >= 2 && !strings.HasSuffix(s, " ") {
			argPrefix = parts[1]
		}
		var items [][]rune
		for _, opt := range []string{"on", "off"} {
			if strings.HasPrefix(opt, argPrefix) {
				items = append(items, []rune(strings.TrimPrefix(opt, argPrefix)))
			}
		}
		return items, len([]rune(argPrefix))
	}

	return nil, 0
}

func printSlashHints(prefix string) {
	fmt.Fprintln(os.Stderr)
	fmt.Fprintln(os.Stderr, paint(styleDim, "  commands  (Tab to autocomplete):"))
	shown := 0
	for _, c := range slashCommands {
		if prefix != "" && prefix != "/" && !strings.HasPrefix(c.Name, prefix) {
			continue
		}
		fmt.Fprintf(os.Stderr, "  %s  %s\n",
			paint(styleAssist, fmt.Sprintf("%-10s", c.Name)),
			paint(styleDim, c.Desc),
		)
		shown++
	}
	if shown == 0 {
		fmt.Fprintln(os.Stderr, paint(styleDim, "  (no matches — try /help)"))
	}
	fmt.Fprintln(os.Stderr)
}

func (a *app) printBanner() {
	fmt.Fprintln(os.Stderr, paintf(styleBrand, "crispy %s", version)+"  "+paint(styleDim, a.statusLine()))
	fmt.Fprintln(os.Stderr, paint(styleDim, "type to chat · / then Tab for commands · ←→ move · ↑↓ history · Ctrl-D quit"))
}

func (a *app) statusLine() string {
	if a.token != "" && a.url != "" {
		who := a.cfg.Email
		if who == "" {
			who = "session"
		}
		return who + " @ " + a.url
	}
	if a.url != "" {
		return "url=" + a.url + " · not logged in — /login"
	}
	return "not logged in — type /login"
}

func printHelp() {
	fmt.Println(paint(styleBrand, "crispy") + paint(styleDim, " — interactive CLI for Crispy CMS admin AI agent"))
	fmt.Println()
	fmt.Println(paint(styleKey, "Start"))
	fmt.Println(paint(styleDim, "  crispy"))
	fmt.Println(paint(styleDim, "  crispy --url http://localhost:3333"))
	fmt.Println()
	fmt.Println(paint(styleKey, "Slash commands") + paint(styleDim, "  (type / or press Tab)"))
	for _, c := range slashCommands {
		fmt.Printf("  %s  %s\n", paint(styleAssist, fmt.Sprintf("%-10s", c.Name)), paint(styleDim, c.Desc))
	}
	fmt.Println()
	fmt.Println(paint(styleDim, "Plain text chats with the agent (multi-turn). Env: CRISPY_URL, CRISPY_TOKEN, NO_COLOR"))
}

func (a *app) handleSlash(line string) (quit bool, err error) {
	parts := splitArgs(line)
	cmd := strings.ToLower(parts[0])
	args := parts[1:]

	switch cmd {
	case "/help", "/h", "/?":
		printHelp()
		return false, nil
	case "/quit", "/exit", "/q":
		return true, nil
	case "/login":
		return false, a.cmdLogin(args)
	case "/logout":
		return false, a.cmdLogout()
	case "/whoami":
		return false, a.cmdWhoami()
	case "/url":
		return false, a.cmdURL(args)
	case "/clear":
		a.history = nil
		a.sessionID = nil
		fmt.Fprintln(os.Stderr, paint(styleOK, "✓ chat cleared"))
		return false, nil
	case "/session":
		return false, a.cmdSession(args)
	case "/tools":
		return false, a.cmdTools(args)
	case "/status":
		return false, a.cmdStatus()
	default:
		printSlashHints(cmd)
		return false, fmt.Errorf("unknown command %s", cmd)
	}
}

func (a *app) readLine(label string) (string, error) {
	fmt.Fprint(os.Stderr, paint(styleKey, label))
	line, err := a.rl.Readline()
	if err != nil {
		return "", err
	}
	return strings.TrimSpace(line), nil
}

func (a *app) cmdLogin(args []string) error {
	url := a.url
	email := firstNonEmpty(os.Getenv("CRISPY_EMAIL"), a.cfg.Email)
	password := os.Getenv("CRISPY_PASSWORD")

	if len(args) >= 1 && looksLikeURL(args[0]) {
		url = strings.TrimRight(args[0], "/")
		args = args[1:]
	}
	if len(args) >= 1 {
		email = args[0]
	}
	if len(args) >= 2 {
		password = args[1]
	}

	var err error
	if url == "" {
		url, err = a.readLine("URL: ")
		if err != nil {
			return err
		}
		url = strings.TrimRight(url, "/")
	}
	if url == "" {
		return fmt.Errorf("url is required (e.g. /login http://localhost:3333)")
	}

	if email == "" {
		email, err = a.readLine("Email: ")
		if err != nil {
			return err
		}
	}
	if email == "" {
		return fmt.Errorf("email is required")
	}

	if password == "" {
		fmt.Fprint(os.Stderr, paint(styleKey, "Password: "))
		b, err := term.ReadPassword(int(syscall.Stdin))
		fmt.Fprintln(os.Stderr)
		if err != nil {
			return err
		}
		password = string(b)
	}
	if password == "" {
		return fmt.Errorf("password is required")
	}

	token, err := newClient(url, "").Login(email, password)
	if err != nil {
		return err
	}

	a.url = url
	a.token = token
	a.cfg.URL = url
	a.cfg.Token = token
	a.cfg.Email = email
	a.refreshClient()
	a.history = nil
	a.sessionID = nil

	if err := saveConfig(a.cfg); err != nil {
		return err
	}
	path, _ := configPath()
	fmt.Fprintln(os.Stderr, paintf(styleOK, "✓ logged in as %s → %s", email, url))
	fmt.Fprintln(os.Stderr, paint(styleDim, "  saved "+path))
	return nil
}

func (a *app) cmdLogout() error {
	if err := clearConfig(); err != nil {
		return err
	}
	a.cfg = Config{}
	a.token = ""
	a.client = nil
	a.history = nil
	a.sessionID = nil
	fmt.Fprintln(os.Stderr, paint(styleOK, "✓ logged out"))
	return nil
}

func (a *app) cmdWhoami() error {
	if err := a.requireAuth(); err != nil {
		return err
	}
	email, name, id, err := a.client.Me()
	if err != nil {
		return err
	}
	fmt.Fprintln(os.Stderr, paintf(styleDim, "url    %s", a.url))
	fmt.Fprintln(os.Stderr, paintf(styleDim, "id     %v", id))
	fmt.Fprintln(os.Stderr, paintf(styleKey, "email  %s", email))
	if name != "" {
		fmt.Fprintln(os.Stderr, paintf(styleDim, "name   %s", name))
	}
	return nil
}

func (a *app) cmdURL(args []string) error {
	if len(args) == 0 {
		if a.url == "" {
			fmt.Fprintln(os.Stderr, paint(styleDim, "url not set — /url http://localhost:3333  or  /login <url>"))
			return nil
		}
		fmt.Fprintln(os.Stderr, paint(styleAssist, a.url))
		return nil
	}
	a.url = strings.TrimRight(args[0], "/")
	a.cfg.URL = a.url
	a.refreshClient()
	_ = saveConfig(a.cfg)
	fmt.Fprintln(os.Stderr, paintf(styleOK, "✓ url → %s", a.url))
	return nil
}

func (a *app) cmdSession(args []string) error {
	if len(args) == 0 {
		if a.sessionID == nil {
			fmt.Fprintln(os.Stderr, paint(styleDim, "no active session"))
			return nil
		}
		fmt.Fprintln(os.Stderr, paintf(styleAssist, "session %v", a.sessionID))
		return nil
	}
	a.sessionID = args[0]
	a.history = nil
	fmt.Fprintln(os.Stderr, paintf(styleOK, "✓ resume session %s", args[0]))
	fmt.Fprintln(os.Stderr, paint(styleDim, "  history reset locally; server may still have prior turns"))
	return nil
}

func (a *app) cmdTools(args []string) error {
	if len(args) == 0 {
		state := "on"
		if a.quietTools {
			state = "off"
		}
		fmt.Fprintln(os.Stderr, paintf(styleDim, "tools %s", state))
		return nil
	}
	switch strings.ToLower(args[0]) {
	case "on", "1", "true":
		a.quietTools = false
		fmt.Fprintln(os.Stderr, paint(styleOK, "✓ tool traces on"))
	case "off", "0", "false":
		a.quietTools = true
		fmt.Fprintln(os.Stderr, paint(styleOK, "✓ tool traces off"))
	default:
		return fmt.Errorf("usage: /tools on|off")
	}
	return nil
}

func (a *app) cmdStatus() error {
	logged := paint(styleErr, "no")
	if a.token != "" {
		logged = paint(styleOK, "yes")
	}
	sid := "-"
	if a.sessionID != nil {
		sid = fmt.Sprint(a.sessionID)
	}
	tools := "on"
	if a.quietTools {
		tools = "off"
	}
	fmt.Fprintf(os.Stderr, "%s  %s\n", paint(styleDim, "url      "), paint(styleAssist, orDash(a.url)))
	fmt.Fprintf(os.Stderr, "%s  %s\n", paint(styleDim, "logged in"), logged)
	fmt.Fprintf(os.Stderr, "%s  %s\n", paint(styleDim, "email    "), paint(styleKey, orDash(a.cfg.Email)))
	fmt.Fprintf(os.Stderr, "%s  %s\n", paint(styleDim, "session  "), paint(styleAssist, sid))
	fmt.Fprintf(os.Stderr, "%s  %s\n", paint(styleDim, "history  "), paintf(styleDim, "%d msgs", len(a.history)))
	fmt.Fprintf(os.Stderr, "%s  %s\n", paint(styleDim, "tools    "), paint(styleDim, tools))
	return nil
}

func (a *app) chat(userText string) error {
	if err := a.requireAuth(); err != nil {
		return err
	}

	a.history = append(a.history, agentMessage{Role: "user", Content: userText})
	res, err := a.client.AgentStream(a.history, a.sessionID)
	if err != nil {
		a.history = a.history[:len(a.history)-1]
		return err
	}
	defer res.Body.Close()

	var assistant strings.Builder
	err = consumeAgentSSE(res.Body, streamOptions{
		QuietTools: a.quietTools,
		OnText:     func(chunk string) { assistant.WriteString(chunk) },
		OnSession:  func(sid string) { a.sessionID = sid },
	})
	if err != nil {
		return err
	}
	if text := strings.TrimSpace(assistant.String()); text != "" {
		a.history = append(a.history, agentMessage{Role: "assistant", Content: text})
	}
	return nil
}

func (a *app) requireAuth() error {
	if a.url == "" {
		return fmt.Errorf("no server URL — /login http://localhost:3333  or  /url <base>")
	}
	if a.token == "" || a.client == nil {
		return fmt.Errorf("not logged in — type /login")
	}
	return nil
}

func looksLikeURL(s string) bool {
	return strings.HasPrefix(s, "http://") || strings.HasPrefix(s, "https://")
}

func orDash(s string) string {
	if s == "" {
		return "-"
	}
	return s
}

func splitArgs(line string) []string {
	var out []string
	var cur strings.Builder
	inQuote := false
	quote := byte(0)

	flush := func() {
		if cur.Len() == 0 {
			return
		}
		out = append(out, cur.String())
		cur.Reset()
	}

	for i := 0; i < len(line); i++ {
		c := line[i]
		if inQuote {
			if c == quote {
				inQuote = false
				continue
			}
			cur.WriteByte(c)
			continue
		}
		switch c {
		case ' ', '\t':
			flush()
		case '"', '\'':
			inQuote = true
			quote = c
		default:
			cur.WriteByte(c)
		}
	}
	flush()
	return out
}

func historyPath() (string, error) {
	cfg, err := configPath()
	if err != nil {
		return "", err
	}
	return filepath.Join(filepath.Dir(cfg), "history"), nil
}
