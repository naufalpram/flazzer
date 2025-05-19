import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { motion } from "motion/react";

type FlashCardProps = {
    number: number,
    question: string,
    answer: string
  };
  
const FlashCard: React.FC<FlashCardProps> = ({ number, question, answer }) => {
    const [showAnswer, setShowAnswer] = useState(false);
    return (
        <Card onClick={() => setShowAnswer((prev) => !prev)} className='flash-card border-0 h-48'>
            <motion.div
                className="flash-card-inner border-2 rounded-xl"
                variants={{'Show Answer': { rotateY: showAnswer ? 180 : 0, transition: { duration: 0.4, type: 'spring' } }}}
                animate={['Show Answer']}
            >
                <motion.div className="flash-card-front">
                    <CardHeader className="text-center space-y-2">
                        <CardTitle className="text-xl font-bold">Question {number}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <p className="text-center text-base">{question}</p>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                        <p className="text-center text-muted-foreground text-sm">
                        Click card to see the answer
                        </p>
                    </CardFooter>
                </motion.div>
                <motion.div className="flash-card-back" style={{ rotateY: 180 }}>
                    <CardHeader className="text-center space-y-2">
                        <CardTitle className="text-xl font-bold">Answer</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <p className="text-center text-base">{answer}</p>
                    </CardContent>
                </motion.div>
            </motion.div>
        </Card>
    )
};

export default FlashCard;