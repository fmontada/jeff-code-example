resource "auth0_resource_server" "gateway" {
  name        = var.resource_server["name"]
  identifier  = var.resource_server["identifier"]
  signing_alg = "RS256"

  enforce_policies     = true
  allow_offline_access = var.resource_server["allow_offline_access"]
  token_dialect        = "access_token_authz"

  skip_consent_for_verifiable_first_party_clients = true

  dynamic "scopes" {
    for_each = var.resource_server["scopes"] != null ? var.resource_server["scopes"] : []

    content {
      value       = scopes.value["value"]
      description = scopes.value["description"]
    }
  }
}

resource "auth0_client_grant" "m2m_gateway_client_grants" {
  for_each = var.m2m_clients

  client_id = auth0_client.m2m_client_group[each.key].id
  audience  = auth0_resource_server.gateway.identifier
  scope     = each.value.scope_list

  depends_on = [
    auth0_client.m2m_client_group
  ]
}

resource "auth0_client_grant" "m2m_management_api_client_grants" {
  for_each = { for k, v in var.m2m_clients : k => v if v.management_api_scope_list != null }

  client_id = auth0_client.m2m_client_group[each.key].id
  audience  = var.management_api_url
  scope     = each.value.management_api_scope_list

  depends_on = [
    auth0_client.m2m_client_group
  ]
}
