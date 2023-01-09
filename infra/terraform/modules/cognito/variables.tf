variable "region" {
  default = "us-west-2"
}

variable "profile" {}

variable "cognito_user_pool_name" {}

variable "username_attributes" {
  default = ["email"]
}

variable "custom_attribute_list" {
  default = []
}

variable "schemas_string" {
  type = list(object({
    attribute_data_type      = string
    name                     = string
    developer_only_attribute = bool
    mutable                  = bool
    required                 = bool
    string_attribute_constraints = object({
      min_length = number
      max_length = number
    })
  }))
  default = []
}

variable "schemas_number" {
  type = list(object({
    attribute_data_type      = string
    name                     = string
    developer_only_attribute = bool
    mutable                  = bool
    required                 = bool
    number_attribute_constraints = object({
      max_value = number
      min_value = number
    })
  }))
  default = []
}

variable "roles" {
  type = set(string)

  default = []
}
