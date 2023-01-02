variable "aws_region" {
  type    = string
  default = "eu-central-1"
}

variable "server_instance_type" {
  type    = string
  default = "t2.micro"
}

variable "server_key_name" {
  type = string
  default = "server_key"
}
