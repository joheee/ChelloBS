import { Link } from "react-router-dom";
import MessageDisplay from "../messages/MessageDisplay";
import {db} from '../../firebase/FirebaseHelper'
import {query, where, collection, getDocs} from 'firebase/firestore'
import { CurrentUserContext } from "../workspace/Workspace";
import { useContext, useEffect, useState } from "react";

const NotificationContainer = () => {
    
    const currentUserID = useContext(CurrentUserContext)
    const [messages, setMessages] = useState([])
    const [messageID, setMessageID] = useState([])
    
    const takeMessages = () => {
        if(currentUserID != undefined) {
            let invitationArray = []
            let deletionArray = []
            
            let messageIDArray = []
            const queryStatement = query(collection(db, 'Messages'), where('receiver', '==', currentUserID))
            getDocs(queryStatement).then(res => {
                res.forEach(item => {
                    messageIDArray.push(item.id)
                    setMessageID(messageIDArray)
                    // console.log(messageIDArray)
                    if(item.data().type ==='invitation'){
                        invitationArray.push(item.data())
                        setMessages(invitationArray)
                        // console.log(invitationArray)
                    } else {
                        deletionArray.push(item.data())
                        setMessages(deletionArray)
                        // console.log(deletionArray)
                    }
                })
            })
        }
    }
    
    useEffect(()=>{
        takeMessages()
    },[])
    
    const fruit =[1,2,3,4]
    
    let count = 0
    if(messages != []) {
        return ( 
            <div className="">
                <div className="bg-blue-200/50 flex flex-col p-0.5 font-mono text-2xl items-center rounded w-96 h-80 m-5 overflow-y-auto">
                    {messages.map((item) => (
                        <div key={count} className="p-2">
                            <div className="bg-blue-500 m-2 mb-4 p-2 rounded text-white"> you have been invited to
                            <Link to={`/invitation/${item.message}/${currentUserID}/${item.workspaceTitle}/${messageID[count++]}`} className="text-black hover:text-white"> {item.workspaceTitle}</Link> workspace :3</div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    
}
 
export default NotificationContainer;