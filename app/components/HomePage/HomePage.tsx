"use client"

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signUp, fetchUserData } from '@/app/utils/api';
import UserDetailsModal from './UserDetailsModal';

interface User {
    firstname?: string;
    lastname?: string;
    mobile_number?: string;
}

const HomePage: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [isGoogleScriptLoaded, setIsGoogleScriptLoaded] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const loadGoogleScript = () => {
            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.defer = true;
            script.onload = () => setIsGoogleScriptLoaded(true);
            document.body.appendChild(script);
        };

        if (typeof window !== 'undefined' && !window.google) {
            loadGoogleScript();
        } else {
            setIsGoogleScriptLoaded(true);
        }
    }, []);

    useEffect(() => {
        if (isGoogleScriptLoaded && typeof window !== 'undefined' && window.google && !user) {
            window.google.accounts.id.initialize({
                client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
                callback: handleCredentialResponse
            });
            window.google.accounts.id.renderButton(
                document.getElementById('googleSignInButton'),
                { theme: 'outline', size: 'large' }
            );
        }
    }, [isGoogleScriptLoaded, user]);

    useEffect(() => {
        const token = localStorage.getItem('jwt_token');
        if (token) {
            fetchUserData()
                .then(response => {
                    setUser(response.data);
                    if (!response.data?.firstname) {
                        setShowModal(true);
                    }
                })
                .catch(() => {
                    localStorage.removeItem('jwt_token');
                });
        }
    }, []);

    const handleCredentialResponse = async (response: any) => {
        try {
            const { jwt_token, data } = await signUp(response.credential);
            localStorage.setItem('jwt_token', jwt_token);
            setUser(data);
            if (!data?.firstname) {
                setShowModal(true);
            } else {
                router.push('/dashboard');
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    const handleStartMath = () => {
        if (user) {
            router.push('/dashboard');
        } else {
            alert('Please sign in to start practicing.');
        }
    };

    const handleDashboardClick = () => {
        router.push('/dashboard');
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
            <div className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="font-playfair text-2xl font-bold">Mockme</h1>
                    {user ? (
                        <button
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                            onClick={handleDashboardClick}
                        >
                            Dashboard
                        </button>
                    ) : (
                        <div id="googleSignInButton"></div>
                    )}
                </div>
            </div>
            <main className="max-w-7xl mx-auto px-4">
                <div className="text-center my-20">
                    <h2 className="font-playfair text-4xl text-gray-400 italic mb-4">Unlimited practice questions</h2>
                    <h3 className="font-inter text-3xl text-gray-800 font-semibold">For GMAT Focus Edition</h3>
                </div>
                <div className="bg-white rounded-lg p-8 shadow-lg">
                    <div className="flex items-center py-6 border-b border-gray-200">
                        <div className="text-2xl w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full mr-4">≠</div>
                        <div className="flex-grow">
                            <h4 className="font-inter text-lg font-semibold mb-1">Math practice</h4>
                            <p className="text-gray-600 text-sm">No of questions: 100</p>
                        </div>
                        <button
                            className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                            onClick={handleStartMath}
                        >
                            Start <span className="ml-1">→</span>
                        </button>
                    </div>
                    {/* Add more practice sections here */}
                </div>
            </main>
            {showModal && <UserDetailsModal user={user} setUser={setUser} setShowModal={setShowModal} />}
        </div>
    );
};

export default HomePage;
