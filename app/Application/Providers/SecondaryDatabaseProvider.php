<?php

namespace App\Application\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SecondaryDatabaseProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        try {
            // Test connection to WooCommerce database
            DB::connection('woocommerce')->getPdo();
        } catch (\Exception $e) {
            Log::warning('Could not connect to WooCommerce database. Check credentials in .env.', [
                'error' => $e->getMessage()
            ]);
        }
    }
}
