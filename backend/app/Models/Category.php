<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = ['name'];

    public function articles()
    {
        return $this->hasMany(Article::class);
    }

    public function sources()
    {
        return $this->belongsToMany(Source::class);
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'user_author');
    }
}
