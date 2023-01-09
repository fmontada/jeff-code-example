provider "aws" {
  profile = var.profile
  region  = var.region
  version = "~> 2.43"
}

resource "aws_sns_topic" "gc_topic_sns" {
  name            = "gc-topic"
  delivery_policy = <<EOF
{
"http": {
  "defaultHealthyRetryPolicy": {
    "numRetries": 3,
    "numNoDelayRetries": 0,
    "minDelayTarget": 20,
    "maxDelayTarget": 20,
    "numMinDelayRetries": 0,
    "numMaxDelayRetries": 0,
    "backoffFunction": "linear"
  },
  "disableSubscriptionOverrides": false
}
}
EOF
  tags = {
    Name        = "terraform"
    Environment = "true"
  }
}

resource "aws_lambda_layer_version" "lambda_layer_worker" {
  filename   = "./lambda-layer/source.zip"
  layer_name = "gc-worker_layer"

  compatible_runtimes = [var.runtime]
}

# Notification
resource "aws_sqs_queue" "notification_sqs" {
  name = "notification"
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.notification_sns_dlq.arn
    maxReceiveCount     = 5
  })

  visibility_timeout_seconds = 300
  tags = {
    Name        = "terraform"
    Environment = "true"
  }
}

resource "aws_sqs_queue" "notification_sns_dlq" {
  name                      = "notification-dlq"
  message_retention_seconds = 1209600
  tags = {
    Name        = "terraform"
    Environment = "true"
  }
}

module "lambda_notification_worker" {
  source = "../../modules/lambda"

  profile       = var.profile
  region        = var.region
  runtime       = var.runtime
  filename      = "../modules/lambda/source/node-function.zip"
  function_name = "gc-notification-worker"
  handler       = "index.handler"
  timeout       = "300"
  role_arn      = var.role_arn
  layers        = ["${aws_lambda_layer_version.lambda_layer_worker.arn}"]

}

resource "aws_sns_topic_subscription" "notification_subscription" {
  topic_arn     = aws_sns_topic.gc_topic_sns.arn
  protocol      = "sqs"
  endpoint      = aws_sqs_queue.notification_sqs.arn
  filter_policy = <<EOF
{
  "event_type": [
    "order/confirm_notify",
    "order/shipped_notify",
    "order/completed_notify",
    "contact/business_owner"
  ],
  "publisher": [
    "gapcommerce"
  ]
}
EOF
}

resource "aws_sqs_queue_policy" "gc_notification_policy_sqs" {
  queue_url = aws_sqs_queue.notification_sqs.id

  policy = <<POLICY
{
  "Version": "2012-10-17",
  "Id": "order_notification_sqs_policy",
  "Statement": [
    {
      "Sid": "First",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "sqs:SendMessage",
      "Resource": "${aws_sqs_queue.notification_sqs.arn}",
      "Condition": {
        "ArnEquals": {
          "aws:SourceArn": "${aws_sns_topic.gc_topic_sns.arn}"
        }
      }
    }
  ]
}
POLICY
}

resource "aws_lambda_event_source_mapping" "sqs_notification_lambda_worker" {
  event_source_arn = aws_sqs_queue.notification_sqs.arn
  function_name    = module.lambda_notification_worker.arn
}


# Order
resource "aws_sqs_queue" "order_sqs" {
  name = "order"
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.order_sqs_dlq.arn
    maxReceiveCount     = 5
  })

  visibility_timeout_seconds = 300
  tags = {
    Name        = "terraform"
    Environment = "true"
  }
}

resource "aws_sqs_queue" "order_sqs_dlq" {
  name                      = "order-dlq"
  message_retention_seconds = 1209600
  tags = {
    Name        = "terraform"
    Environment = "true"
  }
}

module "lambda_order_worker" {
  source = "../../modules/lambda"

  profile       = var.profile
  region        = var.region
  runtime       = var.runtime
  filename      = "../modules/lambda/source/node-function.zip"
  function_name = "gc-order-worker"
  handler       = "index.handler"
  timeout       = "300"
  role_arn      = var.role_arn
  layers        = ["${aws_lambda_layer_version.lambda_layer_worker.arn}"]

}

resource "aws_sns_topic_subscription" "order_subscription" {
  topic_arn     = aws_sns_topic.gc_topic_sns.arn
  protocol      = "sqs"
  endpoint      = aws_sqs_queue.order_sqs.arn
  filter_policy = <<EOF
{
  "event_type": [
    "order/completed"
  ],
  "publisher": [
    "gapcommerce"
  ]
}
EOF
}

resource "aws_sqs_queue_policy" "gc_order_policy_queue" {
  queue_url = aws_sqs_queue.order_sqs.id

  policy = <<POLICY
{
  "Version": "2012-10-17",
  "Id": "order_sqs_policy",
  "Statement": [
    {
      "Sid": "First",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "sqs:SendMessage",
      "Resource": "${aws_sqs_queue.order_sqs.arn}",
      "Condition": {
        "ArnEquals": {
          "aws:SourceArn": "${aws_sns_topic.gc_topic_sns.arn}"
        }
      }
    }
  ]
}
POLICY
}

resource "aws_lambda_event_source_mapping" "sqs_order_lambda_worker" {
  event_source_arn = aws_sqs_queue.order_sqs.arn
  function_name    = module.lambda_order_worker.arn
}

# App
resource "aws_sqs_queue" "app_sqs" {
  name = "app"
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.app_sqs_dlq.arn
    maxReceiveCount     = 5
  })

  visibility_timeout_seconds = 300
  tags = {
    Name        = "terraform"
    Environment = "true"
  }
}

resource "aws_sqs_queue" "app_sqs_dlq" {
  name                      = "app-dlq"
  message_retention_seconds = 1209600
  tags = {
    Name        = "terraform"
    Environment = "true"
  }
}

module "lambda_app_worker" {
  source = "../../modules/lambda"

  profile       = var.profile
  region        = var.region
  runtime       = var.runtime
  filename      = "../modules/lambda/source/node-function.zip"
  function_name = "gc-app-worker"
  handler       = "index.handler"
  timeout       = "300"
  role_arn      = var.role_arn
  layers        = ["${aws_lambda_layer_version.lambda_layer_worker.arn}"]

}

resource "aws_sns_topic_subscription" "app_subscription" {
  topic_arn     = aws_sns_topic.gc_topic_sns.arn
  protocol      = "sqs"
  endpoint      = aws_sqs_queue.app_sqs.arn
  filter_policy = <<EOF
{
  "event_type": [
    "app/shippo",
    "app/inventory"
  ],
  "publisher": [
    "gapcommerce"
  ]
}
EOF
}

resource "aws_sqs_queue_policy" "gc_app_policy_queue" {
  queue_url = aws_sqs_queue.app_sqs.id

  policy = <<POLICY
{
  "Version": "2012-10-17",
  "Id": "app_sqs_policy",
  "Statement": [
    {
      "Sid": "First",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "sqs:SendMessage",
      "Resource": "${aws_sqs_queue.app_sqs.arn}",
      "Condition": {
        "ArnEquals": {
          "aws:SourceArn": "${aws_sns_topic.gc_topic_sns.arn}"
        }
      }
    }
  ]
}
POLICY
}

resource "aws_lambda_event_source_mapping" "sqs_app_lambda_worker" {
  event_source_arn = aws_sqs_queue.app_sqs.arn
  function_name    = module.lambda_app_worker.arn
}


# Alarm
resource "aws_sns_topic" "gc_dlq_sns_topic" {
  name            = "gc-dlq-alarm"
  delivery_policy = <<EOF
{
"http": {
  "defaultHealthyRetryPolicy": {
    "numRetries": 3,
    "numNoDelayRetries": 0,
    "minDelayTarget": 20,
    "maxDelayTarget": 20,
    "numMinDelayRetries": 0,
    "numMaxDelayRetries": 0,
    "backoffFunction": "linear"
  },
  "disableSubscriptionOverrides": false
}
}
EOF
  tags = {
    Name        = "terraform"
    Environment = "true"
  }
}

resource "aws_cloudwatch_metric_alarm" "order-dlq-alarm" {
  alarm_name                = "order-dlq-alarm"
  namespace                 = "AWS/SQS"
  metric_name               = "NumberOfMessagesSent"
  statistic                 = "Sum"
  period                    = "60" # We can change this value as soon as we have more treffic
  comparison_operator       = "GreaterThanOrEqualToThreshold"
  threshold                 = "1"
  evaluation_periods        = "1"
  alarm_actions             = [aws_sns_topic.gc_dlq_sns_topic.arn]
  insufficient_data_actions = [aws_sns_topic.gc_dlq_sns_topic.arn]

  dimensions = {
    QueueName = aws_sqs_queue.order_sqs_dlq.name
  }

  alarm_description = "This metric monitors when a message is send to the order drq becasue the message could not be process"
}

resource "aws_cloudwatch_metric_alarm" "notification-dlq-alarm" {
  alarm_name                = "notification-dlq-alarm"
  namespace                 = "AWS/SQS"
  metric_name               = "NumberOfMessagesSent"
  statistic                 = "Sum"
  period                    = "60" # We can change this value as soon as we have more treffic
  comparison_operator       = "GreaterThanOrEqualToThreshold"
  threshold                 = "1"
  evaluation_periods        = "1"
  alarm_actions             = [aws_sns_topic.gc_dlq_sns_topic.arn]
  insufficient_data_actions = [aws_sns_topic.gc_dlq_sns_topic.arn]

  dimensions = {
    QueueName = aws_sqs_queue.notification_sns_dlq.name
  }

  alarm_description = "This metric monitors when a message is send to the notification drq becasue the message could not be process"
}

resource "aws_cloudwatch_metric_alarm" "app-dlq-alarm" {
  alarm_name                = "app-dlq-alarm"
  namespace                 = "AWS/SQS"
  metric_name               = "NumberOfMessagesSent"
  statistic                 = "Sum"
  period                    = "60" # We can change this value as soon as we have more treffic
  comparison_operator       = "GreaterThanOrEqualToThreshold"
  threshold                 = "1"
  evaluation_periods        = "1"
  alarm_actions             = [aws_sns_topic.gc_dlq_sns_topic.arn]
  insufficient_data_actions = [aws_sns_topic.gc_dlq_sns_topic.arn]

  dimensions = {
    QueueName = aws_sqs_queue.app_sqs_dlq.name
  }

  alarm_description = "This metric monitors when a message is send to the notification drq becasue the message could not be process"
}
