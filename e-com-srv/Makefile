#!make

# global defaults
ENV ?= dev
VERSION ?= $(shell git rev-parse HEAD)
DEV_DOMAIN ?= emberzdelivery.com
SERVICES=$(shell cd ./scripts && docker-compose ps --services)
APP ?= $(PROJECT)

# don't override
ZIP_FILE = main.zip
AWS_REGION = us-west-1

GOOS = linux
GOARCH = amd64
TAG ?= $(shell git rev-parse HEAD)

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

# https://pkg.go.dev/cmd/go
# ie ENV=cn_dev AWS_PROFILE=gc-dev FUNCTION_NAME=gc-backend-cn-dev make deploy
# ie ENV=dev AWS_PROFILE=gc-dev FUNCTION_NAME=gc-backend make deploy
# ie ENV=jane_prod AWS_PROFILE=gc-prod FUNCTION_NAME=gc-backend-jane-prod make deploy
deploy:
	cd cmd && \
	GOOS=$(GOOS) GOARCH=$(GOARCH) go build -ldflags "-X main.version=$TAG -X main.build=$(date +%D) -X main.env=$(ENV)" -o main . && \
	cp ../configs/.env.$(ENV) .env && \
	zip main.zip main .env && \
	rm main && \
	rm .env && \
	aws lambda update-function-code --function-name $(FUNCTION_NAME) \
	--zip-file fileb://$(ZIP_FILE) \
	--region $(AWS_REGION) \
	--profile $(AWS_PROFILE)
