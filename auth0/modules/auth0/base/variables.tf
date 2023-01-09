variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "auth0_domain" {
  type    = string
  default = "auth0_domain"
}

variable "auth0_client_id" {
  type    = string
  default = "auth0_client_id"
}

variable "auth0_secret" {
  type      = string
  default   = "auth0_secret"
  sensitive = true
}

variable "management_api_url" {
  type        = string
  default     = ""
  description = "Identifier for Auth0 Management API"
}
variable "tenant_name" {
  type    = string
  default = "Omaze Tenant"
}

variable "custom_domain_name" {
  type        = string
  default     = null
  description = "Custom domain name for the tenant"
}

variable "email_templates" {
  type = map(object({
    subject              = string,
    syntax               = string,
    body_file            = string,
    result_url           = string,
    url_lifetime_seconds = number,
    enabled              = bool
  }))
  description = "Map of email templates to load onto auth0 tenant"
  default     = {}
}

variable "m2m_clients" {
  type = map(object({
    jwt_lifetime              = number,
    scope_list                = list(string),
    management_api_scope_list = optional(list(string))
  }))
  default     = {}
  description = "Name and jwt_lifetime for m2m clients"
}

variable "web_clients" {
  type = map(object({
    app_type             = string,
    grant_types          = list(string),
    callbacks            = list(string),
    allowed_logout_urls  = list(string),
    allowed_origins      = list(string),
    web_origins          = list(string)
    grant_types          = list(string),
    callbacks            = list(string),
    allowed_logout_urls  = list(string),
    allowed_origins      = list(string),
    web_origins          = list(string),
    custom_login_page_on = bool,
    custom_login_page    = string
  }))
  default     = {}
  description = "Web clients for Auth0, with their grants, callbacks, logout urls, and origins"
}

variable "native_mobile_clients" {
  type = map(object({
    grant_types           = list(string),
    callbacks             = list(string),
    allowed_logout_urls   = list(string),
    allowed_origins       = list(string),
    web_origins           = list(string),
    team_id               = string,
    app_bundle_identifier = string
  }))
  default     = {}
  description = "Native mobile clients for Auth0, with their grants, callbacks, logout urls, and origins"
}

variable "resource_server" {
  type = object({
    name                 = string,
    identifier           = string,
    allow_offline_access = bool,
    scopes = list(object({
      value       = string,
      description = string
    }))
  })
  default     = null
  description = "Resource Server for Auth0 with identifier and grants"
}

variable "roles" {
  type = map(object({
    description                = string,
    permissions                = list(string),
    management_api_permissions = optional(list(string))
  }))
}
variable "logo_url" {
  type        = string
  description = "What is the URL for the logo used in branding?"
  default     = "https://assets.prd.omazedev.com/new-logo-dark.svg"
}

variable "default_from_address" {
  type    = string
  default = "default_from_address"
}

variable "email_from_address" {
  type    = string
  default = "default_email_address"
}

variable "auth0_debug" {
  type    = bool
  default = false
}

variable "ses_user_aws_key_id" {
  type    = string
  default = "hahanope"
}

variable "ses_user_aws_secret" {
  type      = string
  default   = "hahanope"
  sensitive = true
}

variable "prompt_custom_texts" {
  type = map(map(object({
    file = string
  })))
  default     = {}
  description = "Map of languages and prompt types for the custom text on auth0 prompts."
}

variable "universal_login_file" {
  type        = string
  description = "HTML file to use for the universal login screens"
}

variable "change_password_file" {
  type        = string
  description = "HTML file to use for the password reset screen"
}

variable "omaze_web_domain" {
  type        = string
  description = "Omaze web domain origin"
}

variable auth0_logo_uri {
  type    = string
  default = "https://assets.stg.omazedev.com/logo.png"
}

variable gtm_id {
  type    = string
  default = "invalid_gtm_id"
}

variable onetrust_script_id {
  type    = string
  default = "invalid_onetrust_script_id"
}
