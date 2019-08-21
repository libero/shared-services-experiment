#!/bin/sh

aws_cli() {
  aws --endpoint-url http://minio:9000 $@
}

set -e

# Executable that waits for a port at an address to be open.
# For further details go to: https://github.com/ufoscout/docker-compose-wait
/wait

echo "Create private bucket (private by default)"
aws_cli s3 mb s3://private-bucket

echo "Upload file to private bucket with custom meta data"
aws_cli s3 cp ./assets/file.txt s3://private-bucket --content-type text/plain --metadata CustomMetaKey=CustomMetaValue

echo "Get meta data about uploaded file"
aws_cli s3api head-object --bucket private-bucket --key file.txt

echo "Get public url for uploaded file"
public_url=$(aws_cli s3 presign s3://private-bucket/file.txt)
echo $public_url

echo "Download file in private bucket using public url (i.e. without using credentials)"
wget $public_url -O ./file.txt

echo "Create public read-only bucket"
aws_cli s3 mb s3://public-bucket

echo "Apply bucket policy"
aws_cli s3api put-bucket-policy --bucket public-bucket --policy file://aws-policies/public-download-policy.json

echo "Get public bucket policy"
aws_cli s3api get-bucket-policy --bucket public-bucket

echo "Upload file to public bucket"
aws_cli s3 cp ./assets/file.txt s3://public-bucket --content-type text/plain --metadata CustomMetaKey=CustomMetaValue

echo "Get meta data about uploaded file"
aws_cli s3api head-object --bucket public-bucket --key file.txt

echo "Get file from public bucket without credentials"
wget http://minio:9000/public-bucket/file.txt -O ./file1.txt

echo "Clean up downloaded files"
rm file.txt file1.txt
