import React, { FunctionComponent } from 'react';
import { Player } from '../types';
import CONFIG from '../config';

type Props = {
    player1: Player | undefined,
    player2: Player | undefined
}

const NavBar: FunctionComponent<Props> = ({ player1, player2 }) => {
    return (
        <div className={`nav-bar ${player2?.name ? 'border-bottom' : ''}`}>
            {
                player1?.name && player2?.name &&
                (
                    <>
                        <div className="float-left flex-col thin-text">
                        <h2 className={localStorage.getItem('pnum') === CONFIG.player1.toString() ? "glowing" : ""}>
                            {player1.name}
                        </h2>
                        <h3 className={localStorage.getItem('pnum') === CONFIG.player1.toString() ? "glowing" : ""}>
                            Score: {player1.score}
                        </h3>
                        </div>
                        <div className="float-right flex-col thin-text">
                            <h2 className={localStorage.getItem('pnum') === CONFIG.player2.toString() ? "glowing" : ""}>
                                {player2.name}
                            </h2>
                            <h3 className={localStorage.getItem('pnum') === CONFIG.player2.toString() ? "glowing" : ""}>
                                Score: {player2.score}
                            </h3>
                        </div>
                    </>
                )
            }
        </div>
    )
}

export default NavBar;