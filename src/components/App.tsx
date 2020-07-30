import React, { FunctionComponent, useState, useContext } from 'react';
import { gql, useQuery, useSubscription, useMutation } from '@apollo/client';

import CONFIG from '../config';
import NavBar from './NavBar';
import GameContent from './Game';
import { Game, Event, SessionContextType } from '../types';
import { getStage } from '../utils';
import { SessionContext } from '../sessionContext';

const bgColor = CONFIG.backgroundColors[Math.random() * CONFIG.backgroundColors.length | 0];

const App: FunctionComponent = () => {
    const { session } = useContext<SessionContextType>(SessionContext);
    const [gameOver, setGameOver] = useState<string | undefined>();
    const [game, setGame] = useState<Game | undefined>();
    const { loading, data, error } = useQuery<GameData, GameVars>(
        GET_GAME,
        { variables: { gameId: session || "" } },
    );
    const { getGame } = data || {};
    let event: Event = gameOver ? "GAME_OVER" : "GAME_START";

    const { error: subError } = useSubscription<{ getCurrentPlayer: Game }, { gameId: string }>(CURRENT_PLAYER, {
        variables: { gameId: session || "" },
        onSubscriptionData: ({ subscriptionData }) => {
            const { data } = subscriptionData;
            data?.getCurrentPlayer && setGame(data.getCurrentPlayer);
        }
    });

    const [endGame] = useMutation<{ endGame: string }, { gameId: string }>(END_GAME, {
        variables: {
            gameId: session
        },
        update: (_, result) => {
            const { data } = result;
            data?.endGame && setGameOver(data.endGame);
            localStorage.clear();
        }
    });

    getGame && (event = getStage(game || getGame));
    (error || subError) && (event = "ERROR");

    const { player1, player2 } = game || getGame || {};

    return (
        <div className={`flex-col container ${bgColor}`}>
            {
                loading
                    ? <h1>Loading...</h1>
                    : (
                        <>
                            <NavBar
                                player1={player1}
                                player2={player2}
                            />
                            <div className="main">
                                <GameContent event={event} gameOver={gameOver}/>
                            </div>
                            <div className='w-full footer'>
                                <div className="float-left hm-xs">
                                    <h1>hints</h1>
                                    <h5>Made with &#128155; by Aishwarya</h5>
                                </div>
                                <button className="primary-button-sm float-right end-game-btn hm-xs text-center" onClick={() => endGame()}>End Game</button>
                            </div>
                        </>
                    )
            }
        </div>
    );
}

type GameVars = {
    gameId: String
}

type GameData = {
    getGame: Game
}

const GET_GAME = gql`
    query getGame($gameId: String!) {
        getGame(gameId: $gameId) {
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

const CURRENT_PLAYER = gql`
  subscription getCurrentPlayer($gameId: String!) {
    getCurrentPlayer(gameId: $gameId) {
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

const END_GAME = gql`
    mutation endGame($gameId: String!) {
        endGame(gameId: $gameId) 
    }
`;

export default App;