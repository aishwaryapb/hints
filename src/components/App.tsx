import React, { FunctionComponent, useState, useContext } from 'react';
import { gql, useQuery, useSubscription } from '@apollo/client';

import CONFIG from '../config';
import NavBar from './NavBar';
import GameContent from './Game';
import { Game, Event, SessionContextType } from '../types';
import { getStage } from '../utils';
import { SessionContext } from '../sessionContext';

const bgColor = CONFIG.backgroundColors[Math.random() * CONFIG.backgroundColors.length | 0];

const App: FunctionComponent = () => {
    const { session } = useContext<SessionContextType>(SessionContext);
    let event: Event = "GAME_START";
    const [game, setGame] = useState<Game | undefined>();
    const { loading, data, error } = useQuery<GameData, GameVars>(
        GET_GAME,
        { variables: { gameId: session || "" } },
    );
    const { getGame } = data || {};

    const { error: subError } = useSubscription<{ getCurrentPlayer: Game }, { gameId: string }>(CURRENT_PLAYER, {
        variables: { gameId: session || "" },
        onSubscriptionData: ({ subscriptionData }) => {
            const { data } = subscriptionData;
            data?.getCurrentPlayer && setGame(data.getCurrentPlayer);
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
                                <GameContent event={event} />
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

export default App;