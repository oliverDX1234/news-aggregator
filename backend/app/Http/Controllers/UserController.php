<?php

namespace App\Http\Controllers;

use App\Services\UserService;
use Illuminate\Http\Request;

class UserController extends Controller
{
    protected $UserService;

    public function __construct(UserService $UserService)
    {
        $this->UserService = $UserService;
    }

    /**
     * Display the user profile with preferences.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $profile = $this->UserService->getUserProfile($request->user());

        return response()->json($profile);
    }

    /**
     * Update the user profile with the provided data.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request)
    {
        $result = $this->UserService->updateUserProfile($request->user(), $request->all());

        if (isset($result['errors'])) {
            return response()->json($result, 422);
        }

        return response()->json(['message' => 'Profile updated successfully.', 'user' => $result]);
    }
}
