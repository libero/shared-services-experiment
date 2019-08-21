<?php

namespace Libero\SharedServicesExperiment\Client;

use RuntimeException;
use GuzzleHttp\ClientInterface;
use GuzzleHttp\Exception\BadResponseException;
use GuzzleHttp\Exception\ConnectException;
use Libero\SharedServicesExperiment\Client\FileRecord;

class RestFileRetriever
{
    private $client;

    public function __construct(ClientInterface $client)
    {
        $this->client = $client;
    }

    public function retrieveFile(string $path): FileRecord
    {
        try {
            $response = $this->client->request('GET', $path);

            return FileRecord::buildFromResponse($response);
        } catch (BadResponseException $e) {
            throw new FileRetrievalException('Error retrieving file: ' . $path, $e->getCode(), $e);
        } catch (ConnectException $e) {
            throw new RuntimeException('Network Error. ' . $e->getMessage(), $e->getCode(), $e);
        }
    }
}
