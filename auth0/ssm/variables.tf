variable "region" {
  default = "us-east-1"
}

variable "profile" {}

variable "auth0_secret" {
  type = string
  default = "auth0_secret"
}

variable "auth0_fb_client_secret" {
  type = string
  default = "auth0_fb_client_secret"
}
