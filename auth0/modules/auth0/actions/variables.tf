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

variable "actions" {
  type = map(object({
    runtime = string,
    deploy  = bool,
    supported_triggers = object({
      id      = string,
      version = string
    }),
    action_file = string,
    dependencies_list = optional(list(object({
      name    = string,
      version = string
    }))),
    secrets_list = optional(list(object({
      name  = string,
      value = string
    })))
  }))
  description = "Map of actions to load onto auth0 tenant"
  default     = {}
}

variable "trigger_bindings" {
  type = map(list(object({
    id           = string,
    display_name = string
  })))
  default     = {}
  description = "Flow Order for Actions"
}

variable "auth0_debug" {
  type    = bool
  default = false
}
