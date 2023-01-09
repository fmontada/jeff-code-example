terraform {
  required_version = "0.12.18"
  backend "s3" {
    bucket         = "gc-tf"
    key            = "lambda/terraform.tfstate"
    region         = "us-west-1"
    dynamodb_table = "tf-infra"
  }
}

provider "aws" {
  profile = var.profile
  region  = var.region
  version = "~> 2.43"
}

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

data "aws_iam_policy_document" "lambda_logging_policy" {
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
}

resource "aws_iam_role" "iam_for_lambda" {
  name = "${var.function_name}-iam_role"

  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role_policy.json
}

resource "aws_lambda_function" "lambda" {
  filename         = var.filename
  function_name    = var.function_name
  role             = aws_iam_role.iam_for_lambda.arn
  handler          = var.handler
  source_code_hash = filebase64sha256(var.filename)
  runtime          = var.runtime
  memory_size      = var.memory_size
  timeout          = var.timeout

  environment {
    variables = {
      terraform = var.environment.active
    }
  }

  tags = {
    terraform = true
  }

  depends_on = [aws_iam_role_policy_attachment.lambda_logs, aws_cloudwatch_log_group.log_group]
}

resource "aws_cloudwatch_log_group" "log_group" {
  name              = "/aws/lambda/${var.function_name}"
  retention_in_days = 14
}

resource "aws_iam_policy" "lambda_logging" {
  name        = "lambda_logging"
  path        = "/"
  description = "IAM policy for logging from a Lambda"

  policy = data.aws_iam_policy_document.lambda_logging_policy.json
}

resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.iam_for_lambda.name
  policy_arn = aws_iam_policy.lambda_logging.arn
}

resource "aws_lambda_alias" "dev_alias" {
  name             = "dev"
  description      = "Dev Environment"
  function_name    = aws_lambda_function.lambda.arn
  function_version = "$LATEST"

  depends_on = [aws_lambda_function.lambda]
}

resource "aws_lambda_alias" "prod_alias" {
  name             = "prod"
  description      = "Prod Environment"
  function_name    = aws_lambda_function.lambda.arn
  function_version = "$LATEST"

  depends_on = [aws_lambda_function.lambda]
}

resource "aws_lambda_alias" "qa_alias" {
  name             = "qa"
  description      = "QA Environment"
  function_name    =  aws_lambda_function.lambda.arn
  function_version = "$LATEST"

  depends_on = [aws_lambda_function.lambda]
}
