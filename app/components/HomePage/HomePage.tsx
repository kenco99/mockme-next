"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { signUp, fetchUserData } from "@/app/utils/api";
import UserDetailsModal from "./UserDetailsModal";

import { PiMathOperations } from "react-icons/pi";
import { PiArticleNyTimes } from "react-icons/pi";
import { PiChartLineUp } from "react-icons/pi";
import { PiLockFill } from "react-icons/pi";

interface User {
  firstname?: string;
  lastname?: string;
  mobile_number?: string;
}

const HomePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (token) {
      fetchUserData()
          .then((response) => {
            setUser(response.data);
            if (!response.data?.firstname) {
              setShowModal(true);
            }
          })
          .catch(() => {
            localStorage.removeItem("jwt_token");
          });
    }
  }, []);

  const handleCredentialResponse = async (credentialResponse: any) => {
    try {
      const { jwt_token, data } = await signUp(credentialResponse.credential);
      localStorage.setItem("jwt_token", jwt_token);
      setUser(data);
      if (!data?.firstname) {
        setShowModal(true);
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleStartMath = () => {
    if (user) {
      router.push("/dashboard");
    } else {
      alert("Please sign in to start practicing.");
    }
  };

  const handleDashboardClick = () => {
    router.push("/dashboard");
  };

  return (
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
        <div className="min-h-screen py-6">
          <div className="absolute left-1/2 -translate-x-1/2 -translate-y-6 bg-home-gradient rounded-b-[24px] h-[90%] w-[95%] z-0"></div>
          <div className="bg-white mx-auto rounded-xl max-w-5xl shadow-bigcard relative z-10">
            <div className="w-full mx-auto px-8 py-4 flex justify-between items-center">
              <h1 className="text-lg font-bold">Mockme</h1>
              {user ? (
                  <button
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                      onClick={handleDashboardClick}
                  >
                    Dashboard
                  </button>
              ) : (
                  <GoogleLogin
                      onSuccess={handleCredentialResponse}
                      onError={() => {
                        console.log('Login Failed');
                      }}
                  />
              )}
            </div>
          </div>
          <main className="max-w-5xl mx-auto relative z-10">
            <div className="text-center my-20">
              <h2 className="font-playfair text-[52px] text-gray-500 italic mb-2">
                1000+ practice questions
              </h2>
              <h3 className="font-satoshi text-[52px] text-gray-800 font-semibold">
                For GMAT Focus Edition
              </h3>
              <p className="text-gray-400 leading-relaxed mt-6 max-w-2xl mx-auto">
                Questions from past GMAT exams, verified by GMAT experts, to help
                you ace the exam. Say bye to expensive GMAT books and prep material
              </p>
            </div>
            <div className="bg-white flex flex-col gap-10 rounded-3xl shadow-bigcard py-12 px-8">
              <div className="flex items-center">
                <div className="w-10 h-10 flex items-center justify-center text-gray-500 bg-gray-100 text-xl rounded-full mr-4">
                  <PiMathOperations />
                </div>
                <div className="flex-grow">
                  <h4 className="font-inter text-lg font-medium mb-1">
                    Math practice
                  </h4>
                </div>
                <button
                    className="bg-gray-900 text-white font-medium w-44 px-4 py-3 rounded-md hover:bg-gray-800 transition-colors"
                    onClick={handleStartMath}
                >
                  Start <span className="ml-1">→</span>
                </button>
              </div>
              <hr className="w-full border-gray-100"></hr>
              <div className="flex items-center">
                <div className="w-10 h-10 flex items-center justify-center text-gray-500 bg-gray-100 text-xl rounded-full mr-4">
                  <PiArticleNyTimes />
                </div>
                <div className="flex-grow">
                  <h4 className="font-inter text-lg font-medium mb-1">
                    Verbal Practice
                  </h4>
                </div>
                <button
                    className="bg-gray-900 text-white font-medium w-44 px-4 py-3 rounded-md hover:bg-gray-800 transition-colors"
                    onClick={handleStartMath}
                >
                  Start <span className="ml-1">→</span>
                </button>
              </div>
              <hr className="w-full border-gray-100"></hr>
              <div className="flex items-center">
                <div className="w-10 h-10 flex items-center justify-center text-gray-500 bg-gray-100 text-xl rounded-full mr-4">
                  <PiChartLineUp />
                </div>
                <div className="flex-grow">
                  <h4 className="font-inter text-lg font-medium mb-1">
                    Data insights
                  </h4>
                </div>
                <button
                    className="bg-gray-900 text-white font-medium w-44 px-4 py-3 rounded-md hover:bg-gray-800 transition-colors"
                    onClick={handleStartMath}
                >
                  Start <span className="ml-1">→</span>
                </button>
              </div>
            </div>
          </main>
          {showModal && (
              <UserDetailsModal
                  user={user}
                  setUser={setUser}
                  setShowModal={setShowModal}
              />
          )}
        </div>
      </GoogleOAuthProvider>
  );
};

export default HomePage;
