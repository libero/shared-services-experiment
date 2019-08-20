# OTS Configuration Services

Most of the research/text below is taken from https://stackshare.io/

## etcd

A distributed consistent key-value store for shared configuration and service discovery.

etcd is a distributed key value store that provides a reliable way to store data across a cluster of machines. It’s open-source and available on GitHub. etcd gracefully handles master elections during network partitions and will tolerate machine failure, including the master.

- Website: https://etcd.io/
- Documentation: https://etcd.io/docs/v3.3.12/
- Containers: https://console.cloud.google.com/gcr/images/etcd-development/GLOBAL/etcd?gcrImageListsize=30
- License: Apache License Version 2.0

## redis

An in-memory database that persists on disk.

Redis is an open source, BSD licensed, advanced key-value store. It is often referred to as a data structure server since keys can contain strings, hashes, lists, sets and sorted sets.

- Website: https://redis.io/
- Documentation: https://redis.io/documentation
- Containers: `docker pull redis`
- License: BSD

## Consul (HashiCorp)

A tool for service discovery, monitoring and configuration.

Consul is a tool for service discovery and configuration. Consul is distributed, highly available, and extremely scalable

- Website: https://www.consul.io/
- Documentation: https://www.consul.io/docs/index.html
- Containers: `docker pull consul`
- License: Mozilla Public License 2.0

## Zookeeper (apache)

Because coordinating distributed systems is a Zoo

A centralized service for maintaining configuration information, naming, providing distributed synchronization, and providing group services. All of these kinds of services are used in some form or another by distributed applications.

- Website: http://zookeeper.apache.org/
- Documentation: http://zookeeper.apache.org/doc/r3.5.5/
- Containers: `docker pull zookeeper`
- License:  Apache License Version 2.0
