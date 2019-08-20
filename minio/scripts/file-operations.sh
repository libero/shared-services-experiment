#!/bin/sh

set -e

# Executable that waits for a port at an address to be open.
# For further details go to: https://github.com/ufoscout/docker-compose-wait
/wait

echo "Add s3 location alias called storage to minio config"
mc config host add storage http://minio:9000 longkey verysecretkey

echo "Create private bucket (private by default)"
mc mb storage/private-bucket

echo "Upload file to private bucket"
mc cp ./assets/file.txt storage/private-bucket

echo "Get meta data about uploaded file"
mc stat storage/private-bucket/file.txt

echo "Get public url for uploaded file"
PUBLIC_URL=$(mc share download storage/private-bucket/file.txt --json | jq '.share' | cut -d '"' -f 2)
echo $PUBLIC_URL

echo "Download file in private bucket using public url (i.e. without using credentials)"
wget $PUBLIC_URL -O ./file.txt
