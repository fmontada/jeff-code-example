variable "region" {
  default = "us-west-1"
}

variable "profile" {}
variable "api_name" {}

# var.allow_headers
variable "allow_headers" {
  description = "Allow headers"
  type        = list

  default = [
    "Authorization",
    "Content-Type",
    "X-Amz-Date",
    "X-Amz-Security-Token",
    "X-Api-Key",
  ]
}

# var.allow_methods
variable "allow_methods" {
  description = "Allow methods"
  type        = list

  default = [
    "OPTIONS",
    "HEAD",
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
  ]
}

# var.allow_origin
variable "allow_origin" {
  description = "Allow origin"
  type        = string
  default     = "*"
}

# var.allow_max_age
variable "allow_max_age" {
  description = "Allow response caching time"
  type        = string
  default     = "7200"
}

# var.allowed_credentials
variable "allow_credentials" {
  description = "Allow credentials"
  default     = false
}

variable "authorization" {
  type        = string
  default     = "NONE"
}

variable "aws_api_gateway_authorizer_id" {
  type        = string
}

locals {
  headers = "${
    map(
      "Access-Control-Allow-Headers", "'${join(",", var.allow_headers)}'",
      "Access-Control-Allow-Methods", "'${join(",", var.allow_methods)}'",
      "Access-Control-Allow-Origin", "'${var.allow_origin}'",
      "Access-Control-Max-Age", "'${var.allow_max_age}'",
      "Access-Control-Allow-Credentials", "${var.allow_credentials ? "'true'" : ""}"
    )
  }"

  # Pick non-empty header values
  header_values = "${compact(values(local.headers))}"

  # Pick names that from non-empty header values
  header_names = "${matchkeys(
    keys(local.headers),
    values(local.headers),
    local.header_values
  )}"

  # Parameter names for method and integration responses
  parameter_names = "${
    formatlist("method.response.header.%s", local.header_names)
  }"

  # Map parameter list to "true" values
  true_list = "${
    split("|", replace(join("|", local.parameter_names), "/[^|]+/", "true"))
  }"

  # Integration response parameters
  integration_response_parameters = "${zipmap(
    local.parameter_names,
    local.header_values
  )}"

  # Method response parameters
  method_response_parameters = "${zipmap(
    local.parameter_names,
    local.true_list
  )}"
}
