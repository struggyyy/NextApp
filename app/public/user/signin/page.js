'use client'

import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence, getAuth, sendEmailVerification } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Field, Label, Input } from '@headlessui/react';
import clsx from 'clsx';

export default function SignInPage() {
  const auth = getAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const handleContinueWithoutVerification = async () => {
    router.push('/protected/user/profile');
  };

  const handleResendVerification = async () => {
    setIsLoading(true);
    try {
      await sendEmailVerification(currentUser);
      setError("success:Link weryfikacyjny został wysłany ponownie.");
    } catch (error) {
      console.error("Error sending verification:", error);
      setError("Wystąpił błąd podczas wysyłania weryfikacji. Spróbuj ponownie później.");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await setPersistence(auth, browserLocalPersistence);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // If email is not verified, show verification screen
      if (!userCredential.user.emailVerified) {
        setCurrentUser(userCredential.user);
        setShowVerification(true);
        return;
      }

      router.push('/protected/user/profile');
    } catch (error) {
      console.error(error.code, error.message);
      switch (error.code) {
        case 'auth/invalid-email':
          setError('Nieprawidłowy adres email.');
          break;
        case 'auth/user-not-found':
          setError('Nie znaleziono użytkownika z tym adresem email.');
          break;
        case 'auth/wrong-password':
          setError('Nieprawidłowe hasło.');
          break;
        default:
          setError('Wystąpił błąd podczas logowania. Spróbuj ponownie.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (showVerification) {
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
            <p className="text-center">
              Link weryfikacyjny został wysłany na adres:
              <br />
              <span className="font-medium text-white">{email}</span>
            </p>
            <p className="text-center">
              Sprawdź swoją skrzynkę pocztową i kliknij w link weryfikacyjny.
            </p>
          </div>

          {error && (
            <div className={clsx(
              'mt-6 p-4 rounded-lg',
              error.startsWith('success:') 
                ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                : 'bg-red-500/10 border border-red-500/20 text-red-400'
            )}>
              <p>{error.replace('success:', '')}</p>
            </div>
          )}

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
              Kontynuuj bez weryfikacji
            </button>
            <button
              onClick={handleResendVerification}
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
              {isLoading ? "Wysyłanie..." : "Wyślij ponownie link weryfikacyjny"}
            </button>
            <p className="text-sm text-center text-white/50">
              Zalecamy weryfikację emaila w celu zwiększenia bezpieczeństwa konta
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <form
        onSubmit={onSubmit}
        className={clsx(
          'w-full max-w-md p-8 rounded-xl',
          'bg-gray-800/50 backdrop-blur-xl',
          'border border-white/10',
          'shadow-2xl shadow-black/10'
        )}
      >
        <h1 className="text-2xl font-medium text-white/90 mb-8 text-center">Logowanie</h1>
        
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-6">
          <Field>
            <Label className="text-sm/6 font-medium text-white/70">Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={clsx(
                'mt-2 block w-full rounded-lg border-none',
                'bg-white/5 py-2 px-3 text-white',
                'focus:outline-none focus:ring-2 focus:ring-white/25',
                'placeholder:text-white/30'
              )}
              required
            />
          </Field>

          <Field>
            <Label className="text-sm/6 font-medium text-white/70">Hasło</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={clsx(
                'mt-2 block w-full rounded-lg border-none',
                'bg-white/5 py-2 px-3 text-white',
                'focus:outline-none focus:ring-2 focus:ring-white/25',
                'placeholder:text-white/30'
              )}
              required
            />
          </Field>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={clsx(
            'mt-8 w-full py-2 px-4 rounded-lg',
            'bg-white/10 hover:bg-white/15',
            'text-white font-medium',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-white/25',
            'disabled:opacity-50'
          )}
        >
          {isLoading ? 'Logowanie...' : 'Zaloguj się'}
        </button>
      </form>
    </div>
  );
}
