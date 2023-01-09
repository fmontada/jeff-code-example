resource "auth0_custom_domain" "custom_dns" {
  count = var.custom_domain_name != null ? 1 : 0

  domain = var.custom_domain_name
  type   = "auth0_managed_certs"
}

# We will not be automating the domain verification, will
# be a manual step for now.
