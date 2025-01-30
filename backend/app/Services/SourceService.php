<?php

namespace App\Services;

use App\Repositories\Contracts\SourceRepositoryInterface;

class SourceService
{
    private SourceRepositoryInterface $sourceRepository;

    public function __construct(SourceRepositoryInterface $sourceRepository)
    {
        $this->sourceRepository = $sourceRepository;
    }

    /**
     * Retrieve all sources from the repository.
     *
     * @return \Illuminate\Database\Eloquent\Collection|static[]
     */
    public function getAll()
    {
        return $this->sourceRepository->getAll();
    }
}
