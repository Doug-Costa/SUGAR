<?php

use App\Providers\AppServiceProvider;

return [
    AppServiceProvider::class,
    App\Application\Providers\SecondaryDatabaseProvider::class,
];
