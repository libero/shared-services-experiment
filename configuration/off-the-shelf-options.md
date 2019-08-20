# OTS Configuration Services

Most of the research/text below is taken from https://stackshare.io/

## etcd

A distributed consistent key-value store for shared configuration and service discovery.

etcd is a distributed key value store that provides a reliable way to store data across a cluster of machines. It’s open-source and available on GitHub. etcd gracefully handles master elections during network partitions and will tolerate machine failure, including the master.

- Website: https://etcd.io/
- Documentation: https://etcd.io/docs/v3.3.12/
- Containers: https://console.cloud.google.com/gcr/images/etcd-development/GLOBAL/etcd?gcrImageListsize=30
- License: Apache License Version 2.0

### Opinion

This is an attactive option for MVP as it provides the minmal functionality we need to read/write key-values.
Downsides is that its not as widely adopted as the other solutions and that its stored on disk so not as performant as others like redis.

- Authentication
- Watch for changed values
- Distributed locks
- Transactional writes
- etcdkeeper (UI, MIT) https://github.com/evildecay/etcdkeeper

## redis

An in-memory database that persists on disk.

Redis is an open source, BSD licensed, advanced key-value store. It is often referred to as a data structure server since keys can contain strings, hashes, lists, sets and sorted sets.

- Website: https://redis.io/
- Documentation: https://redis.io/documentation
- Containers: `docker pull redis`
- License: BSD

### Opinion

Performant as its stored in-memory and also allows for other data-types to be stored. Downside is that it does not have service disovery - but that is not really a requirement.

- There are separate UIs you can get for it. See https://redislabs.com/blog/so-youre-looking-for-the-redis-gui/

## Consul (HashiCorp)

A tool for service discovery, monitoring and configuration.

Consul is a tool for service discovery and configuration. Consul is distributed, highly available, and extremely scalable

- Website: https://www.consul.io/
- Documentation: https://www.consul.io/docs/index.html
- Containers: `docker pull consul`
- License: Mozilla Public License 2.0

### Opinion

Coming from the HashiCorp stable it is more popular that etcd, it comes out of the box with a UI (see demo).
It has, in addtion to Service discovery, identity-based authorization, and L7 traffic management abstracted from application code with proxies in the service mesh pattern. So does seem the more mature/rounder choice.

Example L7 traffic management (https://www.consul.io/mesh.html):
```
Kind = "service-splitter"
Name = "billing-api"

Splits = [
    {
        Weight        = 10
        ServiceSubset = "v2"
    },
    {
        Weight        = 90
        ServiceSubset = "v1"
    },
]
```

## Zookeeper (apache)

Because coordinating distributed systems is a Zoo

A centralized service for maintaining configuration information, naming, providing distributed synchronization, and providing group services. All of these kinds of services are used in some form or another by distributed applications.

- Website: http://zookeeper.apache.org/
- Documentation: http://zookeeper.apache.org/doc/r3.5.5/
- Containers: `docker pull zookeeper`
- License:  Apache License Version 2.0

### Opinion

Developers report it take a lot more work to setup (https://gist.github.com/yurishkuro/10cb2dc42f42a007a8ce0e055ed0d171) and does not offer service discovery.

... and Java :boom:
