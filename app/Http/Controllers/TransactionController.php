<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\Transaction\TransactionStoreRequest;
use App\Models\Transaction;
use App\Service\Entity\TransactionService;
use App\Service\FileService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class TransactionController extends Controller
{
    public function __construct(private readonly TransactionService $transactionService)
    {
    }

    public function getList(Request $request): Response
    {
        return Inertia::render('Transaction/List', $this->transactionService->getList($request));
    }

    public function store(TransactionStoreRequest $request): RedirectResponse
    {
        $this->transactionService->create($request);

        return Redirect::route('transaction.getList');
    }

    public function download(Transaction $transaction): BinaryFileResponse
    {
        if ($transaction->user_id !== Auth::user()->id){
            throw new ModelNotFoundException();
        }

        return app(FileService::class)->downloadFile($transaction->evidence_file);
    }
}
