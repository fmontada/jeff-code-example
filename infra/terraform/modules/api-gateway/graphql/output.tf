output "id" {
  value = aws_api_gateway_rest_api.api.id
}

output "execution_arn" {
  value = aws_api_gateway_rest_api.api.execution_arn
}

output "root_resource_id" {
  value = aws_api_gateway_rest_api.api.root_resource_id
}

output "graphql_resouce_id" {
  value = aws_api_gateway_resource.root.id
}

output "graphql_resouce_path" {
  value = aws_api_gateway_resource.root.path_part
}

output "graphql_resouce_parent_id" {
  value = aws_api_gateway_resource.root.parent_id
}
