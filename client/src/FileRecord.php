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

  private function __construct()
  {
  }

  public static function buildFromResponse(ResponseInterface $response): self
  {
    $instance = new static;

    $instance->body = $response->getBody();
    $instance->contentType = $response->getHeader('Content-Type')[0];
    $instance->etag = $response->getHeader('ETag')[0];
    $instance->lastModified = $response->getHeader('Last-Modified')[0];
    $instance->link = $response->getHeader('Link')[0];
    $instance->size = $response->getHeader('Content-Length')[0];
    $instance->tags = array_reduce(
      explode(',', $response->getHeader('Libero-file-tags')[0]),
      function ($carry, $item) {
        list($key, $value) = explode('=', $item, 2);
        $carry[$key] = $value;
        return $carry;
      },
      []
    );

    return $instance;
  }

  public static function buildFromData(array $data): self
  {
      $instance = new static;

      $instance->contentType  = $data['mimeType'];
      $instance->size         = $data['size'];
      $instance->lastModified = $data['updated'];
      $instance->link         = $data['sharedLink'];
      $instance->tags         = $data['tags'] ?? [];
      $instance->namespace    = $data['namespace'];

      return $instance;
  }

  public function getBody(): ?string
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
