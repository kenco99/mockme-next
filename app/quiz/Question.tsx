import React from "react";
import { MathJax, MathJaxContext } from "better-react-mathjax";

interface QuestionProps {
  question: {
    question_text: string;
  };
}

const Question: React.FC<QuestionProps> = ({ question }) => {
  if (!question) return null;

    const renderMathJaxWithLineBreaks = (text:string) => {
        const segments = text.split(/<br>/i);
        return segments.map((segment, index) => (
            <React.Fragment key={index}>
                <MathJaxContext><MathJax>{segment}</MathJax></MathJaxContext>
                {index < segments.length - 1 && <br />}
            </React.Fragment>
        ));
    };

  return (
    <div className="leading-relaxed">
        {renderMathJaxWithLineBreaks(question.question_text)}
    </div>
  );
};

export default Question;
