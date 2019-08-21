stop:
	docker-compose down -v

configuration:
	docker-compose up etcd1

health:
	docker-compose exec etcd1 etcdctl endpoint health
