variable "region" {
  default = "us-east-1"
  description = "The AWS region."
}

variable "env" {
  default = "shared-services-experiment"
}

variable "vpc_id" {
  default = "vpc-e121f79b"
  description = "Default VPC for us-east-1 on Libero account"
}

variable "subnet_id" {
  default = "subnet-cec2bec1"
  description = "Default for us-east-1f on Libero account"
}
