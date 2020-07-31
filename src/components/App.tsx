import React, { FunctionComponent, useState, useContext } from 'react';
import { useQuery, useSubscription, useMutation } from '@apollo/client';

import CONFIG from '../config';
import NavBar from './NavBar';
import GameContent from './Game';
import { Game, Event, SessionContextType, Player } from '../types';
import { getStage } from '../utils';
import { SessionContext } from '../sessionContext';
import { GET_GAME, CURRENT_PLAYER, END_GAME, GAME_OVER } from '../graphql';

const bgColor = CONFIG.backgroundColors[Math.random() * CONFIG.backgroundColors.length | 0];

const App: FunctionComponent = () => {
    // Context
    const { session } = useContext<SessionContextType>(SessionContext);

    // State
    const [gameOver, setGameOver] = useState<string | undefined>();
    const [players, setPlayers] = useState<{player1: Player, player2: Player}>();
    const [event, setEvent] = useState<Event>("GAME_START");

    // GraphQL
    const { loading, error: getErr } = useQuery<GameData, GameVars>(
        GET_GAME,
        { 
            variables: { gameId: session || "" },
            onCompleted: (data) => {
                if(data?.getGame) {
                    setEvent(getStage(data.getGame));
                    setPlayers({
                        player1: data.getGame.player1,
                        player2: data.getGame.player2
                    });
                }
            }
        },
    
    );

    const { error: updateErr} = useSubscription<{ getCurrentPlayer: Game }, { gameId: string }>(CURRENT_PLAYER, {
        variables: { gameId: session || "" },
        onSubscriptionData: ({ subscriptionData }) => {
            const { data } = subscriptionData;
            if(data?.getCurrentPlayer) {
                setEvent(getStage(data.getCurrentPlayer));
                setPlayers({
                    player1: data.getCurrentPlayer.player1,
                    player2: data.getCurrentPlayer.player2
                });
            }
        }
    });

    useSubscription<{ endGame: {result: string} }, { gameId: string }>(GAME_OVER, {
        variables: { gameId: session || "" },
        onSubscriptionData: ({ subscriptionData }) => {
            const { data } = subscriptionData;
            if(data?.endGame.result) {
                setEvent("GAME_OVER");
                setGameOver(data?.endGame.result);
            }
            localStorage.clear();
        }
    });

    const [endGame, {error: endErr}] = useMutation<{ endGame: string }, { gameId: string }>(END_GAME, {
        variables: {
            gameId: session
        },
        update: (_, result) => {
            const { data } = result;
            if(data?.endGame) {
                setEvent("GAME_OVER");
                setGameOver(data.endGame);
            }
            localStorage.clear();
        }
    });

    (getErr || updateErr || endErr) && setEvent("ERROR");

    const { player1, player2 } = players || {};

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
                                <div className="float-left m-xs">
                                    <h1>hints</h1>
                                    <h5>Made with &#128155; by Aishwarya</h5>
                                </div>
                                { (event === "WAITING_FOR_TURN" || event === "MY_TURN") && <button className="primary-button-sm float-right end-game-btn hm-xs text-center" onClick={() => endGame()}>End Game</button> }
                                { event === "GAME_OVER" && <button className="primary-button-sm float-right end-game-btn hm-xs text-center" onClick={() =>  window.location.reload()}>Restart</button> }
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

export default App;