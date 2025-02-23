import React, { FunctionComponent, useState, useEffect, useContext } from 'react';
import { useMutation } from '@apollo/client';

import { Event, Game, SessionContextType } from '../types';
import { getStage } from '../utils';
import CONFIG from '../config';
import { SessionContext } from '../sessionContext';
import JoinGame from './JoinGame';
import Waiting from './Waiting';
import MyTurn from './MyTurn';
import { CREATE_GAME, UPDATE_GAME } from '../graphql';

type Props = {
    event?: Event,
    gameOver?: string
}

const Game: FunctionComponent<Props> = ({ event, gameOver }) => {
    const { session, setSession } = useContext<SessionContextType>(SessionContext);
    const [stage, setStage] = useState<Event | undefined>(event);
    const [playerName, setName] = useState<string>("");
    const [createGame] = useMutation<{ createGame: Game }, { name: string }>(CREATE_GAME, {
        variables: { name: playerName },
        update: (_, result) => {
            const { data } = result;
            data?.createGame.id && setSession(data?.createGame.id);
            localStorage.setItem("session", data?.createGame.id || "");
            localStorage.setItem("pnum", CONFIG.player1.toString());
            data?.createGame && setStage(getStage(data.createGame));
        },
        onError: () => setStage("ERROR")
    });
    const [updateGame] = useMutation<{ updateGame: Game }, { name: string, gameId: string }>(UPDATE_GAME, {
        update: (_, { data }) => {
            data?.updateGame.id && setSession(data?.updateGame.id);
            localStorage.setItem("session", data?.updateGame.id || "");
            localStorage.setItem("pnum", CONFIG.player2.toString());
            data?.updateGame && setStage(getStage(data.updateGame));
        },
        onError: () => setStage("ERROR")
    });

    useEffect(() => {
        setStage(event)
    }, [event])

    const enterName = (e: any) => {
        const { key, target: { value } } = e;
        if (key === "Enter" && value !== "") {
            e.target.value = "";
            localStorage.setItem("playerName", playerName);
            setStage("JOIN_GAME");
        }
        return;
    }

    const joinGame = (e: any) => {
        const { key, target: { value } } = e;
        if (key === "Enter" && value !== "") {
            e.target.value = "";
            updateGame({ variables: { name: playerName, gameId: value } });
        }
        return;
    }

    switch (stage) {
        case "GAME_START":
            return <input className="text-input-lg vm-md" placeholder="Enter Name" onChange={(e) => setName(e.target.value)} onKeyUp={enterName} />;
        case "JOIN_GAME":
            return <JoinGame joinGame={joinGame} createGame={createGame} />
        case "WAITING_FOR_PLAYER":
            return <Waiting session={session} />
        case "MY_TURN":
            return <MyTurn />
        case "WAITING_FOR_TURN":
            return <h1 className="vm-md">Guess the word!</h1>
        case "GAME_OVER":
            return <h1 className="vm-md">{gameOver}</h1>;
        case "ERROR": return <h1>Something went wrong. Please try later  🙁</h1>
        default:
            return <h1>Welcome to Hints!</h1>;
    }
}

export default Game;