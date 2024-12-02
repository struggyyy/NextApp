'use client';

import { useAuth } from "../../../lib/AuthContext";
import { auth } from "../../../lib/firebase";
import { deleteUser, updateProfile } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from 'next/image';
import clsx from 'clsx';

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    photoURL: ''
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || '',
        photoURL: user.photoURL || ''
      });
      setImageError(false);
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setError("");

    try {
      await updateProfile(user, {
        displayName: formData.displayName,
        photoURL: formData.photoURL,
      });
      setError("success:Profil został zaktualizowany.");
      setImageError(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (name === 'photoURL') {
      setImageError(false);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleResendVerification = async () => {
    setIsVerifying(true);
    try {
      await user.sendEmailVerification();
      setError("success:Link weryfikacyjny został wysłany ponownie na twój adres email.");
    } catch (error) {
      console.error("Error sending verification email:", error);
      setError("Wystąpił błąd podczas wysyłania linku weryfikacyjnego. Spróbuj ponownie później.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!showConfirmation) {
      setShowConfirmation(true);
      return;
    }

    try {
      setIsDeleting(true);
      setError("");
      
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("Nie znaleziono użytkownika");
      }

      await deleteUser(currentUser);
      router.push("/");
    } catch (error) {
      console.error("Error deleting account:", error);
      setError("Wystąpił błąd podczas usuwania konta. Spróbuj wylogować się i zalogować ponownie przed usunięciem konta.");
    } finally {
      setIsDeleting(false);
      setShowConfirmation(false);
    }
  };

  const cancelDelete = () => {
    setShowConfirmation(false);
    setError("");
  };

  const InfoField = ({ label, value }) => (
    <div className={clsx(
      'p-4 rounded-lg',
      'bg-white/5 backdrop-blur-sm',
      'border border-white/10'
    )}>
      <p className="text-sm font-medium text-white/50">{label}</p>
      <p className="mt-1 text-white">{value}</p>
    </div>
  );

  const ProfileImage = () => {
    if (!formData.photoURL || imageError) {
      return (
        <div className={clsx(
          'w-full h-full flex items-center justify-center',
          'text-white/50 text-4xl font-medium'
        )}>
          {formData.displayName ? formData.displayName[0].toUpperCase() : user.email[0].toUpperCase()}
        </div>
      );
    }

    return (
      <img
        src={formData.photoURL}
        alt="Profile"
        className="w-full h-full object-cover"
        onError={handleImageError}
      />
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className={clsx(
        'w-full max-w-2xl p-8 rounded-xl',
        'bg-gray-800/50 backdrop-blur-xl',
        'shadow-2xl shadow-black/10'
      )}>
        <h1 className="text-2xl font-medium text-white/90 mb-8 text-center">Profil użytkownika</h1>
        
        {user ? (
          <div className="space-y-8">
            {/* Verification Status */}
            {!user.emailVerified && (
              <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <div className="flex flex-col items-center text-center space-y-4">
                  <p className="text-yellow-400">
                    Twój email nie został jeszcze zweryfikowany. Zweryfikuj swój adres email, aby w pełni korzystać z konta.
                  </p>
                  <button
                    onClick={handleResendVerification}
                    disabled={isVerifying}
                    className={clsx(
                      'py-2 px-4 rounded-lg',
                      'bg-yellow-500/20 hover:bg-yellow-500/30',
                      'text-yellow-400 font-medium',
                      'transition-all duration-200',
                      'disabled:opacity-50',
                      'focus:outline-none focus:ring-2 focus:ring-yellow-500/25'
                    )}
                  >
                    {isVerifying ? "Wysyłanie..." : "Wyślij ponownie link weryfikacyjny"}
                  </button>
                </div>
              </div>
            )}

            {/* Error/Success Messages */}
            {error && (
              <div className={clsx(
                'p-4 rounded-lg',
                error.startsWith('success:') 
                  ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                  : 'bg-red-500/10 border border-red-500/20 text-red-400'
              )}>
                <p>{error.replace('success:', '')}</p>
              </div>
            )}

            {/* Profile Photo */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative w-32 h-32 rounded-full overflow-hidden bg-white/5">
                <ProfileImage />
              </div>
              {imageError && (
                <p className="text-sm text-red-400">
                  Nie można załadować obrazu. Sprawdź, czy URL jest poprawny.
                </p>
              )}
            </div>

            {/* Profile Edit Form */}
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="displayName" className="text-sm font-medium text-white/70">
                  Nazwa użytkownika
                </label>
                <input
                  id="displayName"
                  name="displayName"
                  type="text"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  className={clsx(
                    'w-full p-3 rounded-lg',
                    'bg-white/5 backdrop-blur-sm',
                    'border border-white/10',
                    'text-white',
                    'focus:outline-none focus:ring-2 focus:ring-white/25'
                  )}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-white/70">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={user.email}
                  readOnly
                  className={clsx(
                    'w-full p-3 rounded-lg',
                    'bg-white/5 backdrop-blur-sm',
                    'border border-white/10',
                    'text-white opacity-50',
                    'cursor-not-allowed'
                  )}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="photoURL" className="text-sm font-medium text-white/70">
                  URL zdjęcia profilowego
                </label>
                <input
                  id="photoURL"
                  name="photoURL"
                  type="text"
                  value={formData.photoURL}
                  onChange={handleInputChange}
                  className={clsx(
                    'w-full p-3 rounded-lg',
                    'bg-white/5 backdrop-blur-sm',
                    'border border-white/10',
                    'text-white',
                    'focus:outline-none focus:ring-2 focus:ring-white/25',
                    imageError && 'border-red-500/50'
                  )}
                />
                {imageError && (
                  <p className="text-sm text-red-400 mt-1">
                    Upewnij się, że URL prowadzi bezpośrednio do obrazu (np. kończy się na .jpg, .png)
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isUpdating}
                className={clsx(
                  'w-full py-2 px-4 rounded-lg',
                  'bg-white/10 hover:bg-white/15',
                  'text-white font-medium',
                  'transition-all duration-200',
                  'disabled:opacity-50',
                  'focus:outline-none focus:ring-2 focus:ring-white/25'
                )}
              >
                {isUpdating ? "Aktualizowanie..." : "Aktualizuj profil"}
              </button>
            </form>

            <div className="border-t border-white/10 pt-8">
              <h2 className="text-xl font-medium text-white/90 mb-6">Informacje o koncie</h2>
              <div className="space-y-4">
                <InfoField label="ID użytkownika" value={user.uid} />
                <InfoField 
                  label="Status weryfikacji email" 
                  value={user.emailVerified ? 'Zweryfikowany' : 'Niezweryfikowany'} 
                />
                <InfoField 
                  label="Data utworzenia konta" 
                  value={user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleString('pl-PL') : 'Brak danych'} 
                />
                <InfoField 
                  label="Ostatnie logowanie" 
                  value={user.metadata.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleString('pl-PL') : 'Brak danych'} 
                />
              </div>
            </div>

            {showConfirmation ? (
              <div className="mt-8 space-y-4">
                <p className="text-red-400 text-center">
                  Czy na pewno chcesz usunąć swoje konto? Ta operacja jest nieodwracalna.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                    className={clsx(
                      'flex-1 py-2 px-4 rounded-lg',
                      'bg-red-500/20 hover:bg-red-500/30',
                      'text-red-400 font-medium',
                      'transition-all duration-200',
                      'disabled:opacity-50',
                      'focus:outline-none focus:ring-2 focus:ring-red-500/25'
                    )}
                  >
                    {isDeleting ? "Usuwanie..." : "Tak, usuń konto"}
                  </button>
                  <button
                    onClick={cancelDelete}
                    disabled={isDeleting}
                    className={clsx(
                      'flex-1 py-2 px-4 rounded-lg',
                      'bg-white/5 hover:bg-white/10',
                      'text-white font-medium',
                      'transition-all duration-200',
                      'disabled:opacity-50',
                      'focus:outline-none focus:ring-2 focus:ring-white/25'
                    )}
                  >
                    Anuluj
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={handleDeleteAccount}
                className={clsx(
                  'mt-8 w-full py-2 px-4 rounded-lg',
                  'bg-red-500/20 hover:bg-red-500/30',
                  'text-red-400 font-medium',
                  'transition-all duration-200',
                  'focus:outline-none focus:ring-2 focus:ring-red-500/25'
                )}
              >
                Usuń konto
              </button>
            )}
          </div>
        ) : (
          <p className="text-center text-white/50">Ładowanie danych użytkownika...</p>
        )}
      </div>
    </div>
  );
}
