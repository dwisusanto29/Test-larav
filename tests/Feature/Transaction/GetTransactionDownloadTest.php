<?php

namespace Tests\Feature\Transaction;

use App\Enum\TransactionTypeEnum;
use App\Models\Transaction;
use App\Models\User;
use App\Service\FileService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Mockery\MockInterface;
use Tests\TestCase;

class GetTransactionDownloadTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_should_not_able_to_download_other_user_file(): void
    {
        $this->withoutExceptionHandling();
        $this->expectException(ModelNotFoundException::class);
        $this->expectExceptionMessage('');
        
        $user = User::factory()->create();
        $transaction = Transaction::factory()->create([
            'user_id' => $this->user->id,
            'type' => TransactionTypeEnum::TRANSACTION,
        ]);

        $this->actingAs($user)
            ->get("/transaction/{$transaction->transaction_id}/download");
    }

    public function test_should_successfully_download_file(): void
    {
        $mockedEvidenceFile = 'mockedEvidenceFile';
        $transaction = Transaction::factory()->create([
            'user_id' => $this->user->id,
            'type' => TransactionTypeEnum::TRANSACTION,
            'evidence_file' => $mockedEvidenceFile
        ]);

        $this->mock(
            FileService::class,
            fn (MockInterface $mock) => 
                $mock->shouldReceive('downloadFile')
                    ->with($mockedEvidenceFile)
                    ->once()
        );

        $this->actingAs($this->user)
            ->get("/transaction/{$transaction->transaction_id}/download");
    }
}
