resource "auth0_branding" "omaze" {
  logo_url = var.logo_url
  colors { #TODO: parameterize these items
    page_background = "#ffffff"
    primary = "#ffdd00"
  }
  universal_login {
    body = templatefile(var.universal_login_file, { omaze_web_domain = var.omaze_web_domain })
  }
}
