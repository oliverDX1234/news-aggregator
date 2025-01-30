<?php

namespace App\Services;

use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Support\Facades\Validator;

class UserService
{
    protected $UserRepository;

    public function __construct(UserRepositoryInterface $UserRepository)
    {
        $this->UserRepository = $UserRepository;
    }

    /**
     * Retrieve the user profile with preferences.
     *
     * @param \App\Models\User $user
     * @return array
     */
    public function getUserProfile($user)
    {
        return $this->UserRepository->getUserWithPreferences($user);
    }

    /**
     * Update the user profile with the provided data.
     *
     * @param \App\Models\User $user
     * @param array $data
     * @return array
     */
    public function updateUserProfile($user, $data)
    {
        $validator = Validator::make($data, [
            'full_name' => 'required|string|max:255',
            'personalized_news' => 'required|boolean',
            'categories' => 'array',
            'categories.*' => 'exists:categories,id',
            'sources' => 'array',
            'sources.*' => 'exists:sources,id',
            'authors' => 'array',
            'authors.*' => 'exists:authors,id',
        ]);

        if ($validator->fails()) {
            return ['errors' => $validator->errors()];
        }

        return $this->UserRepository->updateUserProfile($user, $data);
    }
}
