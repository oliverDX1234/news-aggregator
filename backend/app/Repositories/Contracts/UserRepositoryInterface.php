<?php

namespace App\Repositories\Contracts;

use App\Models\User;

interface UserRepositoryInterface
{
    public function getUserWithPreferences(User $user);

    public function updateUserProfile(User $user, array $data);
}
