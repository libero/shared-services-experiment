<?php

use PHPUnit\Framework\TestCase;
use GuzzleHttp\Client;
use GuzzleHttp\Handler\MockHandler;
use GuzzleHttp\HandlerStack;
use GuzzleHttp\Psr7\Response;
use Libero\SharedServicesExperiment\Client\RestFileUploader;
use Libero\SharedServicesExperiment\Client\RestFileUploaderException;

class RestFileUploaderTest extends TestCase
{
    private function makeMockRestFileUploader($mock)
    {
        $handler = HandlerStack::create($mock);
        $client  = new Client(['handler' => $handler]);

        return new RestFileUploader($client);
    }

    public function testUploadFileIsSuccessful()
    {
        $mockHeaders = [
          'Link' => 'http://user-facing-server/files/namespace/directory/file.ext',
          'Last-Modified' => '2019-08-20 14:28:01.123456',
          'ETag' => 'someHashOrOtherForETag'
        ];

        $mock = new MockHandler([
            new Response(201,
              [
                'Link' => 'http://user-facing-server/files/namespace/directory/file.ext',
                'Last-Modified' => '2019-08-20 14:28:01.123456',
                'ETag' => 'someHashOrOtherForETag'
              ]),
        ]);

        $RestFileUploader = $this->makeMockRestFileUploader($mock);


        $result = $RestFileUploader->uploadFile(__DIR__ . '/stub.txt', '/foo/bar.txt');

        $this->assertEquals($mockHeaders['Link'], $result->getLink());
        $this->assertEquals($mockHeaders['Last-Modified'], $result->getLastModified());
        $this->assertEquals($mockHeaders['ETag'], $result->getETag());
    }

    public function testUploadFileFailsWhenFileDoesntExist()
    {
        $mock = new MockHandler([
            new Response(201),
        ]);

        $RestFileUploader = $this->makeMockRestFileUploader($mock);

        $this->expectException(InvalidArgumentException::class);

        $RestFileUploader->uploadFile(__DIR__ . '/doesnt.exist', '/foo/bar.txt');
    }

    public function testUploadFileFailsWhenClientErrorOccurs()
    {
        $mock = new MockHandler([
            new Response(500),
        ]);

        $RestFileUploader = $this->makeMockRestFileUploader($mock);

        $this->expectException(RestFileUploaderException::class);
        $this->expectExceptionCode(500);

        $RestFileUploader->uploadFile(__DIR__ . '/stub.txt', '/foo/bar.txt');
    }

    public function testUploadFileFailsWhenClientReturnsWrongCode()
    {
        $mock = new MockHandler([
            new Response(200),
        ]);

        $RestFileUploader = $this->makeMockRestFileUploader($mock);

        $this->expectException(RestFileUploaderException::class);
        $this->expectExceptionCode(200);

        $RestFileUploader->uploadFile(__DIR__ . '/stub.txt', '/foo/bar.txt');
    }
}
