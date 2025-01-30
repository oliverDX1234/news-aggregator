<?php

namespace App\Http\Controllers;

use App\Services\AuthorService;
use App\Services\CategoryService;
use App\Services\SourceService;
use Illuminate\Http\JsonResponse;

class FilterController extends Controller
{
    private CategoryService $categoryService;
    private SourceService $sourceService;
    private AuthorService $authorService;

    public function __construct(CategoryService $categoryService, SourceService $sourceService, AuthorService $authorService)
    {
        $this->categoryService = $categoryService;
        $this->sourceService = $sourceService;
        $this->authorService = $authorService;
    }

    /**
     * Fetch all categories.
     */
    public function getCategories(): JsonResponse
    {
        $categories = $this->categoryService->getAll();
        return response()->json($categories);
    }

    /**
     * Fetch all sources.
     */
    public function getSources(): JsonResponse
    {
        $sources = $this->sourceService->getAll();
        return response()->json($sources);
    }

    /**
     * Fetch all sources.
     */
    public function getAuthors(): JsonResponse
    {
        $sources = $this->authorService->getAll();
        return response()->json($sources);
    }
}
