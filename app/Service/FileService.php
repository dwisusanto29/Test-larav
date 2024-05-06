<?php

namespace App\Service;

use Illuminate\Http\UploadedFile;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class FileService
{
    public function storeFile(UploadedFile $uploadedFile, string $file_location): string
    {
        return $uploadedFile->store($file_location, 'local');
    }

    public function downloadFile(string $file_location): BinaryFileResponse
    {
        return response()->download(storage_path("app/$file_location"));
    }
}
