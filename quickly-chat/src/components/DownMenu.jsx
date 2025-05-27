import React from "react"
import { useLogout } from "../../hooks/useLogout";
import Link from "next/link";
const DownMenu =(props,ref) => {
    
    const {logout} = useLogout()
 

    return (
        <div ref={ref} className="absolute right-10 top-2 bg-black-3 border-2 border-grey-700
        text-white rounded-lg p-2">
            <ol className="text-orange-500 font-bold">
                <li onClick={() => logout()} className="clickable2 p-1 rounded-lg">
                     logout 
                </li>
                <li className="clickable2 p-1 rounded-lg mt-2">
                <Link href="/settings"> Settings </Link>
                </li>
            </ol>
        </div>
    )
}

export default React.forwardRef(DownMenu)