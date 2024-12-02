'use client';

import { useEffect, useState } from 'react';
import { signOut, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../lib/firebase";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../lib/AuthContext";
import clsx from 'clsx';

export default function VerifyPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [userEmail, setUserEmail] = useState('');
    const [tempPassword, setTempPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Store the email and password before signing out
        if (user?.email) {
            setUserEmail(user.email);
            // We'll need this to sign back in if user chooses to continue without verification
            const searchParams = new URLSearchParams(window.location.search);
            const pass = searchParams.get('pass');
            if (pass) setTempPassword(decodeURIComponent(pass));
        }

        // Auto logout
        const performLogout = async () => {
            try {
                await signOut(auth);
            } catch (error) {
                console.error("Error signing out:", error);
            }
        };

        performLogout();
    }, [user]);

    const handleContinueWithoutVerification = async () => {
        setIsLoading(true);
        try {
            if (userEmail && tempPassword) {
                await signInWithEmailAndPassword(auth, userEmail, tempPassword);
                router.push('/protected/user/profile');
            }
        } catch (error) {
            console.error("Error signing in:", error);
            // If there's an error, redirect to sign in page
            router.push('/public/user/signin');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <div className={clsx(
                'w-full max-w-md p-8 rounded-xl',
                'bg-gray-800/50 backdrop-blur-xl',
                'border border-white/10',
                'shadow-2xl shadow-black/10'
            )}>
                <h1 className="text-2xl font-medium text-white/90 mb-8 text-center">
                    Weryfikacja Email
                </h1>
                
                <div className="space-y-6 text-white/70">
                    <p className="text-center">
                        Email nie został jeszcze zweryfikowany.
                    </p>
                    {userEmail && (
                        <p className="text-center">
                            Link weryfikacyjny został wysłany na adres:
                            <br />
                            <span className="font-medium text-white">{userEmail}</span>
                        </p>
                    )}
                    <p className="text-center">
                        Sprawdź swoją skrzynkę pocztową i kliknij w link weryfikacyjny.
                    </p>
                </div>

                <div className="mt-8 space-y-4">
                    <button
                        onClick={handleContinueWithoutVerification}
                        disabled={isLoading}
                        className={clsx(
                            'w-full py-2 px-4 rounded-lg',
                            'bg-white/10 hover:bg-white/15',
                            'text-white font-medium',
                            'transition-all duration-200',
                            'focus:outline-none focus:ring-2 focus:ring-white/25',
                            'disabled:opacity-50'
                        )}
                    >
                        {isLoading ? 'Proszę czekać...' : 'Kontynuuj bez weryfikacji'}
                    </button>
                    <button
                        onClick={() => router.push('/public/user/signin')}
                        disabled={isLoading}
                        className={clsx(
                            'w-full py-2 px-4 rounded-lg',
                            'bg-white/5 hover:bg-white/10',
                            'text-white/70 font-medium',
                            'transition-all duration-200',
                            'focus:outline-none focus:ring-2 focus:ring-white/25',
                            'disabled:opacity-50'
                        )}
                    >
                        Powrót do logowania
                    </button>
                    <p className="text-sm text-center text-white/50">
                        Zalecamy weryfikację emaila w celu zwiększenia bezpieczeństwa konta
                    </p>
                </div>
            </div>
        </div>
    );
}
