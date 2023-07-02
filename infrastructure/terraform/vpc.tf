module "bella_vpc" {
  source  = "registry.terraform.io/terraform-aws-modules/vpc/aws"
  version = "3.14.0"

  name = "bella_vpc"

  cidr             = "10.0.0.0/16"
  azs              = ["${data.aws_region.current.name}a", "${data.aws_region.current.name}b", "${data.aws_region.current.name}c"]
  public_subnets   = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  private_subnets  = ["10.0.4.0/24", "10.0.5.0/24", "10.0.6.0/24"]
  database_subnets = ["10.0.7.0/24", "10.0.8.0/24", "10.0.9.0/24"]
  intra_subnets    = ["10.0.10.0/24", "10.0.11.0/24", "10.0.12.0/24"]

  default_route_table_name    = "bella_vpc_${var.env}_default"
  database_subnet_group_name  = "bella_vpc_${var.env}_db_sb"

  enable_nat_gateway      = false
  single_nat_gateway      = false
  one_nat_gateway_per_az  = true

  enable_vpn_gateway      = false

  enable_dns_support      = true
  enable_dns_hostnames    = true

  create_database_subnet_group = true

  tags = merge(local.tags, {})
}

locals {
  route_table_ids = toset(module.bella_vpc.intra_route_table_ids)
}

resource "aws_vpc_endpoint_route_table_association" "s3-endpoint-rt-association" {
  route_table_id  = module.bella_vpc.intra_route_table_ids[0]
  vpc_endpoint_id = aws_vpc_endpoint.s3-endpoint.id
}

resource "aws_vpc_endpoint" "s3-endpoint" {
  vpc_id       = module.bella_vpc.vpc_id
  service_name = "com.amazonaws.${var.aws_region}.s3"

  tags = merge(local.tags, {
    "Name" = "${module.bella_vpc.name}-s3-endpoint"
  })
}

output "vpc_id" {
  value = module.bella_vpc.vpc_id
}

#--------------------#
#       SG Rules     #
#--------------------#

#-----------#
#  Inbound  #
#-----------#

resource "aws_security_group_rule" "df_sg_inbound_http" {
  from_port         = 80
  to_port           = 80
  protocol          = "tcp"
  security_group_id = module.bella_vpc.default_security_group_id
  type              = "ingress"
  cidr_blocks       = ["0.0.0.0/0"]
}

resource "aws_security_group_rule" "df_sg_inbound_https" {
  from_port         = 443
  to_port           = 443
  protocol          = "tcp"
  security_group_id = module.bella_vpc.default_security_group_id
  type              = "ingress"
  cidr_blocks       = ["0.0.0.0/0"]
}

resource "aws_security_group_rule" "df_sg_inbound_ftp" {
  from_port         = 21
  to_port           = 21
  protocol          = "tcp"
  security_group_id = module.bella_vpc.default_security_group_id
  type              = "ingress"
  cidr_blocks       = ["0.0.0.0/0"]
}

resource "aws_security_group_rule" "df_sg_inbound_sql" {
  from_port         = 3306
  to_port           = 3306
  protocol          = "tcp"
  security_group_id = module.bella_vpc.default_security_group_id
  type              = "ingress"
  cidr_blocks       = ["0.0.0.0/0"]
}

#------------#
#  Outbound  #
#------------#

resource "aws_security_group_rule" "df_sg_outbound_http" {
  from_port         = 80
  to_port           = 80
  protocol          = "tcp"
  security_group_id = module.bella_vpc.default_security_group_id
  type              = "egress"
  cidr_blocks       = ["0.0.0.0/0"]
}

resource "aws_security_group_rule" "df_sg_outbound_https" {
  from_port         = 443
  to_port           = 443
  protocol          = "tcp"
  security_group_id = module.bella_vpc.default_security_group_id
  type              = "egress"
  cidr_blocks       = ["0.0.0.0/0"]
}

resource "aws_security_group_rule" "df_sg_outbound_ftp" {
  from_port         = 21
  to_port           = 21
  protocol          = "tcp"
  security_group_id = module.bella_vpc.default_security_group_id
  type              = "egress"
  cidr_blocks       = ["0.0.0.0/0"]
}

resource "aws_security_group_rule" "df_sg_outbound_sql" {
  from_port         = 3306
  to_port           = 3306
  protocol          = "tcp"
  security_group_id = module.bella_vpc.default_security_group_id
  type              = "egress"
  cidr_blocks       = ["0.0.0.0/0"]
}

