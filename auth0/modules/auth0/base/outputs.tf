output "m2m_clients" {
  value     = auth0_client.m2m_client_group
  sensitive = true
}

output "roles" {
  value     = auth0_role.role_group
  sensitive = true
}
