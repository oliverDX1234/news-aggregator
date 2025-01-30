<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'Automobiles', 'value' => 'automobiles'],
            ['name' => 'Food', 'value' => 'food'],
            ['name' => 'Fashion', 'value' => 'fashion'],
            ['name' => 'Science', 'value' => 'science'],
            ['name' => 'World', 'value' => 'world'],
            ['name' => 'Travel', 'value' => 'travel'],
            ['name' => 'Politics', 'value' => 'politics'],
            ['name' => 'Sport', 'value' => 'sport'],
            ['name' => 'Technology', 'value' => 'technology'],
            ['name' => 'Wellness', 'value' => 'wellness'],
        ];

        foreach ($categories as $category) {
            Category::create([
                'name' => $category['name'],
                'value' => $category['value']
            ]);
        }
    }
}
