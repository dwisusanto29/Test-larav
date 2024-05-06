<?php

namespace App\Http\Requests\Transaction;

use App\Enum\TransactionTypeEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TransactionStoreRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        return [
            'type' => ['required', 'string', Rule::in(TransactionTypeEnum::getTransactionTypes())],
            'amount' => ['required', 'integer', 'min:0'],
            'description' => ['nullable', 'string', 'max:255'],
            'evidence_file' => [Rule::requiredIf(fn () => $this->isTopUp()), 'file']
        ];
    }

    private function isTopUp(): bool
    {
        return $this->type === TransactionTypeEnum::TOP_UP;
    }
}
