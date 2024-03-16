'use client'

import { createContext, useState } from "react";

export const TargetContext = createContext()



    export const TargetContextProvider = ({children}) => {
        const [target, setTarget] = useState()
        const [socket, setSoc] = useState()
        return (
            <TargetContext.Provider value={{target, setTarget, socket, setSoc}}>
                {children}
            </TargetContext.Provider>
        )

    }