import React from "react";
import { MathJax, MathJaxContext } from "better-react-mathjax";

interface QuestionProps {
  question: {
    question_text: string;
  };
}

const Question: React.FC<QuestionProps> = ({ question }) => {
  if (!question) return null;

  return (
    <div className="leading-relaxed">
      <MathJaxContext>
        <MathJax>{question.question_text}</MathJax>
      </MathJaxContext>
    </div>
  );
};

export default Question;
