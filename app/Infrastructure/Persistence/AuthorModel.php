<?php

namespace App\Infrastructure\Persistence;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AuthorModel extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'authors';

    protected $fillable = [
        'name',
        'cpf',
        'bank_info',
        'show_fee_detail',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'bank_info' => 'array',
            'show_fee_detail' => 'boolean',
        ];
    }

    /**
     * Get the users associated with the author.
     */
    public function users(): HasMany
    {
        return $this->hasMany(UserModel::class, 'author_id');
    }
}
