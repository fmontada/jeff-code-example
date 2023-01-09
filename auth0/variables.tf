# Note: make sure to set the default value to each variable
variable aws_region {
  type    = string
  default = "us-east-1"
}

variable auth0_identifier {
  type    = string
  default = "https://api.omaze.com"
}

variable auth0_domain {
  type    = string
  default = "auth0_domain"
}

variable auth0_client_id {
  type    = string
  default = "auth0_client_id"
}

variable auth0_secret {
  type    = string
  default = "auth0_secret"
}

variable auth0_jwt_lifetime {
  type    = number
  default = 18000
}

variable auth0_jwt_secret_encoded {
  type    = bool
  default = true
}

variable auth0_jwt_signing_alg {
  type    = string
  default = "RS256"
}

variable auth0_user_service_url {
  type    = string
  default = "https://8c68d11f03cf.ngrok.io/auth0"
}

variable auth0_tenant_url {
  type    = string
  default = "https://terraform-testing.us.auth0.com"
}

variable auth0_tenant_support_email {
  type    = string
  default = "weloveyou@omaze.com"
}

variable auth0_tenant_support_url {
  type    = string
  default = "https://support.omaze.com"
}

variable auth0_multipass_token_namespace {
  type    = string
  default = "https://omaze.shopify.com"
}

variable auth0_callbacks {
  type    = string
  default = "https://api.omaze.com/callback"
}

variable auth0_allowed_origins {
  type    = string
  default = "https://api.omaze.com"
}

variable auth0_allowed_logout_urls {
  type    = string
  default = "https://api.omaze.com"
}

variable auth0_web_origins {
  type    = string
  default = "https://api.omaze.com"
}

variable auth0_logo_uri {
  type    = string
  default = "https://assets.stg.omazedev.com/logo.png"
}

variable auth0_fb_app_id {
  type    = string
  default = "362090473828987"
}

variable auth0_fb_client_secret {
  type    = string
  default = "auth0_fb_client_secret"
}

variable auth0_fb_scopes {
  type    = string
  default = "public_profile,email"
}

variable auth0_debug {
  type    = bool
  default = true
}

variable auth0_email_from_address {
  type    = string
  default = "auth0_email_from_address"
}

variable auth0_change_password_result_url {
  type    = string
  default = "auth0_change_password_result_url"
}

variable auth0_login_url {
  type    = string
  default = "https://qa.omaze.com/account/login"
}

variable omaze_domain {
  type    = string
  default = "omaze_domain"
}

variable auth0_ga_namespace {
  type    = string
  default = "https://ga.omaze.com"
}

variable omaze_web_domain {
  type    = string
  default = "omaze_web_domain"
}

variable gtm_id {
  type    = string
  default = "invalid_gtm_id"
}

variable onetrust_script_id {
  type    = string
  default = "invalid_onetrust_script_id"
}
