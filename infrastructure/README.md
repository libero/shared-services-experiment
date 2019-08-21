## How to run

```
# assuming you have this profile in ~/.aws/credentials
export AWS_PROFILE=libero
# server SSH key is stored on S3 to avoid a git-crypt setup in this repository
aws s3 cp single-node--shared-services-experiment.key s3://libero-terraform/shared-services-experiment/single-node--shared-services-experiment.key
# setup of local state only
terraform init
# will ask for confirmation of changes
terraform apply
./ssh
```

