module "cluster-api" {
  source  = "terraform-aws-modules/rds/aws"
  version = "5.6.0"

  identifier      = "${local.prefix}-api-db"

  engine                = "mysql"
  engine_version        = "5.7"
  major_engine_version  = "5.7"
  family                = "mysql5.7"

  instance_class        = "db.t3.micro"
  allocated_storage     = 20
  max_allocated_storage = 20

  db_name               = "${local.prefix}ForumDb"
  username              = "user"
  password              = var.db_pass
  port                  = 3306

  db_subnet_group_name    = module.bella_vpc.database_subnet_group_name
  vpc_security_group_ids  = [module.bella_vpc.default_security_group_id]

  create_db_subnet_group  = false
  deletion_protection     = false

  iam_database_authentication_enabled = true
  create_random_password              = false

  apply_immediately   = true
  skip_final_snapshot = true
  storage_encrypted   = false
  publicly_accessible = true

  availability_zone = "${data.aws_region.current.name}c"

  parameters = [
    {
      name = "character_set_client"
      value = "utf8mb4"
    },
    {
      name = "character_set_server"
      value = "utf8mb4"
    }
  ]
}

output "db_instance_arn" {
  value = module.cluster-api.db_instance_arn
}
