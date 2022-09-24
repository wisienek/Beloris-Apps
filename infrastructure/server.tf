data "aws_ami" "server_image" {
  most_recent = true

  filter {
    name   = "name"
    values = ["amzn2-ami-kernel-5.10-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  owners = ["740770524067"]
}

resource "aws_instance" "server_image_instance" {
  ami                  = data.aws_ami.server_image.id
  instance_type        = var.server_instance_type
  hibernation          = false

  key_name = aws_key_pair.server_key.key_name

  subnet_id              = element(module.bella_vpc.public_subnets, 0)
  vpc_security_group_ids = [element(module.server_sg, 0).security_group_id]

  root_block_device {
    volume_type = "gp2"
    volume_size = 20
  }

  tags = {
    Name = "${local.prefix}-server-ec2"
  }

  lifecycle {
    ignore_changes = [ami]
  }
}

resource "aws_eip" "server_eip" {
  vpc      = true
  instance = aws_instance.server_image_instance.id
  tags = {
    Name = "${local.prefix}-server-eip"
  }
}

