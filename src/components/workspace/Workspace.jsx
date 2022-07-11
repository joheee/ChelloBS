import { collection, onSnapshot, query, where } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase/FirebaseHelper";
import NavBar from "../navigationBar/NavigationBar";
import NotificationContainer from "../notification/Notification";
import WorkspaceFavouriteBoard from "./workspaceComponent/WorkspaceFavouriteBoard";
import WorkspaceItem from "./workspaceComponent/WorkspaceItem";
import WorkspaceSidebar from "./workspaceComponent/WorkspaceSidebar";

export const CurrentUserContext = createContext()
 
const Workspace = () => {
    
    const {id} = useParams()
    const [currentFavouriteBoard, setCurrentFavouriteBoard] = useState([])
    const [involvedBoard, setInvolvedBoard] = useState([])
    const getUserBoard = () => {
        let boardFavArr = []
        const queryStateFav = query(collection(db, 'Boards'), where('boardMember', 'array-contains', id), where('boardFavourite', '==', true))
        onSnapshot(queryStateFav, e => {
            e.forEach(board => {
                boardFavArr.push({...board.data(), boardID:board.id})
                setCurrentFavouriteBoard(boardFavArr)
            })
        })
        let boardInvolveArr = []
        const queryStateInvolve = query(collection(db, 'Boards'), where('boardMember', 'array-contains', id))
        onSnapshot(queryStateInvolve, e => {
            console.log(e.empty)
            e.forEach(board => {
                boardInvolveArr.push({...board.data(), boardID:board.id})
                setInvolvedBoard(boardInvolveArr)
            })
        })
    }
    const [currentWorkspace, setCurrentWorkspace] = useState([])
    const getUserWorkspace = () => {
        let workspaceFavArr = []
        const queryStateFav = query(collection(db, 'Workspaces'), where('workspaceMember', 'array-contains', id))
        onSnapshot(queryStateFav, e => {
            console.log(e.empty)
            e.forEach(workspace => {
                workspaceFavArr.push({...workspace.data(), workspaceID:workspace.id})
                setCurrentWorkspace(workspaceFavArr)
            })
        })
    }
    
    
    const [trigger, setTrigger] = useState(false)
    useEffect(e => {
        getUserBoard()
        getUserWorkspace()
    }, [trigger])

    return ( 
        <div className="">
            <CurrentUserContext.Provider value={id}>
                <div className="flex flex-col">
                    <div className="sticky top-0 z-10">
                        <NavBar id={id}/>
                        <WorkspaceSidebar/>
                    </div>
                    
                </div>
                <div className="flex justify-center w-full font-mono text-blue-500 ">
                    <div className="flex flex-col items-center gap-20 w-1/2">
                        
                        <div className="">
                            <div className="text-7xl font-black text-blue-500 my-5 text-center">your workspaces</div>
                            <div className="flex gap-4 justify-center flex-wrap">
                                {
                                currentWorkspace.map(workspace => (
                                    <WorkspaceItem key={workspace.workspaceID} yourWorkspace={workspace} trigger={[trigger, setTrigger]}/>
                                    ))
                                }
                            </div>
                        </div>
                        
                        <div className="">
                            <div className="text-7xl font-black text-blue-500 my-5 text-center">favourite boards</div>
                            
                            <div className="flex gap-4 justify-center flex-wrap">
                                {
                                    currentFavouriteBoard.map(board => (
                                        <WorkspaceFavouriteBoard key={board.boardID} favouriteBoard={board} trigger={[trigger, setTrigger]}/>
                                    ))
                                }
                            </div>
                        </div>
                        
                        <div className="">
                            <div className="text-7xl font-black text-blue-500 my-5 text-center">involved boards</div>
                            <div className="flex gap-4 justify-center flex-wrap">
                                {
                                    involvedBoard.map(board => (
                                        <WorkspaceFavouriteBoard key={board.boardID} favouriteBoard={board} trigger={[trigger, setTrigger]}/>
                                    ))
                                }
                            </div>
                        </div>
                        
                    </div>
                </div>
                    
                    <div className="fixed right-2 mr-10  top-8">
                        <div className="flex flex-col items-center">
                            <div className="text-7xl font-black text-blue-500 my-5">chatbox</div>
                            <NotificationContainer/>
                        </div>
                    </div>
            </CurrentUserContext.Provider>
        </div>
    );
}
 
export default Workspace;