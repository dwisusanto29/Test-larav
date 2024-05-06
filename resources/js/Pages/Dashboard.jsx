import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="flex flex-col justify-center items-center h-[50vh]">
                <div className="relative flex flex-col items-center rounded-[20px] w-[700px] max-w-[95%] mx-auto bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:!shadow-none p-3">
                    <div className="mt-2 mb-8 w-full">
                        <h4 className="px-2 text-xl font-bold text-navy-700 dark:text-white">
                        Welcome, {auth.user.name}
                        </h4>
                        <p className="mt-2 px-2 text-base text-gray-600">
                        This is our main portal for our service. Please click the button to manage your transaction.
                        </p>
                    </div> 
                    <button className="group relative h-12 w-48 overflow-hidden rounded-lg bg-white text-lg shadow">
                        <div className="absolute inset-0 w-3 bg-amber-400 transition-all duration-[250ms] ease-out group-hover:w-full"></div>
                        <Link href="/transaction">
                            <span className="relative text-black group-hover:text-white">Let's go!</span>
                        </Link>
                    </button>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
