#!make

# global defaults
ENV ?= dev
VERSION ?= $(shell git rev-parse HEAD)
APP ?= $(PROJECT)

# don't override
export GOPRIVATE := github.com/gap-commerce

# if .configs file exists locally, load it.
ifneq (,$(wildcard .env))
	include .env
endif

all:
	$(error Pick a target.)

deps:
	go mod tidy

debug:
	echo debug

test:
	go test -cover ./...

cover:
	go test -covermode=count -coverprofile=count.out ./... && go tool cover -html=count.out

migrate:
	@echo "Not implemented, but should run what you have in ./migrations"
