<?php

namespace Tests\Feature\Transaction;

use App\Enum\TransactionTypeEnum;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class GetTransactionTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_should_return_zero_data_when_doesnt_have_transaction_data(): void
    {
        $this->actingAs($this->user)->get('/transaction')
            ->assertInertia(fn (Assert $page) => $page
                ->component('Transaction/List')
                ->has('transactions')
                ->has('transactions.data', 0)
                ->where('balance', 0)
            );
    }

    public function test_should_return_positive_balance_when_only_has_top_up_type_transaction_data(): void
    {
        $transaction = Transaction::factory()->create([
            'user_id' => $this->user->id,
            'type' => TransactionTypeEnum::TOP_UP,
        ]);

        $this->actingAs($this->user)->get('/transaction')
            ->assertInertia(fn (Assert $page) => $page
                ->component('Transaction/List')
                ->has('transactions')
                ->has('transactions.data', 1)
                ->where('balance', $transaction->amount)
            );
    }

    public function test_should_return_negative_balance_when_only_has_transaction_type_transaction_data(): void
    {
        $transaction = Transaction::factory()->create([
            'user_id' => $this->user->id,
            'type' => TransactionTypeEnum::TRANSACTION,
        ]);

        $this->actingAs($this->user)->get('/transaction')
            ->assertInertia(fn (Assert $page) => $page
                ->component('Transaction/List')
                ->has('transactions')
                ->has('transactions.data', 1)
                ->where('balance', -$transaction->amount)
            );
    }

    public function test_should_return_substraction_result_balance_when_has_all_types_transaction_data(): void
    {
        $topUpTypeTransaction = Transaction::factory()->create([
            'user_id' => $this->user->id,
            'type' => TransactionTypeEnum::TOP_UP,
        ]);

        $transactionTypeTransaction = Transaction::factory()->create([
            'user_id' => $this->user->id,
            'type' => TransactionTypeEnum::TRANSACTION,
        ]);

        $this->actingAs($this->user)->get('/transaction')
            ->assertInertia(fn (Assert $page) => $page
                ->component('Transaction/List')
                ->has('transactions')
                ->has('transactions.data', 2)
                ->where('balance', $topUpTypeTransaction->amount - $transactionTypeTransaction->amount)
            );
    }

    // public function test_profile_information_can_be_updated(): void
    // {
    //     $user = User::factory()->create();

    //     $response = $this
    //         ->actingAs($user)
    //         ->patch('/profile', [
    //             'name' => 'Test User',
    //             'email' => 'test@example.com',
    //         ]);

    //     $response
    //         ->assertSessionHasNoErrors()
    //         ->assertRedirect('/profile');

    //     $user->refresh();

    //     $this->assertSame('Test User', $user->name);
    //     $this->assertSame('test@example.com', $user->email);
    //     $this->assertNull($user->email_verified_at);
    // }

    // public function test_email_verification_status_is_unchanged_when_the_email_address_is_unchanged(): void
    // {
    //     $user = User::factory()->create();

    //     $response = $this
    //         ->actingAs($user)
    //         ->patch('/profile', [
    //             'name' => 'Test User',
    //             'email' => $user->email,
    //         ]);

    //     $response
    //         ->assertSessionHasNoErrors()
    //         ->assertRedirect('/profile');

    //     $this->assertNotNull($user->refresh()->email_verified_at);
    // }

    // public function test_user_can_delete_their_account(): void
    // {
    //     $user = User::factory()->create();

    //     $response = $this
    //         ->actingAs($user)
    //         ->delete('/profile', [
    //             'password' => 'password',
    //         ]);

    //     $response
    //         ->assertSessionHasNoErrors()
    //         ->assertRedirect('/');

    //     $this->assertGuest();
    //     $this->assertNull($user->fresh());
    // }

    // public function test_correct_password_must_be_provided_to_delete_account(): void
    // {
    //     $user = User::factory()->create();

    //     $response = $this
    //         ->actingAs($user)
    //         ->from('/profile')
    //         ->delete('/profile', [
    //             'password' => 'wrong-password',
    //         ]);

    //     $response
    //         ->assertSessionHasErrors('password')
    //         ->assertRedirect('/profile');

    //     $this->assertNotNull($user->fresh());
    // }
}
