<?php

namespace App\Enum;

class TransactionTypeEnum
{
    public const TOP_UP = 'TOP_UP';

    public const TRANSACTION = 'TRANSACTION';

    public static function getTransactionTypes(): array
    {
        return array_values((new \ReflectionClass(static::class))->getConstants());
    }
}
