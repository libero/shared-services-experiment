<?php

namespace Libero\SharedServicesExperiment\Client;

interface FileUploader
{
    public function uploadFile(string $sourcePath, string $uploadPath): array;
}
