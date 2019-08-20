<?php

namespace Libero\SharedServicesExperiment\Client;

class FileUploadRecord
{

  private $link;
  private $lastModified;
  private $etag;

  public function __construct(string $link, string $last_modified, string $etag)
  {
    $this->link         = $link;
    $this->lastModified = $last_modified;
    $this->etag         = $etag;
  }

  // TODO: parse for signed link (rel=signed)
  public function getLink(): string
  {
    return $this->link;
  }

  public function getLastModified(): string
  {
    return $this->lastModified;
  }

  public function getETag(): string
  {
    return $this->etag;
  }

}
