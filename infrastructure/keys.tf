resource "tls_private_key" "key_rsa" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "aws_key_pair" "server_key" {
  key_name   = var.server_key_name
  public_key = tls_private_key.key_rsa.public_key_openssh

  provisioner "local-exec" { # Create "myKey.pem" to your computer
    command = "echo '${tls_private_key.key_rsa.private_key_pem}' > ./${var.server_key_name}.pem"
  }
}

output "private_key" {
  value     = tls_private_key.key_rsa.private_key_pem
  sensitive = true
}
