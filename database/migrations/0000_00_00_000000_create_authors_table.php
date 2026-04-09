<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('authors', function (Blueprint $group) {
            $group->uuid('id')->primary();
            $group->string('name');
            $group->string('cpf')->unique();
            $group->json('bank_info')->nullable();
            $group->boolean('show_fee_detail')->default(false);
            $group->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('authors');
    }
};
