'use client'

import { createContext, useState } from "react";

export const TargetContext = createContext()



    export const TargetContextProvider = ({children}) => {
        const [target, setTarget] = useState()
        return (
            <TargetContext.Provider value={{target, setTarget}}>
                {children}
            </TargetContext.Provider>
        )

    }