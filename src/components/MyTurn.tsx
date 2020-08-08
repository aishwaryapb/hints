import React, { FunctionComponent, useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';

import { getTime } from '../utils';
import ding from '../assets/sounds/ding.mp3';
import useSound from 'use-sound';
import { Game } from '../types';
import { UPDATE_SCORE, GET_RANDOM_QUESTION } from '../graphql';
import CONFIG from '../config';

let timer: NodeJS.Timeout;

type QuestionData = {
    getQuestion: Question
}

type Question = {
    id: string,
    word: string,
    taboo: [string]
}

const MyTurn: FunctionComponent = () => {
    const [play] = useSound(ding);
    const [question, setQuestion] = useState<undefined | Question>();
    const [time, setTime] = useState<number>(CONFIG.timer);
    const [showAction, toggleShowAction] = useState<boolean>(false);

    useEffect(() => {
        timer = setTimeout(() => setTime(time - 1), 1000);
        if (time === 0 && !showAction) {

            play();
            clearTimeout(timer);
            toggleShowAction(true);
        }
        return () => clearTimeout(timer)
    }, [time])

    const [updateScore] = useMutation<{ updateScore: Game }, { correctGuess: boolean, gameId: string }>(UPDATE_SCORE);
    const correctGuess = (guess: boolean): void => {
        updateScore({
            variables: {
                correctGuess: guess,
                gameId: localStorage.getItem("session") || ""
            }
        })
    }

    const { refetch, data } = useQuery<QuestionData>(
        GET_RANDOM_QUESTION,
        {
            fetchPolicy: "network-only"
        }
    );

    if (question === undefined && data?.getQuestion) {
        setQuestion(data.getQuestion);
    }

    const finishQuestion = () => {
        play();
        clearTimeout(timer);
        toggleShowAction(true);
    }

    const skipQuestion = () => {
        refetch();
        setQuestion(undefined);
    }

    return (
        <div className="flex-row my-turn-container">
            <div className="question flex-col">
                <h1>{question?.word}</h1>
                <h2>Do not use</h2>
                <ul>
                    {
                        question?.taboo.map((word, index) => <li key={index}>{word}</li>)
                    }
                </ul>
            </div>
            <div className="timer flex-col">
                {
                    !showAction
                        ? (
                            <>
                                <h1>{getTime(time)}</h1>
                                <div className="vm-xs">
                                    <button className="primary-button-sm float-left text-center hm-xs" onClick={finishQuestion}>Done</button>
                                    <button className="primary-button-sm float-right text-center hm-xs" onClick={skipQuestion}>Skip</button>
                                </div>
                            </>
                        )
                        : (
                            <>
                                <h2 className="vm-md">{time === 0 ? "Times up!" : "Great!"}</h2>
                                <h3>Did they guess correctly?</h3>
                                <div className="vm-xs">
                                    <button className="primary-button-sm float-left text-center hm-xs" onClick={() => correctGuess(true)}>Yes</button>
                                    <button className="primary-button-sm float-right text-center hm-xs" onClick={() => correctGuess(false)}>No</button>
                                </div>
                            </>
                        )
                }
            </div>
        </div>
    )
}

export default MyTurn;
