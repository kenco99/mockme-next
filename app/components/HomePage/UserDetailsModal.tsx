"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { updateUserDetails } from "@/app/utils/api";

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

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  user,
  setUser,
  setShowModal,
}) => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await updateUserDetails({
        firstname,
        lastname,
        mobile_number: mobileNumber,
      });
      if (response.code === 200) {
        setUser({ ...user, firstname, lastname, mobile_number: mobileNumber });
        setShowModal(false);
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error updating user details:", error);
    }
  };

  return (
    <div className="absolute z-20 inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 flex flex-col gap-6 rounded-xl w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Complete Your Profile</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <input
            type="text"
            placeholder="First Name"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            required
            className="w-full py-3 px-4 border border-gray-300 rounded-lg"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            required
            className="w-full py-3 px-4 border border-gray-300 rounded-lg"
          />
          <input
            type="tel"
            placeholder="Mobile Number (with country code)"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            required
            className="w-full py-3 px-4 border border-gray-300 rounded-lg"
          />
          <button
            type="submit"
            className="w-full mt-4 bg-black text-white py-3 rounded-md hover:bg-gray-900 transition-colors"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserDetailsModal;
