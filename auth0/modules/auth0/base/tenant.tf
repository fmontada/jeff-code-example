resource "auth0_tenant" "tenant" {
  #TODO: Figure out which of these can be variables
  #      And which should be hardcoded
  friendly_name = var.tenant_name
  picture_url   = var.logo_url
  support_email = "weloveyou@omaze.com"
  support_url   = "http://support.omaze.com"

  session_lifetime = 72 #hours before login needed
  sandbox_version  = "12"
  enabled_locales  = ["en"]

  # default_audience  = "<client_id>"
  default_directory = "Username-Password-Authentication"

  change_password {
    enabled = true
    html    = file(var.change_password_file)
  }

  session_cookie {
    mode = "persistent"
  }
}
