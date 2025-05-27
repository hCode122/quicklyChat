'use client'

import { createContext, useState } from "react";

export const TargetContext = createContext()



    export const TargetContextProvider = ({children}) => {
        const [target, setTarget] = useState()
        const [socketContext, setSoc] = useState()
        return (
            <TargetContext.Provider value={{target, setTarget, socketContext, setSoc}}>
                {children}
            </TargetContext.Provider>
        )

    }