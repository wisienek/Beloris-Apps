locals {
  prefix                          = "bella"
  admin_db_engine                 = "aurora-mysql"
  admin_db_engine_version         = "5.7.mysql_aurora.2.07.2"

  tags = {
    Manager     = "terraform"
    Environment = var.env
  }
}

output "prefix" {
  value = local.prefix
}
