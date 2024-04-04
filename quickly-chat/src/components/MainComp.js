import { useEffect, useRef, useState } from "react";
import AddUsrMnu from "./AddUsrMnu";

const MainComp = ({ selected, setUi, children, user }) => {
  // handle outside click
  useEffect(() => {
    document.addEventListener('click', handleOutsideClick, true);
  }, [])

  const searchMenRef= useRef(null)
  const [searchMen, setSMen] = useState()

  const handleOutsideClick = (e) => {
    if (searchMenRef.current && !searchMenRef.current.contains(e.target)) {
      setSMen(null)
    }
  }

  
  if (user) {
    return (
      <div  className="h-screen flex flex-col bg-black-2">
        <div className="absolute bg-orange-500 h-16 w-60 border-orange-500 border-b rounded-b-full right-32 z-1"></div>
        <div className="bg-black"></div>
        <div id="upper" className=" flex-initial h-24 flex justify-center">
          <p className="w-40 text-black absolute h-10 text-2xl font-bold right-32 top-4 z-2">
            QuicklyChat
          </p>
        </div>
        <div className="absolute top-8 clickable2  left-64">
          <img className="w-8 h-10 m-auto" src="/images/menu.svg"></img>
        </div>
        <div></div>
        <div
          className="grid grid-cols-3 grid-rows-1 text-orange-300 text-center text-lg font-semibold
          "
        >
          <button
            name="contacts"
            onClick={() => setUi("contacts")}
            className={
              selected == "contacts"
                ? "active-btn col-start-1"
                : "base-btn col-start-1"
            }
          >
            <img className="w-14 h-14 m-auto" src="/images/contacts.svg"></img>
          </button>

          <button
            name="chats"
            onClick={() => setUi("chats")}
            className={
              selected == "chats"
                ? "active-btn col-start-2"
                : "base-btn col-start-2"
            }
          >
            <img className="w-14 h-14 m-auto" src="/images/msg.svg"></img>
          </button>

          <button
            name="groups"
            onClick={() => setUi("groups")}
            className={
              selected == "groups"
                ? "active-btn col-start-3"
                : "base-btn col-start-3"
            }
          >
            <img className="w-14 h-14 m-auto" src="/images/group.svg"></img>
          </button>
        </div>

        <div id="main" className="bg-black-3  flex flex-col flex-1">
          {children}
          {selected == "contacts" ? <AddCntBtn setSMen={() => setSMen}></AddCntBtn> : <></>}
          {searchMen && <AddUsrMnu setSMen={setSMen} ref={searchMenRef} name="menu" user={user}></AddUsrMnu>}
        </div>
      </div>
    );
  } else return (<div className="bg-black-2 w-full h-full">
     <img className="bg-black-2 w-18 h-18 m-auto"  src="/images/loader.svg">
     </img>
     </div>
     );
};

const AddCntBtn = ({setSMen}) => {

  return (
    <div onClick={setSMen(1)} className='w-14 h-14 clickable absolute bottom-4 right-4 rounded-full bg-orange-500 p-2'>
      <img src='/images/addU.svg'></img>
    </div>
  )
}


export default MainComp;
