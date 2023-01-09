locals{
  account_vars = yamldecode(file("${get_original_terragrunt_dir()}/../account_vars.yaml"))
}

remote_state {
  backend = "s3"
  generate = {
    path      = "backend.tf"
    if_exists = "overwrite"
  }
  config = {
    bucket         = "omaze-${local.account_vars["environment"]}-tf"
    key            = "auth0/${path_relative_to_include()}/terraform.tfstate"
    region         = "${local.account_vars["region"]}"
    encrypt        = true
    dynamodb_table = "tf-infra"
    role_arn       = "arn:aws:iam::${local.account_vars["account-id"]}:role/admin"
    disable_bucket_update = true
  }
}

