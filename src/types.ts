import { SetStateAction } from 'react';

export type Event = "GAME_START" | "JOIN_GAME" | "WAITING_FOR_PLAYER" | "WAITING_FOR_TURN" | "MY_TURN" | "ERROR";

export type Player = {
    name: string | null,
    score: number | null
};

export type Game = {
    id: string,
    player1: Player,
    player2: Player,
    currentPlayer: number
}

export type SessionContextType = {
    session: string,
    setSession: React.Dispatch<SetStateAction<string>>
}
