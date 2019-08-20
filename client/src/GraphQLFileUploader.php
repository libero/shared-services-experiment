<?php

namespace Libero\SharedServicesExperiment\Client;

use GuzzleHttp\ClientInterface;

class GraphQLFileUploader implements FileUploader
{
    public function __construct(ClientInterface $client)
    {
        $this->client = new Client
    }

    public function uploadFile(string $sourcePath, string $uploadPath): array
    {

    }
}
