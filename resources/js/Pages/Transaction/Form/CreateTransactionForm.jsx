import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';

export default function CreateTransactionForm({ showCreateTransactionModal, setShowCreateTransactionModal, setShowToast }) {
    
    const { data, setData, errors, post, reset, progress, processing, recentlySuccessful } = useForm({
        type: 'TOP_UP',
        amount: '',
        description: '',
        evidence_file: undefined,
    });

    const onClose = () => setShowCreateTransactionModal(false)

    const onSubmit = (e) => {
        e.preventDefault();
        
        post(route('transaction.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset()
                setShowToast(true)
                onClose()
            },
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                }

                if (errors.current_password) {
                    reset('current_password');
                }
            },
        });
    };

    return (
        <Modal show={showCreateTransactionModal} onClose={onClose}>
            <form onSubmit={onSubmit} className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-2 text-center">
                    Add Transaction
                </h2>

                <p className='mb-5 text-center'>Add your new transaction</p>

                <div className="mb-5">
                    <InputLabel htmlFor="type" value="Transaction Type" className="mb-3 block text-base font-medium text-[#07074D]" />
                        <select
                            onChange={(e) => setData('type', e.target.value)}
                            className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                            defaultValue="TOP_UP"
                        >
                            <option value="TOP_UP">Top up</option>
                            <option value="TRANSACTION">Transaction</option>
                        </select>
                    <InputError message={errors.type} className="mt-2" />
                </div>
                
                <div className="mb-5">
                    <InputLabel htmlFor="amount" value="Amount" className="mb-3 block text-base font-medium text-[#07074D]" />

                    <TextInput
                        id="amount"
                        value={data.amount}
                        type="number"
                        onChange={(e) => setData('amount', e.target.value)}
                        className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                        autoComplete="amount"
                    />

                    <InputError message={errors.amount} className="mt-2" />
                </div>
                <div className="mb-5">
                    <InputLabel htmlFor="description" value="Description" className="mb-3 block text-base font-medium text-[#07074D]" />

                    <TextInput
                        id="description"
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                        autoComplete="description"
                    />

                    <InputError message={errors.description} className="mt-2" />
                </div>

                <div className="mb-6 pt-4">
                    <InputLabel htmlFor="description" value="Upload File" className="mb-3 block text-base font-medium text-[#07074D]" />

                        {/* <div className="mb-8">
                        <input type="file" name="evidence_file" id="evidence_file" className="sr-only" onChange={e => setData('evidence_file', e.target.files[0])} />
                            <label
                                htmlFor="evidence_file"
                                className="relative flex min-h-[200px] items-center justify-center rounded-md border border-dashed border-[#e0e0e0] p-12 text-center"
                            >
                                <div>
                                <span className="mb-2 block text-xl font-semibold text-[#07074D]">
                                    Drop files here
                                </span>
                                <span className="mb-2 block text-base font-medium text-[#6B7280]">
                                    Or
                                </span>
                                <span
                                    className="inline-flex rounded border border-[#e0e0e0] py-2 px-7 text-base font-medium text-[#07074D]"
                                >
                                    Browse
                                </span>
                                </div>
                            </label>
                        </div> */}
                        <input type="file" onChange={e => setData('evidence_file', e.target.files[0])} />
                        {progress && (
                        <progress value={progress.percentage} max="100">
                            {progress.percentage}%
                        </progress>
                        )}
                    </div>
                    <InputError message={errors.evidence_file} className="mt-2" />

                <div className="mt-6 flex justify-center">
                    <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>

                    <PrimaryButton className="ms-3" disabled={processing}>
                        Create
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
