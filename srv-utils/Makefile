#!make

# global defaults
ENV ?= dev
VERSION ?= $(shell git rev-parse HEAD)
DEV_DOMAIN ?= omazedev.com
SERVICES=$(shell cd ./scripts && docker-compose ps --services)
APP ?= $(PROJECT)

# don't override

export GOPRIVATE := github.com/gap-commerce

# if .env file exists locally, load it.
ifneq (,$(wildcard .env))
	include .env
endif

all:
	$(error Pick a target.)

deps:
	go mod tidy

run:
	docker-compose up --force-recreate --remove-orphans --build $(APP)

debug:
	docker-compose up --force-recreate --remove-orphans --build $(APP)-debug

test:
	go test -cover ./...

cover:
	go test -covermode=count -coverprofile=count.out ./... && go tool cover -html=count.out

migrate:
	@echo "Not implemented, but should run what you have in ./migrations"
