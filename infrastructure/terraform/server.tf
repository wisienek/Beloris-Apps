#-------------------#
#     IAM Role      #
#-------------------#

resource "aws_iam_role" "ec2_server_role" {
  name = "${local.prefix}_server_role"
  assume_role_policy = data.aws_iam_policy_document.ec2_server_role_assume_role_policy.json
}

#----------#
# policies #
#----------#

resource "aws_iam_role_policy" "access_s3_game_files" {
  name   = "server_access_s3_game_files_policy"
  role = aws_iam_role.ec2_server_role.id
  policy = data.aws_iam_policy_document.access_s3_game_files.json
}

resource "aws_iam_role_policy" "access_rds" {
  name   = "server_access_rds_policy"
  role = aws_iam_role.ec2_server_role.id
  policy = data.aws_iam_policy_document.use_rds.json
}

#------------------#
# policy documents #
#------------------#

data "aws_iam_policy_document" "access_s3_game_files" {
  statement {
    actions = ["s3:*"]

    resources = [
      aws_s3_bucket.updater_bucket.arn,
      "${aws_s3_bucket.updater_bucket.arn}/*",
    ]
  }
}

data "aws_iam_policy_document" "use_rds" {
  statement {
    actions = ["rds-db:*"]

    resources = [
      module.cluster-api.db_instance_arn,
      "${module.cluster-api.db_instance_arn}/*",
    ]
  }
}

#------------#
# sts assume #
#------------#

data "aws_iam_policy_document" "ec2_server_role_assume_role_policy" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
  }
}
