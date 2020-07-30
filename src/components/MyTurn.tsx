import React, {FunctionComponent, useEffect, useState} from 'react';
import {useMutation, gql} from '@apollo/client';

import { getTime } from '../utils';
import ding from '../assets/sounds/ding.mp3';
import useSound from 'use-sound';
import {Game} from '../types';

const MyTurn:FunctionComponent = () => {
    const [play] = useSound(ding);
    const [time, setTime] = useState<number>(2);
    const [showAction, toggleShowAction] = useState<boolean>(false);

    useEffect(() => {
        const timer = setTimeout(() => setTime(time - 1), 1000);
        if(time === 0 && !showAction) {
            play();
            clearTimeout(timer);
            toggleShowAction(true);
        }
        return () => clearTimeout(timer)
    }, [time])

    const [updateScore] = useMutation<{ updateScore: Game }, { correctGuess:boolean, gameId: string }>(UPDATE_SCORE);
    const correctGuess = (guess: boolean):void => {
        updateScore({
            variables: {
                correctGuess: guess,
                gameId: localStorage.getItem("session") || ""
            }
        })
    }
    return (
        <div className="flex-row my-turn-container">
            <div className="question flex-col">
                <h1>Start up</h1>
                <h2>Do not use</h2>
                <ul>
                    <li>Business</li>
                    <li>Office</li>
                    <li>Work</li>
                    <li>Organization</li>
                </ul>
            </div>
            <div className="timer flex-col">
                {
                    !showAction
                    ? <h1>{getTime(time)}</h1>
                    : (
                        <>
                            <h2 className="vm-md">Times up!</h2>
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

const UPDATE_SCORE = gql`
    mutation updateScore($correctGuess: Boolean!, $gameId: String!) {
        updateScore(correctGuess: $correctGuess, gameId: $gameId) {
            id
            player1 {
                name
                score
            }
            player2 {
                name
                score
            }
            currentPlayer
        }
    }   
`;

export default MyTurn;
