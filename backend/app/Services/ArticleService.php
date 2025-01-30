<?php

namespace App\Services;

use App\Repositories\Contracts\ArticleRepositoryInterface;
use App\Models\Category;
use App\Models\Source;

class ArticleService
{
    protected ArticleRepositoryInterface $articleRepository;

    public function __construct(ArticleRepositoryInterface $articleRepository)
    {
        $this->articleRepository = $articleRepository;
    }

    /**
     * Get filtered and paginated articles.
     *
     * @param array $filters
     * @param int $perPage
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function listArticles(array $filters = [])
    {

        return $this->articleRepository->getArticles($filters);
    }
}
