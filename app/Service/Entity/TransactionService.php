<?php

namespace App\Service\Entity;

use App\Enum\TransactionTypeEnum;
use App\Models\Transaction;
use App\Service\FileService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Throwable;

class TransactionService
{
    private function getBalance(?array $groupedAmount): int {
        return match(true){
            !isset($groupedAmount[TransactionTypeEnum::TOP_UP]) && !isset($groupedAmount[TransactionTypeEnum::TRANSACTION]) => 0,
            !isset($groupedAmount[TransactionTypeEnum::TOP_UP]) => -$groupedAmount[TransactionTypeEnum::TRANSACTION],
            !isset($groupedAmount[TransactionTypeEnum::TRANSACTION]) => $groupedAmount[TransactionTypeEnum::TOP_UP],
            default => $groupedAmount[TransactionTypeEnum::TOP_UP] - $groupedAmount[TransactionTypeEnum::TRANSACTION]
        };
    }

    public function getList(Request $request): array
    {
        $search = $request->query('search');
        $type = $request->query('type');
        $value = $request->query('value', 'All');

        $groupedAmount = Transaction::where('user_id', Auth::user()->id)
            ->groupBy('type')
            ->selectRaw('sum(amount) as sum, type')
            ->pluck('sum','type')->toArray();


        $transactions = Transaction::query()
            ->where('user_id', Auth::user()->id)
            ->when($search, fn ($query) =>
                $query->where(fn ($query) =>
                    $query->where('transaction_id', 'LIKE', "%{$search}%")
                        ->orWhere('description', 'LIKE', "%{$search}%")
                ))
            ->when($value !== 'All', fn ($query) =>
                $query->where($type, $value))
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return [
            'transactions' => $transactions,
            'balance' => $this->getBalance($groupedAmount)
        ];
    }

    public function create(Request $request): void
    {
        $user_id = Auth::user()->id;
        $data = $request->validated();
        try {
            DB::beginTransaction();

            $defaultAdditionalData = ['user_id' => $user_id];

            if($data['type'] === TransactionTypeEnum::TOP_UP) {
                $defaultAdditionalData = array_merge(
                    $defaultAdditionalData, 
                    ['evidence_file' => app(FileService::class)->storeFile($request->file('evidence_file'), "transactions/$user_id")]
                );
            }

            Transaction::create(array_merge($data, $defaultAdditionalData));
            DB::commit();
        } catch (Throwable $e) {
            DB::rollBack();
        }
    }
}
