<?php

namespace Libero\SharedServicesExperiment\Client;

use InvalidArgumentException;
use Psr\Http\Message\ResponseInterface;

class FileRecord
{

  private $body;
  private $contentType;
  private $etag;
  private $lastModified;
  private $link;
  private $size;
  private $tags;

  public function __construct(ResponseInterface $response)
  {
    $this->body = $response->getBody();
    $this->contentType = $response->getHeader('Content-Type')[0];
    $this->etag = $response->getHeader('ETag')[0];
    $this->lastModified = $response->getHeader('Last-Modified')[0];
    $this->link = $response->getHeader('Link')[0];
    $this->size = $response->getHeader('Content-Length')[0];
    $this->tags = array_reduce(
      explode(',', $response->getHeader('Libero-file-tags')[0]),
      function ($carry, $item) {
        list($key, $value) = explode('=', $item, 2);
        $carry[$key] = $value;
        return $carry;
      },
      []
    );
  }

  public function getBody(): string
  {
    return $this->body;
  }

  public function getContentType(): string
  {
    return $this->contentType;
  }

  public function getETag(): string
  {
    return $this->etag;
  }

  public function getLastModified(): string
  {
    return $this->lastModified;
  }

  // TODO: parse for signed link (rel=signed)
  public function getLink(): string
  {
    return $this->link;
  }

  public function getSize(): string
  {
    return $this->size;
  }

  public function getTags(): array
  {
    return $this->tags;
  }

  public function getTag(string $key): string
  {
    if (!isset($this->tags[$key])) {
      throw new InvalidArgumentException('No Libero tag exists called ' . $key);
    }

    return $this->tags[$key];
  }

}
