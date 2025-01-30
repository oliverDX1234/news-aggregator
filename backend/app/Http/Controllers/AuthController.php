<?php

namespace App\Http\Controllers;

use App\Services\AuthService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    protected AuthService $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    /**
     * Register a new user.
     *
     * @param Request $request The HTTP request containing user registration data.
     * @return \Illuminate\Http\JsonResponse The JSON response containing the newly registered user and access token.
     *
     * @throws \Illuminate\Validation\ValidationException If validation fails.
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $response = $this->authService->registerUser($request->all());

        return response()->json($response, 201);
    }

    /**
     * Authenticate and log in a user.
     *
     * @param Request $request The HTTP request containing login credentials.
     * @return \Illuminate\Http\JsonResponse The JSON response containing the access token and user information.
     *
     * @throws ValidationException If authentication fails.
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        try {
            $response = $this->authService->loginUser($credentials);
            return response()->json($response, 200);
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        }
    }

    /**
     * Log out the authenticated user.
     *
     * @return \Illuminate\Http\JsonResponse The JSON response confirming the logout process.
     */
    public function logout()
    {
        $this->authService->logoutUser();
        return response()->json(['message' => 'Logged out successfully.'], 200);
    }
}
