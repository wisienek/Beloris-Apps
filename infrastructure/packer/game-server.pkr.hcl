source "amazon-ebs" "game-ebs" {
  profile = var.aws_profile

  ami_name             = local.ami_name
  ssh_username         = var.ssh_user
  instance_type        = var.builder_instance_type
  iam_instance_profile = var.iam_profile

  associate_public_ip_address = true

  source_ami = var.source_ami

  force_deregister      = true
  force_delete_snapshot = true

  launch_block_device_mappings {
    volume_type = var.volume_type
    volume_size = var.ssd_space

    device_name           = "/dev/sda1"
    encrypted             = false
    delete_on_termination = true
  }
}

build {
  name = "game-ami-creator"
  sources = [
    "source.amazon-ebs.game-ebs"
  ]

  provisioner "shell" {
    scripts = []
    environment_vars = [
      "ACCOUNT=${var.runner_account}",
      "UUID=${build.PackerRunUUID}",
      "S3=${var.s3_bucket}",
      "BUILDER_ACCOUNT=${var.ssh_user}",
    ]
  }
}
