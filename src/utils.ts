import { Game, Event } from './types';

export const getStage = (game: Game): Event => {
    if (!game.player2.name) return "WAITING_FOR_PLAYER";
    if (game.currentPlayer === parseInt(localStorage.getItem('pnum') || "")) return "MY_TURN"
    else return "WAITING_FOR_TURN";
}