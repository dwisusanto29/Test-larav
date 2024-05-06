<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Transaction extends Model
{
    use HasFactory;

    public $incrementing = false;

    protected $primaryKey = 'transaction_id';

    protected $fillable = ['transaction_id', 'type', 'amount', 'description', 'evidence_file', 'user_id'];

    public static function boot()
    {
        parent::boot();

        self::creating(function ($transaction) {
            $transaction->transaction_id = Str::random(30);
        });
    }
}
