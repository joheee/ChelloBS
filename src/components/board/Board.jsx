import NavBar from "../navigationBar/NavigationBar";
import { Link, useParams } from "react-router-dom";
import { doc, getDoc, addDoc, collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../../firebase/FirebaseHelper'
import { createContext, useEffect, useState } from "react";
import WorkspaceMember from "./WorkspaceMember";
import WorkspaceAdmin from "./WorkspaceAdmin";
import InvitationForm from "./InvitationForm";
import MessageDisplay from '../messages/MessageDisplay'
export const WorkspaceContext = createContext()

const BoardContainer = () => {
    
    const {workspaceID, userID} = useParams()
    const [workspaceIdentity, setWorkspaceIdentity] = useState([])
    const [inviteBool, setInviteBool] = useState(false)
    const [memberBool, setMemberBool] = useState(false)
    
    const getMemberAdmin = () => {
        const docRef = doc(db,'Workspaces', workspaceID)
        const currentDoc =  getDoc(docRef).then((e) => {
            let workspaceData = {
                currentWorkspaceID: '',
                currentUserID: '',
                workspaceTitle:'',
                workspaceAdmin:[],
                workspaceMember:[]
            }
            workspaceData.currentWorkspaceID = workspaceID
            workspaceData.currentUserID = userID
            workspaceData.workspaceTitle = e.data().workspaceTitle
            workspaceData.workspaceAdmin = e.data().workspaceAdmin
            workspaceData.workspaceMember = e.data().workspaceMember    
            setWorkspaceIdentity(workspaceData)
        })
    }
    
    useEffect(()=>{
        getMemberAdmin()
    }, [])
    
    const InvitationFormToggle = () => {
        if(inviteBool === true){
            return ( 
                <InvitationForm/>
            )
        }
    }
    const WorkspaceAdminMemberToggle = () => {
        if(memberBool === true) {
            return (
                <div className="bg-blue-200/50 flex flex-col p-4 font-mono text-2xl items-center w-96 rounded m-5">
                    <div className="p-2 gap-10">
                        <WorkspaceAdmin /> 
                        <WorkspaceMember />
                    </div>
                </div>
            )
        }
    }
    const InviteMemberButtonToggle = () => {
        return (
            <div className="bg-blue-200/50 flex p-6 font-mono text-2xl justify-evenly items-center w-96 rounded ml-5 mt-5 mr-5">
                <button onClick={() => setInviteBool(!inviteBool)} className="bg-blue-500 px-7 py-0.5 rounded hover:bg-blue-500/50 text-white">invite</button>
                <button onClick={() => setMemberBool(!memberBool)} className="bg-blue-500 px-7 py-0.5 rounded hover:bg-blue-500/50 text-white">member</button>
            </div>
        )
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
            boardStatus: true,
            boardAdmin:[userID],
            boardMember:[userID]
        }).then(e => {
            setErrorMsg('')
            alert(`success create new board ${boardTitleInput}`)
            setPopUpBool(!popUpBool)
            setTrigger(!trigger)
        })
    }
    
    const [renderBoard, setRenderBoard] = useState([])
    const [saveBoardID, setSaveBoardID] = useState([])
    const boardRender = () => {
        let currentBoard = []
        let currentBoardID = []
        const queryStatement = query(collection(db,'Boards'), where('boardMember' ,'array-contains', userID), where('workspaceID', '==', workspaceID))
        getDocs(queryStatement).then(e => {
            e.forEach(item => {
                currentBoard.push(item.data())
                setRenderBoard(currentBoard)
                
                currentBoardID.push(item.id)
                setSaveBoardID(currentBoardID)
            })
        })
    }
    
    const [trigger, setTrigger] = useState(false)
    useEffect(()=>{
        boardRender()
        console.log(renderBoard)
    },[trigger])
    
    const PopUpAddDisplay = () => {
        if(popUpBool === true) {
            return (
                <div className="h-full w-full bg-black/30 fixed">
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
        let count = 0
        if(renderBoard != []){
            return (
                renderBoard.map((item) => ((
                    <div key={count}>
                        <Link to={`/card/${workspaceID}/${saveBoardID[count++]}/${userID}/${item.boardTitle}`}>
                            <div  className="p-2 bg-blue-500 w-64 h-64 rounded flex justify-center items-center">
                                <div className="text-white p-2 text-center">{item.boardTitle}</div>
                            </div>
                        </Link>
                    </div>
                )))
            )
        }
    }
    
    if(workspaceIdentity != []) {
        return ( 
            <div>
                <PopUpAddDisplay/> 
                
                <NavBar id={userID}/>
                    
                <WorkspaceContext.Provider value={workspaceIdentity}>
                    <div className="text-7xl font-black text-blue-500 my-5 text-center">{workspaceIdentity.workspaceTitle}'s workspace</div>
                    <div className="flex justify-center">
                        <div className="">
                            <InviteMemberButtonToggle/>
                            <InvitationFormToggle/>
                            <WorkspaceAdminMemberToggle/>
                        </div>
                        
                        <div className="bg-blue-200/50 flex p-5 font-mono text-2xl gap-5 items-start flex-wrap w-screen rounded mr-5 my-5">
                            
                            <BoardList/>
                            
                            <button onClick={e => setPopUpBool(!popUpBool)} className="p-2 bg-blue-500/80 hover:bg-blue-500/40 w-64 rounded text-white">+ add board</button>
                        </div>
        
                    </div>
                </WorkspaceContext.Provider>
            </div>
        );
    }
}
 
export default BoardContainer