stop:
	docker-compose down

configuration:
	docker-compose up

status:
	docker-compose exec etcd1 etcdctl endpoint status

test_data:
	docker-compose exec etcd1 etcdctl put /Libero/version SSE
	docker-compose exec etcd1 etcdctl put /Org_A/Journal_A/Type S3
	docker-compose exec etcd1 etcdctl put /Org_A/Journal_A/Bucket Bucket_A
	docker-compose exec etcd1 etcdctl put /Org_A/Journal_A/ACL private
	docker-compose exec etcd1 etcdctl get --prefix /
