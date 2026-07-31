package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

type Config struct {
	URL   string `json:"url"`
	Token string `json:"token"`
	Email string `json:"email,omitempty"`
}

func configPath() (string, error) {
	if p := strings.TrimSpace(os.Getenv("CRISPY_CONFIG")); p != "" {
		return p, nil
	}
	dir, err := os.UserConfigDir()
	if err != nil {
		return "", err
	}
	return filepath.Join(dir, "crispy", "config.json"), nil
}

func loadConfig() (Config, error) {
	path, err := configPath()
	if err != nil {
		return Config{}, err
	}
	data, err := os.ReadFile(path)
	if err != nil {
		if errors.Is(err, os.ErrNotExist) {
			return Config{}, nil
		}
		return Config{}, err
	}
	var cfg Config
	if err := json.Unmarshal(data, &cfg); err != nil {
		return Config{}, fmt.Errorf("parse config %s: %w", path, err)
	}
	return cfg, nil
}

func saveConfig(cfg Config) error {
	path, err := configPath()
	if err != nil {
		return err
	}
	if err := os.MkdirAll(filepath.Dir(path), 0o700); err != nil {
		return err
	}
	data, err := json.MarshalIndent(cfg, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile(path, append(data, '\n'), 0o600)
}

func clearConfig() error {
	path, err := configPath()
	if err != nil {
		return err
	}
	err = os.Remove(path)
	if errors.Is(err, os.ErrNotExist) {
		return nil
	}
	return err
}

func resolveURL(flagURL string, cfg Config) (string, error) {
	url := firstNonEmpty(flagURL, os.Getenv("CRISPY_URL"), cfg.URL)
	url = strings.TrimRight(strings.TrimSpace(url), "/")
	if url == "" {
		return "", errors.New("missing server URL; set CRISPY_URL or run /login")
	}
	return url, nil
}

func resolveToken(cfg Config) (string, error) {
	token := firstNonEmpty(os.Getenv("CRISPY_TOKEN"), cfg.Token)
	token = strings.TrimSpace(token)
	if token == "" {
		return "", errors.New("not logged in; type /login")
	}
	return token, nil
}

func firstNonEmpty(values ...string) string {
	for _, v := range values {
		if strings.TrimSpace(v) != "" {
			return strings.TrimSpace(v)
		}
	}
	return ""
}
