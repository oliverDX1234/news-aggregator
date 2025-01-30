<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\ArticleService;

class ArticleController extends Controller
{
    protected ArticleService $articleService;

    public function __construct(ArticleService $articleService)
    {
        $this->articleService = $articleService;
    }

    /**
     * List articles with filters.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $filters = [
            'keyword'    => $request->get('keyword'),
            'category_ids'   => $request->get('categories'),
            'source_ids'     => $request->get('sources'),
            'author_ids'     => $request->get('authors'),
            'start_date' => $request->get('start_date'),
            'end_date'   => $request->get('end_date'),
            'page'       => $request->get('page', 1) ?? 1,
            'per_page' => 9
        ];

        $articles = $this->articleService->listArticles($filters);

        return response()->json($articles);
    }
}
