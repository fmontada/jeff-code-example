package config

import (
	"bufio"
	"io"
	"io/ioutil"
	"strings"
)

type Config interface {
	Lookup(key string) (string, error)
}

func readFile(filename string) ([]byte, error) {
	data, err := ioutil.ReadFile(filename)
	if err != nil {
		return make([]byte, 0), err
	}

	return data, nil
}

func parse(r io.Reader) (map[string] string, error)  {
	envMap := make(map[string]string)

	var lines []string
	scanner := bufio.NewScanner(r)
	for scanner.Scan() {
		lines = append(lines, scanner.Text())
	}

	if err := scanner.Err(); err != nil {
		return envMap, err
	}

	trimmedLine := ""
	for _, fullLine := range lines {
		trimmedLine = strings.TrimSpace(fullLine)
		if isIgnoredLine(trimmedLine) {
			continue
		}

		splitString := strings.SplitN(trimmedLine, "=", 2)
		key := splitString[0]
		value := splitString[1]

		envMap[key] = value
	}
	return envMap, nil
}

func isIgnoredLine(line string) bool {
	return len(line) == 0 || strings.HasPrefix(line, "#")
}