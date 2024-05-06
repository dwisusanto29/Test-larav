import { useEffect } from "react";

export default function Toast({ showToast, setShowToast }) {
    const onClose = () => setShowToast(false)

    useEffect(() => {
        if(showToast) {
            setTimeout(() => {
                onClose();
            }, 5000);
        }
    }, [showToast])

    return (
        <button hidden={!showToast} type="button" onClick={onClose} className="fixed top-12 right-24 z-50 rounded-md bg-green-500 px-4 py-2 text-white transition hover:bg-green-600">
            <div className="flex items-center space-x-2">
                <span className="text-3xl"><i className="bx bx-check"></i></span>
                <p className="font-bold">Item Created Successfully!</p>
            </div>
        </button>
    );
}
