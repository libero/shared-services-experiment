<?php

use PHPUnit\Framework\TestCase;
use GuzzleHttp\Client;
use GuzzleHttp\ClientInterface;
use GuzzleHttp\Exception\TransferException;
use GuzzleHttp\Handler\MockHandler;
use GuzzleHttp\HandlerStack;
use GuzzleHttp\Psr7\Response;
use Libero\SharedServicesExperiment\Client\GraphQLFileUploader;
use Libero\SharedServicesExperiment\Client\FileUploadException;

class GraphQLFileUploaderTest extends TestCase
{
  // TODO: error when path is /files/file.ext (no namespace)

    private function makeMockFileUploader($mock)
    {
        $handler = HandlerStack::create($mock);
        $client  = new Client(['handler' => $handler]);

        return new GraphQLFileUploader($client);
    }

    public function testUploadFileIsSuccessful()
    {
        $data = [
            'mimeType'   => 'application/txt',
            'sharedLink' => 'http://user-facing-server/files/namespace/directory/file.ext',
            'namespace'  => 'namespace',
            'path'       => 'directory/file.ext',
            'size'       => 12345,
            'updated'    => '2019-08-20 14:28:01.123456',
            'tags'       => [
                ['filename' => 'stub.txt']
            ]
        ];

        $mock = new MockHandler([
            new Response(200, [], json_encode(['data' => $data])),
        ]);

        $fileUploader = $this->makeMockFileUploader($mock);

        $result = $fileUploader->uploadFile(__DIR__ . '/stub.txt', '/foo/bar.txt');

        $this->assertEquals($data['sharedLink'], $result->getLink());
        $this->assertEquals($data['updated'], $result->getLastModified());
        $this->assertEquals('', $result->getETag());
    }

    public function testUploadFileFailsWhenFileDoesntExist()
    {
        $mock = new MockHandler([
            new Response(200),
        ]);

        $fileUploader = $this->makeMockFileUploader($mock);

        $this->expectException(InvalidArgumentException::class);

        $fileUploader->uploadFile(__DIR__ . '/doesnt.exist', '/foo/bar.txt');
    }

    public function testUploadFileFailsWhenServerErrorOccurs()
    {
        $mock = new MockHandler([
            new Response(200, [], json_encode(['errors' => ['something went wrong']])),
        ]);

        $fileUploader = $this->makeMockFileUploader($mock);

        $this->expectException(FileUploadException::class);

        $fileUploader->uploadFile(__DIR__ . '/stub.txt', '/foo/bar.txt');
    }

    public function testUploadFileFailsWhenServerInternalErrorOccurs()
    {
        $mock = new MockHandler([
            new Response(500, [], json_encode([])),
        ]);

        $fileUploader = $this->makeMockFileUploader($mock);

        $this->expectException(RuntimeException::class);

        $fileUploader->uploadFile(__DIR__ . '/stub.txt', '/foo/bar.txt');
    }

    public function testUploadFileFailsWhenNetworkError()
    {
        /** @var \GuzzleHttp\ClientInterface $mock */
        $mock = $this->createMock(ClientInterface::class);

        $mock->expects($this->once())
            ->method('request')
            ->willThrowException(new TransferException('server error'));

        $fileUploader = new GraphQLFileUploader($mock);

        $this->expectException(RuntimeException::class);
        $this->expectExceptionMessage('server error');

        $fileUploader->uploadFile(__DIR__ . '/stub.txt', '/foo/bar.txt');
    }
}
