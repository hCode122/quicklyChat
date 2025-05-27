import { useAuthContext } from "./useAuthContext";
import { useRouter } from 'next/navigation'


export const useLogout = () => {
    const router = useRouter();
    const {dispatch} = useAuthContext()
    const logout = () => {
        localStorage.removeItem("user");
        dispatch({type:"LOGOUT"})
        router.push("/auth")
    }

    return {logout}
}