"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateUserDetails } from '@/app/utils/api';

interface User {
    firstname?: string;
    lastname?: string;
    mobile_number?: string;
}

interface UserDetailsModalProps {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ user, setUser, setShowModal }) => {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await updateUserDetails({
                firstname,
                lastname,
                mobile_number: mobileNumber
            });
            if (response.code === 200) {
                setUser({ ...user, firstname, lastname, mobile_number: mobileNumber });
                setShowModal(false);
                router.push('/dashboard');
            }
        } catch (error) {
            console.error('Error updating user details:', error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg w-full max-w-md">
                <h2 className="text-2xl font-semibold mb-4">Complete Your Profile</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="First Name"
                        value={firstname}
                        onChange={(e) => setFirstname(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                    <input
                        type="text"
                        placeholder="Last Name"
                        value={lastname}
                        onChange={(e) => setLastname(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                    <input
                        type="tel"
                        placeholder="Mobile Number (with country code)"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UserDetailsModal;
