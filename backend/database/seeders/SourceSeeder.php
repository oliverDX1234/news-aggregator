<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Source;
use App\Models\Category;

class SourceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {

        $newsAPI = Source::firstOrCreate(['name' => 'NewsAPI', 'base_url' => 'https://newsapi.org/v2', 'api_key' => env('NEWSAPI_KEY')]);
        $guardian = Source::firstOrCreate(['name' => 'The Guardian', 'base_url' => 'https://content.guardianapis.com', 'api_key' => env('GUARDIAN_API_KEY')]);
        $nytimes = Source::firstOrCreate(['name' => 'NY Times', 'base_url' => 'https://api.nytimes.com/svc', 'api_key' => env('NYTIMES_API_KEY')]);

        $newsAPI->categories()->attach(Category::all()->pluck('id')->toArray());

        $guardian->categories()->attach([
            Category::where('value', 'food')->first()->id,
            Category::where('value', 'fashion')->first()->id,
            Category::where('value', 'science')->first()->id,
            Category::where('value', 'world')->first()->id,
            Category::where('value', 'travel')->first()->id,
            Category::where('value', 'politics')->first()->id,
            Category::where('value', 'sport')->first()->id,
            Category::where('value', 'technology')->first()->id,
            Category::where('value', 'wellness')->first()->id,
        ]);

        $nytimes->categories()->attach([
            Category::where('value', 'automobiles')->first()->id,
            Category::where('value', 'food')->first()->id,
            Category::where('value', 'fashion')->first()->id,
            Category::where('value', 'science')->first()->id,
            Category::where('value', 'world')->first()->id,
            Category::where('value', 'travel')->first()->id,
            Category::where('value', 'politics')->first()->id,
            Category::where('value', 'technology')->first()->id,
        ]);
    }
}
