<?php

namespace Database\Factories;

use App\Enum\TransactionTypeEnum;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Transaction>
 */
class TransactionFactory extends Factory
{
    public function definition(): array
    {
        return [
            'transaction_id' => Str::random(30),
            'type' => TransactionTypeEnum::getTransactionTypes()[rand(0,1)],
            'amount' => rand(500000, 50000000),
            'description' => fake()->sentence(),
        ];
    }
}
