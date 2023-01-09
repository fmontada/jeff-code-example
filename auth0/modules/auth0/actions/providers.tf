provider "auth0" {
  domain        = var.auth0_domain
  client_id     = var.auth0_client_id
  client_secret = var.auth0_secret
  debug         = tobool(var.auth0_debug)
  version       = "~> 0.32"
}
