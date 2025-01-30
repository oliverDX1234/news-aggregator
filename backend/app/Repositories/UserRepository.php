<?php

namespace App\Repositories;

use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;

class UserRepository implements UserRepositoryInterface
{
    public function getUserWithPreferences(User $user)
    {
        $user->load(['categories:id', 'sources:id', 'authors:id']);

        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'personalized_news' => $user->personalized_news,
            'categories' => $user->categories->pluck('id')->map(fn($id) => (string) $id),
            'sources' => $user->sources->pluck('id')->map(fn($id) => (string) $id),
            'authors' => $user->authors->pluck('id')->map(fn($id) => (string) $id),
        ];
    }


    public function updateUserProfile(User $user, array $data)
    {
        $user->update([
            'name' => $data['full_name'],
            'personalized_news' => $data['personalized_news'],
        ]);

        if (isset($data['categories'])) {
            $user->categories()->sync($data['categories']);
        }

        if (isset($data['sources'])) {
            $user->sources()->sync($data['sources']);
        }

        if (isset($data['authors'])) {
            $user->authors()->sync($data['authors']);
        }

        return $user;
    }
}
