resource "aws_s3_bucket" "updater_bucket" {
  bucket = "bella-updater-1a"
}

resource "aws_s3_bucket_acl" "updater_bucket_acl" {
  bucket = aws_s3_bucket.updater_bucket.id
  acl    = "public-read"
}
