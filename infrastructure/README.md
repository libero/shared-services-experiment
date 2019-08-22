## How to run

```
# assuming you have this profile in ~/.aws/credentials
export AWS_PROFILE=libero
# setup of local state only
terraform init
# will ask for confirmation of changes
terraform apply
# server SSH key is stored on S3 to avoid a git-crypt setup in this repository
./ssh
```

Everything is deployed from source:
```
cd ~/shared-service-experiment
cd storage
docker-compose ps
```
