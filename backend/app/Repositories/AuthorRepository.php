<?php

namespace App\Repositories;

use App\Models\Author;
use App\Repositories\Contracts\AuthorRepositoryInterface;

class AuthorRepository implements AuthorRepositoryInterface
{
    public function getAll()
    {
        return Author::all(['id', 'name']);
    }
}
