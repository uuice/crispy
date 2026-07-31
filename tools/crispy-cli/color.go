package main

import (
	"fmt"
	"os"

	"github.com/charmbracelet/lipgloss"
)

var (
	colorEnabled = shouldColor()

	styleBrand  = lipgloss.NewStyle().Bold(true).Foreground(lipgloss.Color("51"))
	styleOK     = lipgloss.NewStyle().Foreground(lipgloss.Color("42"))
	styleErr    = lipgloss.NewStyle().Foreground(lipgloss.Color("203"))
	styleDim    = lipgloss.NewStyle().Foreground(lipgloss.Color("245"))
	styleTool   = lipgloss.NewStyle().Foreground(lipgloss.Color("141"))
	styleAssist = lipgloss.NewStyle().Foreground(lipgloss.Color("87"))
	styleKey    = lipgloss.NewStyle().Bold(true).Foreground(lipgloss.Color("255"))
)

func shouldColor() bool {
	if os.Getenv("NO_COLOR") != "" {
		return false
	}
	if os.Getenv("CLICOLOR_FORCE") == "1" {
		return true
	}
	fi, err := os.Stderr.Stat()
	if err != nil {
		return false
	}
	return (fi.Mode() & os.ModeCharDevice) != 0
}

func paint(style lipgloss.Style, s string) string {
	if !colorEnabled {
		return s
	}
	return style.Render(s)
}

func paintf(style lipgloss.Style, format string, args ...any) string {
	return paint(style, fmt.Sprintf(format, args...))
}
