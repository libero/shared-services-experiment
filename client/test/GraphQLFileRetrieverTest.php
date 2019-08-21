<?php

use PHPUnit\Framework\TestCase;
use GuzzleHttp\Client;
use GuzzleHttp\ClientInterface;
use GuzzleHttp\Exception\ConnectException;
use GuzzleHttp\Handler\MockHandler;
use GuzzleHttp\HandlerStack;
use GuzzleHttp\Psr7\Response;
use Libero\SharedServicesExperiment\Client\GraphQLFileRetriever;
use Libero\SharedServicesExperiment\Client\FileRetrievalException;
use Psr\Http\Message\RequestInterface;

class GraphQLFileRetrieverTest extends TestCase
{
  // TODO: error when path is /files/file.ext (no namespace)

    private function makeMockFileRetriever($mock)
    {
        $handler = HandlerStack::create($mock);
        $client  = new Client(['handler' => $handler]);

        return new GraphQLFileRetriever($client);
    }

    public function testRetrieveFileIsSuccessful()
    {
        $fileMeta = [ 'data' => ['sharedLink' => 'http://some-link'] ];
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
            new Response(200, [], json_encode($fileMeta)),
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

}
