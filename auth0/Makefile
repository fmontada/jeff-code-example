all:
	@echo ""
	@echo "All commands are scoped to the user-provided PROJECT and your AWS profile ENV:"
	@echo "  e.g. ENV=jsmith PROJECT=checkout_api make plan"
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

PHONY: new_workspace select_workspace test init import fmt validate plan apply show

# https://www.terraform.io/docs/internals/debugging.html
export TF_LOG ?= ERROR

check_env:
ifndef ENV
	$(error ENV must be set)
endif

check_workspace: check_env
	if ! terraform workspace select $(ENV); then terraform workspace new $(ENV); fi

new_workspace: check_env 
		terraform workspace new $(ENV)

select_workspace: check_workspace
	terraform workspace select $(ENV)

init: check_env select_workspace
		terraform init

import: check_env select_workspace
	terraform import $(NAME) $(ID)

state_rm: check_env terraform state rm $(NAME)

fmt: check_env select_workspace
	terraform fmt -check=true

validate: check_env select_workspace
	terraform validate

plan: check_env select_workspace
	terraform plan

apply: check_env select_workspace
	terraform apply -lock=true -auto-approve

ssm: check_env select_workspace
	terraform apply -target=module.ssm -auto-approve

show: check_env select_workspace
	terraform show
