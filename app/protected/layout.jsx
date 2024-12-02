'use client';

import { useAuth } from "../lib/AuthContext";
import { useLayoutEffect } from "react";
import { redirect } from 'next/navigation';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

export default function Protected({ children }) {
    const { user, loading } = useAuth();
    const returnUrl = usePathname();

    useLayoutEffect(() => {
        if (!loading && !user) {
            redirect(`/public/user/signin`);
        }
    }, [user, loading, returnUrl]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900">
                <div className="text-center">
                    <div className={clsx(
                        'w-12 h-12 rounded-full',
                        'border-t-2 border-r-2 border-white/20',
                        'border-l-2 border-b-2 border-white/5',
                        'animate-spin'
                    )}></div>
                    <p className="mt-4 text-white/50">Ładowanie...</p>
                </div>
            </div>
        );
    }

    return children;
}
