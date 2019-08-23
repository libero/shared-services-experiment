resource "aws_s3_bucket" "storage_service" {
  bucket = "storage-service-demo"
}

resource "aws_iam_user" "storage_service" {
  name = "${var.env}-storage-service"
  path = "/applications/"
}

resource "aws_iam_access_key" "storage_service" {
  user    = "${aws_iam_user.storage_service.name}"
}

output "credentials_storage_service_id" {
  value = "${aws_iam_access_key.storage_service.id}"
}

output "credentials_storage_service_secret" {
  value = "${aws_iam_access_key.storage_service.secret}"
}

resource "aws_iam_policy" "storage_service_s3_write" {
  name        = "${var.env}StorageServiceS3Write"
  path        = "/applications/"
  description = "Allows read and write access to storage service S3 storage"

  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:ListAllMyBuckets"
            ],
            "Resource": ["*"]
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:*"
            ],
            "Resource": [
                "arn:aws:s3:::${aws_s3_bucket.storage_service.id}",
                "arn:aws:s3:::${aws_s3_bucket.storage_service.id}/*"
            ]
        }
    ]
}
EOF
}

resource "aws_iam_user_policy_attachment" "storage_service" {
  user       = "${aws_iam_user.storage_service.name}"
  policy_arn = "${aws_iam_policy.storage_service_s3_write.arn}"
}
