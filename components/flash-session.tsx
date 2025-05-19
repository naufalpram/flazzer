import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  FileText,
} from "lucide-react";
import { Question } from "@/lib/schemas";
import FlashCard from "./flash-card";
import { cn } from "@/lib/utils";
import FlashOverview from "./flash-overview";
import FlashStats from "./flash-stats";

type FlashSessionProps = {
  questions: Question[];
  clearPDF: () => void;
  title: string;
};

export default function FlashSession({
  questions,
  clearPDF,
  title = "Quiz",
}: FlashSessionProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [confidentResponses, setConfidentResponses] = useState<string[]>(
    Array(questions.length).fill(null),
  );
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [progress, setProgress] = useState(0);

  const [prevAnswer, setPrevAnswer] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress((currentQuestionIndex / questions.length) * 100);
    }, 100);
    return () => clearTimeout(timer);
  }, [currentQuestionIndex, questions.length]);

  useEffect(() => {
    if (prevAnswer) {
        const revertAnswer = setTimeout(() => setPrevAnswer(null), 1000);
        return () => clearTimeout(revertAnswer);
    }
  }, [prevAnswer]);

  const handleSwipeCard = (response: string) => {
    const newResponse = [...confidentResponses];
    newResponse[currentQuestionIndex] = response;
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setPrevAnswer(response);
    } else {
      handleSubmit();
    }
    setConfidentResponses(newResponse);
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setConfidentResponses(Array(questions.length).fill(null));
    setIsSubmitted(false);
    setCurrentQuestionIndex(0);
    setProgress(0);
  };

  const currentQuestion = questions[currentQuestionIndex];

  const answerShoutVariant = {
    hidden: {
      scale: 0, x: 0, y: 0, rotate: 0
    },
    visibleRight: {
      scale: 1, x: 15, y: -30, rotate: 6
    },
    visibleLeft: {
      scale: 1, x: -15, y: -30, rotate: -6
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-center text-foreground">
          {title}
        </h1>
        <div className="relative">
          {!isSubmitted && <Progress value={progress} className="h-1 mb-20" />}
          <div className="min-h-[400px]">
            {" "}
            {/* Prevent layout shift */}
            <AnimatePresence mode="wait">
              <motion.div
                key={isSubmitted ? "results" : currentQuestionIndex}
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {!isSubmitted ? (
                  <div className="space-y-20 relative">
                    <div className={cn("flash-cards-container w-full h-full flex justify-center items-center transition-transform")}>
                        <FlashCard number={currentQuestionIndex + 1} question={currentQuestion.question} answer={currentQuestion.answer}  />
                    </div>
                    <div className="flex justify-between items-center pt-4">
                      <Button
                        onClick={() => handleSwipeCard('Study Again')}
                        variant="ghost"
                      >
                        <ChevronLeft className="mr-2 h-4 w-4" /> Study Again
                      </Button>
                      <span className="text-sm font-medium">
                        {currentQuestionIndex + 1} / {questions.length}
                      </span>
                      <Button
                        onClick={() => handleSwipeCard('Got It')}
                        variant="ghost"
                      >
                        Got It
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                    <motion.h2 layout variants={answerShoutVariant} initial='hidden' animate={prevAnswer === 'Got It' ? 'visibleRight' : 'hidden'} transition={{ easings: ['easeInOut'] }} className={cn("absolute top-0 right-0 font-bold text-2xl")}>You Got It!</motion.h2>
                    <motion.h2 layout variants={answerShoutVariant} initial='hidden' animate={prevAnswer === 'Study Again' ? 'visibleLeft' : 'hidden'} transition={{ easings: ['easeInOut'] }} className={cn("absolute top-0 left-0 font-bold text-2xl")}>Study Again!</motion.h2>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <FlashStats
                      confidentResponses={confidentResponses}
                      totalQuestions={questions.length}
                    />
                    <div className="space-y-12">
                      <FlashOverview questions={questions} confidentResponse={confidentResponses} />
                    </div>
                    <div className="flex justify-center space-x-4 pt-4">
                      <Button
                        onClick={handleReset}
                        variant="outline"
                        className="bg-muted hover:bg-muted/80 w-full"
                      >
                        <RefreshCw className="mr-2 h-4 w-4" /> Reset Quiz
                      </Button>
                      <Button
                        onClick={clearPDF}
                        className="bg-primary hover:bg-primary/90 w-full"
                      >
                        <FileText className="mr-2 h-4 w-4" /> Try Another PDF
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
