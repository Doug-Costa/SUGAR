<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Infrastructure\Persistence\UserModel;
use App\Infrastructure\Persistence\AuthorModel;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Create an Admin
        UserModel::create([
            'name' => 'Admin SUGAR',
            'email' => 'admin@sugar.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // 2. Create an Author entity
        $author = AuthorModel::create([
            'name' => 'João Silva',
            'cpf' => '123.456.789-00',
            'bank_info' => [
                'bank' => 'Inter',
                'agency' => '0001',
                'account' => '12345-6',
            ],
            'show_fee_detail' => true,
        ]);

        // 3. Create a User for the Author
        UserModel::create([
            'name' => 'João Silva',
            'email' => 'joao@author.com',
            'password' => Hash::make('password'),
            'role' => 'author',
            'author_id' => $author->id,
        ]);
    }
}
