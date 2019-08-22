<?php

namespace Libero\SharedServicesExperiment\Client;

use InvalidArgumentException;
use GuzzleHttp\ClientInterface;
use GuzzleHttp\Exception\BadResponseException;
use GuzzleHttp\Exception\ConnectException;
use RuntimeException;

use function GuzzleHttp\Psr7\stream_for;

class RestFileUploader
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
     * @return FileRecord
     * @throws InvalidArgumentException
     * @throws FileUploadException
     */
    public function uploadFile(string $sourcePath, string $uploadPath): FileRecord
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
        } catch (BadResponseException $e) {
            throw new FileUploadException('Error uploading file', $e->getCode(), $e);
        } catch (ConnectException $e) {
            throw new RuntimeException('Network Error. ' . $e->getMessage(), $e->getCode(), $e);
        }

        $status = $response->getStatusCode();

        if ($status !== 201) {
            throw new FileUploadException('Error uploading file', $status);
        }

        return FileRecord::buildFromResponse($response);
    }
}
