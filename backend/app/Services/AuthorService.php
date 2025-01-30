<?php

namespace App\Services;

use App\Repositories\Contracts\AuthorRepositoryInterface;

class AuthorService
{
    private AuthorRepositoryInterface $authorRepository;

    public function __construct(AuthorRepositoryInterface $authorRepository)
    {
        $this->authorRepository = $authorRepository;
    }

    /**
     * Retrieve all authors from the repository.
     *
     * @return \Illuminate\Database\Eloquent\Collection|static[]
     */
    public function getAll()
    {
        return $this->authorRepository->getAll();
    }
}
