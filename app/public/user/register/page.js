'use client';

import { createUserWithEmailAndPassword, setPersistence, browserLocalPersistence } from "firebase/auth";
import { db } from "../../../lib/firebase"; // Import Firestore
import { collection, setDoc, doc } from 'firebase/firestore'; // Import Firestore functions
import { auth, sendVerificationEmail } from "../../../lib/firebase";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Field, Label, Input } from '@headlessui/react';
import clsx from 'clsx';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const handleResendVerification = async () => {
    setIsLoading(true);
    try {
      if (currentUser) {
        await sendVerificationEmail(currentUser);
        setError("success:Link weryfikacyjny został wysłany ponownie.");
      }
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

    if (password !== confirmPassword) {
      setError('Hasła nie są identyczne');
      setIsLoading(false);
      return;
    }

    try {
      await setPersistence(auth, browserLocalPersistence);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Send verification email with custom settings
      await sendVerificationEmail(userCredential.user);
      
      // Store user and show verification screen
      setCurrentUser(userCredential.user);
      setShowVerification(true);
    } catch (error) {
      console.error(error.code, error.message);
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError('Ten email jest już zarejestrowany.');
          break;
        case 'auth/invalid-email':
          setError('Nieprawidłowy adres email.');
          break;
        case 'auth/weak-password':
          setError('Hasło jest za słabe. Użyj minimum 6 znaków.');
          break;
        default:
          setError('Wystąpił błąd podczas rejestracji. Spróbuj ponownie.');
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
              Link weryfikacyjny został wysłany na adres:
              <br />
              <span className="font-medium text-white">{email}</span>
            </p>
            <p className="text-center">
              Sprawdź swoją skrzynkę pocztową i kliknij w link weryfikacyjny.
              <br />
              <span className="text-sm text-white/50">
                (Sprawdź również folder spam)
              </span>
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
        <h1 className="text-2xl font-medium text-white/90 mb-8 text-center">Rejestracja</h1>
        
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

          <Field>
            <Label className="text-sm/6 font-medium text-white/70">Potwierdź hasło</Label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
          {isLoading ? "Rejestrowanie..." : "Zarejestruj się"}
        </button>
      </form>
    </div>
  );
}
