variable "region" {
  default = "us-west-1"
}

variable "profile" {}

variable "filename" {}

variable "memory_size" {
  default = "512"
}

variable "timeout" {}

variable "layers" {
  default = []
}

variable "role_arn" {}

variable "function_name" {
  default = "function_name"
}

variable "runtime" {}

variable "handler" {
  default = "com.gc.lambda::handler"
}

variable "environment" {
  type = map
  default = {
    active = "true"
  }
}
