variable "aws_region" {
  type    = string
  default = "eu-central-1"
}

variable "server_instance_type" {
  type    = string
  default = "t2.micro"
}

variable "env" {
  default = "stage"

  validation {
    condition = contains(["stage", "prod"], var.env)
    error_message = "Invalid environment"
  }
}

variable "db_pass" {
  description = "Database password"

  validation {
    condition = length(var.db_pass) > 5
    error_message = "Password must be at least 5 characters long"
  }
}
