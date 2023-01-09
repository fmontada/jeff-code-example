terraform {
  required_version = "0.12.18"
  backend "s3" {
    bucket         = "gc-tf"
    key            = "gc-serverless/terraform.tfstate"
    region         = "us-west-1"
    dynamodb_table = "tf-infra"
  }
}


provider "aws" {
  profile = local.workspace["profile"]
  region  = local.workspace["region"]
  version = "~> 2.43"
}

locals {
  lambda_uri = join("", ["arn:aws:apigateway:",
    "${local.workspace["region"]}",
    ":lambda:path/2015-03-31/functions/",
    "${module.lambda.arn}",
  ":$${stageVariables.environment}/invocations"])

  # TODO Move this into each env
  dev  = "dev"
  prod = "prod"
  qa   = "qa"

  env = {
    default = {
      api_name                = "gc-graphql-api"
      runtime                 = "nodejs10.x"
      filename                = "../modules/lambda/source/node-function.zip"
      function_name           = "gc-backend"
      handler                 = "index.graphqlHandler"
      cognito_user_pool_name  = "gc-user-pool"
      cognito_authorizer_type = "COGNITO_USER_POOLS"
    }

    prod = {
      region      = "us-west-1"
      profile     = "gc-prod"
      memory_size = "1024"
      timeout     = "300"
      environment = {
        active = "true"
      }
    }

    dev = {
      region      = "us-west-1"
      profile     = "gc-dev"
      memory_size = "512"
      timeout     = "300"
      environment = {
        active = "true"
      }
    }

  }

  active_env = "${contains(keys(local.env), terraform.workspace) ? terraform.workspace : "default"}"
  workspace  = "${merge(local.env["default"], local.env[local.active_env])}"

}

module "cognito" {
  source = "../modules/cognito"

  profile                = local.workspace["profile"]
  cognito_user_pool_name = local.workspace["cognito_user_pool_name"]
  roles                  = ["ADMIN", "SUPER_ADMIN", "SALLER"]
  schemas_string = [{
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true
    name                     = "ACCOUNT_ID"
    required                 = false

    string_attribute_constraints = {
      min_length = 1
      max_length = 256
    }
    }, {
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true
    name                     = "STORE_ID"
    required                 = false

    string_attribute_constraints = {
      min_length = 1
      max_length = 256
    }
    },
    {
      attribute_data_type      = "String"
      developer_only_attribute = false
      mutable                  = true
      name                     = "email"
      required                 = true

      string_attribute_constraints = {
        min_length = 1
        max_length = 256
      }
    }
  ]
}

module "lambda" {
  source = "../modules/lambda"

  profile       = local.workspace["profile"]
  region        = local.workspace["region"]
  function_name = local.workspace["function_name"]
  runtime       = local.workspace["runtime"]
  filename      = local.workspace["filename"]
  handler       = local.workspace["handler"]
  timeout       = local.workspace["timeout"]
  role_arn      = aws_iam_role.iam_for_lambda.arn
  layers        = ["${aws_lambda_layer_version.lambda_layer.arn}"]

}

module "lambda_cognito" {
  source = "../modules/lambda"

  profile       = local.workspace["profile"]
  region        = "us-west-2"
  function_name = "cognito_trigger"
  runtime       = local.workspace["runtime"]
  filename      = local.workspace["filename"]
  handler       = "handler"
  timeout       = local.workspace["timeout"]
  role_arn      = aws_iam_role.iam_for_lambda.arn

}

module "apigateway" {
  source = "../modules/api-gateway/graphql"

  profile  = local.workspace["profile"]
  region   = local.workspace["region"]
  api_name = local.workspace["api_name"]
  #authorization = "COGNITO_USER_POOLS"
  aws_api_gateway_authorizer_id = aws_api_gateway_authorizer.authorizer.id
}

resource "aws_api_gateway_authorizer" "authorizer" {
  name            = "congnito_authorizer"
  rest_api_id     = module.apigateway.id
  type            = local.workspace["cognito_authorizer_type"]
  identity_source = "method.request.header.Authorization"
  provider_arns   = [module.cognito.arn]
}

resource "aws_lambda_layer_version" "lambda_layer" {
  filename   = "./lambda-layer/source.zip"
  layer_name = "${local.workspace["function_name"]}_layer"

  compatible_runtimes = [local.workspace["runtime"]]
}

# Create System Static Bucket
resource "aws_s3_bucket" "static_metadata" {
  bucket = "gc-metadata-${local.active_env}"
  acl    = "private"

  versioning {
    enabled = true
  }

  # Remove after testing the file upload
  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["PUT", "POST", "GET"]
    allowed_origins = ["*"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }

  tags = {
    Name        = "terraform"
    Environment = "true"
  }
}

# SSM
module "ssm" {
  source  = "./ssm"
  profile = local.workspace["profile"]
  region  = local.workspace["region"]
}

# Pub Sub
module "pub_sub" {
  source = "./pub-sub"

  profile  = local.workspace["profile"]
  region   = local.workspace["region"]
  runtime  = local.workspace["runtime"]
  role_arn = aws_iam_role.iam_for_lambda.arn
}

// Invetory Control
module "inventory" {
  source = "./inventory"

  profile  = local.workspace["profile"]
  region   = local.workspace["region"]
  runtime  = "go1.x"
  role_arn = aws_iam_role.iam_for_lambda.arn
}

# Integration
resource "aws_api_gateway_integration" "get_integ" {
  rest_api_id             = module.apigateway.id
  resource_id             = module.apigateway.graphql_resouce_id
  http_method             = "GET"
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = local.lambda_uri
  credentials             = aws_iam_role.iam_apiw_execution_role.arn
}

resource "aws_api_gateway_integration" "post_intg" {
  rest_api_id             = module.apigateway.id
  resource_id             = module.apigateway.graphql_resouce_id
  http_method             = "POST"
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = local.lambda_uri
  credentials             = aws_iam_role.iam_apiw_execution_role.arn
}

# Deployment + Stage
resource "aws_api_gateway_deployment" "dev_deployment" {
  depends_on  = [aws_api_gateway_integration.get_integ]
  rest_api_id = module.apigateway.id
  stage_name  = local.dev
  variables = {
    environment = local.dev
  }
}

resource "aws_api_gateway_deployment" "prod_deployment" {
  depends_on  = [aws_api_gateway_integration.get_integ]
  rest_api_id = module.apigateway.id
  stage_name  = local.prod
  variables = {
    environment = local.prod
  }
}

resource "aws_api_gateway_deployment" "qa_deployment" {
  depends_on  = [aws_api_gateway_integration.get_integ]
  rest_api_id = module.apigateway.id
  stage_name  = local.qa
  variables = {
    environment = local.qa
  }
}

# Lambda
# resource "aws_lambda_permission" "apigw_lambda" {
#  statement_id  = "AllowExecutionFromAPIGateway"
#  action        = "lambda:InvokeFunction"
#  function_name = local.workspace["function_name"]
#  qualifier     = local.dev
#  principal     = "apigateway.amazonaws.com"
#  source_arn    = "${module.apigateway.execution_arn}/*/*"
#}

# Create the api gateway lambda
# execution role
data "aws_iam_policy_document" "apiw_assume_role_policy" {
  statement {
    actions = [
      "sts:AssumeRole",
    ]
    principals {
      type        = "Service"
      identifiers = ["apigateway.amazonaws.com"]
    }
    effect = "Allow"
  }
}

data "aws_iam_policy_document" "apiw_invoke_policy" {
  statement {
    actions = [
      "lambda:InvokeFunction"
    ]
    resources = [
      "*",
    ]
    effect = "Allow"
  }
}

resource "aws_iam_role" "iam_apiw_execution_role" {
  name               = "${local.workspace["api_name"]}-iam_execution_role"
  assume_role_policy = data.aws_iam_policy_document.apiw_assume_role_policy.json
}

resource "aws_iam_policy" "iam_invoke_role" {
  name   = "${local.workspace["api_name"]}-iam_invoke_role"
  policy = data.aws_iam_policy_document.apiw_invoke_policy.json
}

resource "aws_iam_role_policy_attachment" "attachment_role" {
  role       = aws_iam_role.iam_apiw_execution_role.name
  policy_arn = aws_iam_policy.iam_invoke_role.arn
}

# ------------------------------------
# Create Apollo Lambda Role
# ---------------------------
data "aws_iam_policy_document" "lambda_assume_role_policy" {
  statement {
    actions = [
      "sts:AssumeRole"
    ]
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
    effect = "Allow"
  }
}

data "aws_iam_policy_document" "lambda_policy_document" {
  statement {
    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents"
    ]
    resources = [
      "arn:aws:logs:*:*:*",
    ]
    effect = "Allow"
  }

  statement {
    actions = [
      "s3:*",
    ]
    resources = [
      "arn:aws:s3:::*",
    ]
    effect = "Allow"
  }

  statement {
    actions = [
      "dynamodb:*",
      "dax:*",
    ]
    resources = [
      "*",
    ]
    effect = "Allow"
  }

  statement {
    actions = [
      "sqs:*"
    ]
    resources = [
      "*",
    ]
    effect = "Allow"
  }

  statement {
    actions = [
      "sns:*"
    ]
    resources = [
      "*",
    ]
    effect = "Allow"
  }

  statement {
    actions = [
      "ses:*"
    ]
    resources = [
      "*",
    ]
    effect = "Allow"
  }

  statement {
    effect = "Allow"
    actions = [
      "cognito-identity:*",
      "cognito-idp:*",
      "cognito-sync:*",
      "iam:ListRoles",
      "iam:ListOpenIdConnectProviders",
      "sns:ListPlatformApplications"
    ]
    resources = ["*"]
  }

  statement {
    effect    = "Allow"
    actions   = ["iam:CreateServiceLinkedRole"]
    resources = ["*"]
  }


  statement {
    effect = "Allow"
    actions = [
      "*"
    ]
    resources = ["arn:aws:iam::*:role/aws-service-role/email.cognito-idp.amazonaws.com/AWSServiceRoleForAmazonCognitoIdpEmail*"]
  }

  statement {
    actions = [
      "mobiletargeting:*"
    ]
    resources = [
      "*",
    ]
    effect = "Allow"
  }
}

resource "aws_iam_role" "iam_for_lambda" {
  name = "${local.workspace["function_name"]}_${local.active_env}_iam_role"

  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role_policy.json
}

resource "aws_iam_policy" "lambda_iam_policy" {
  name        = "lambda_${local.workspace["function_name"]}"
  path        = "/"
  description = "Policy for Lambda"

  policy = data.aws_iam_policy_document.lambda_policy_document.json
}

resource "aws_iam_role_policy_attachment" "attachment_policy" {
  role       = aws_iam_role.iam_for_lambda.name
  policy_arn = aws_iam_policy.lambda_iam_policy.arn
}
