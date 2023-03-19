resource "aws_s3_bucket" "updater_bucket" {
  bucket = "bella-updater-${var.env}"

  tags = merge(local.tags, {})
}

resource "aws_s3_bucket_acl" "updater_bucket_acl" {
  bucket = aws_s3_bucket.updater_bucket.id
  acl    = "public-read"
}
