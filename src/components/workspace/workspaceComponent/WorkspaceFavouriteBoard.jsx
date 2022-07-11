import { doc, updateDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { db } from "../../../firebase/FirebaseHelper"

const WorkspaceFavouriteBoard = ({favouriteBoard, trigger}) => {
    console.log(trigger)
    const [loveColor, setLoveColor] = useState('bg-slate-400')
    const {id} = useParams()
    const navigate = useNavigate()
    
    console.log(id)
    
    const getLoveColor = () => {
        if(favouriteBoard.boardFavourite === true){
            setLoveColor('bg-pink-500')
        }else {
            setLoveColor('bg-slate-400')
        }
    }
    const favouriteBoardController = () => {
        updateDoc(doc(db, 'Boards', favouriteBoard.boardID), {
            boardFavourite: !favouriteBoard.boardFavourite
        }).then(e => {
            trigger[1](!trigger[0])
            navigate(`/refresh/${id}`)
        })
    }
    useEffect(() =>{
        getLoveColor()
    }, [trigger[0]])
    
    if(favouriteBoard !== undefined) {
        return ( 
            <div className="relative hover:scale-105 duration-300 cursor-pointer">
                <Link to={`/card/${favouriteBoard.workspaceID}/${favouriteBoard.boardID}/${id}/${favouriteBoard.boardTitle}`}>
                    <div  className="p-2 bg-blue-500 w-52 h-52 rounded flex justify-center items-center text-2xl">
                        <div className="text-white p-2 text-center">{favouriteBoard.boardTitle}</div>
                    </div>
                </Link>
                <div onClick={e => favouriteBoardController()} className={`p-2 absolute bottom-2 left-2 ${loveColor} px-4 hover:bg-slate-400/40 rounded text-white cursor-pointer fa-solid fa-heart`}></div> 
            </div>
        );
    
    }
}
 
export default WorkspaceFavouriteBoard;