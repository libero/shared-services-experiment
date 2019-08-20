FROM minio/mc:latest

WORKDIR /srv

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.5.0/wait /wait
RUN chmod +x /wait

RUN apk update && apk add curl jq
