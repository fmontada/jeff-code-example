terraform {
  required_version = "0.12.18"
  backend "s3" {
    bucket         = "gc-tf"
    key            = "gc-cognito-storefront/terraform.tfstate"
    region         = "us-west-1"
    dynamodb_table = "tf-infra"
  }
}

provider "aws" {
  profile = local.workspace["profile"]
  region  = local.workspace["region"]
  version = "~> 2.43"
}

locals {
  prod = "prod"

  env = {
    default = {
      custom_attribute_list = [
        "custom:ACCOUNT_ID",
        "custom:STORE_ID",
        "custom:ADDRESS2",
        "custom:CITY",
        "custom:COUNTRY_CODE",
        "custom:PROVINCE_CODE",
        "custom:ZIP",
        "custom:GC_CUSTOMER_ID"
      ]
    }
    
# ------------------------------------------------------------------------
# Every time we provition a Cognito User pool for a Storefront 
# we need to do the fallowing small changes
# ---------------------------------------------------------------
#  1. Remove (Optional)
#      Require numbers
#      Require special character
#      Require uppercase letters
#      Require lowercase letters

#  2. Add the Cognito Trigger (Required)
#      Pre sign-up
#      Post confirmation

    store_pinaterapia = {
      profile                = "gc-prod"
      cognito_user_pool_name = "gc-pinaterapia-user-pool"
    }

    store_dev = {
      profile                = "gc-dev"
      cognito_user_pool_name = "gc-storefront-user-pool"
    }
  }

  active_env = "${contains(keys(local.env), terraform.workspace) ? terraform.workspace : "default"}"
  workspace  = "${merge(local.env["default"], local.env[local.active_env])}"

}

module "cognito" {
  source = "../modules/cognito"

  profile                = local.workspace["profile"]
  cognito_user_pool_name = local.workspace["cognito_user_pool_name"]
  roles                  = ["CUSTOMER", "PUBLIC"]

  custom_attribute_list = local.workspace["custom_attribute_list"]

  schemas_string = [{
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true
    name                     = "ACCOUNT_ID"
    required                 = false

    string_attribute_constraints = {
      min_length = 1
      max_length = 256
    }
    }, {
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true
    name                     = "STORE_ID"
    required                 = false

    string_attribute_constraints = {
      min_length = 1
      max_length = 256
    }
    },
    {
      attribute_data_type      = "String"
      developer_only_attribute = false
      mutable                  = true
      name                     = "ADDRESS2"
      required                 = false

      string_attribute_constraints = {
        min_length = 1
        max_length = 256
      }
    },
    {
      attribute_data_type      = "String"
      developer_only_attribute = false
      mutable                  = true
      name                     = "CITY"
      required                 = false

      string_attribute_constraints = {
        min_length = 1
        max_length = 256
      }
    },
    {
      attribute_data_type      = "String"
      developer_only_attribute = false
      mutable                  = true
      name                     = "COUNTRY_CODE"
      required                 = false

      string_attribute_constraints = {
        min_length = 1
        max_length = 256
      }
    },
    {
      attribute_data_type      = "String"
      developer_only_attribute = false
      mutable                  = true
      name                     = "PROVINCE_CODE"
      required                 = false

      string_attribute_constraints = {
        min_length = 1
        max_length = 256
      }
    },
    {
      attribute_data_type      = "String"
      developer_only_attribute = false
      mutable                  = true
      name                     = "ZIP"
      required                 = false

      string_attribute_constraints = {
        min_length = 1
        max_length = 256
      }
    },
    {
      attribute_data_type      = "String"
      developer_only_attribute = false
      mutable                  = true
      name                     = "GC_CUSTOMER_ID"
      required                 = false

      string_attribute_constraints = {
        min_length = 1
        max_length = 256
      }
    },
    {
      attribute_data_type      = "String"
      developer_only_attribute = false
      mutable                  = true
      name                     = "ACCEPT_MARKETING"
      required                 = false

      string_attribute_constraints = {
        min_length = 1
        max_length = 256
      }
    },
    {
      attribute_data_type      = "String"
      developer_only_attribute = false
      mutable                  = true
      name                     = "email"
      required                 = true

      string_attribute_constraints = {
        min_length = 1
        max_length = 256
      }
    }
  ]
}


