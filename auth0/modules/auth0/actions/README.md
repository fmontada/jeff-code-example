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
| [auth0_action.action_group](https://registry.terraform.io/providers/auth0/auth0/latest/docs/resources/action) | resource |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_actions"></a> [actions](#input\_actions) | Map of actions to load onto auth0 tenant | <pre>map(object({<br>    runtime = string,<br>    deploy  = bool,<br>    supported_triggers = object({<br>      id      = string,<br>      version = string<br>    }),<br>    action_file = string,<br>    dependencies_list = optional(list(object({<br>      name    = string,<br>      version = string<br>    }))),<br>    secrets_list = optional(list(object({<br>      name  = string,<br>      value = string<br>    })))<br>  }))</pre> | `{}` | no |
| <a name="input_auth0_client_id"></a> [auth0\_client\_id](#input\_auth0\_client\_id) | n/a | `string` | `"auth0_client_id"` | no |
| <a name="input_auth0_domain"></a> [auth0\_domain](#input\_auth0\_domain) | n/a | `string` | `"auth0_domain"` | no |
| <a name="input_auth0_secret"></a> [auth0\_secret](#input\_auth0\_secret) | n/a | `string` | `"auth0_secret"` | no |
| <a name="input_aws_region"></a> [aws\_region](#input\_aws\_region) | n/a | `string` | `"us-east-1"` | no |

## Outputs

No outputs.
<!-- END_TF_DOCS -->