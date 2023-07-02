variable "region" {
  type    = string
  default = "eu-central-1"
}

variable "ssd_space" {
  type    = number
  default = 30
}

variable "volume_type" {
  type    = string
  default = "gp3"
}

variable "builder_instance_type" {
  type    = string
  default = "t2.micro"
}

variable "runner_account" {
  type    = string
  default = "terraform"
}

variable "starting_port" {
  type    = number
  default = 7000
}

variable ssh_user {
  type    = string
  default = "ubuntu"
}

variable source_ami {
  type    = string
  default = "ami-06ce824c157700cd2"
}

variable "aws_profile" {
  type    = string
  default = "default"
}

variable "iam_profile" {
  type    = string
  default = "terraform"
}
# USER VARS

variable "env" {
  type = string
}
