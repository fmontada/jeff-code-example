output "client_id" {
  value = "${auth0_client.omaze_user_service_app.client_id}"
}

output "primary" {
  value = "${auth0_custom_domain.custom_domain.primary}"
}

output "status" {
  value = "${auth0_custom_domain.custom_domain.status}"
}

output "verification" {
  value = "${auth0_custom_domain.custom_domain.verification}"
}
