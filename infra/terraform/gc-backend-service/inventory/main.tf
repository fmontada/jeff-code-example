provider "aws" {
  profile = var.profile
  region  = var.region
  version = "~> 2.43"
}

module "lambda_invetory_control" {
  source = "../../modules/lambda"

  profile       = var.profile
  region        = var.region
  runtime       = var.runtime
  filename      = "../modules/lambda/source/go-function.zip"
  function_name = "gc-invetory-control"
  handler       = "main"
  timeout       = "300"
  role_arn      = var.role_arn

}

# https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/ScheduledEvents.html
resource "aws_cloudwatch_event_rule" "every_day_at_10" {
  name                = "invetory-control"
  description         = "Check the inventory for the configured stores and notify the owner if any of the product is about to expired"
  schedule_expression = "cron(0 10 * * ? *)" # Run at 10:00 am (UTC) every day
}

resource "aws_cloudwatch_event_target" "check_inventory_every_day" {
  rule = aws_cloudwatch_event_rule.every_day_at_10.id
  arn  = module.lambda_invetory_control.arn
}

resource "aws_lambda_permission" "allow_cloudwatch_to_call_check_foo" {
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  function_name = "gc-invetory-control"
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.every_day_at_10.arn
}
