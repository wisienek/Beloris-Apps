#resource "aws_security_group" "ec_server_sg" {
#  name   = "ec-server-sg"
#  vpc_id = module.bella_vpc.vpc_id
#  egress {
#    from_port        = 0
#    to_port          = 0
#    protocol         = "-1"
#    cidr_blocks      = ["0.0.0.0/0"]
#    ipv6_cidr_blocks = ["::/0"]
#  }
#}
#
#resource "aws_security_group" "bella-db-sg" {
#  name   = "${local.prefix}-db-sg"
#  vpc_id = module.bella_vpc.vpc_id
#
#  ingress {
#    description     = "Allow from ec2 to MySQL"
#    security_groups = [aws_security_group.ec_server_sg.id]
#    from_port       = 3306
#    to_port         = 3306
#    protocol        = "TCP"
#  }
#}
#
#module "server_sg" {
#  source = "registry.terraform.io/terraform-aws-modules/security-group/aws"
#
#  name        = "${local.prefix}-server-sg"
#  description = "Main security group"
#  vpc_id      = module.bella_vpc.vpc_id
#
#  ingress_cidr_blocks = ["0.0.0.0/0"]
#  ingress_with_cidr_blocks = [
#    {
#      description = "Allow inbound ssh traffic "
#      protocol    = "TCP"
#      from_port   = 22
#      to_port     = 22
#      cidr_blocks = "0.0.0.0/0"
#    },
#    {
#      description = "Allow inbound http traffic"
#      protocol    = "TCP"
#      from_port   = 80
#      to_port     = 80
#      cidr_blocks = "0.0.0.0/0"
#    },
#    {
#      description = "Allow inbound file traffic"
#      protocol    = "TCP"
#      from_port   = 21
#      to_port     = 21
#      cidr_blocks = "0.0.0.0/0"
#    },
#    {
#      description = "Allow inbound TCP traffic"
#      protocol    = "TCP"
#      protocol    = "all"
#      cidr_blocks = "0.0.0.0/0"
#    },
#    {
#      description = "Allow inbound UDP traffic"
#      protocol    = "UDP"
#      protocol    = "all"
#      cidr_blocks = "0.0.0.0/0"
#    },
#  ]
#  egress_cidr_blocks = ["0.0.0.0/0"]
#  egress_with_cidr_blocks = [
#    {
#      description = "Allow outbound ssh traffic "
#      protocol    = "TCP"
#      from_port   = 22
#      to_port     = 22
#      cidr_blocks = "0.0.0.0/0"
#    },
#    {
#      description = "Allow outbound http traffic"
#      protocol    = "TCP"
#      from_port   = 80
#      to_port     = 80
#      cidr_blocks = "0.0.0.0/0"
#    },
#    {
#      description = "Allow outbound file traffic"
#      protocol    = "TCP"
#      from_port   = 21
#      to_port     = 21
#      cidr_blocks = "0.0.0.0/0"
#    },
#    {
#      description = "Allow outbound TCP traffic"
#      protocol    = "TCP"
#      protocol    = "all"
#      cidr_blocks = "0.0.0.0/0"
#    },
#    {
#      description = "Allow outbound UDP traffic"
#      protocol    = "UDP"
#      protocol    = "all"
#      cidr_blocks = "0.0.0.0/0"
#    },
#  ]
#}
