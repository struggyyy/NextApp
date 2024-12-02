'use client';

import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
      <h1 className="text-4xl font-bold text-red-600 mb-4">404</h1>
      <p className="text-lg mb-6">Nie znaleziono strony, której szukasz.</p>
      <button
        onClick={() => router.push('/')}
        className="bg-blue-600 text-white px-6 py-2 rounded"
      >
        Powrót do strony głównej
      </button>
    </div>
  );
}
