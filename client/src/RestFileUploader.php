<?php

namespace Libero\SharedServicesExperiment\Client;

use InvalidArgumentException;
use GuzzleHttp\ClientInterface;
use GuzzleHttp\Exception\ConnectException;
use GuzzleHttp\Exception\GuzzleException;
use RuntimeException;

use function GuzzleHttp\Psr7\stream_for;

class RestFileUploader implements FileUploader
{
    /**
     * Http Client
     *
     * @var ClientInterface
     */
    private $client;

    /**
     * Construct the client instance
     *
     * @param ClientInterface $client
     */
    public function __construct(ClientInterface $client)
    {
        $this->client = $client;
    }

    /**
     * Upload a file
     *
     * @param string $sourcePath
     * @param string $uploadPath
     * @return FileUploadRecord
     * @throws InvalidArgumentException
     * @throws FileUploaderException
     */
    public function uploadFile(string $sourcePath, string $uploadPath): FileUploadRecord
    {
        if (! file_exists($sourcePath)) {
            throw new InvalidArgumentException('File not found: ' . $sourcePath);
        }

        $finfo         = finfo_open(FILEINFO_MIME_TYPE);
        $mimeType      = finfo_file($finfo, $sourcePath);
        $contentLength = filesize($sourcePath);
        $body          = stream_for(fopen($sourcePath, 'r'));

        try {
            $response = $this->client->request(
            'PUT',
                $uploadPath,
                [
                    'headers' =>
                    [
                        'Content-Type'     => $mimeType,
                        'Content-Length'   => $contentLength,
                        'Libero-file-tags' => 'filename=' . basename($sourcePath),
                        'If-Match'         => '*'
                    ],
                    'body' => $body
                ]
            );
        } catch (ConnectException $e) {
            throw new RuntimeException('Network Error.' . $e->getMessage(), $e->getCode(), $e);
        } catch (GuzzleException $e) {
            throw new FileUploaderException('Error uploading file', $e->getCode());
        }

        $status = $response->getStatusCode();

        if ($status !== 201) {
            throw new FileUploaderException('Error uploading file', $status);
        }

        return new FileUploadRecord(
          $response->getHeader('Link')[0],
          $response->getHeader('Last-Modified')[0],
          $response->getHeader('ETag')[0]
        );
    }
}
