resource "auth0_role" "role_group" {
  for_each = var.roles

  name        = each.key
  description = each.value.description

  dynamic "permissions" {
    for_each = each.value["permissions"]

    content {
      resource_server_identifier = auth0_resource_server.gateway.identifier
      name                       = permissions.value
    }
  }
}
