locals {
  app_vars     = yamldecode(file(find_in_parent_folders("app_vars.yaml")))
  app_secrets  = yamldecode(sops_decrypt_file(find_in_parent_folders("app_secrets.sops.yaml")))
  account_vars = yamldecode(file(find_in_parent_folders("account_vars.yaml")))
}

terraform {
  source = "${get_repo_root()}/modules/auth0/actions"
}

dependency "base" {
  config_path = "../base"
}

inputs = {
  aws_region          = local.account_vars["region"]
  auth0_domain        = local.app_vars["auth0_domain"]
  auth0_client_id     = local.app_vars["auth0_client_id"]
  auth0_secret        = local.app_secrets["auth0_secret"]
  
  actions = {
    "Check Verification" = {
      runtime     = "node16"
      action_file = "${get_repo_root()}/js/src/cl/login/checkVerification.js"
      deploy      = true
      supported_triggers = {
        id      = "post-login"
        version = "v3"
      }
    },
    "Set Custom Claim" = {
      runtime     = "node16"
      action_file = "${get_repo_root()}/js/src/cl/login/setCustomClaim.js"
      deploy      = true
      supported_triggers = {
        id      = "post-login"
        version = "v3"
      }
      dependencies_list = [
        {
          "name"    = "auth0"
          "version" = "2.42.0"
        }
      ]
      secrets_list = [
        {
          "name"  = "audience"
          "value" = local.app_vars["auth0_audience"]
        }
      ]
    },
    "Check First Time Login" = {
      runtime     = "node16"
      action_file = "${get_repo_root()}/js/src/cl/login/checkFirstTimeLogin.js"
      deploy      = true
      supported_triggers = {
        id      = "post-login"
        version = "v3"
      }
      secrets_list = [
        {
          "name"  = "namespace"
          "value" = "http://omaze-cl.com"
        }
      ]
    },
    "Set M2M Custom Claim" = {
      runtime     = "node16"
      action_file = "${get_repo_root()}/js/src/cl/m2m/setM2MCustomClaim.js"
      deploy      = true
      supported_triggers = {
        id      = "credentials-exchange"
        version = "v2"
      }
      secrets_list = [
        {
          "name"  = "audience"
          "value" = local.app_vars["auth0_audience"]
        }
      ]
    },
    "Add User Self Role" = {
      runtime     = "node16"
      action_file = "${get_repo_root()}/js/src/cl/postUserRegistration/addUserSelfRole.js"
      deploy      = true
      supported_triggers = {
        id      = "post-user-registration"
        version = "v2"
      }
      dependencies_list = [
        {
          "name"    = "auth0"
          "version" = "2.42.0"
        }
      ]
      secrets_list = [
        {
          "name" = "clientSecret"
          "value" = dependency.base.outputs.m2m_clients["omaze-cl-actions"].client_secret
        },
        {
          "name" = "clientId"
          "value" = dependency.base.outputs.m2m_clients["omaze-cl-actions"].client_id
        },
        {
          "name" = "domain"
          "value" = local.app_vars["auth0_domain"]
        },
        {
          "name" = "roleId"
          "value" = dependency.base.outputs.roles["User Self RW"].id
        }
      ]
    },
    "Create Omaze User" = {
      runtime     = "node16"
      action_file = "${get_repo_root()}/js/src/cl/postUserRegistration/createUser.js"
      deploy      = true
      supported_triggers = {
        id      = "post-user-registration"
        version = "v2"
      }
      dependencies_list = [
        {
          "name"    = "auth0"
          "version" = "2.42.0"
        },
        {
          "name"    = "axios"
          "version" = "0.27.2"
        }
      ]
      secrets_list = [
        {
          "name" = "clientSecret"
          "value" = dependency.base.outputs.m2m_clients["omaze-cl-actions"].client_secret
        },
        {
          "name" = "clientId"
          "value" = dependency.base.outputs.m2m_clients["omaze-cl-actions"].client_id
        },
        {
          "name" = "domain"
          "value" = local.app_vars["auth0_domain"]
        },
        {
          "name" = "issuer"
          "value" = local.app_vars["auth0_custom_dns"]
        },
        {
          "name" = "userApiEndpoint"
          "value" = "https://cl-user-api.qa.omazedev.com/v1/admin/users"
        },
        {
          "name" = "audience"
          "value" = local.app_vars["auth0_audience"]
        },
        {
          "name" = "actionId"
          "value" = ""
        },
        {
          "name" = "cachedToken"
          "value" = ""
        },
        {
          "name" = "tokenExpiration"
          "value" = ""
        }
      ]
    },
    "Create Sailthru User" = {
      runtime     = "node16"
      action_file = "${get_repo_root()}/js/src/cl/postUserRegistration/salithruUserOptIn.js"
      deploy      = true
      supported_triggers = {
        id      = "post-user-registration"
        version = "v2"
      }
      dependencies_list = [  
        {
          "name"    = "sailthru-client"
          "version" = "4.0.0"
        },
      ]
      secrets_list = [
        {
          "name" = "sailthruApiKey"
          "value" = local.app_secrets["sailthru_api_key"]
        },
        {
          "name" = "sailthruApiSecret"
          "value" = local.app_secrets["sailthru_api_secret"]
        }
      ]
    },
    "Email Regex" = {
      runtime     = "node16"
      action_file = "${get_repo_root()}/js/src/cl/preUserRegistration/emailRegex.js"
      deploy      = true
      supported_triggers = {
        id      = "pre-user-registration"
        version = "v2"
      }
    }
  }

  trigger_bindings = {
    "post-login" = [
      {
        id = "Check Verification"
        display_name = "Check Verification"
      },
      {
        id = "Set Custom Claim"
        display_name = "Set Custom Claim"
      },
      {
        id = "Check First Time Login"
        display_name = "Check First Time Login"
      }
    ],
    "credentials-exchange" = [
      {
        id = "Set M2M Custom Claim"
        display_name = "Set M2M Custom Claim"
      }
    ],
    "post-user-registration" = [
      {
        id = "Add User Self Role"
        display_name = "Add User Self Role"
      },
      {
        id = "Create Omaze User"
        display_name = "Create Omaze User"
      },
      {
        id = "Create Sailthru User"
        display_name = "Create Sailthru User"
      }
    ],
    "pre-user-registration" = [
      {
        id = "Email Regex"
        display_name = "Email Regex"
      }
    ]
  }
}

include {
  path = find_in_parent_folders("terragrunt.hcl")
}
