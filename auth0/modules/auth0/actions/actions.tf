resource "auth0_action" "action_group" {
  for_each = var.actions

  name    = each.key
  runtime = each.value.runtime
  deploy  = each.value.deploy

  supported_triggers {
    id      = each.value.supported_triggers.id
    version = each.value.supported_triggers.version
  }

  code = <<-EOT
${file("${each.value.action_file}")}
EOT

  dynamic "dependencies" {
    for_each = each.value.dependencies_list != null ? each.value.dependencies_list : []

    content {
      name    = dependencies.value["name"]
      version = dependencies.value["version"]
    }
  }

  dynamic "secrets" {
    for_each = each.value.secrets_list != null ? each.value.secrets_list : []
    content {
      name  = secrets.value["name"]
      value = secrets.value["value"]
    }
  }
}

resource "auth0_trigger_binding" "flows" {
  for_each = var.trigger_bindings

  trigger = each.key
  dynamic "actions" {
    for_each = each.value

    content {
      id           = auth0_action.action_group[actions.value.id].id
      display_name = actions.value.display_name
    }
  }
}
