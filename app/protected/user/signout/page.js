'use client';

import { signOut } from "firebase/auth";
import { auth } from "../../../lib/firebase";
import { useRouter } from "next/navigation";
import clsx from 'clsx';

export default function LogoutPage() {
    const router = useRouter();
    
    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            await signOut(auth);
            router.push("/");
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };
    
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <form 
                onSubmit={handleLogout}
                className={clsx(
                    'w-full max-w-md p-8 rounded-xl',
                    'bg-gray-800/50 backdrop-blur-xl',
                    'border border-white/10',
                    'shadow-2xl shadow-black/10'
                )}
            >
                <h1 className="text-2xl font-medium text-white/90 mb-8 text-center">Wylogowanie</h1>
                <p className="text-white/70 mb-8 text-center">
                    Czy na pewno chcesz się wylogować?
                </p>
                <button
                    type="submit"
                    className={clsx(
                        'w-full py-2 px-4 rounded-lg',
                        'bg-white/10 hover:bg-white/15',
                        'text-white font-medium',
                        'transition-all duration-200',
                        'focus:outline-none focus:ring-2 focus:ring-white/25'
                    )}
                >
                    Wyloguj się
                </button>
            </form>
        </div>
    );
}
