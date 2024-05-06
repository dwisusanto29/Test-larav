import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useCallback, useMemo, useState } from 'react';
import CreateTransactionForm from './Form/CreateTransactionForm';
import Toast from '@/Components/Toast';

export default function TransactionList({ auth, transactions, balance }) {
    const [showCreateTransactionModal, setShowCreateTransactionModal] = useState(false)
    const [showToast, setShowToast] = useState(false)
    const [filter, setFilter] = useState({
        type: "type",
        value: ""
    })
    const [search, setSearch] = useState("")

    const formatCurrency = useCallback((amount) => 
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR"
        }).format(amount),
        []
    )

    const formatDatetime = useCallback((timestamp) => 
        new Date( Date.parse(timestamp) ).toLocaleString(),
        []
    )

    const onApplyFilter = useCallback(() => {
        router.get(route(route().current()), {search, ...filter}, {
            preserveState: true,
            replace: true,
        });
    }, [search, filter])

    const onPreviousPage = useCallback(() => {
        router.get(route(route().current()), {search, ...filter, page: transactions.current_page-1}, {
            preserveState: true,
            replace: true,
        });
    }, [search, filter, transactions])

    const onNextPage = useCallback(() => {
        console.log({search, ...filter, page: transactions.current_page+1})
        router.get(route(route().current()), {search, ...filter, page: transactions.current_page+1}, {
            preserveState: true,
            replace: true,
        });
    }, [search, filter, transactions])

    const paginationText = useMemo(() => {
        const baseFirstPage = (transactions.current_page - 1) * transactions.per_page;

        if (transactions.current_page !== transactions.last_page) {
            return `Showing ${baseFirstPage + 1} to ${(transactions.current_page * transactions.per_page)} of ${transactions.total} Entries`
        }

        const totalRecordsModuloPerPage = transactions.total % transactions.per_page
        const remainingRecords = totalRecordsModuloPerPage ? totalRecordsModuloPerPage : transactions.per_page

        return `Showing ${baseFirstPage + 1} to ${baseFirstPage + remainingRecords} of ${transactions.total} Entries`
    }, [transactions])

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="md:flex md:items-center md:justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Transaction List</h2>
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Balance {formatCurrency(balance)}</h2>
                </div>
            }
        >
            <Head title="Transaction List" />

            <div className="container mx-auto px-4 sm:px-8">
                <CreateTransactionForm 
                    showCreateTransactionModal={showCreateTransactionModal}
                    setShowCreateTransactionModal={setShowCreateTransactionModal}
                    setShowToast={setShowToast}
                />
                <Toast showToast={showToast} setShowToast={setShowToast}/>
                <div className="py-8">
                    <div className="md:flex md:items-center md:justify-between">
                        <div className="inline-flex overflow-hidden">
                            <div className="my-2 flex sm:flex-row flex-col">
                                <div className="flex flex-row mb-1 sm:mb-0">
                                    <div className="relative">
                                        <select
                                            onChange={(e) => setFilter(prev => { return {...prev, type: e.target.value}})}
                                            className="appearance-none h-full rounded-l border block appearance-none w-full bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        >
                                            <option>Type</option>
                                        </select>
                                        <div
                                            className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <select
                                            onChange={(e) => setFilter(prev => { return {...prev, value: e.target.value}})}
                                            className="appearance-none h-full rounded-r border-t sm:rounded-r-none sm:border-r-0 border-r border-b block appearance-none w-full bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:border-l focus:border-r focus:bg-white focus:border-gray-500">
                                            <option>All</option>
                                            <option>TOP_UP</option>
                                            <option>TRANSACTION</option>
                                        </select>
                                        <div
                                            className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div className="block relative  mb-1 sm:mb-0">
                                    <span className="h-full absolute inset-y-0 left-0 flex items-center pl-2">
                                        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current text-gray-500">
                                            <path
                                                d="M10 4a6 6 0 100 12 6 6 0 000-12zm-8 6a8 8 0 1114.32 4.906l5.387 5.387a1 1 0 01-1.414 1.414l-5.387-5.387A8 8 0 012 10z">
                                            </path>
                                        </svg>
                                    </span>
                                    <input placeholder="Search"
                                        className="appearance-none rounded-r rounded-l sm:rounded-l-none border border-gray-400 border-b block pl-8 pr-6 py-2 w-full bg-white text-sm placeholder-gray-400 text-gray-700 focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none"
                                        onChange={(e) => setSearch(e.target.value)}
                                        />
                                </div>
                                <div className="block relative">
                                    <button
                                        onClick={onApplyFilter}
                                        className="text-sm bg-blue-300 hover:bg-blue-400 text-blue-800 font-semibold py-2 px-4 rounded">
                                        Apply filter
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="relative flex items-center mt-4 md:mt-0">
                            <button
                                onClick={() => setShowCreateTransactionModal(true)}
                                className="text-sm bg-blue-300 hover:bg-blue-400 text-blue-800 font-semibold py-2 px-4 rounded">
                                Add Transaction
                            </button>
                        </div>
                    </div>
                    <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                        <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
                            <table className="min-w-full leading-normal">
                                <thead>
                                    <tr>
                                        <th
                                            className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Transaction Id
                                        </th>
                                        <th
                                            className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Type
                                        </th>
                                        <th
                                            className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Amount
                                        </th>
                                        <th
                                            className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Description
                                        </th>
                                        <th
                                            className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Created at
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.data.map((transaction) => (
                                        <tr key={transaction.transaction_id}>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <div className="flex items-center">
                                                    <div className="ml-3">
                                                        <p className="text-gray-900 whitespace-no-wrap">
                                                            {transaction.transaction_id}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <p className="text-gray-900 whitespace-no-wrap">{transaction.type}</p>
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <p className="text-gray-900 whitespace-no-wrap">{formatCurrency(transaction.amount)}</p>
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                {!transaction.description || transaction.description.length < 60 ? transaction.description : transaction.description.substring(0, 56) + '...'} 
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <div className="flex">
                                                    <div className="flex-auto w-34">
                                                        {formatDatetime(transaction.created_at)}
                                                    </div>
                                                    {transaction.evidence_file && <div className="flex-auto">
                                                        <a href={`/transaction/${transaction.transaction_id}/download`}>
                                                            <svg
                                                                fill="currentColor"
                                                                viewBox="0 0 16 16"
                                                                height="1em"
                                                                width="1em"
                                                            >
                                                                <path d="M.5 9.9a.5.5 0 01.5.5v2.5a1 1 0 001 1h12a1 1 0 001-1v-2.5a.5.5 0 011 0v2.5a2 2 0 01-2 2H2a2 2 0 01-2-2v-2.5a.5.5 0 01.5-.5z" />
                                                                <path d="M7.646 11.854a.5.5 0 00.708 0l3-3a.5.5 0 00-.708-.708L8.5 10.293V1.5a.5.5 0 00-1 0v8.793L5.354 8.146a.5.5 0 10-.708.708l3 3z" />
                                                            </svg>
                                                        </a>
                                                    </div>} 
                                                    
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div
                                className="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between          ">
                                <span className="text-xs xs:text-sm text-gray-900">
                                    {paginationText}
                                </span>
                                <div className="inline-flex mt-2 xs:mt-0">
                                    <button
                                        disabled={transactions.current_page === 1}
                                        onClick={onPreviousPage}
                                        className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-l">
                                        Prev
                                    </button>
                                    <button
                                        disabled={transactions.current_page === transactions.last_page}
                                        onClick={onNextPage}
                                        className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-r">
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
