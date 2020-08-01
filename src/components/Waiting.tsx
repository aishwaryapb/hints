import React, { FunctionComponent, useState } from 'react';
import Copy from '../assets/icons/copy.svg';

type Props = {
    session: string
};

const Waiting: FunctionComponent<Props> = ({ session }) => {

    const [isCopied, setIsCopied] = useState<boolean>(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(session || "");
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 3000);
    }

    return (
        <div className="flex-col align-center waiting-container">
            <h1 className="vm-md">Waiting for the other player to join</h1>
            <div className="flex-row h-v-center share-id-container">
                <h3>Share this ID - {session}</h3>
                <Copy className="icon hm-xs" onClick={handleCopy} />
                {isCopied && <span className="font-xs">Copied!</span>}
            </div>
        </div>
    )
}

export default Waiting;
