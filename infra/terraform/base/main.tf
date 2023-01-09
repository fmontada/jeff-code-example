terraform {
  required_version = "0.12.18"
  backend "s3" {
    bucket         = "gc-tf"
    key            = "base-infra/terraform.tfstate"
    region         = "us-west-1"
    dynamodb_table = "tf-infra"
  }
}

provider "aws" {
  profile = var.profile
  region  = var.region
  version = "~> 2.43"
}

resource "aws_s3_bucket" "my-bucket" {
  bucket = "my-tf-test-bucket-fmontada-s3"
  acl    = "private"

  tags = {
    Name        = "My bucket"
    Environment = "Dev"
  }
}
