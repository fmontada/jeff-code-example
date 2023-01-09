terraform {
  required_version = "0.12.18"
  backend "s3" {
    bucket         = "gc-tf"
    key            = "api-gateway-graphql/terraform.tfstate"
    region         = "us-west-1"
    dynamodb_table = "tf-infra"
  }
}

provider "aws" {
  profile = var.profile
  region  = var.region
  version = "~> 2.43"
}

# API Gateway
resource "aws_api_gateway_rest_api" "api" {
  name = var.api_name
}

resource "aws_api_gateway_resource" "root" {
  path_part   = "graphql"
  parent_id   = aws_api_gateway_rest_api.api.root_resource_id
  rest_api_id = aws_api_gateway_rest_api.api.id
}

resource "aws_api_gateway_method" "method_get" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_resource.root.id
  http_method   = "GET"
  # authorization = "NONE"

  authorization = var.authorization
  authorizer_id = var.authorization == "NONE" ? "" : var.aws_api_gateway_authorizer_id

  request_parameters = {
    "method.request.header.Authorization" = var.authorization == "NONE" ? false : true
  }
}

resource "aws_api_gateway_method" "method_post" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_resource.root.id
  http_method   = "POST"
  authorization = var.authorization
  authorizer_id = var.authorization == "NONE" ? "" : var.aws_api_gateway_authorizer_id

  request_parameters = {
    "method.request.header.Authorization" = var.authorization == "NONE" ? false : true
  }
}

# Cors
resource "aws_api_gateway_method" "_" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_resource.root.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "_" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_resource.root.id
  http_method = aws_api_gateway_method._.http_method

  type = "MOCK"

  request_templates = {
    "application/json" = "{ \"statusCode\": 200 }"
  }
}

resource "aws_api_gateway_integration_response" "_" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_resource.root.id
  http_method = aws_api_gateway_method._.http_method
  status_code = 200

  response_parameters = local.integration_response_parameters

  depends_on = [
    aws_api_gateway_integration._,
    aws_api_gateway_method_response._,
  ]
}

resource "aws_api_gateway_method_response" "_" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_resource.root.id
  http_method = aws_api_gateway_method._.http_method
  status_code = 200

  response_parameters = local.method_response_parameters

  response_models = {
    "application/json" = "Empty"
  }

  depends_on = [
    aws_api_gateway_method._,
  ]
}
