<?php

namespace Libero\SharedServicesExperiment\Client;

use InvalidArgumentException;
use Softonic\GraphQL\Client as GraphQLClient;
use Softonic\GraphQL\ResponseBuilder;
use GuzzleHttp\ClientInterface;
use function GuzzleHttp\Psr7\stream_for;

class GraphQLFileUploader implements FileUploader
{
    private $client;

    public function __construct(ClientInterface $client)
    {
        $this->client = new GraphQLClient($client, new ResponseBuilder());
    }

    public function uploadFile(string $sourcePath, string $uploadPath): FileUploadRecord
    {
      if (! file_exists($sourcePath)) {
        throw new InvalidArgumentException('File not found: ' . $sourcePath);
      }

      $finfo         = finfo_open(FILEINFO_MIME_TYPE);
      $mimeType      = finfo_file($finfo, $sourcePath);
      $contentLength = filesize($sourcePath);
      $body          = stream_for(fopen($sourcePath, 'r'));
      list(, $path) = explode('/', $uploadPath, 2) + [1 => null];

      $query = <<<'QUERY'
mutation UploadFile(file: Upload, meta: FileMeta) {
        uploadFile {
          id,
          updated,
          size,
          internalLink,
          sharedLink,
          publicLink,
          tags,
          mimeType,
          namespace
        }
      } 
QUERY;

      $queryVariables = [
        'file' => $body,
        'meta' => [
          'mimeType' => $mimeType,
          'size' => $contentLength,
          'namespace' => dirname($uploadPath),
          'path' => $path
        ],
      ];

      $response = $this->client->query($query, $queryVariables);

    }


}
