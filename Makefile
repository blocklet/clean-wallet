#!/usr/bin/env bash

init build:
	@make dep
	@cd packages/utils && npm run build

dep:
	@echo "Install dependencies required for this repo..."
	@lerna bootstrap && lerna link

upgrade:
	@echo "Upgraded dependencies required for this repo..."
	@lerna exec --no-bail -- "ncu -u -f /arcblock\|ocap\|abtnode\|blocklet/ && lerna bootstrap && lerna link"

lint:
	@echo "Running lint..."
	@npm run lint

test:
	@echo "Running test suites..."
	@npm run test

bundle:
	@echo "Bundling the software..."
	@npm run bundle

github-init:
	@make dep

include .makefiles/*.mk
