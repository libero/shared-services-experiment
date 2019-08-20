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
        $mock = new MockHandler([
            new Response(201),
        ]);

        $RestFileUploader = $this->makeMockRestFileUploader($mock);


        $RestFileUploader->uploadFile(__DIR__ . '/stub.txt', '/foo/bar.txt');
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
