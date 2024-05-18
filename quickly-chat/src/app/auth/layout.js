const AuthLayout = ({children}) => {
    return (
        <div className="bg-black h-screen flex flex-col 
        lg:flex-row bg-cover bg-login">
            <div className="lg:w-5/12 h-32 flex-initial">
            </div>
            <div className="flex-1">

            </div>
            <div className="absolute ml-auto mr-auto left-0 right-0 top-12 lg:top-44">
                {children}
            </div>
            
        </div>
    )
}

export default AuthLayout