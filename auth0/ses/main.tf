locals {

  env = {
    default = {
        domain : "qa-omazeaccounts.com"
    }
    qa = {
       domain : "qa-omazeaccounts.com"
    }
    stg = {
        domain : "stg-omazeaccounts.com"
    }
    prd = {
        domain : "omazeaccounts.com"
    }
  }

  active_env = "${contains(keys(local.env), terraform.workspace) ? terraform.workspace : "default"}"
  workspace  = "${merge(local.env["default"], local.env[local.active_env])}"

}

provider "aws" {
  profile = var.profile
  region  = var.region
  version = "~> 2.43"
}


# Example SES Domain Identity
resource "aws_ses_domain_identity" "omaze_domain_identity" {
  domain = local.workspace["domain"]
}

# Select Domain in R53
data "aws_route53_zone" "selected_zone" {
  name         = local.workspace["domain"]
}

# Add verification
resource "aws_route53_record" "omaze_amazonses_verification_record" {
  zone_id = data.aws_route53_zone.selected_zone.id
  name    = "_amazonses.${local.workspace["domain"]}"
  type    = "TXT"
  ttl     = "600"
  records = [aws_ses_domain_identity.omaze_domain_identity.verification_token]
}

# DKIM
resource "aws_ses_domain_dkim" "omaze_dkim" {
  domain = aws_ses_domain_identity.omaze_domain_identity.domain
}

resource "aws_route53_record" "dkim" {
  count = 3
  zone_id = data.aws_route53_zone.selected_zone.id
  name = format(
    "%s._domainkey.%s",
    element(aws_ses_domain_dkim.omaze_dkim.dkim_tokens, count.index),
    local.workspace["domain"],
  )
  type    = "CNAME"
  ttl     = "600"
  records = ["${element(aws_ses_domain_dkim.omaze_dkim.dkim_tokens, count.index)}.dkim.amazonses.com"]
}

resource "aws_route53_record" "omaze_amazonses_dmarc_record" {
  zone_id = data.aws_route53_zone.selected_zone.id
  name    = "_dmarc.no-reply.${local.workspace["domain"]}"
  type    = "TXT"
  ttl     = "300"
  records = ["v=DMARC1;p=none"]
}

# SES MAIL FROM Domain
resource "aws_ses_domain_mail_from" "omaze_mail_from" {
  domain           = aws_ses_domain_identity.omaze_domain_identity.domain
  mail_from_domain = "no-reply.${local.workspace["domain"]}"
}


# SPF validation record
resource "aws_route53_record" "spf_mail_from" {
  count =  1 

  zone_id = data.aws_route53_zone.selected_zone.id
  name    = aws_ses_domain_mail_from.omaze_mail_from.mail_from_domain
  type    = "TXT"
  ttl     = "600"
  records = ["v=spf1 include:amazonses.com -all"]
}

resource "aws_route53_record" "spf_domain" {
  count =  1 

  zone_id = data.aws_route53_zone.selected_zone.id
  name    = local.workspace["domain"]
  type    = "TXT"
  ttl     = "600"
  records = ["v=spf1 include:amazonses.com -all"]
}

# Sending MX Record
resource "aws_route53_record" "mx_send_mail_from" {
  zone_id = data.aws_route53_zone.selected_zone.id
  name    = aws_ses_domain_mail_from.omaze_mail_from.mail_from_domain
  type    = "MX"
  ttl     = "600"
  records = ["10 feedback-smtp.${var.region}.amazonses.com"]
}

// User for AUTH0 SES
resource "aws_iam_user" "auth0_ses_user" {
  name = "auth0_ses_user"
  path = "/services/"
}

resource "aws_iam_access_key" "auth0_ses_user_key" {
  user = aws_iam_user.auth0_ses_user.name
  depends_on = [aws_iam_user.auth0_ses_user]
}

resource "aws_iam_user_policy" "auth0_ses_user_policy" {
  name = "SESSendEmail"
  user = aws_iam_user.auth0_ses_user.name

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "ses:SendEmail",
        "ses:SendTemplatedEmail",
        "ses:SendRawEmail",
        "ses:SendBulkTemplatedEmail"
      ],
      "Effect": "Allow",
      "Resource": "${aws_ses_domain_identity.omaze_domain_identity.arn}"
    }
  ]
}
EOF
}

output "aws_key_id" {
    value = aws_iam_access_key.auth0_ses_user_key.id
}

output "aws_secret" {
    value = aws_iam_access_key.auth0_ses_user_key.secret
    sensitive   = true
}
