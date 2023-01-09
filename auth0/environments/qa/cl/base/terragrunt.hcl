locals {
  app_vars     = yamldecode(file(find_in_parent_folders("app_vars.yaml")))
  app_secrets  = yamldecode(sops_decrypt_file(find_in_parent_folders("app_secrets.sops.yaml")))
  account_vars = yamldecode(file(find_in_parent_folders("account_vars.yaml")))
}

terraform {
  source = "${get_repo_root()}/modules/auth0/base"
}
inputs = {
  aws_region           = local.account_vars["region"]
  auth0_domain         = local.app_vars["auth0_domain"]
  auth0_client_id      = local.app_vars["auth0_client_id"]
  auth0_secret         = local.app_secrets["auth0_secret"]
  custom_domain_name   = local.app_vars["auth0_custom_dns"]
  default_from_address = "Omaze - QA <weloveyou@qa-omazeaccounts.com>"
  email_from_address   = "Omaze - QA <weloveyou@qa-omazeaccounts.com>"
  tenant_name          = "Omaze - CoreLoop QA"
  management_api_url   = "https://${local.app_vars["auth0_domain"]}/api/v2/"
  ses_user_aws_key_id  = local.app_vars["ses_user_aws_key_id"]
  ses_user_aws_secret  = local.app_secrets["ses_user_aws_secret"]

  change_password_file = "${get_repo_root()}/ui-templates/password_reset.html"
  universal_login_file = "${get_repo_root()}/ui-templates/universal_login.html"

  omaze_web_domain = "https://dogfood.qa.omazedev.com"

  email_templates = {
    "reset_email" = {
      subject              = "Customer account password reset"
      syntax               = "liquid"
      body_file            = "${get_repo_root()}/emails-templates/customer_account_password_reset.liquid"
      result_url           = "https://dogfood.qa.omazedev.com"
      url_lifetime_seconds = 604800
      enabled              = true
    },
    "verify_email" = {
      subject              = "Verify your email for Omaze"
      syntax               = "liquid"
      body_file            = "${get_repo_root()}/emails-templates/customer_account_email_verification.liquid"
      result_url           = "{% if application.name == 'Omaze%20Mobile' %} {{ application.callback_domain }} {% else %} https://dogfood.qa.omazedev.com {% endif %}"
      url_lifetime_seconds = 604800
      enabled              = true
    },
    "blocked_account" = {
      subject              = "Account Blocked"
      syntax               = "liquid"
      body_file            = "${get_repo_root()}/emails-templates/customer_account_blocked.liquid"
      result_url           = "https://dogfood.qa.omazedev.com"
      url_lifetime_seconds = 604800
      enabled              = true
    }
  }

  resource_server = {
    name = "gateway"
    allow_offline_access = true
    identifier = local.app_vars["auth0_audience"]
    scopes = [
      {
        value = "cl-sweeps-api.sweeps:read"
        description = "Read sweepstakes"
      },
      {
        value = "cl-sweeps-api.sweeps:create"
        description = "Create sweepstakes"
      },
      {
        value = "cl-sweeps-api.prices:create"
        description = "Create Prices"
      },
      {
        value = "cl-sweeps-api.sweeps:update"
        description = "Update Sweepstakes"
      },
      {
        value = "cl-sweeps-api.sub-prizes:create"
        description = "Create Subprizes"
      },
      {
        value = "cl-sweeps-api.sub-prizes:update"
        description = "Update Subprizes"
      },
      {
        value = "cl-sweeps-api.sub-prizes:delete"
        description = "Delete Subprizes"
      },
      {
        value = "cl-user-api.self:read"
        description = "Read Self"
      },
      {
        value = "cl-user-api.self:update"
        description = "Update User Self"
      },
      {
        value = "cl-user-api.user:create"
        description = "Create User"
      },
      {
        value = "cl-user-api.user:update"
        description = "Update User"
      },
      {
        value = "cl-user-api.user:read"
        description = "Read User"
      },
      {
        value = "cl-order-api.orders:create"
        description = "Create order"
      },
      {
        value = "cl-order-api.orders:read"
        description = "Read order"
      },
      {
        value = "cl-order-api.lineitems:update"
        description = "Update lineitem"
      },
      {
        value = "cl-order-api.pools:create"
        description = "Create Pool"
      },
      {
        value = "cl-order-api.self:read"
        description = "Read Self Orders"
      },
      {
        value = "cl-crm-api.sweeps:*"
        description = "All permissions for sweepstakes in CRM (Sailthru)"
      },
      {
        value = "cl-crm-api.users:*"
        description = "All permissions for users in CRM (Sailthru)"
      },
      {
        value = "cl-fame-api.fame:create"
        description = "Allows creation of a new fame object"
      },
      {
        value = "cl-fame-api.fame-file-upload:create"
        description = "Allows creation of a new fame csv file submission to be processed into fame entities."
      },
      {
        value = "cl-entries-api.entries:create"
        description = "Creates new entries linked to user id"
      },
      {
        value = "cl-entries-api.pools:create"
        description = "Creates new pool for draws"
      },
      {
        value = "cl-entries-api.self:read"
        description = "Read Self Entries"
      }
    ]
  }

  m2m_clients = {
    "cl-stripe-ingest" = {
      jwt_lifetime = 86400
      scope_list = [
        "cl-user-api.user:create",
        "cl-user-api.user:read",
        "cl-order-api.orders:create"
      ]
    },
    "cl-sweeps-worker" = {
      jwt_lifetime = 86400
      scope_list = [
        "cl-sweeps-api.sweeps:read",
        "cl-sweeps-api.prices:create",
        "cl-crm-api.sweeps:*"
      ]
    },
    "cl-crm-worker" = {
      jwt_lifetime = 86400
      scope_list = [
        "cl-sweeps-api.sweeps:read"
      ]
    },
    "cl-entries-worker" = {
      jwt_lifetime = 86400
      scope_list = [
        "cl-entries-api.entries:create"
      ]
    },
    "cl-fame-worker" = {
      jwt_lifetime = 86400
      scope_list = [
        "cl-fame-api.fame:create",
        "cl-user-api.user:create"
      ]
    },
    "omaze-cl-actions" = {
      jwt_lifetime = 86400
      scope_list = [
        "cl-user-api.user:create"
      ],
      management_api_scope_list = [
        "create:role_members",
        "update:users",
        "read:client_grants",
        "read:actions",
        "update:actions",
        "create:actions"
      ]
    },
    "budibase-m2m" = {
      jwt_lifetime = 86400
      scope_list = [],
      management_api_scope_list = [
        "read:client_grants",
        "read:users",
        "update:users",
        "read:users_app_metadata",
        "update:users_app_metadata"
      ]
    }
  }

  "web_clients" = {
    "Omaze Web" = {
      app_type = "spa"
      grant_types = [
        "implicit",
        "authorization_code",
        "refresh_token",
        "password"
      ]
      callbacks = [
        "http://localhost:3000",
        "https://dogfood.qa.omazedev.com",
        "https://dogfood.omaze.com",
        "http://localhost:3000/account",
        "https://dogfood.qa.omazedev.com/account",
        "https://dogfood.omaze.com/account",
        "https://cl-frontend-*-omaze.vercel.app/account"
      ]
      allowed_logout_urls = [
        "http://localhost:3000",
        "https://dogfood.qa.omazedev.com",
        "https://dogfood.omaze.com",
        "http://localhost:3000/logout",
        "https://cl-frontend-*-omaze.vercel.app/logout"
      ]
      allowed_origins = [
        "http://localhost:3000",
        "https://dogfood.qa.omazedev.com",
        "https://dogfood.omaze.com",
        "https://cl-frontend-*-omaze.vercel.app/"
      ],
      web_origins = [
        "http://localhost:3000",
        "https://dogfood.qa.omazedev.com",
        "https://dogfood.omaze.com",
        "https://cl-frontend-*-omaze.vercel.app/"
      ]
      custom_login_page_on = true
      custom_login_page = "${get_repo_root()}/ui-templates/cl_login.html"
    }
    "Budibase" = {
      app_type = "regular_web"
      grant_types = [
        "implicit",
        "authorization_code",
        "refresh_token",
      ]
      callbacks = [
        "https://omaze.budibase.app/api/global/auth/omaze/oidc/callback",
        "https://omaze.budibase.app/api/admin/auth/oidc/callback"
      ]
      allowed_logout_urls = [
        "http://localhost:3000",
        "https://omaze.budibase.app"
      ]
      allowed_origins = [
        "https://omaze.budibase.app"
      ],
      web_origins = [
        "https://omaze.budibase.app"
      ]
      custom_login_page_on = false
      custom_login_page = "${get_repo_root()}/ui-templates/cl_login.html"
    }
  }

  "native_mobile_clients" = {
    "Omaze Mobile" = {
      grant_types = [
        "implicit",
        "authorization_code",
        "refresh_token",
        "password",
        "http://auth0.com/oauth/grant-type/password-realm"
      ]
      team_id = local.app_vars["omaze_ios_team_id"]
      app_bundle_identifier = local.app_vars["omaze_ios_app_bundle_identifier"]
      callbacks = [
        "${local.app_vars["omaze_ios_app_bundle_identifier"]}://${local.app_vars["auth0_domain"]}/ios/${local.app_vars["omaze_ios_app_bundle_identifier"]}/callback",
        "${local.app_vars["omaze_ios_app_bundle_identifier"]}://${local.app_vars["auth0_custom_dns"]}/ios/${local.app_vars["omaze_ios_app_bundle_identifier"]}/callback",
        "${local.app_vars["omaze_ios_app_bundle_identifier"]}://${local.app_vars["auth0_custom_dns"]}/android/${local.app_vars["omaze_ios_app_bundle_identifier"]}/callback"
      ]
      allowed_logout_urls = [
        "${local.app_vars["omaze_ios_app_bundle_identifier"]}://${local.app_vars["auth0_domain"]}/ios/${local.app_vars["omaze_ios_app_bundle_identifier"]}/callback",
        "${local.app_vars["omaze_ios_app_bundle_identifier"]}://${local.app_vars["auth0_domain"]}/android/${local.app_vars["omaze_ios_app_bundle_identifier"]}/callback"
      ]
      allowed_origins = []
      web_origins = []
    }
  }

  prompt_custom_texts = {
    "en" = {
      "login" = {
        file = "${get_repo_root()}/i18n/en/login.json"
      },
      "signup" = {
        file = "${get_repo_root()}/i18n/en/signup.json"
      }
    }
  }

  roles = {
    "Dev API RW" = {
      description = "Backend API Management for Developers"
      permissions = [
        "cl-crm-api.sweeps:*",
        "cl-order-api.orders:create",
        "cl-order-api.orders:read",
        "cl-order-api.lineitems:update",
        "cl-order-api.pools:create",
        "cl-order-api.self:read",
        "cl-sweeps-api.prices:create",
        "cl-sweeps-api.sweeps:create",
        "cl-sweeps-api.sweeps:read",
        "cl-sweeps-api.sweeps:update",
        "cl-sweeps-api.sub-prizes:create",
        "cl-sweeps-api.sub-prizes:update",
        "cl-sweeps-api.sub-prizes:delete",
        "cl-user-api.self:read",
        "cl-user-api.self:update",
        "cl-user-api.user:create",
        "cl-user-api.user:update",
        "cl-user-api.user:read",
        "cl-crm-api.users:*",
        "cl-fame-api.fame:create",
        "cl-fame-api.fame-file-upload:create",
        "cl-entries-api.entries:create",
        "cl-entries-api.pools:create",
        "cl-entries-api.self:read"
      ]
    },
    "CX API RW" = {
      description = "API Access for CX Users"
      permissions = [
        "cl-order-api.orders:create",
        "cl-order-api.orders:read",
        "cl-order-api.lineitems:update",
        "cl-sweeps-api.sweeps:read",
        "cl-user-api.user:update",
        "cl-user-api.user:read",
        "cl-crm-api.users:*",
        "cl-fame-api.fame-file-upload:create"
      ]
    },
    "Sweeps API RW" = {
      description = "Sweepstakes API Management"
      permissions = [
        "cl-order-api.pools:create",
        "cl-sweeps-api.sweeps:create",
        "cl-sweeps-api.sweeps:read",
        "cl-sweeps-api.sweeps:update",
        "cl-sweeps-api.sub-prizes:create",
        "cl-sweeps-api.sub-prizes:update",
        "cl-sweeps-api.sub-prizes:delete",
        "cl-entries-api.pools:create"
      ]
    },
    "User Self RW" = {
      description = "User Self Management"
      permissions = [
        "cl-user-api.self:read",
        "cl-user-api.self:update",
        "cl-order-api.self:read",
        "cl-entries-api.self:read"
      ]
    }
  }
}
include "root" {
  path = find_in_parent_folders("terragrunt.hcl")
}
