import { Game, Event } from './types';

export const getStage = (game: Game): Event => {
    if (!game.player2.name) return "WAITING_FOR_PLAYER";
    if (game.currentPlayer === parseInt(localStorage.getItem('pnum') || "")) return "MY_TURN"
    else return "WAITING_FOR_TURN";
}

export const getTime = (s: number):string => {
    if(s === 0) return "";
    if(s <= 60) return s + "s";

    const minutes = Math.floor(s / 60);
    const seconds = s % 60;
    const padLeft = (str:number, pad:string, length:number) => {
        return (new Array(length + 1).join(pad)+str).slice(-length);
    }
    const finalTime = padLeft(minutes,'0', 2) + ':' + padLeft(seconds,'0', 2);

    return finalTime;
}