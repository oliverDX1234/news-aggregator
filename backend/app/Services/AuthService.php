<?php

namespace App\Services;

use App\Repositories\Contracts\AuthRepositoryInterface;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;


class AuthService
{
    protected AuthRepositoryInterface $authRepository;

    public function __construct(AuthRepositoryInterface $authRepository)
    {
        $this->authRepository = $authRepository;
    }

    /**
     * Registers a new user and generates an authentication token.
     *
     * @param array $data The user registration data.
     * @return array The response containing the access token and user information.
     */
    public function registerUser(array $data): array
    {
        $user = $this->authRepository->createUser($data);
        $token = $user->createToken('auth_token')->plainTextToken;

        return [
            'message' => 'User registered successfully.',
            'access_token' => $token,
            'user' => $user,
        ];
    }

    /**
     * Authenticates a user and generates an authentication token.
     *
     * @param array $credentials The login credentials (email and password).
     * @return array The response containing the access token, user information, and token type.
     *
     * @throws ValidationException If authentication fails.
     */
    public function loginUser(array $credentials): array
    {
        if (!Auth::attempt($credentials)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $user = Auth::user();

        /** @var \App\Models\User $user **/
        $token = $user->createToken('auth_token')->plainTextToken;

        return [
            'message' => 'Login successful',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
        ];
    }

    /**
     * Logs out the authenticated user by revoking the current session and access token.
     *
     * @return void
     */
    public function logoutUser(): void
    {
        Auth::guard('web')->logout();
        request()->session()->invalidate();
        request()->session()->regenerateToken();
        request()->user()->currentAccessToken()->delete();
    }
}
