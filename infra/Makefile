all:
	@echo ""
	@echo "Make doc"
	@echo " https://www.gnu.org/software/make/manual/make.html"
	@echo ""
	@echo "All commands are scoped to the user-provided PROJECT and your AWS profile ENV:"
	@echo "  e.g. ENV=jsmith PROJECT=checkout_api make plan"
	@echo "       ENV=dev PROJECT=gc-backend-service make apply"
	@echo "=============================================================================="
	@echo "  new_workspace: Create a new workspace for the provided ENV."
	@echo "  test:          Run tests."
	@echo "  init:          Init terraform."
	@echo "  import:        Import existing resources into state."
	@echo "  fmt:           Format terraform."
	@echo "  validate:      Ensure terraform is valid."
	@echo "  plan:          Display the changes that will be applied."
	@echo "  apply:         Apply changes."
	@echo "  show:          Show current state."
	@echo "=============================================================================="
	@echo ""

say_hello:
	@echo "Hello World"

# https://www.terraform.io/docs/internals/debugging.html
# export TF_LOG ?= TRACE

# ENV PROJECT PROFILE
# init plan apply -var-file
# ENV=<YOUR_IAM_USER_NAME> PROJECT=base make new_workspace
# ENV=dev PROJECT=gc-serverless-graphql make new_workspace


check_env:
ifndef ENV
	$(error ENV must be set)
endif

check_proj:
ifndef PROJECT
	$(error PROJECT must be defined)
endif

check_tf:
ifneq (,$(findstring modules,$(PROJECT)))
	$(error cannot run this command on terraform modules)
endif

check_init: check_proj
	cd ./terraform/$(PROJECT) && \
		if ! terraform show; then terraform init; fi

check_workspace: check_env check_proj check_init
	cd ./terraform/$(PROJECT) && \
		if ! terraform workspace select $(ENV); then terraform workspace new $(ENV); fi

# Workspace
select_workspace: check_workspace
	cd terraform/$(PROJECT) && \
		terraform workspace select $(ENV)

list: check_env check_proj
	cd terraform/$(PROJECT) && \
		terraform workspace list

init: check_env check_proj check_tf select_workspace
	cd terraform/$(PROJECT) && \
		terraform init

new_workspace: check_env check_proj check_tf
	cd terraform/$(PROJECT) && \
		terraform init &&\
		terraform workspace new $(ENV)

# Format
fmt: check_env check_proj select_workspace
	cd terraform/$(PROJECT) && \
		terraform fmt

# Validate
validate: check_env check_proj select_workspace
	cd terraform/$(PROJECT) && \
		terraform validate

# Plan
plan: check_env check_proj check_tf select_workspace
	cd terraform/$(PROJECT) && \
		terraform plan

# Apply
apply: check_env check_proj check_tf select_workspace
	cd terraform/$(PROJECT) && \
		terraform apply -auto-approve

# Destroy
destroy: check_env check_proj check_tf select_workspace
	cd terraform/$(PROJECT) && \
		terraform destroy -auto-approve

# Show
show: check_env check_proj check_tf select_workspace
	cd terraform/$(PROJECT) && \
		terraform show
