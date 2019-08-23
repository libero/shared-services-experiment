<?php

namespace Libero\SharedServicesExperiment\Client;

use RuntimeException;
use GuzzleHttp\Exception\BadResponseException;
use Softonic\GraphQL\Client as GraphQLClient;
use Softonic\GraphQL\ResponseBuilder;
use GuzzleHttp\ClientInterface;
use function GuzzleHttp\Psr7\stream_for;

class GraphQLFileRetriever
{
    /**
     * GraphQL client instance
     *
     * @var GraphQLClient
     */
    private $client;
    private $restFileRetriever;

    public function __construct(ClientInterface $client)
    {
        $this->client = new GraphQLClient($client, new ResponseBuilder());
        $this->restFileRetriever = new RestFileRetriever($client);
    }

    public function retrieveFile(string $path): FileRecord
    {
        $fileRecord = $this->retrieveFileMeta($path);

        return $this->restFileRetriever->retrieveFile($fileRecord->getLink());
    }

    public function retrieveFileMeta(string $path): FileRecord
    {
        $query = <<<'QUERY'
        query GetFileMeta(key: String) {
            getFileMeta {
                updated,
                size,
                sharedLink,
                publicLink,
                tags,
                mimeType,
                namespace
            }
        }
QUERY;

        $queryVariables = [ 'key' => $path ];

        try {
            $response = $this->client->query($query, $queryVariables);

            if ($response->hasErrors()) {
                throw new FileUploadException(); // ?????
            }
        } catch (RuntimeException $e) {
          $originalException = $e->getPrevious();

          if ($originalException instanceof BadResponseException) {
            throw new FileRetrievalException('Error retrieving file: ' . $path);
          }
          throw $e;
        }

        $data = $response->getData();

        return FileRecord::buildFromData($data);
    }
}
