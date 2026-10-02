terraform {
  required_version = ">= 1.16.0, < 2.0.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}

# These credentials and endpoints are exclusively for local emulation.
provider "aws" {
  region     = "us-east-1"
  access_key = "test"
  secret_key = "test"

  skip_credentials_validation = true
  skip_metadata_api_check     = true
  skip_requesting_account_id  = true
  s3_use_path_style           = true

  endpoints {
    s3        = "http://127.0.0.1:4566"
    s3control = "http://127.0.0.1:4566"
    sts       = "http://127.0.0.1:4566"
  }
}
