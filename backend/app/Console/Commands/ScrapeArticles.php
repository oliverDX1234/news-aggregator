<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use App\Models\Source;
use App\Models\Category;
use App\Models\Article;
use App\Models\Author;

class ScrapeArticles extends Command
{
    protected $signature = 'scrape:articles';
    protected $description = 'Scrape articles from all sources and categories';

    public function handle()
    {
        $sources = Source::with('categories')->get();

        foreach ($sources as $source) {
            foreach ($source->categories as $category) {
                $this->info("Scraping {$category->name} articles from {$source->name}...");

                $articles = [];

                switch ($source->name) {
                    case 'NewsAPI':
                        $articles = $this->fetchFromNewsAPI($source, $category);
                        break;

                    case 'The Guardian':
                        $articles = $this->fetchFromGuardian($source, $category);
                        break;

                    case 'NY Times':
                        $articles = $this->fetchFromNYTimes($source, $category);
                        break;
                }

                if (!empty($articles)) {
                    $this->saveArticles($articles, $source->id, $category->id);
                } else {
                    $this->error("No articles found for {$category->name} from {$source->name}.");
                }
            }
        }

        logger()->info("Scraping completed successfully!");

        $this->info('Scraping completed successfully!');
    }

    private function fetchFromNewsAPI($source, $category)
    {
        $response = Http::get("{$source->base_url}/everything", [
            'q' => $category->value,
            'apiKey' => $source->api_key,
        ]);

        return $response->successful() ? $response->json('articles') : [];
    }

    private function fetchFromGuardian($source, $category)
    {
        $response = Http::get("{$source->base_url}/search", [
            'section' => $category->value,
            'api-key' => $source->api_key,
        ]);

        return $response->successful() ? $response->json('response.results') : [];
    }

    private function fetchFromNYTimes($source, $category)
    {
        $response = Http::get("{$source->base_url}/topstories/v2/{$category->value}.json", [
            'api-key' => $source->api_key,
        ]);

        return $response->successful() ? $response->json('results') : [];
    }

    private function saveArticles($articles, $sourceId, $categoryId)
    {
        foreach ($articles as $article) {
            $uniqueUrl = $article['url'] ?? $article['webUrl'] ?? $article['uri'] ?? null;

            // Skip if no unique URL is found
            if (!$uniqueUrl) {
                $this->error("Article skipped due to missing URL in source ID {$sourceId}.");
                continue;
            }

            $image = $article['urlToImage'] ?? $this->extractImageUrl($article) ?? null;

            $authorName = $article['author'] ?? $article['byline'] ?? $article['byline']['original'] ?? null;
            $author = null;

            if ($authorName) {
                $author = Author::firstOrCreate(['name' => preg_replace('/^By\s+/i', '', $authorName)]);
            }

            Article::updateOrCreate(
                ['url' => $uniqueUrl],
                [
                    'title' => $article['title'] ?? $article['webTitle'] ?? $article['headline']['main'] ?? '',
                    'content' => $article['content'] ?? $article['bodyText'] ?? $article['abstract'] ?? null,
                    'source_id' => $sourceId,
                    'category_id' => $categoryId,
                    'author_id' => $author?->id,
                    'published_at' => $this->formatDatetime($article['publishedAt'] ?? $article['webPublicationDate'] ?? $article['published_date'] ?? $article['created_date'] ?? null),
                ]
            );
        }
    }

    private function formatDatetime($datetime)
    {
        if (!$datetime) {
            return null;
        }

        try {
            return \Carbon\Carbon::parse($datetime)->format('Y-m-d H:i:s');
        } catch (\Exception $e) {
            return null;
        }
    }

    private function extractImageUrl($article)
    {
        if (isset($article['multimedia']) && is_array($article['multimedia'])) {
            foreach ($article['multimedia'] as $media) {
                if (isset($media['url']) && $media['format'] === 'Super Jumbo') {
                    return $media['url'];
                }
            }
        }

        return null;
    }
}
