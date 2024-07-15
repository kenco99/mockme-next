import React from "react";
import { MathJax, MathJaxContext } from "better-react-mathjax";

import { PiCampfire } from "react-icons/pi";

interface ResultProps {
  result: {
    solution_text: string;
  };
  onNextQuestion: () => void;
  timeTaken: number;
}

const Result: React.FC<ResultProps> = ({
  result,
  onNextQuestion,
  timeTaken,
}) => {
  if (!result) return null;

  return (
    <div className="flex flex-row gap-4 mt-8 p-6 bg-gray-100 rounded-lg">
      <div className="text-lg pt-2">
        <PiCampfire />
      </div>
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Solution</h3>
        <div className="solution-text text-base leading-relaxed mb-4">
          <MathJaxContext>
            <MathJax>{result.solution_text}</MathJax>
          </MathJaxContext>
        </div>
        <button
          onClick={onNextQuestion}
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Next Question →
        </button>
      </div>
    </div>
  );
};

export default Result;
