import {TargetContext} from "../context/targetContext"
import { useContext } from "react"

export const useTargetContext = () => {
    const context = useContext(TargetContext)

    if (!context) {
        throw Error("useTargetContext must be used inside an TargetContextProvider")
    }

    return context
}