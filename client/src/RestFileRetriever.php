<?php

namespace Libero\SharedServicesExperiment\Client;

use GuzzleHttp\ClientInterface;
use Libero\SharedServicesExperiment\Client\FileRecord;
use Psr\Http\Message\ResponseInterface;

class RestFileRetriever
{

  private $client;

  public function __construct(ClientInterface $client)
  {
    $this->client = $client;
  }

  public function retrieveFile(string $path): FileRecord
  {
    $response =  $this->client->request('GET', $path);
    return new FileRecord($response);
  }

}
