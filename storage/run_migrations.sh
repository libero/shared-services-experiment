psql -U postgres -h localhost -c "CREATE DATABASE storage_service"

ls -w 1 migrations | xargs -I {} psql -U postgres -h localhost -d "storage_service" -f migrations/{}
