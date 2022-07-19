import { Link, useParams } from "react-router-dom";
import MessageDisplay from "../messages/MessageDisplay";
import {db} from '../../firebase/FirebaseHelper'
import {query, where, collection, getDocs} from 'firebase/firestore'
import { CurrentUserContext } from "../workspace/Workspace";
import { useContext, useEffect, useState } from "react";

const NotificationContainer = () => {
    
    const currentUserID = useContext(CurrentUserContext)
    const [messageInviteWorkspace, setMessageInviteWorkspace] = useState([])
    const [messageInviteBoard, setMessageInviteBoard] = useState([])
    const [messageInviteCardWatcher, setMessageInviteCardWatcher] = useState([])
    const [notificationWorkspace, setNotificationWorkspace] = useState([])
    const [notificationMentionedCard, setNotificationMentionedCard] = useState([])

    const takeMessages = () => {
        if(currentUserID != undefined) {
            let invitationWorkspaceArray = []
            let invitationBoardArray = []
            let invitationCardWatcherArray = []
            let notificationWorkspaceArray = []
            let notificationMentionedArray = []

            const queryStatement = query(collection(db, 'Messages'), where('receiver', '==', currentUserID))
            getDocs(queryStatement).then(res => {
                res.forEach(item => {
                    if(item.data().type === 'invitationWorkspaceMember'){
                        invitationWorkspaceArray.push({...item.data(), messageID:item.id})
                        setMessageInviteWorkspace(invitationWorkspaceArray)
                    } else if(item.data().type === 'invitationBoardMember') {
                        invitationBoardArray.push({...item.data(), messageID:item.id})
                        setMessageInviteBoard(invitationBoardArray)
                    } else if(item.data().type === 'invitationCardWatcher'){
                        invitationCardWatcherArray.push({...item.data(), messageID:item.id})
                        setMessageInviteCardWatcher(invitationCardWatcherArray)
                    }
                })
            })
            getDocs(query(collection(db, 'Notifications'), where('workspaceMember', 'array-contains', currentUserID)))
            .then(res => {
                res.forEach(item => {
                    notificationWorkspaceArray.push({...item.data()})
                    setNotificationWorkspace(notificationWorkspaceArray)
                })
            })
            getDocs(query(collection(db, 'CardMentions'), where('receiver', '==', currentUserID)))
            .then(res => {
                res.forEach(item => {
                    notificationMentionedArray.push({...item.data()})
                    setNotificationMentionedCard(notificationMentionedArray)
                })
            })
        }
    }
    
    useEffect(()=>{
        takeMessages()
    },[])
    
    let count = 0
    return ( 
        <div className="">
            <div className="bg-blue-200/50 flex flex-col p-0.5 font-mono text-2xl items-center rounded w-96 h-80 overflow-y-auto">
                {messageInviteWorkspace.map((item) => (
                    <div key={count} className="p-2">
                        <div className="bg-blue-500 m-2 mb-4 p-2 rounded text-white"> you have been invited to
                        <Link to={`/invitation/workspace/${item.message}/${currentUserID}/${item.workspaceTitle}/${item.messageID}`} className="text-black hover:text-white"> {item.workspaceTitle}</Link> workspace :3</div>
                    </div>
                ))}
                {messageInviteBoard.map((item) => (
                    <div key={count} className="p-2">
                        <div className="bg-blue-500 m-2 mb-4 p-2 rounded text-white"> you have been invited to
                        <Link to={`/invitation/board/${item.message}/${currentUserID}/${item.boardTitle}/${item.messageID}`} className="text-black hover:text-white"> {item.boardTitle}</Link> board :3</div>
                    </div>
                ))}
                {notificationWorkspace.map((item) => (
                    <div key={count} className="p-2">
                    <div className="bg-blue-500 m-2 mb-4 p-2 rounded text-white"> 
                        {item.invited} has joined {item.workspaceTitle} workspace!
                    </div>
                </div>
                ))}
                {notificationMentionedCard.map((item) => (
                    <div key={count} className="p-2">
                    <div className="bg-blue-500 m-2 mb-4 p-2 rounded text-white"> 
                        you has been mentioned in <Link to={`/card/${item.workspaceID}/${item.boardID}/${currentUserID}/${item.boardTitle}/`} className="text-black hover:text-white"> {item.cardTitle}</Link> card!
                    </div>
                </div>
                ))}
            </div>
        </div>
    );
}
 
export default NotificationContainer;