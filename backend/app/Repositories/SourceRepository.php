<?php

namespace App\Repositories;

use App\Models\Source;
use App\Repositories\Contracts\SourceRepositoryInterface;

class SourceRepository implements SourceRepositoryInterface
{
    public function getAll()
    {
        return Source::all(['id', 'name']);
    }
}
