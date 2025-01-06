// Existing content
'use client';

import { initializeApp } from "firebase/app";
import { getAuth, sendEmailVerification } from "firebase/auth";
import { getFirestore } from "firebase/firestore";          

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);      

const sendVerificationEmail = async (user) => {
    const actionCodeSettings = {
        url: `${window.location.origin}/public/user/signin`,
        handleCodeInApp: false
    };

    try {
        await sendEmailVerification(user, actionCodeSettings);
        return true;
    } catch (error) {
        console.error("Error sending verification email:", error);
        throw error;
    }
};

let analytics = null;
if (typeof window !== 'undefined') {
    import('firebase/analytics').then(({ getAnalytics }) => {
        analytics = getAnalytics(app);
    });
}

export { auth, sendVerificationEmail };
