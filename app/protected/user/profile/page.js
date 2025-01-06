'use client';

import { useAuth } from "../../../lib/AuthContext";
import { auth, db } from "../../../lib/firebase"; 
import { deleteUser, updateProfile } from "firebase/auth";
import { getDoc, setDoc, doc, deleteDoc } from 'firebase/firestore'; // Corrected import
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import clsx from 'clsx';
import { useForm } from 'react-hook-form';
import Image from 'next/image';


export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(true); 

  // Initialize useForm hook
  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: user?.email || "",
      displayName: user?.displayName || "",
      photoURL: user?.photoURL || "",
      street: '',
      city: '',
      zipCode: '',
    },
  });

  useEffect(() => {
    if (user) {
      const fetchUserAddress = async () => {
        try {
          const snapshot = await getDoc(doc(db, "users", user.uid));
          if (snapshot.exists()) {
            const address = snapshot.data().address;
            setValue("city", address.city);
            setValue("zipCode", address.zipCode);
            setValue("street", address.street);
          }
        } catch (error) {
          console.error("Error fetching address:", error);
          setError("Wystąpił błąd podczas ładowania danych adresowych.");
        } finally {
          setLoading(false); 
        }
      };

      fetchUserAddress();
    }
  }, [user, setValue]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setError("");

    try {
      await updateProfile(user, {
        displayName: watch('displayName'),
        photoURL: watch('photoURL'),
      });

      await setDoc(doc(db, "users", user?.uid), {
        address: {
          street: watch('street'),
          city: watch('city'),
          zipCode: watch('zipCode'),
        },
      });

      setError("success:Profil został zaktualizowany.");
      setImageError(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Wystąpił błąd podczas aktualizacji profilu. Sprawdź swoje uprawnienia.");
    } finally {
      setIsUpdating(false);
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

// Delete user document from Firestore
      await deleteDoc(doc(db, "users", currentUser.uid));

      // Delete user from Firebase Authentication
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
  const photoURL = watch('photoURL');
  if (!photoURL || imageError) {
    return (
      <div className={clsx(
        'w-full h-full flex items-center justify-center',
        'text-white/50 text-4xl font-medium'
      )}>
        {watch('displayName') ? watch('displayName')[0].toUpperCase() : user.email[0].toUpperCase()}
      </div>
    );
  }

  return (
    <Image
      src={photoURL}
      alt="Profile"
      width={140}
      height={140}
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
                  {...register("displayName")}
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
                  {...register("photoURL")}
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

              {/* Address Fields */}
              <div className="space-y-2">
                <label htmlFor="street" className="text-sm font-medium text-white/70">Ulica</label>
                <input
                  id="street"
                  name="street"
                  type="text"
                  {...register("street")}
                  disabled={loading} 
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
                <label htmlFor="city" className="text-sm font-medium text-white/70">Miasto</label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  {...register("city")}
                  disabled={loading} 
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
                <label htmlFor="zipCode" className="text-sm font-medium text-white/70">Kod pocztowy</label>
                <input
                  id="zipCode"
                  name="zipCode"
                  type="text"
                  {...register("zipCode")}
                  disabled={loading} 
                  className={clsx(
                    'w-full p-3 rounded-lg',
                    'bg-white/5 backdrop-blur-sm',
                    'border border-white/10',
                    'text-white',
                    'focus:outline-none focus:ring-2 focus:ring-white/25'
                  )}
                />
              </div>

              <button
                type="submit"
                disabled={isUpdating || loading} 
                className="w-full py-2 px-4 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-white font-medium transition-all duration-200"
              >
                {isUpdating ? "Aktualizowanie..." : "Aktualizuj profil"}
              </button>
            </form>

            <div className="border-t border-white/10 pt-8">
              <h2 className="text-xl font-medium text-white/90 mb-6">Informacje o koncie</h2>
              <div className="space-y-4">
                <InfoField label="ID użytkownika" value={user.uid} />
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
                <p className="text-sm text-red-500">Czy na pewno chcesz usunąć swoje konto? To działanie jest nieodwracalne!</p>
                <div className="flex space-x-4">
                  <button 
                    onClick={cancelDelete}
                    className="py-2 px-4 bg-gray-600 rounded-lg text-white"
                  >
                    Anuluj
                  </button>
                  <button 
                    onClick={handleDeleteAccount}
                    className="py-2 px-4 bg-red-500/40 hover:bg-red-500/50 rounded-lg text-white"
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Usuwanie..." : "Usuń konto"}
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowConfirmation(true)}
                className="w-full py-2 px-4 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-white font-medium transition-all duration-200"
              >
                Usuń konto
              </button>
            )}
          </div>
        ) : (
          <p className="text-white">Ładowanie danych użytkownika...</p>
        )}
      </div>
    </div>
  );
}
