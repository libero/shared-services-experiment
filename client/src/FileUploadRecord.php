<?php

namespace Libero\SharedServicesExperiment\Client;

class FileUploadRecord
{

  private $link;
  private $last_modified;
  private $etag;

  public function __construct(string $link, string $last_modified, string $etag)
  {
    $this->link = $link;
    $this->last_modified = $last_modified;
    $this->etag = $etag;
  }

  // TODO: parse for signed link (rel=signed)
  public function getLink(): string
  {
    return $this->link;
  }

  public function getLastModified(): string
  {
    return $this->last_modified;
  }

  public function getETag(): string
  {
    return $this->etag;
  }

}
