<?php

namespace Database\Seeders;

use App\Models\Transaction;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->count(20)->create()->each(function (User $user){
            Transaction::factory()->count(200)->create(['user_id' => $user->id]);
        });
    }
}
