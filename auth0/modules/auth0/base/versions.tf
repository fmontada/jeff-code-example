terraform {
  experiments      = [module_variable_optional_attrs]
  required_version = "1.0.0"
  required_providers {
    auth0 = {
      source = "auth0/auth0"
    }
  }
}
