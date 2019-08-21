<?php

use PHPUnit\Framework\TestCase;
use GuzzleHttp\Client;
use GuzzleHttp\ClientInterface;
use GuzzleHttp\Exception\ConnectException;
use GuzzleHttp\Handler\MockHandler;
use GuzzleHttp\HandlerStack;
use GuzzleHttp\Psr7\Response;
use Libero\SharedServicesExperiment\Client\RestFileRetriever;
use Libero\SharedServicesExperiment\Client\FileRetrievalException;
use Psr\Http\Message\RequestInterface;

class RestFileRetrieverTest extends TestCase
{
  // TODO: error when path is /files/file.ext (no namespace)

    private function makeMockFileRetriever($mock)
    {
        $handler = HandlerStack::create($mock);
        $client  = new Client(['handler' => $handler]);

        return new RestFileRetriever($client);
    }

    public function testRetrieveFileIsSuccessful()
    {
        $bodyContent = 'The file contents';
        $mockHeaders = [
          'Content-Type' => 'application/pdf',
          'Content-Length' => strlen($bodyContent),
          'Libero-file-tags' => 'tag1=value1,tag2=value2',
          'Link'          => 'http://server/files/namespace/directory/file.ext',
          'Last-Modified' => '2019-08-20 14:28:01.123456',
          'ETag'          => 'someHashOrOtherForETag',
        ];

        $mock = new MockHandler([
            new Response(200, $mockHeaders, $bodyContent),
        ]);

        $fileRetriever = $this->makeMockFileRetriever($mock);

        $result = $fileRetriever->retrieveFile('some-path');

        $this->assertEquals($bodyContent, $result->getBody());
        $this->assertEquals($mockHeaders['Content-Type'], $result->getContentType());
        $this->assertEquals($mockHeaders['ETag'], $result->getETag());
        $this->assertEquals($mockHeaders['Last-Modified'], $result->getLastModified());
        $this->assertEquals($mockHeaders['Link'], $result->getLink());
        $this->assertEquals($mockHeaders['Content-Length'], $result->getSize());
        $this->assertEquals(
          [
            'tag1' => 'value1',
            'tag2' => 'value2',
          ],
          $result->getTags()
        );
    }

    public function testRetrieveFileMetaIsSuccessful()
    {
        $bodyContent = 'The file contents';
        $mockHeaders = [
          'Content-Type'     => 'application/pdf',
          'Content-Length'   => strlen($bodyContent),
          'Libero-file-tags' => 'tag1=value1,tag2=value2',
          'Link'             => 'http://server/files/namespace/directory/file.ext',
          'Last-Modified'    => '2019-08-20 14:28:01.123456',
          'ETag'             => 'someHashOrOtherForETag',
        ];

        $mock = new MockHandler([
            new Response(200, $mockHeaders, null),
        ]);

        $fileRetriever = $this->makeMockFileRetriever($mock);

        $result = $fileRetriever->retrieveFileMeta('some-path');

        $this->assertEquals(null, $result->getBody());
        $this->assertEquals($mockHeaders['Content-Type'], $result->getContentType());
        $this->assertEquals($mockHeaders['ETag'], $result->getETag());
        $this->assertEquals($mockHeaders['Last-Modified'], $result->getLastModified());
        $this->assertEquals($mockHeaders['Link'], $result->getLink());
        $this->assertEquals($mockHeaders['Content-Length'], $result->getSize());
        $this->assertEquals(
          [
            'tag1' => 'value1',
            'tag2' => 'value2',
          ],
          $result->getTags()
        );
    }

    public function testRetrieveFileFailsWhenInvalidPath()
    {
        $mock = new MockHandler([
            new Response(404)
        ]);

        $fileRetriever = $this->makeMockFileRetriever($mock);

        $this->expectException(FileRetrievalException::class);
        $this->expectExceptionMessage('Error retrieving file: some-path');

        $fileRetriever->retrieveFile('some-path');
    }

    public function testRetrieveFileFailsWhenServerInternalErrorOccurs()
    {
        $mock = new MockHandler([
            new Response(500)
        ]);

        $fileRetriever = $this->makeMockFileRetriever($mock);

        $this->expectException(FileRetrievalException::class);
        $this->expectExceptionMessage('Error retrieving file: some-path');

        $fileRetriever->retrieveFile('some-path');
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

        $fileRetriever = new RestFileRetriever($mock);

        $this->expectException(RuntimeException::class);
        $this->expectExceptionMessage('Network Error. network failure');

        $fileRetriever->retrieveFile('some-path');
    }

}
