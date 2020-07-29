import React, { createContext, useState } from 'react';
import { SessionContextType } from './types';

type Props = {
    children: React.ReactNode
}

const initialState = {
    session: localStorage.getItem("session") || "",
    setSession: () => { }
}

const SessionContext = createContext<SessionContextType>(initialState)

const SessionProvider: React.FC<Props> = ({ children }) => {
    const [session, setSession] = useState<string>(initialState.session);
    return (
        <SessionContext.Provider value={{ session, setSession }}>
            {children}
        </SessionContext.Provider>
    )
}

export { SessionContext, SessionProvider };