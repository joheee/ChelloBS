import { arrayUnion, doc, updateDoc, query, where, collection, getDocs, deleteField, deleteDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import {db} from '../../firebase/FirebaseHelper'

const InvitationWorkspacePageContainer = () => {

    const {workspaceID, userID, title, messageID, boardID, cardListID, cardID} = useParams()
    const navigate = useNavigate()
    
    const deleteMessage = (text) => {
        if(workspaceID !== undefined) {
            console.log(boardID)
            const queryStatementWorkspace = query(collection(db, 'Messages'), where('message', '==', workspaceID), where('receiver', '==', userID), where('workspaceTitle', '==', title))
            getDocs(queryStatementWorkspace).then(e => {
                e.forEach(item => {
                    deleteDoc(item.ref).then(() => {
                        alert(text)
                        navigate(`/workspace/${userID}`)
                    })
                })
            })
        }
        else if(boardID !== undefined && cardListID === undefined && cardID === undefined){
            console.log(boardID)
            const queryStatementBoard = query(collection(db, 'Messages'), where('message', '==', boardID), where('receiver', '==', userID), where('boardTitle', '==', title))
            getDocs(queryStatementBoard).then(e => {
                e.forEach(item => {
                    deleteDoc(item.ref).then(() => {
                        alert(text)
                        navigate(`/workspace/${userID}`)
                    })
                })
            })
        }
        else if(boardID !== undefined && cardListID !== undefined && cardID !== undefined){
            console.log(boardID)
            const queryStatementBoard = query(collection(db, 'Messages'), 
            where('boardID', '==', boardID), 
            where('cardID', '==', cardID), 
            where('cardListID', '==', cardListID),
            where('receiver', '==', userID), 
            where('cardTitle', '==', title))
            getDocs(queryStatementBoard).then(e => {
                console.log(e.empty)
                e.forEach(item => {
                    deleteDoc(item.ref).then(() => {
                        alert(text)
                        navigate(`/workspace/${userID}`)
                    })
                    console.log(item.data())
                })
            })
        }
    }

    const handleRejectWorkspaceInvitation = () => {
        deleteMessage(`reject ${title}\'s invitation`)
    }
    const handleAcceptWorkspaceInvitation = () => {
        updateDoc(doc(db, 'Workspaces', workspaceID), {
            workspaceMember: arrayUnion(userID)
        }).then(e => {
            deleteMessage(`succes join ${title}\'s workspace`)
        })
    }
    
    const handleRejectBoardInvitation = () => {
        deleteMessage(`reject ${title}\'s invitation`)
    }
    
    const handleAcceptBoardInvitation = () => {
        updateDoc(doc(db, 'Boards', boardID), {
            boardMember: arrayUnion(userID)
        }).then(e => {
            deleteMessage(`succes join ${title}\'s board`)
        })
    }
    
    const handleRejectCardInvitation = () => {
        deleteMessage(`reject ${title}\'s card`)
    }
    
    const handleAcceptCardInvitation = () => {
        updateDoc(doc(db, 'Boards', boardID, 'CardLists', cardListID, 'Cards', cardID), {
            cardWatcher: arrayUnion(userID)
        }).then(e => {
            deleteMessage(`succes join ${title}\'s card`)
        })
    }
    
    if(workspaceID !== undefined){
        return ( 
            <div>
            <div className="bg-blue-400 p-5 flex items-center gap-5 justify-center h-screen">
            
                <div className="text-7xl font-black text-white m-5">{title} workspace</div>
                <div className="bg-green-200 p-2 font-mono rounded">
                    <button onClick={() => handleAcceptWorkspaceInvitation()} className="font-black text-3xl my-3">accept</button>
                </div>
                <div className="bg-red-200 p-2 font-mono rounded">
                    <button onClick={()=> handleRejectWorkspaceInvitation()} className="font-black text-3xl my-3">reject</button>
                </div>
            </div>
        </div>
        )
    }
    
    else if(boardID !== undefined && cardListID === undefined && cardID === undefined){
        return ( 
            <div>
            <div className="bg-blue-400 p-5 flex items-center gap-5 justify-center h-screen">
            
                <div className="text-7xl font-black text-white m-5">{title} board</div>
                <div className="bg-green-200 p-2 font-mono rounded">
                    <button onClick={() => handleAcceptBoardInvitation()} className="font-black text-3xl my-3">accept</button>
                </div>
                <div className="bg-red-200 p-2 font-mono rounded">
                    <button onClick={()=> handleRejectBoardInvitation()} className="font-black text-3xl my-3">reject</button>
                </div>
            </div>
        </div>
        )
    }
    
    else if(boardID !== undefined && cardListID !== undefined && cardID !== undefined){
        console.log(cardListID)
        console.log(cardID)
        return ( 
            <div>
            <div className="bg-blue-400 p-5 flex items-center gap-5 justify-center h-screen">
            
                <div className="text-7xl font-black text-white m-5">{title} card</div>
                <div className="bg-green-200 p-2 font-mono rounded">
                    <button onClick={() => handleRejectCardInvitation()} className="font-black text-3xl my-3">accept</button>
                </div>
                <div className="bg-red-200 p-2 font-mono rounded">
                    <button onClick={()=> handleAcceptCardInvitation()} className="font-black text-3xl my-3">reject</button>
                </div>
            </div>
        </div>
        )
    }
}
 
export default InvitationWorkspacePageContainer;