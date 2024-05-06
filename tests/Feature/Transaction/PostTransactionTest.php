<?php

namespace Tests\Feature\Transaction;

use App\Enum\TransactionTypeEnum;
use App\Models\User;
use App\Service\FileService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\ValidationException;
use Mockery\MockInterface;
use Tests\TestCase;

class PostTransactionTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_should_get_error_validation_when_no_type_input(): void
    {
        $this->withoutExceptionHandling();
        $this->expectException(ValidationException::class);
        $this->expectExceptionMessage('The type field is required.');

        $this->actingAs($this->user)
            ->post('/transaction', ['amount' => 100000]);
    }

    public function test_should_get_error_validation_when_no_amount_input(): void
    {
        $this->withoutExceptionHandling();
        $this->expectException(ValidationException::class);
        $this->expectExceptionMessage('The amount field is required.');

        $this->actingAs($this->user)
            ->post('/transaction', ['type' => TransactionTypeEnum::TRANSACTION]);
    }

    public function test_should_get_error_validation_when_transaction_type_is_top_up_and_when_no_evidence_file_input(): void
    {
        $this->withoutExceptionHandling();
        $this->expectException(ValidationException::class);
        $this->expectExceptionMessage('The evidence file field is required.');

        $this->actingAs($this->user)
            ->post('/transaction', [
                'type' => TransactionTypeEnum::TOP_UP,
                'amount' => 100000,
            ]);
    }

    public function test_should_get_error_validation_when_transaction_type_is_top_up_and_when_evidence_file_input_is_not_file(): void
    {
        $this->withoutExceptionHandling();
        $this->expectException(ValidationException::class);
        $this->expectExceptionMessage('The evidence file field must be a file.');

        $this->actingAs($this->user)
            ->post('/transaction', [
                'type' => TransactionTypeEnum::TOP_UP,
                'amount' => 100000,
                'evidence_file' => 'evidence_file'
            ]);
    }

    public function test_should_have_correct_transaction_type_transaction_after_executing_correct_input(): void
    {
        Redirect::shouldReceive('route')->with('transaction.getList')->once();
        $inputtedData = [
            'type' => TransactionTypeEnum::TRANSACTION,
            'amount' => 100000,
        ];

        $this->actingAs($this->user)
            ->post('/transaction', $inputtedData);

        $this->assertDatabaseHas('transactions', $inputtedData);
    }

    public function test_should_have_correct_top_up_type_transaction_after_executing_correct_input(): void
    {
        Redirect::shouldReceive('route')->with('transaction.getList')->once();
        $mockedReturnString = 'mockedReturnString';
        $fakeUploadData = UploadedFile::fake()->create('filename.ext', 50);

        $this->mock(
            FileService::class,
            fn (MockInterface $mock) => 
                $mock->shouldReceive('storeFile')
                    ->with($fakeUploadData, "transactions/{$this->user->id}")
                    ->andReturn($mockedReturnString)
                    ->once()
        );

        $inputtedData = [
            'type' => TransactionTypeEnum::TOP_UP,
            'amount' => 100000,
            'evidence_file' => $fakeUploadData
        ];


        $this->actingAs($this->user)
            ->post('/transaction', $inputtedData);

        $this->assertDatabaseHas('transactions', array_merge($inputtedData, ['evidence_file' => $mockedReturnString]));
    }
}
