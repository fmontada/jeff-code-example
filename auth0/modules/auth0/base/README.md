<!-- BEGIN_TF_DOCS -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | 1.0.0 |
| <a name="requirement_auth0"></a> [auth0](#requirement\_auth0) | ~> 0.32 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_auth0"></a> [auth0](#provider\_auth0) | ~> 0.32 |

## Modules

No modules.

## Resources

| Name | Type |
|------|------|
| [auth0_branding.omaze](https://registry.terraform.io/providers/auth0/auth0/latest/docs/resources/branding) | resource |
| [auth0_client.m2m_client_group](https://registry.terraform.io/providers/auth0/auth0/latest/docs/resources/client) | resource |
| [auth0_client.native_mobile_client_group](https://registry.terraform.io/providers/auth0/auth0/latest/docs/resources/client) | resource |
| [auth0_client.web_client_group](https://registry.terraform.io/providers/auth0/auth0/latest/docs/resources/client) | resource |
| [auth0_client_grant.m2m_gateway_client_grants](https://registry.terraform.io/providers/auth0/auth0/latest/docs/resources/client_grant) | resource |
| [auth0_client_grant.m2m_management_api_client_grants](https://registry.terraform.io/providers/auth0/auth0/latest/docs/resources/client_grant) | resource |
| [auth0_custom_domain.custom_dns](https://registry.terraform.io/providers/auth0/auth0/latest/docs/resources/custom_domain) | resource |
| [auth0_email.ses](https://registry.terraform.io/providers/auth0/auth0/latest/docs/resources/email) | resource |
| [auth0_email_template.email_templates](https://registry.terraform.io/providers/auth0/auth0/latest/docs/resources/email_template) | resource |
| [auth0_prompt_custom_text.prompt_custom_text_group](https://registry.terraform.io/providers/auth0/auth0/latest/docs/resources/prompt_custom_text) | resource |
| [auth0_resource_server.gateway](https://registry.terraform.io/providers/auth0/auth0/latest/docs/resources/resource_server) | resource |
| [auth0_role.role_group](https://registry.terraform.io/providers/auth0/auth0/latest/docs/resources/role) | resource |
| [auth0_tenant.tenant](https://registry.terraform.io/providers/auth0/auth0/latest/docs/resources/tenant) | resource |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_auth0_client_id"></a> [auth0\_client\_id](#input\_auth0\_client\_id) | n/a | `string` | `"auth0_client_id"` | no |
| <a name="input_auth0_debug"></a> [auth0\_debug](#input\_auth0\_debug) | n/a | `bool` | `false` | no |
| <a name="input_auth0_domain"></a> [auth0\_domain](#input\_auth0\_domain) | n/a | `string` | `"auth0_domain"` | no |
| <a name="input_auth0_secret"></a> [auth0\_secret](#input\_auth0\_secret) | n/a | `string` | `"auth0_secret"` | no |
| <a name="input_aws_region"></a> [aws\_region](#input\_aws\_region) | n/a | `string` | `"us-east-1"` | no |
| <a name="input_change_password_file"></a> [change\_password\_file](#input\_change\_password\_file) | HTML file to use for the password reset screen | `string` | n/a | yes |
| <a name="input_custom_domain_name"></a> [custom\_domain\_name](#input\_custom\_domain\_name) | Custom domain name for the tenant | `string` | `null` | no |
| <a name="input_default_from_address"></a> [default\_from\_address](#input\_default\_from\_address) | n/a | `string` | `"default_from_address"` | no |
| <a name="input_email_from_address"></a> [email\_from\_address](#input\_email\_from\_address) | n/a | `string` | `"default_email_address"` | no |
| <a name="input_email_templates"></a> [email\_templates](#input\_email\_templates) | Map of email templates to load onto auth0 tenant | <pre>map(object({<br>    subject              = string,<br>    syntax               = string,<br>    body_file            = string,<br>    result_url           = string,<br>    url_lifetime_seconds = number,<br>    enabled              = bool<br>  }))</pre> | `{}` | no |
| <a name="input_logo_url"></a> [logo\_url](#input\_logo\_url) | What is the URL for the logo used in branding? | `string` | `"https://assets.prd.omazedev.com/new-logo-dark.svg"` | no |
| <a name="input_m2m_clients"></a> [m2m\_clients](#input\_m2m\_clients) | Name and jwt\_lifetime for m2m clients | <pre>map(object({<br>    jwt_lifetime              = number,<br>    scope_list                = list(string),<br>    management_api_scope_list = optional(list(string))<br>  }))</pre> | `{}` | no |
| <a name="input_management_api_url"></a> [management\_api\_url](#input\_management\_api\_url) | Identifier for Auth0 Management API | `string` | `""` | no |
| <a name="input_native_mobile_clients"></a> [native\_mobile\_clients](#input\_native\_mobile\_clients) | Native mobile clients for Auth0, with their grants, callbacks, logout urls, and origins | <pre>map(object({<br>    grant_types           = list(string),<br>    callbacks             = list(string),<br>    allowed_logout_urls   = list(string),<br>    allowed_origins       = list(string),<br>    web_origins           = list(string),<br>    team_id               = string,<br>    app_bundle_identifier = string<br>  }))</pre> | `{}` | no |
| <a name="input_omaze_web_domain"></a> [omaze\_web\_domain](#input\_omaze\_web\_domain) | Omaze web domain origin | `string` | n/a | yes |
| <a name="input_prompt_custom_texts"></a> [prompt\_custom\_texts](#input\_prompt\_custom\_texts) | Map of languages and prompt types for the custom text on auth0 prompts. | <pre>map(map(object({<br>    file = string<br>  })))</pre> | `{}` | no |
| <a name="input_resource_server"></a> [resource\_server](#input\_resource\_server) | Resource Server for Auth0 with identifier and grants | <pre>object({<br>    name                 = string,<br>    identifier           = string,<br>    allow_offline_access = bool,<br>    scopes = list(object({<br>      value       = string,<br>      description = string<br>    }))<br>  })</pre> | `null` | no |
| <a name="input_roles"></a> [roles](#input\_roles) | n/a | <pre>map(object({<br>    description                = string,<br>    permissions                = list(string),<br>    management_api_permissions = optional(list(string))<br>  }))</pre> | n/a | yes |
| <a name="input_ses_user_aws_key_id"></a> [ses\_user\_aws\_key\_id](#input\_ses\_user\_aws\_key\_id) | n/a | `string` | `"hahanope"` | no |
| <a name="input_ses_user_aws_secret"></a> [ses\_user\_aws\_secret](#input\_ses\_user\_aws\_secret) | n/a | `string` | `"hahanope"` | no |
| <a name="input_tenant_name"></a> [tenant\_name](#input\_tenant\_name) | n/a | `string` | `"Omaze Tenant"` | no |
| <a name="input_universal_login_file"></a> [universal\_login\_file](#input\_universal\_login\_file) | HTML file to use for the universal login screens | `string` | n/a | yes |
| <a name="input_web_clients"></a> [web\_clients](#input\_web\_clients) | Web clients for Auth0, with their grants, callbacks, logout urls, and origins | <pre>map(object({<br>    grant_types         = list(string),<br>    callbacks           = list(string),<br>    allowed_logout_urls = list(string),<br>    allowed_origins     = list(string),<br>    web_origins         = list(string)<br>  }))</pre> | `{}` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_m2m_clients"></a> [m2m\_clients](#output\_m2m\_clients) | n/a |
| <a name="output_roles"></a> [roles](#output\_roles) | n/a |
<!-- END_TF_DOCS -->