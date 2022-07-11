import NavBar from "../navigationBar/NavigationBar";
import { useParams } from "react-router-dom";
import { doc, getDoc, addDoc, collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../../firebase/FirebaseHelper'
import { createContext, useEffect, useState } from "react";
import BoardItem from "./BoardItem";

export const triggerContext = createContext()

const BoardContainer = () => {
    
    const {workspaceID, userID} = useParams()
    const [workspaceIdentity, setWorkspaceIdentity] = useState([])
    
    const getMemberAdmin = () => {
        const docRef = doc(db,'Workspaces', workspaceID)
        getDoc(docRef).then((e) => {
            setWorkspaceIdentity({...e.data()})
        })
    }
    
    
    const [popUpBool, setPopUpBool] = useState(false)
    let boardTitleInput = ''
    const handleTitleInput = (e) => {
        boardTitleInput = e.target.value
    }
    
    const [errorMsg, setErrorMsg] = useState('')
    const handlePopUp = () => {
        if(boardTitleInput == ''){
            setErrorMsg('board title must be filled')
        } else {
            createNewBoard()
        }
    }
    
    const createNewBoard = () => {
        const docRef = collection(db, 'Boards')
        addDoc(docRef,{
            boardTitle: boardTitleInput,
            workspaceID:workspaceID,
            boardVisibility: 'public',
            boardStatus: true,
            boardFavourite: false,
            boardAdmin:[userID],
            boardMember:[userID]
        }).then(e => {
            setErrorMsg('')
            alert(`success create new board ${boardTitleInput}`)
            setPopUpBool(!popUpBool)
            setTrigger(!trigger)
        })
    }
    
    const getAdminIdentifier = (boardAdmin, userID) => {
        return boardAdmin.indexOf(userID)
    }
    
    const [renderBoard, setRenderBoard] = useState([])
    const boardRender = () => {
        let currentBoard = []
        const queryStatement = query(collection(db,'Boards'), where('boardMember' ,'array-contains', userID), where('workspaceID', '==', workspaceID))
        getDocs(queryStatement).then(e => {
            e.forEach(item => {
                let isAdmin = false
                if(getAdminIdentifier(item.data().boardAdmin, userID) != -1){
                    isAdmin = true
                }
                currentBoard.push({...item.data(), boardID:item.id, isAdmin:isAdmin})
                setRenderBoard(currentBoard)
            })
        })
    }
    
    const [trigger, setTrigger] = useState(false)
    useEffect(()=>{
        boardRender()
        getMemberAdmin()
    },[trigger])
    
    const AddNewBoardForm = () => {
        if(popUpBool === true) {
            return (
                <div className="h-full w-full bg-black/30 fixed z-10">
                    <div className="flex justify-center items-center h-full">
                        <div className="bg-white/80 px-10 py-7 rounded relative text-center flex flex-col items-center justify-center gap-2">
                            <button onClick={e => setPopUpBool(!popUpBool)} className="p-2 absolute top-2 right-2 bg-blue-500/80 hover:bg-blue-500/40 w-10 rounded text-white">x</button>
                            <div className="text-blue-500 text-xl font-bold">New Board</div>
                            <input onChange={e => handleTitleInput(e)} type="text" className="m-2 p-2 w-64 rounded" name="" id="" placeholder="board title"/>
                            <div className="text-red-500 text-xl font-bold">{errorMsg}</div>
                            <button onClick={e => handlePopUp(e)} className="p-2 bg-blue-500/80 hover:bg-blue-500/40 w-64 rounded text-white">create board</button>
                        </div>
                    </div>
                </div>
            )
        }
    }
    
    const BoardList = () => {
        return (
            renderBoard.map((item) => ((
                <BoardItem key={item.boardID} workspaceID={workspaceID} item={item} userID={userID}/>
            )))
        )
    }
    
    if(workspaceIdentity != []) {
        return ( 
            <div>
                <triggerContext.Provider value={[trigger, setTrigger]}>
                    <AddNewBoardForm/> 
                    
                    <NavBar id={userID}/>
                    
                    <div className="text-7xl font-black text-blue-500 m-5 text-center">{workspaceIdentity.workspaceTitle}'s workspace</div>
                    <div className="flex justify-center">
                        
                        <div className="bg-blue-200/50 flex p-5 font-mono text-2xl gap-5 items-start flex-wrap w-screen rounded m-5">
                            
                            <BoardList/>
                            
                            <button onClick={e => setPopUpBool(!popUpBool)} className="p-2 bg-blue-500/80 hover:bg-blue-500/40 hover:scale-105 duration-300 w-64 rounded text-white">+ add board</button>
                        </div>
        
                    </div>
                </triggerContext.Provider>
            </div>
        );
    }
}
 
export default BoardContainer