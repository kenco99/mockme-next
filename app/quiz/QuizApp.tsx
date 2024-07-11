"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Question from './Question';
import Result from './Result';
import { getQuestion, submitAnswer } from '@/app/utils/api';
import {MathJax, MathJaxContext} from 'better-react-mathjax';



interface QuestionData {
    id: string;
    question_text: string;
    section: string;
    options: Array<{ option: string }>;
}

interface SessionInfo {
    session_id: string;
    attempted_count: number;
    question_count: number;
    time_left: number | null;
}

interface ResultData {
    answer: string;
    solution_text: string;
}

const QuizApp: React.FC = () => {
    const [question, setQuestion] = useState<QuestionData | null>(null);
    const [selectedOption, setSelectedOption] = useState<string>('');
    const [result, setResult] = useState<ResultData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);
    const [questionTime, setQuestionTime] = useState<number>(0);
    const [totalTime, setTotalTime] = useState<number | null>(null);

    const searchParams = useSearchParams();

    const fetchQuestion = useCallback(async (params: { sessionId?: string; questionId?: string }) => {
        try {
            setLoading(true);
            const response = await getQuestion(params);
            setQuestion(response.data);
            if (response.session_info) {
                setSessionInfo(response.session_info);
                setTotalTime(response.session_info.time_left);
            }
            setLoading(false);
            setSelectedOption('');
            setResult(null);
            setQuestionTime(0);
        } catch (error) {
            setError('Failed to fetch question. Please try again.');
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const sessionId = searchParams.get('session_id');
        const questionId = searchParams.get('question_id');

        if (sessionId) {
            fetchQuestion({ sessionId });
        } else if (questionId) {
            fetchQuestion({ questionId });
        } else {
            setError('No session ID or question ID provided');
        }
    }, [searchParams, fetchQuestion]);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;
        if (sessionInfo && !loading && !result) {
            intervalId = setInterval(() => {
                setQuestionTime(prevTime => prevTime + 1);
                if(totalTime !== null){
                    setTotalTime(prevTime => prevTime - 1);
                }
            }, 1000);
        }
        return () => clearInterval(intervalId);
    }, [sessionInfo, loading, result, totalTime]);

    const handleOptionSelect = (option: string) => {
        setSelectedOption(option);
    };

    const handleConfirm = async () => {
        if (!selectedOption) {
            alert('Please select an option');
            return;
        }

        try {
            setLoading(true);
            const data = await submitAnswer(selectedOption, question!.id);
            setResult(data);
            setLoading(false);
        } catch (error) {
            setError('Failed to submit answer. Please try again.');
            setLoading(false);
        }
    };

    const handleNextQuestion = () => {
        if (sessionInfo) {
            fetchQuestion({ sessionId: sessionInfo.session_id });
        } else {
            window.location.reload();
        }
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="max-w-6xl mx-auto my-8 p-8 bg-white rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">{question?.section.toUpperCase()} REVIEW</h1>
                {sessionInfo && <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors">Pause session II</button>}
            </div>
            {sessionInfo && (
                <div className="flex justify-between text-sm text-gray-600 mb-4">
                    <span>Question {sessionInfo.attempted_count}/{sessionInfo.question_count}</span>
                    <span>This question: {formatTime(questionTime)}</span>
                    {totalTime !== null && (<span>Total: {formatTime(totalTime)}</span>)}
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {question && <Question question={question}/>}
                <div className="space-y-4">
                    {question?.options.map((option, index) => {
                        const optionLetter = String.fromCharCode(65 + index);
                        const isCorrect = result && result.answer === optionLetter;
                        const isSelected = selectedOption === optionLetter.toLowerCase();

                        return (
                            <label key={index}
                                   className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all
                                               ${isCorrect ? 'bg-green-100 border-green-400' : ''}
                                               ${isSelected && !isCorrect && result ? 'bg-red-100 border-red-400' : ''}
                                               ${isSelected && !result ? 'bg-gray-200' : ''}
                                               ${!isSelected && !result ? 'hover:bg-gray-100' : ''}`}>
                                <input
                                    type="radio"
                                    name="option"
                                    value={optionLetter.toLowerCase()}
                                    checked={isSelected}
                                    onChange={() => handleOptionSelect(optionLetter.toLowerCase())}
                                    disabled={result !== null}
                                    className="mr-4"
                                />
                                {/*<span dangerouslySetInnerHTML={{__html: option.option}}></span>*/}
                                <MathJaxContext>
                                    <MathJax>
                                        {option.option}
                                    </MathJax>
                                </MathJaxContext>

                            </label>
                        );
                    })}
                </div>
            </div>
            {!result && (
                <button
                    className="w-full bg-black text-white py-3 rounded-lg text-lg font-semibold hover:bg-gray-800 transition-colors"
                    onClick={handleConfirm}
                >
                    Next
                </button>
            )}
            {result && (
                <Result
                    result={result}
                    onNextQuestion={handleNextQuestion}
                    timeTaken={questionTime}
                />
            )}
        </div>
    );
};

export default QuizApp;
