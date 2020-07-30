import React, {FunctionComponent} from 'react';

type Props = {
    joinGame: (e: any) => void,
    createGame: Function
};

const JoinGame:FunctionComponent<Props> = ({joinGame, createGame}) => {
    return (
        <div className="flex-col align-center">
            <input className="text-input-md" placeholder="Enter Game ID" onKeyUp={joinGame} />
            <i className="vm-md font-lg">Or</i>
            <button className="primary-button-lg" onClick={() => createGame()}>New Game</button>
        </div>
    )
}

export default JoinGame;
