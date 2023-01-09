terraform {
  required_version = "0.12.18"
  backend "s3" {
    bucket         = "gc-tf"
    key            = "cognito/terraform.tfstate"
    region         = "us-west-1"
    dynamodb_table = "tf-infra"
  }
}

provider "aws" {
  profile = var.profile
  region  = var.region
  version = "~> 2.43"
}

locals {
  default_attributes = ["address",
    "birthdate",
    "email",
    "family_name",
    "gender",
    "given_name",
    "locale",
    "middle_name",
    "name",
    "nickname",
    "phone_number",
    "picture",
    "preferred_username",
    "profile",
    "updated_at",
    "website",
    "zoneinfo",
    "custom:ACCOUNT_ID",
  "custom:STORE_ID"]

  attributes = concat(var.custom_attribute_list, local.default_attributes)
}


resource "aws_cognito_user_pool" "pool" {
  name                = var.cognito_user_pool_name
  username_attributes = var.username_attributes

  auto_verified_attributes = ["email"]

  dynamic "schema" {
    for_each = var.schemas_string
    content {
      attribute_data_type      = schema.value["attribute_data_type"]
      name                     = schema.value["name"]
      developer_only_attribute = schema.value["developer_only_attribute"]
      mutable                  = schema.value["mutable"]
      required                 = schema.value["required"]
      string_attribute_constraints {
        min_length = 1
        max_length = 256
      }
    }
  }

  tags = {
    Name        = "terraform"
    Environment = "true"
  }
}

resource "aws_cognito_user_pool_client" "client" {
  name            = "web_client"
  user_pool_id    = aws_cognito_user_pool.pool.id
  generate_secret = false
  explicit_auth_flows = [
    "ALLOW_CUSTOM_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_SRP_AUTH"
  ]
  read_attributes  = local.attributes
  write_attributes = local.attributes
}

resource "aws_cognito_user_group" "role" {
  for_each = var.roles

  name         = each.value
  user_pool_id = aws_cognito_user_pool.pool.id
}
