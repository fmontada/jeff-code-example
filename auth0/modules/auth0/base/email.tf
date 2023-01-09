resource "auth0_email" "ses" {
  name    = "ses"
  enabled = true

  default_from_address = var.default_from_address
  credentials {
    access_key_id     = var.ses_user_aws_key_id
    secret_access_key = var.ses_user_aws_secret
    region            = var.aws_region
  }
}

resource "auth0_email_template" "email_templates" {
  for_each = var.email_templates

  template                = each.key
  body                    = file(each.value.body_file)
  from                    = var.email_from_address
  result_url              = each.value.result_url
  subject                 = each.value.subject
  syntax                  = each.value.syntax
  url_lifetime_in_seconds = each.value.url_lifetime_seconds
  enabled                 = each.value.enabled

  depends_on = [auth0_email.ses]
}
