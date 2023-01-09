terraform {
  required_version = "0.12.31"
  backend "s3" {
    bucket         = "omaze-tf"
    key            = "auth0"
    region         = "us-east-1"
    dynamodb_table = "tf-infra"
  }
}

provider "auth0" {
  domain        = var.auth0_domain
  client_id     = var.auth0_client_id
  client_secret = var.auth0_secret
  debug         = tobool(var.auth0_debug)
  version       = "~> 0.14"
}

provider "aws" {
  profile = terraform.workspace
  region  = var.aws_region
  version = "~> 2.43"
}

# Rules
resource "auth0_rule" "email_verified" {
  name    = "Email Verification"
  script  = templatefile("${path.module}/js/src/email_verified_rule.js", {})
  enabled = true
  order   = 1 # Lower-valued rules execute first.
}

resource "auth0_rule" "get_access_token" {
  name    = "Get Access Token Helper"
  script  = templatefile("${path.module}/js/src/get_access_token.js", {})
  enabled = true
  order   = 10 # Lower-valued rules execute first.
}

resource "auth0_rule" "multipass_rule" {
  name    = "Shopify Multipass"
  script  = templatefile("${path.module}/js/src/multipass_rule.js", {})
  enabled = true
  order   = 11
}

resource "auth0_rule" "user_metadata_rule" {
  name    = "Update User Metadata"
  script  = templatefile("${path.module}/js/src/user_metadata_rule.js", {})
  enabled = true
  order   = 12
}

resource "auth0_rule" "post_user_registration_rule" {
  name    = "Post User Registration"
  script  = templatefile("${path.module}/js/src/post_user_registration_rule.js", {})
  enabled = true
  order   = 13
}

resource "auth0_rule" "notify_email_status_rule" {
  name    = "Notify User email verified"
  script  = templatefile("${path.module}/js/src/notify_email_status_rule.js", {})
  enabled = true
  order   = 14
}

resource "auth0_hook" "pre_user_registration" {
  name       = "Pre User Registration"
  script     = templatefile("${path.module}/js/src/pre_user_registration.js", {})
  trigger_id = "pre-user-registration"
  enabled    = true
}

resource "auth0_rule_config" "rule_client_id_config" {
  key   = "CLIENT_ID"
  value = auth0_client.omaze_user_service_app.client_id
}

resource "auth0_rule_config" "rule_client_secret_config" {
  key   = "CLIENT_SECRET"
  value = auth0_client.omaze_user_service_app.client_secret
}

resource "auth0_rule_config" "rule_identifier_config" {
  key   = "IDENTIFIER"
  value = var.auth0_identifier

  depends_on = [
    module.ssm
  ]
}

resource "auth0_rule_config" "rule_user_service_url_config" {
  key   = "USER_SERVICE_URL"
  value = var.auth0_user_service_url

  depends_on = [
    module.ssm
  ]
}

resource "auth0_rule_config" "rule_auth0_tenant_url_config" {
  key   = "AUTH0_TENANT_URL"
  value = var.auth0_tenant_url

  depends_on = [
    module.ssm
  ]
}

resource "auth0_rule_config" "rule_auth0_multipass_token_namespace" {
  key   = "MULTIPASS_TOKEN_NAMESPACE"
  value = var.auth0_multipass_token_namespace

  depends_on = [
    module.ssm
  ]
}

resource "auth0_rule_config" "rule_auth0_domain" {
  key   = "AUTH0_DOMAIN"
  value = var.auth0_domain

  depends_on = [
    module.ssm
  ]
}

resource "auth0_rule_config" "rule_rules_client_id" {
  key   = "RULES_CLIENT_ID"
  value = auth0_client.rules_config_client.client_id
}

resource "auth0_rule_config" "rule_rules_client_secret" {
  key   = "RULES_CLIENT_SECRET"
  value = auth0_client.rules_config_client.client_secret
}

resource "auth0_rule_config" "rule_auth0_ga_namespace" {
  key   = "GA_NAMESPACE"
  value = var.auth0_ga_namespace

  depends_on = [
    module.ssm
  ]
}

# Connections
resource "auth0_connection" "automatic_migration" {
  name            = "Omaze-Users"
  strategy        = "auth0"
  enabled_clients = [auth0_client.omaze_authentication_app.client_id]
  options {
    import_mode                    = true
    enabled_database_customization = true
    custom_scripts = {
      get_user = templatefile("${path.module}/js/src/get_user.js", {})
      login    = templatefile("${path.module}/js/src/login.js", {})
    }
    configuration = {
      CLIENT_ID           = auth0_client.omaze_user_service_app.client_id
      CLIENT_SECRET       = auth0_client.omaze_user_service_app.client_secret
      IDENTIFIER          = var.auth0_identifier
      USER_SERVICE_URL    = var.auth0_user_service_url
      AUTH0_TENANT_URL    = var.auth0_tenant_url
      RULES_CLIENT_ID     = auth0_client.rules_config_client.client_id
      RULES_CLIENT_SECRET = auth0_client.rules_config_client.client_secret
      AUTH0_DOMAIN        = var.auth0_domain
    }
    password_policy = "good"
    password_no_personal_info {
      enable = true
    }
    password_dictionary {
      enable = true
    }
    password_history {
      enable = true
      size   = 5
    }
    password_complexity_options {
      min_length = 8
    }
    brute_force_protection = "true"
  }

  depends_on = [
    module.ssm
  ]
}

resource "auth0_connection" "facebook" {
  name            = "Facebook"
  strategy        = "facebook"
  enabled_clients = [auth0_client.omaze_authentication_app.client_id]
  options {
    client_id     = var.auth0_fb_app_id
    client_secret = var.auth0_fb_client_secret
    scopes        = split(",", var.auth0_fb_scopes)
  }

  depends_on = [
    module.ssm
  ]
}

# API
resource "auth0_resource_server" "omaze_user_service_api" {
  name        = "Omaze User Service API"
  identifier  = var.auth0_identifier
  signing_alg = var.auth0_jwt_signing_alg

  scopes {
    value       = "generate:multipass"
    description = "Generate Multipass Token"
  }

  scopes {
    value       = "migration:login"
    description = "Validate User Credentials"
  }

  scopes {
    value       = "migration:get_user"
    description = "Check User exists"
  }

  allow_offline_access                            = true
  token_lifetime                                  = 86400
  skip_consent_for_verifiable_first_party_clients = true

  depends_on = [
    module.ssm
  ]
}

# Application
resource "auth0_client" "omaze_user_service_app" {
  name        = "Omaze User Service"
  description = "Omaze User Service"
  app_type    = "non_interactive"
  grant_types = ["client_credentials"]
  jwt_configuration {
    lifetime_in_seconds = var.auth0_jwt_lifetime
    secret_encoded      = var.auth0_jwt_secret_encoded
    alg                 = var.auth0_jwt_signing_alg
  }
}

# Grant Access
resource "auth0_client_grant" "omaze_user_service_app_api_grant" {
  client_id = auth0_client.omaze_user_service_app.id
  audience  = auth0_resource_server.omaze_user_service_api.identifier
  scope = [
    "generate:multipass",
    "migration:login",
    "migration:get_user"
  ]
}

resource "auth0_client" "rules_config_client" {
  name        = "Rules Configuration Client"
  description = "Client to update/read rule configs"
  app_type    = "non_interactive"
  grant_types = ["client_credentials"]
  jwt_configuration {
    lifetime_in_seconds = var.auth0_jwt_lifetime
    secret_encoded      = var.auth0_jwt_secret_encoded
    alg                 = var.auth0_jwt_signing_alg
  }
}

resource "auth0_client_grant" "rules_config_client_management_api_grant" {
  client_id = auth0_client.rules_config_client.id
  audience  = "https://${var.auth0_domain}/api/v2/"
  scope = [
    "read:rules_configs",
    "update:rules_configs",
    "read:connections",
    "update:connections"
  ]
}

# Web App
resource "auth0_client" "omaze_authentication_app" {
  name                       = "Omaze Web Authentication"
  description                = "Omaze Web Authentication"
  app_type                   = "regular_web"
  token_endpoint_auth_method = "none" # public client without a client secret
  grant_types                = ["authorization_code", "refresh_token"]
  callbacks                  = split(",", var.auth0_callbacks)
  allowed_origins            = split(",", var.auth0_allowed_origins)
  allowed_logout_urls        = split(",", var.auth0_allowed_logout_urls)
  web_origins                = split(",", var.auth0_web_origins)
  logo_uri                   = var.auth0_logo_uri
  custom_login_page_on       = true
  custom_login_page          = templatefile("${path.module}/ui-templates/login.html", { logo_uri = var.auth0_logo_uri, omaze_web_domain = var.omaze_web_domain, gtm_id = var.gtm_id, onetrust_script_id = var.onetrust_script_id })
  depends_on = [
    module.ssm
  ]
}

# SSM
module "ssm" {
  source                 = "./ssm"
  profile                = terraform.workspace
  region                 = var.aws_region
  auth0_secret           = var.auth0_secret
  auth0_fb_client_secret = var.auth0_fb_client_secret
}


module "ses" {
  source  = "./ses"
  profile = terraform.workspace
  region  = var.aws_region
}

resource "auth0_email" "auth0_esp" {
  name                 = "ses"
  enabled              = true
  default_from_address = var.auth0_email_from_address
  credentials {
    access_key_id     = module.ses.aws_key_id
    secret_access_key = module.ses.aws_secret
    region            = var.aws_region
  }

  depends_on = [module.ssm, module.ses]
}

# Note: The resource name has to be equals to the template name
resource "auth0_email_template" "reset_email" {
  template                = "reset_email"
  body                    = templatefile("${path.module}/emails-templates/customer_account_password_reset.liquid", {})
  from                    = var.auth0_email_from_address
  subject                 = "Customer account password reset"
  syntax                  = "liquid"
  url_lifetime_in_seconds = 604800 # Number of seconds during which the link within the email will be valid
  enabled                 = true
  result_url              = var.auth0_change_password_result_url
  depends_on              = [auth0_email.auth0_esp, module.ssm]
}

resource "auth0_email_template" "verify_email" {
  template                = "verify_email"
  body                    = templatefile("${path.module}/emails-templates/customer_account_email_verification.liquid", {})
  from                    = var.auth0_email_from_address
  subject                 = "Verify your email for Omaze"
  syntax                  = "liquid"
  url_lifetime_in_seconds = 604800 # Number of seconds during which the link within the email will be valid
  enabled                 = true
  result_url              = var.auth0_login_url
  depends_on              = [auth0_email.auth0_esp, module.ssm]
}

resource "auth0_email_template" "blocked_account" {
  template                = "blocked_account"
  body                    = templatefile("${path.module}/emails-templates/customer_account_blocked.liquid", {})
  from                    = var.auth0_email_from_address
  subject                 = "Account Blocked"
  syntax                  = "liquid"
  url_lifetime_in_seconds = 604800 # Number of seconds during which the link within the email will be valid
  enabled                 = true
  result_url              = var.auth0_login_url
  depends_on              = [auth0_email.auth0_esp, module.ssm]
}

# Select Domain in R53
data "aws_route53_zone" "selected_zone" {
  name = var.omaze_domain
}

# Custom Domain
resource "auth0_custom_domain" "custom_domain" {
  domain              = "login.${var.omaze_domain}"
  type                = "auth0_managed_certs"
  verification_method = "txt"
}

# Add verification
resource "aws_route53_record" "omaze_amazonses_verification_record" {
  zone_id = data.aws_route53_zone.selected_zone.id
  name    = "login.${var.omaze_domain}"
  type    = upper(auth0_custom_domain.custom_domain.verification[0].methods[0].name)
  ttl     = "600"
  records = [auth0_custom_domain.custom_domain.verification[0].methods[0].record]
}

resource "auth0_tenant" "tenant" {
  support_email = var.auth0_tenant_support_email
  support_url   = var.auth0_tenant_support_url
  change_password {
    enabled = true
    html    = templatefile("${path.module}/ui-templates/password_reset.html", { logo_uri = var.auth0_logo_uri, omaze_web_domain = var.omaze_web_domain, gtm_id = var.gtm_id, onetrust_script_id = var.onetrust_script_id })
  }
  session_lifetime      = 24
  idle_session_lifetime = 24

  error_page {
    html          = ""
    show_log_link = false
    url           = "${var.omaze_web_domain}/pages/account-services-error"
  }
}
