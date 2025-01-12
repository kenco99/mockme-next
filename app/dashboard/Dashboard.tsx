"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import moment from 'moment';
import { getSessions } from '@/app/utils/api';

interface Session {
    session_id: number;
    sections?: string[];
    topics?: string[];
    createdAt: string;
    duration: number | null;
    attempted_count: number;
    question_count: number;
    correct_count: number;
}

const Dashboard: React.FC = () => {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        fetchSessions();
    }, []);

    useEffect(() => {
        if (!loading && sessions.length === 0) {
            router.push('/create-session');
        }
    }, [loading, sessions, router]);

    const fetchSessions = async () => {
        try {
            setLoading(true);
            const response = await getSessions();
            if (response && response.data && Array.isArray(response.data)) {
                setSessions(response.data);
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error('Error fetching sessions:', error);
            setError('Failed to load sessions. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleStartNewSession = () => {
        router.push('/create-session');
    };

    const handleResumeSession = (sessionId: number) => {
        router.push(`/quiz?session_id=${sessionId}`);
    };

    const formatDuration = (duration: number | null) => {
        if (duration === null || duration === undefined) return 'Untimed';
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        if (hours === 0) return `${minutes}mins`;
        return `${hours}h ${minutes}mins`;
    };

    const calculatePercentCorrect = (correct: number, attempted: number) => {
        if (!attempted || attempted === 0) return 'Unlimited';
        return `${((correct / attempted) * 100).toFixed(2)}%`;
    };

    if (loading) return <div className="text-center mt-8 text-gray-600">Loading...</div>;
    if (error) return <div className="text-center mt-8 text-red-600">{error}</div>;

    return (
        <div className="flex justify-center p-8">
            <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-3xl">
                <h1 className="text-2xl font-bold mb-6">Sessions</h1>

                <button
                    onClick={handleStartNewSession}
                    className="w-full bg-blue-50 text-black p-4 rounded-lg text-left flex justify-between items-center mb-6 hover:bg-blue-100 transition-colors"
                >
                    Start a new session
                    <span className="text-xl">→</span>
                </button>

                <h2 className="text-lg font-semibold mb-4 text-gray-600">PREVIOUS SESSIONS</h2>

                {sessions.map((session) => (
                    <div key={session.session_id} className="border border-gray-200 rounded-lg p-4 mb-4">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-lg mb-1">Practice session #{session.session_id}</h3>
                                <p className="text-sm text-gray-600">
                                    {session.sections && session.sections.join(' / ')}
                                    {session.sections && session.topics && ' / '}
                                    {session.topics && session.topics.join(' / ')}
                                </p>
                            </div>
                            <span className="text-sm text-gray-600">{moment(session.createdAt).format('DD/MM/YYYY')}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex gap-4">
                                <div>
                                    <span className="text-sm font-semibold text-gray-600 mr-1">Duration:</span>
                                    <span className="text-sm">{formatDuration(session.duration)}</span>
                                </div>
                                <div>
                                    <span className="text-sm font-semibold text-gray-600 mr-1">Questions:</span>
                                    <span className="text-sm">{session.attempted_count || 0}/{session.question_count || 0}</span>
                                </div>
                                <div>
                                    <span className="text-sm font-semibold text-gray-600 mr-1">% Correct:</span>
                                    <span className="text-sm">{calculatePercentCorrect(session.correct_count, session.attempted_count)}</span>
                                </div>
                            </div>
                            {(session.attempted_count === 0 || session.attempted_count !== session.question_count) && (
                                <button
                                    onClick={() => handleResumeSession(session.session_id)}
                                    className="bg-gray-800 text-white px-4 py-2 rounded text-sm hover:bg-gray-700 transition-colors"
                                >
                                    Resume
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
