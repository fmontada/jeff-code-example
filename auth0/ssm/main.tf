locals {

  env = {
    default = {
      auth0_domain : ""
      auth0_client_id : ""
      auth0_secret : ""
      auth0_debug : true

      auth0_identifier : "https://api.omaze.com"
      auth0_user_service_url : "https://8c68d11f03cf.ngrok.io/auth0"
      auth0_tenant_url : "https://terraform-testing.us.auth0.com"
      auth0_multipass_token_namespace : "https://omaze.shopify.com"
      auth0_callbacks : "https://api.omaze.com/callback"
      auth0_allowed_origins : "https://api.omaze.com"
      auth0_allowed_logout_urls : "https://api.omaze.com"
      auth0_web_origins : "https://api.omaze.com"
      auth0_logo_uri : "https://assets.stg.omazedev.com/logo.png"

      auth0_fb_app_id : "362090473828987"
      auth0_fb_scopes : "public_profile,email"
      auth0_fb_client_secret : "auth0_fb_client_secret"
      auth0_email_from_address : "weloveyou@qa.omazedev.com"

      auth0_change_password_result_url : "https://qa.omaze.com"
      auth0_login_url : "https://qa.omaze.com/account/login"

      auth0_ga_namespace : "https://ga.omaze.com"

      auth0_tenant_support_email : "weloveyou@omaze.com"
      auth0_tenant_support_url : "https://support.omaze.com"

      onetrust_script_id : "38629f39-2a3f-4515-be24-a22ad602474d"
    }

    prd = {
      auth0_domain : "omaze-prod.us.auth0.com"
      auth0_client_id : "l2UjBwpphBM6tgfnScVKo1KLR483T01G"
      auth0_secret : "auth0_secret"

      auth0_identifier : "https://auth-api.prd.omazedev.com"
      auth0_user_service_url : "https://auth-api.prd.omazedev.com/auth0"
      auth0_tenant_url : "https://omaze-prod.us.auth0.com"
      auth0_callbacks : "https://omaze.com/account,https://omaze.com,https://omaze.com/account/login,https://www.omaze.com/account,https://www.omaze.com,https://www.omaze.com/account/login"
      auth0_allowed_origins : "https://*.omaze.com"
      auth0_allowed_logout_urls : "https://omaze.com/account/logout,https://omaze.com/pages/create-account-message,https://omaze.com/pages/account-services-error,https://www.omaze.com/account/logout,https://www.omaze.com/pages/create-account-message,https://www.omaze.com/pages/account-services-error"
      auth0_web_origins : "https://*.omaze.com"
      auth0_email_from_address : "Omaze <weloveyou@omazeaccounts.com>"

      auth0_change_password_result_url : "https://www.omaze.com/account/login"
      auth0_login_url : "https://omaze.com/account/login"

      omaze_domain : "omaze.com"
      omaze_web_domain : "https://omaze.com"

      gtm_id : "GTM-WP8TJF3"
    }
    qa = {
      auth0_domain : "omaze-qa.us.auth0.com"
      auth0_client_id : "jpHvoip2bQwTHaBA0A23zlSsiNzwvRpY"
      auth0_secret : "auth0_secret"

      auth0_identifier : "https://auth-api.qa.omazedev.com"
      auth0_user_service_url : "https://auth-api.qa.omazedev.com/auth0"
      auth0_tenant_url : "https://omaze-qa.us.auth0.com"
      auth0_callbacks : "https://qa.omaze.com/account,https://qa.omaze.com,https://qa.omaze.com/account/login"
      auth0_allowed_origins : "https://*.omaze.com"
      auth0_allowed_logout_urls : "https://qa.omaze.com/account/logout,https://qa.omaze.com/pages/create-account-message,https://qa.omaze.com/pages/account-services-error"
      auth0_web_origins : "https://*.omaze.com"
      auth0_email_from_address : "Omaze - QA <weloveyou@qa-omazeaccounts.com>"

      auth0_change_password_result_url : "https://qa.omaze.com/account/login"
      auth0_login_url : "https://qa.omaze.com/account/login"

      omaze_domain : "qa.omazedev.com"
      omaze_web_domain : "https://qa.omaze.com"

      gtm_id : "GTM-TLBNL6H"
    }
    stg = {
      auth0_domain : "omaze-stg.us.auth0.com"
      auth0_client_id : "da0Rq5IS49BByF04bSXWv66mlDXvKtuT"
      auth0_secret : "auth0_secret"

      auth0_identifier : "https://auth-api.stg.omazedev.com"
      auth0_user_service_url : "https://auth-api.stg.omazedev.com/auth0"
      auth0_tenant_url : "https://omaze-stg.us.auth0.com"
      auth0_callbacks : "https://stage.omaze.com/account,https://stage.omaze.com,https://stage.omaze.com/account/login"
      auth0_allowed_origins : "https://*.omaze.com"
      auth0_allowed_logout_urls : "https://stage.omaze.com/account/logout,https://stage.omaze.com/pages/create-account-message,https://stage.omaze.com/pages/account-services-error"
      auth0_web_origins : "https://*.omaze.com"
      auth0_email_from_address : "Omaze - Staging <weloveyou@stg-omazeaccounts.com>"

      auth0_change_password_result_url : "https://stage.omaze.com/account/login"
      auth0_login_url : "https://stage.omaze.com/account/login"

      omaze_domain : "stg.omazedev.com"
      omaze_web_domain : "https://stage.omaze.com"

      gtm_id : "GTM-TLBNL6H"
    }
  }

  active_env = "${contains(keys(local.env), terraform.workspace) ? terraform.workspace : "default"}"
  workspace  = "${merge(local.env["default"], local.env[local.active_env])}"

}

provider "aws" {
  profile = var.profile
  region  = var.region
  version = "~> 2.43"
}

resource "aws_ssm_parameter" "auth0_domain" {
  name  = "/auth0/auth0_domain"
  type  = "String"
  value = local.workspace["auth0_domain"]
}

resource "aws_ssm_parameter" "auth0_client_id" {
  name  = "/auth0/auth0_client_id"
  type  = "String"
  value = local.workspace["auth0_client_id"]
}

resource "aws_ssm_parameter" "auth0_secret" {
  name  = "/auth0/auth0_secret"
  type  = "SecureString"
  value = local.workspace["auth0_secret"]
  lifecycle {
    ignore_changes = [
      value,
    ]
  }
}

resource "aws_ssm_parameter" "auth0_identifier" {
  name  = "/auth0/auth0_identifier"
  type  = "String"
  value = local.workspace["auth0_identifier"]
}

resource "aws_ssm_parameter" "auth0_user_service_url" {
  name  = "/auth0/auth0_user_service_url"
  type  = "String"
  value = local.workspace["auth0_user_service_url"]
}

resource "aws_ssm_parameter" "auth0_tenant_url" {
  name  = "/auth0/auth0_tenant_url"
  type  = "String"
  value = local.workspace["auth0_tenant_url"]
}

resource "aws_ssm_parameter" "auth0_multipass_token_namespace" {
  name  = "/auth0/auth0_multipass_token_namespace"
  type  = "String"
  value = local.workspace["auth0_multipass_token_namespace"]
}

resource "aws_ssm_parameter" "auth0_callbacks" {
  name  = "/auth0/auth0_callbacks"
  type  = "StringList"
  value = local.workspace["auth0_callbacks"]
}

resource "aws_ssm_parameter" "auth0_allowed_origins" {
  name  = "/auth0/auth0_allowed_origins"
  type  = "StringList"
  value = local.workspace["auth0_allowed_origins"]
}

resource "aws_ssm_parameter" "auth0_allowed_logout_urls" {
  name  = "/auth0/auth0_allowed_logout_urls"
  type  = "StringList"
  value = local.workspace["auth0_allowed_logout_urls"]
}

resource "aws_ssm_parameter" "auth0_web_origins" {
  name  = "/auth0/auth0_web_origins"
  type  = "StringList"
  value = local.workspace["auth0_web_origins"]
}

resource "aws_ssm_parameter" "auth0_logo_uri" {
  name  = "/auth0/auth0_logo_uri"
  type  = "String"
  value = local.workspace["auth0_logo_uri"]
}

resource "aws_ssm_parameter" "auth0_fb_app_id" {
  name  = "/auth0/auth0_fb_app_id"
  type  = "String"
  value = local.workspace["auth0_fb_app_id"]
}

resource "aws_ssm_parameter" "auth0_fb_scopes" {
  name  = "/auth0/auth0_fb_scopes"
  type  = "StringList"
  value = local.workspace["auth0_fb_scopes"]
}

resource "aws_ssm_parameter" "auth0_fb_client_secret" {
  name  = "/auth0/auth0_fb_client_secret"
  type  = "SecureString"
  value = local.workspace["auth0_fb_client_secret"]
  lifecycle {
    ignore_changes = [
      value,
    ]
  }
}

resource "aws_ssm_parameter" "auth0_debug" {
  name  = "/auth0/auth0_debug"
  type  = "String"
  value = local.workspace["auth0_debug"]
}

resource "aws_ssm_parameter" "auth0_email_from_address" {
  name  = "/auth0/auth0_email_from_address"
  type  = "String"
  value = local.workspace["auth0_email_from_address"]
}

resource "aws_ssm_parameter" "auth0_change_password_result_url" {
  name  = "/auth0/auth0_change_password_result_url"
  type  = "String"
  value = local.workspace["auth0_change_password_result_url"]
}

resource "aws_ssm_parameter" "auth0_login_url" {
  name  = "/auth0/auth0_login_url"
  type  = "String"
  value = local.workspace["auth0_login_url"]
}

resource "aws_ssm_parameter" "omaze_domain" {
  name  = "/auth0/omaze_domain"
  type  = "String"
  value = local.workspace["omaze_domain"]
}

resource "aws_ssm_parameter" "auth0_ga_namespace" {
  name  = "/auth0/auth0_ga_namespace"
  type  = "String"
  value = local.workspace["auth0_ga_namespace"]
}

resource "aws_ssm_parameter" "omaze_web_domain" {
  name  = "/auth0/omaze_web_domain"
  type  = "String"
  value = local.workspace["omaze_web_domain"]
}

resource "aws_ssm_parameter" "auth0_tenant_support_email" {
  name  = "/auth0/auth0_tenant_support_email"
  type  = "String"
  value = local.workspace["auth0_tenant_support_email"]
}

resource "aws_ssm_parameter" "auth0_tenant_support_url" {
  name  = "/auth0/auth0_tenant_support_url"
  type  = "String"
  value = local.workspace["auth0_tenant_support_url"]
}

resource "aws_ssm_parameter" "gtm_id" {
  name  = "/auth0/gtm_id"
  type  = "String"
  value = local.workspace["gtm_id"]
}

resource "aws_ssm_parameter" "onetrust_script_id" {
  name  = "/auth0/onetrust_script_id"
  type  = "String"
  value = local.workspace["onetrust_script_id"]
}
