<?php

use PHPUnit\Framework\TestCase;
use GuzzleHttp\Client;
use GuzzleHttp\ClientInterface;
use GuzzleHttp\Exception\ConnectException;
use GuzzleHttp\Handler\MockHandler;
use GuzzleHttp\HandlerStack;
use GuzzleHttp\Psr7\Response;
use Libero\SharedServicesExperiment\Client\RestFileUploader;
use Libero\SharedServicesExperiment\Client\FileUploadException;
use Psr\Http\Message\RequestInterface;

class RestFileUploaderTest extends TestCase
{
  // TODO: error when path is /files/file.ext (no namespace)

    private function makeMockFileUploader($mock)
    {
        $handler = HandlerStack::create($mock);
        $client  = new Client(['handler' => $handler]);

        return new RestFileUploader($client);
    }

    public function testUploadFileIsSuccessful()
    {
        $mockHeaders = [
          'Link'           => 'http://user-facing-server/files/namespace/directory/file.ext',
          'Last-Modified'  => '2019-08-20 14:28:01.123456',
          'ETag'           => 'someHashOrOtherForETag',
          'Content-Type'   => 'application/text',
          'Content-Length' => 12345
        ];

        $mock = new MockHandler([
            new Response(201, $mockHeaders),
        ]);

        $fileUploader = $this->makeMockFileUploader($mock);

        $result = $fileUploader->uploadFile(__DIR__ . '/stub.txt', '/foo/bar.txt');

        $this->assertEquals($mockHeaders['Link'], $result->getLink());
        $this->assertEquals($mockHeaders['Last-Modified'], $result->getLastModified());
        $this->assertEquals($mockHeaders['Content-Type'], $result->getContentType());
        $this->assertEquals($mockHeaders['Content-Length'], $result->getSize());
        $this->assertEquals($mockHeaders['ETag'], $result->getETag());
    }

    public function testUploadFileSendsCorrectRequest()
    {
        $sourcePath = __DIR__ . '/stub.txt';
        $uploadPath = '/namespace/directory/foo.txt';
        $fileSize   = filesize($sourcePath);
        $body       = fread(fopen($sourcePath, 'r'), filesize($sourcePath));

        /** @var \GuzzleHttp\ClientInterface $mock */
        $mock = $this->createMock(ClientInterface::class);

        $response = new Response(201, [
            'Link'           => 'http://user-facing-server/files/namespace/directory/file.ext',
            'Last-Modified'  => '2019-08-20 14:28:01.123456',
            'ETag'           => 'someHashOrOtherForETag',
            'Content-Type'   => 'application/text',
            'Content-Length' => 12345
        ]);

        $mock->expects($this->once())
            ->method('request')
            ->with(
                'PUT',
                $uploadPath,
                $this->callback(function ($options) use ($fileSize, $body) {
                    return empty(array_diff($options['headers'],
                        [
                            'Content-Type'     => 'text/plain',
                            'Content-Length'   => $fileSize,
                            'Libero-file-tags' => 'filename=stub.txt',
                            'If-Match'         => '*'
                        ]
                    ))
                    && $options['body'] instanceof GuzzleHttp\Psr7\Stream
                    && $options['body']->getContents() === $body;
                })
            )
            ->will($this->returnValue($response));

        $fileUploader = new RestFileUploader($mock);

        $fileUploader->uploadFile($sourcePath, $uploadPath);
    }

    public function testUploadFileFailsWhenFileDoesntExist()
    {
        $mock = new MockHandler([
            new Response(201),
        ]);

        $fileUploader = $this->makeMockFileUploader($mock);

        $this->expectException(InvalidArgumentException::class);

        $fileUploader->uploadFile(__DIR__ . '/doesnt.exist', '/foo/bar.txt');
    }

    public function testUploadFileFailsWhenServerErrorOccurs()
    {
        $mock = new MockHandler([
            new Response(500),
        ]);

        $fileUploader = $this->makeMockFileUploader($mock);

        $this->expectException(FileUploadException::class);
        $this->expectExceptionCode(500);

        $fileUploader->uploadFile(__DIR__ . '/stub.txt', '/foo/bar.txt');
    }

    public function testUploadFileFailsWhenServerReturnsWrongCode()
    {
        $mock = new MockHandler([
            new Response(200),
        ]);

        $fileUploader = $this->makeMockFileUploader($mock);

        $this->expectException(FileUploadException::class);
        $this->expectExceptionCode(200);

        $fileUploader->uploadFile(__DIR__ . '/stub.txt', '/foo/bar.txt');
    }

    public function testUploadFileFailsWhenServerInternalErrorOccurs()
    {
        $mock = new MockHandler([
            new Response(500, [], json_encode([])),
        ]);

        $fileUploader = $this->makeMockFileUploader($mock);

        $this->expectException(FileUploadException::class);

        $fileUploader->uploadFile(__DIR__ . '/stub.txt', '/foo/bar.txt');
    }

    public function testUploadFileFailsWhenNetworkErrorOccurs()
    {
        /** @var \GuzzleHttp\ClientInterface $mock */
        $mock = $this->createMock(ClientInterface::class);

        /** @var \Psr\Http\Message\RequestInterface $requestMock */
        $requestMock = $this->createMock(RequestInterface::class);

        $mock->expects($this->once())
            ->method('request')
            ->willThrowException(new ConnectException('network failure', $requestMock));

        $fileUploader = new RestFileUploader($mock);

        $this->expectException(RuntimeException::class);
        $this->expectExceptionMessage('Network Error. network failure');

        $fileUploader->uploadFile(__DIR__ . '/stub.txt', '/foo/bar.txt');
    }
}
