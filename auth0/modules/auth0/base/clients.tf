resource "auth0_client" "m2m_client_group" {
  for_each = var.m2m_clients

  name        = each.key
  app_type    = "non_interactive"
  grant_types = ["client_credentials"]
  jwt_configuration {
    lifetime_in_seconds = each.value.jwt_lifetime
  }
}

resource "auth0_client" "web_client_group" {
  for_each = var.web_clients

  name                       = each.key
  app_type                   = each.value.app_type
  grant_types                = each.value.grant_types
  callbacks                  = each.value.callbacks
  allowed_logout_urls        = each.value.allowed_logout_urls
  allowed_origins            = each.value.allowed_origins
  web_origins                = each.value.web_origins
  oidc_conformant            = true
  token_endpoint_auth_method = "none"
  custom_login_page_on       = each.value.custom_login_page_on
  custom_login_page          = templatefile(each.value.custom_login_page, { logo_uri = var.auth0_logo_uri, omaze_web_domain = var.omaze_web_domain, gtm_id = var.gtm_id, onetrust_script_id = var.onetrust_script_id })
  jwt_configuration {
    alg                 = "RS256"
    lifetime_in_seconds = 36000
    secret_encoded      = false
  }
  refresh_token {
    rotation_type                = "rotating"
    expiration_type              = "expiring"
    leeway                       = 0
    token_lifetime               = 2592000
    infinite_idle_token_lifetime = true
    infinite_token_lifetime      = false
    idle_token_lifetime          = 1296000
  }
}

resource "auth0_client" "native_mobile_client_group" {
  for_each = var.native_mobile_clients

  name                       = each.key
  app_type                   = "native"
  grant_types                = each.value.grant_types
  callbacks                  = each.value.callbacks
  allowed_logout_urls        = each.value.allowed_logout_urls
  allowed_origins            = each.value.allowed_origins
  web_origins                = each.value.web_origins
  oidc_conformant            = true
  token_endpoint_auth_method = "none"
  jwt_configuration {
    alg                 = "RS256"
    lifetime_in_seconds = 36000
    secret_encoded      = false
  }
  refresh_token {
    rotation_type                = "rotating"
    expiration_type              = "expiring"
    leeway                       = 0
    token_lifetime               = 2592000
    infinite_idle_token_lifetime = true
    infinite_token_lifetime      = false
    idle_token_lifetime          = 1296000
  }
  mobile {
    ios {
      team_id = each.value.team_id
      app_bundle_identifier = each.value.app_bundle_identifier
    }
  }
}
