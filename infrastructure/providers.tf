provider "aws" {
  region = "${var.region}"
}

provider "local" {
}

terraform {
  backend "s3" {
    bucket = "libero-terraform"
    key    = "shared-services-experiment/terraform.tfstate"
    region = "us-east-1"
  }
}
