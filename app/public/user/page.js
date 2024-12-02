'use client'

import { redirect } from 'next/navigation';

export default function UserPage() {
    redirect('/public/user/signin');
}
