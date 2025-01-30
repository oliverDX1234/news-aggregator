<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Source extends Model
{
    public function categories()
    {
        return $this->belongsToMany(Category::class);
    }

    public function articles()
    {
        return $this->hasMany(Article::class);
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'user_author');
    }
}
