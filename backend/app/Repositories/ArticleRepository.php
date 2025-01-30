<?php

namespace App\Repositories;

use App\Models\Article;
use Illuminate\Database\Eloquent\Builder;
use App\Repositories\Contracts\ArticleRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ArticleRepository implements ArticleRepositoryInterface
{
    /**
     * Get all articles with optional filters.
     *
     * @param array $filters
     * @return Builder
     */
    public function getArticles(array $filters = []): LengthAwarePaginator
    {
        $query = Article::with('source');

        if (!empty($filters['keyword'])) {
            $query->where('title', 'LIKE', '%' . $filters['keyword'] . '%')
                ->orWhere('content', 'LIKE', '%' . $filters['keyword'] . '%');
        }

        if (!empty($filters['category_ids'])) {
            $query->where('category_id', $filters['category_ids']);
        }

        if (!empty($filters['source_ids'])) {
            $query->where('source_id', $filters['source_ids']);
        }

        if (!empty($filters['author_ids'])) {
            $query->where('author_id', $filters['author_ids']);
        }

        if (!empty($filters['start_date']) && !empty($filters['end_date'])) {
            $query->whereBetween('published_at', [$filters['start_date'], $filters['end_date']]);
        }

        return $query->paginate($filters['per_page']);
    }
}
