<?php

use Illuminate\Support\Facades\Schedule;
use App\Console\Commands\ScrapeArticles;

Schedule::command(ScrapeArticles::class)->everyFiveMinutes();

