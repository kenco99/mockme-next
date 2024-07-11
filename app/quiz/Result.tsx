import React from 'react';
import {MathJax, MathJaxContext} from 'better-react-mathjax';

interface ResultProps {
    result: {
        solution_text: string;
    };
    onNextQuestion: () => void;
    timeTaken: number;
}

const Result: React.FC<ResultProps> = ({ result, onNextQuestion, timeTaken }) => {
    if (!result) return null;

    return (
        <div className="mt-8 p-6 bg-gray-100 rounded-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Solution</h3>
            <div className="solution-text text-base leading-relaxed mb-4">
                <MathJaxContext >
                    <MathJax>{result.solution_text}</MathJax>
                </MathJaxContext>
            </div>
            <button
                onClick={onNextQuestion}
                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
            >
                Next Question →
            </button>
        </div>
    );
};

export default Result;
