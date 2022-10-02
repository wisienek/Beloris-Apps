module "bella_vpc" {
  source = "registry.terraform.io/terraform-aws-modules/vpc/aws"

  name = "bella_vpc"

  cidr             = "10.0.0.0/16"
  azs              = ["${var.aws_region}a", "${var.aws_region}b", "${var.aws_region}c"]
  public_subnets   = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  private_subnets  = ["10.0.4.0/24", "10.0.5.0/24", "10.0.6.0/24"]
  database_subnets = ["10.0.7.0/24", "10.0.8.0/24", "10.0.9.0/24"]
  intra_subnets    = ["10.0.10.0/24", "10.0.11.0/24", "10.0.12.0/24"]

  enable_nat_gateway     = false
  single_nat_gateway     = false
  one_nat_gateway_per_az = false

  enable_vpn_gateway = false

  enable_dns_support   = false
  enable_dns_hostnames = false

  create_database_subnet_group = true
}

locals {
  route_table_ids = toset(module.bella_vpc.intra_route_table_ids)
}

resource "aws_vpc_endpoint_route_table_association" "s3-endpoint-rt-association" {
  route_table_id  = module.bella_vpc.intra_route_table_ids[0]
  vpc_endpoint_id = aws_vpc_endpoint.s3-endpoint.id
}

resource "aws_db_subnet_group" "bella" {
  name       = "bella-db"
  subnet_ids = module.bella_vpc.database_subnets
}

resource "aws_vpc_endpoint" "s3-endpoint" {
  vpc_id       = module.bella_vpc.vpc_id
  service_name = "com.amazonaws.${var.aws_region}.s3"
  tags = {
    "Name" = "${module.bella_vpc.name}-s3-endpoint"
  }
}

output "vpc_id" {
  value = module.bella_vpc.vpc_id
}

