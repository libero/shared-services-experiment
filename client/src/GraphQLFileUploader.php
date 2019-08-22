<?php

namespace Libero\SharedServicesExperiment\Client;

use InvalidArgumentException;
use Softonic\GraphQL\Client as GraphQLClient;
use Softonic\GraphQL\ResponseBuilder;
use GuzzleHttp\ClientInterface;
use function GuzzleHttp\Psr7\stream_for;

class GraphQLFileUploader
{
    /**
     * GraphQL client instance
     *
     * @var GraphQLClient
     */
    private $client;

    public function __construct(ClientInterface $client)
    {
        $this->client = new GraphQLClient($client, new ResponseBuilder());
    }

    public function uploadFile(string $sourcePath, string $uploadPath): FileRecord
    {
        if (! file_exists($sourcePath)) {
            throw new InvalidArgumentException('File not found: ' . $sourcePath);
        }

        $finfo         = finfo_open(FILEINFO_MIME_TYPE);
        $mimeType      = finfo_file($finfo, $sourcePath);
        $contentLength = filesize($sourcePath);
        $body          = stream_for(fopen($sourcePath, 'r'));

        list($namespace, $path) = explode('/', $uploadPath, 2) + [1 => null];

        $query = <<<'QUERY'
        mutation UploadFile(file: Upload, meta: FileMeta) {
            uploadFile {
                key,
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

        $queryVariables = [
            'file' => $body,
            'meta' => [
                'mimeType'  => $mimeType,
                'size'      => $contentLength,
                'namespace' => $namespace,
                'key'       => $path,
                'tags'      => [[
                    'key'   => 'filename',
                    'value' => basename($sourcePath)
                ]]
            ],
        ];

        try {
            $response = $this->client->query($query, $queryVariables);

            if ($response->hasErrors()) {
                throw new FileUploadException(); // ?????
            }
        } catch (TransportException $e) {
            throw $e;
        }

        $data = $response->getData();

        return FileRecord::buildFromData($data);
    }
}
