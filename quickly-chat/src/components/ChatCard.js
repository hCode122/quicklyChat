const ChatCard = ({name, lastM}) => {
    const date = new Date(lastM.date) 
    const time = date.getHours() + ':' + date.getMinutes()
    return(
    <div className="clickable flex-initial border-b-4 border-black bg-orange-500
    flex gap-2 flex-row h-16">
        <div className="bg-userPic1 bg-white border-2 border-black rounded-2xl  w-12 h-12 flex-initial mt-2  ml-2">
        </div>
        <div className="flex text-black-2 pt-1 flex-1 h-16 flex-col">
            <div className="flex flex-row gap-4 justify-between ">
                <div className="font-bold text-xl flex-1">{name}</div>
                <div className="pt-1 mr-3 text-sm w-8"> {time}</div>
            </div>
            <div className="overflow-hidden text flex-1"> 
                {lastM.text}
            </div>
            
        </div>
    </div>
    )
    
  }

export default ChatCard;