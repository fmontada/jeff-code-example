
# auth0

Omaze Auth0 

## Table of Contents

- [Initial Setup Steps](#initial-setup-steps)
- [Auth0 Terraform Provider](#auth0-terraform-provider)
- [Environment Variables](#environment-variables)
- [Terraform Bucket](#terraform-bucket)
- [Infra Setup](#infra-setup)
- [Commands](#commands)
- [System Diagram](#system-diagram)

## Initial Setup Steps
1. Install [Terraform](https://www.terraform.io/downloads.html).

## Auth0 Terraform Provider
The Auth0 provider is used to interact with Auth0 applications and APIs. It provides resources that allow you to create and manage clients, resource servers, client grants, connections, email providers and templates, rules and rule variables, users, roles, tenants, and custom domains as part of a Terraform deployment.

```
provider "auth0" {
  domain = "<domain>"
  client_id = "<client-id>"
  client_secret = "<client-secret>"
  debug = "<debug>"
}
```

## Environment Variables
You can provide your credentials via the `AUTH0_DOMAIN`, `AUTH0_CLIENT_ID` and `AUTH0_CLIENT_SECRET` environment variables, respectively.

```
provider "auth0" {}
```

Usage:

```
$ export TF_VAR_auth0_domain="<domain>"
$ export TF_VAR_auth0_client_id="<client-id>"
$ export TF_VAR_auth0_secret="<client_secret>"
$ export TF_VAR_auth0_omaze_web_domain="<omaze domain>"
$ ENV=dev make plan
```

## Infra Setup
1. Run the following command in the root directory of this repository to initialize the workspace for your current ENV:
```sh
ENV=<YOUR_IAM_USER_NAME> make new_workspace
```
> _NOTE: Remember, you're replacing `<YOUR_IAM_USER_NAME>` with your actual **IAM User Name**, e.g. `ENV=jsmith`!_

2. After the above command has run and your workspace has been set, run the following command to see a preview of the project scaffold:
```sh
ENV=<YOUR_IAM_USER_NAME> make plan
```
- `plan` effectively acts as a dry-run of changes that'll take place (before you run `apply`)
3. Now that you've got a preview of which resources will be created, run the command to actually execute the previewed changes:
```sh
ENV=<YOUR_IAM_USER_NAME> make apply
```

## Terraform Bucket

Make sure you have the right `AWS_PROFILE` to run the terraforms commands

```
export AWS_SDK_LOAD_CONFIG=1
export AWS_REGION=us-west-1
export AWS_PROFILE=root
```

## Commands
- Run `make` to see development commands while in the root `auth0/` folder.
- Assign your AWS profile to the `ENV` environment variable and select which project to run a command for with the `PROJECT` environment variable, e.g. if your AWS credentials file has the profile `[jsmith]`, to test a `terraform plan` of the `checkout_api` project, the command would be:
```sh
ENV=jsmith make plan
```

#### terraform destroy
- `terraform destroy` is not included in our tooling, to avoid running it accidentally. However, it's still good practice to set [`prevent_destroy`](https://www.terraform.io/docs/configuration/resources.html#lifecycle) on most resources once they're in production use. For this reason, all of our modules must accept a `prevent_destroy` parameter, whose value it will set internally on the resources it's creating:

## System Diagram

![alt text](https://github.com/Omaze/auth0/blob/integration/system-diagram-auth0-shopify.jpg "Architecture Diagram")
