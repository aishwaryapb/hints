import React, { FunctionComponent } from 'react';
import { Player } from '../types';

type Props = {
    player1: Player | undefined,
    player2: Player | undefined
}

const NavBar: FunctionComponent<Props> = ({ player1, player2 }) => (
    <div className="nav-bar">
        {
            player1?.name && player2?.name &&
            (
                <>
                    <div className="float-left flex-col">
                        <h3>{player1.name}</h3>
                        <h4>Score: {player1.score}</h4>
                    </div>
                    <div className="float-right flex-col">
                        <h3>{player2.name}</h3>
                        <h4>Score: {player2.score}</h4>
                    </div>
                </>
            )
        }
    </div>
)

export default NavBar;