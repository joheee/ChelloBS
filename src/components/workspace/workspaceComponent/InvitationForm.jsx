import { useEffect, useState } from 'react';
import {db} from '../../../firebase/FirebaseHelper'
import {query, collection, where, getDocs, addDoc} from 'firebase/firestore'
const InvitationForm = ({workspaceItem}) => {
    
    const [memberList, setMemberList] = useState([])
    const [errorMsg, setErrorMsg] = useState('')
    
    const getUnjoinedUser = () => {
        if(workspaceItem.workspaceMember != undefined) {
            console.log(workspaceItem)
            let workspaceMemberArray = []
            const queryStatement = query(collection(db, 'Users'), where('uid', 'not-in', workspaceItem.workspaceMember))
            getDocs(queryStatement).then(res => {
                res.forEach(item => {
                    workspaceMemberArray.push({userEmail:item.data().email, userID: item.data().uid})
                    setMemberList(workspaceMemberArray)
                    console.log(workspaceMemberArray)
                })
            })
        }
    }
    
    useEffect(()=>{
        getUnjoinedUser()
    },[workspaceItem])
    
        
    let inputTargetInviteMember = ''
    const handleChooseMember = (e) => {
        inputTargetInviteMember = e.target.value
        console.log(inputTargetInviteMember)
    }
    
    const handleMemberInvitation= () => {
        if(inputTargetInviteMember !== ''&& workspaceItem.currentUserID !== '' && workspaceItem.currentWorkspaceID !== '' && workspaceItem.workspaceTitle !== ''){
            const messagesRef = collection(db, 'Messages')
            addDoc(messagesRef, {
                receiver: inputTargetInviteMember,
                sender: workspaceItem.currentUserID,
                message: workspaceItem.currentWorkspaceID,
                workspaceTitle:workspaceItem.workspaceTitle,
                type : 'invitationWorkspaceMember'
            }).then((e)=> {
                alert('success invite ' + e.id)
                setErrorMsg('')
            })
        } else setErrorMsg('choose a user!')
    }
    
    const handleGenerateLink = () => {
        if(inputTargetInviteMember !== ''&& workspaceItem.currentUserID !== '' && workspaceItem.currentWorkspaceID !== '' && workspaceItem.workspaceTitle !== ''){
            const messagesRef = collection(db, 'Messages')
            addDoc(messagesRef, {
                receiver: inputTargetInviteMember,
                sender: workspaceItem.currentUserID,
                message: workspaceItem.currentWorkspaceID,
                workspaceTitle:workspaceItem.workspaceTitle,
                type : 'invitationWorkspaceMember'
            }).then((e)=> {
                let link = `localhost:3000/invitation/workspace/${workspaceItem.currentWorkspaceID}/${inputTargetInviteMember}/${workspaceItem.workspaceTitle}/${e.id}`
                console.log(link)
                alert('copied this ' + link)
                setErrorMsg('')
            })
        } else setErrorMsg('choose a user!')
    }
    
    if(workspaceItem != []){
        let count = 0
        return (
            <div className="bg-blue-200 flex flex-col font-mono text-2xl items-center rounded m-5">
                <div className="p-2 flex flex-col items-center gap-4">
                    <div className="text-4xl font-black text-white bg-fuchsia-500 text-center break-words w-96 py-2 rounded">invite to <br/> workspace</div>
                    
                    <div className="text-red-500 font-black text-3xl">{errorMsg}</div>
                    <select onChange={e => handleChooseMember(e)} className=" w-full p-2 rounded cursor-pointer">
                    {memberList.map((member) => (
                        <option key={count++} value={member.userID} className="text-center">{member.userEmail}</option>
                    ))}
                        <option value="" className="text-center">empty</option>
                    </select>
                    <button onClick={() => handleMemberInvitation()} className="bg-blue-500/80 p-2  rounded hover:bg-blue-500/40 text-white w-full">add member</button>
                    <button onClick={() => handleGenerateLink()} className="text-blue-500/80 p-2 rounded hover:bg-white/40 bg-white w-full">generate link</button>
                </div>
            </div>
        )
    }     
}
 
export default InvitationForm;