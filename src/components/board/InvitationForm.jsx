import { useContext, useEffect, useState } from 'react';
import {WorkspaceContext} from './Board'
import {db} from '../../firebase/FirebaseHelper'
import {query, collection, where, getDocs, addDoc} from 'firebase/firestore'
const InvitationForm = () => {
    
    const [memberList, setMemberList] = useState([])
    const [errorMsg, setErrorMsg] = useState('')
    const workspaceItem = useContext(WorkspaceContext)
    
    const testFunction = () => {
        if(workspaceItem.workspaceMember != undefined) {
            console.log(workspaceItem)
            let workspaceMemberArray = []
            const queryStatement = query(collection(db, 'Users'), where('uid', 'not-in', workspaceItem.workspaceMember))
            let getQuery = getDocs(queryStatement).then(res => {
                res.forEach(item => {
                    workspaceMemberArray.push({userEmail:item.data().email, userID: item.data().uid})
                    setMemberList(workspaceMemberArray)
                    console.log(workspaceMemberArray)
                })
            })
        }
    }
    
    useEffect(()=>{
        testFunction()
    },[workspaceItem])
    
        
    let inputTargetInviteMember = ''
    const handleChooseMember = (e) => {
        inputTargetInviteMember = e.target.value
        console.log(inputTargetInviteMember)
    }
    
    const handleMemberInvitation= () => {
        // console.log('receiver member ' +  inputTargetInviteMember)
        // console.log('sender member ' +  workspaceItem.currentUserID)
        // console.log('messages ' +  workspaceItem.currentWorkspaceID)
        // console.log('workspaceTitle ' +  workspaceItem.workspaceTitle)
        // console.log('type invitation')
        if(inputTargetInviteMember !== ''&& workspaceItem.currentUserID !== '' && workspaceItem.currentWorkspaceID !== '' && workspaceItem.workspaceTitle !== ''){
            const messagesRef = collection(db, 'Messages')
            const addMessage = addDoc(messagesRef, {
                receiver: inputTargetInviteMember,
                sender: workspaceItem.currentUserID,
                message: workspaceItem.currentWorkspaceID,
                workspaceTitle:workspaceItem.workspaceTitle,
                type : 'invitation'
            }).then((e)=> {
                alert('success invite ' + e.id)
                setErrorMsg('')
            })
        } else setErrorMsg('choose a user!')
    }
    
    const handleGenerateLink = () => {
        if(inputTargetInviteMember !== ''&& workspaceItem.currentUserID !== '' && workspaceItem.currentWorkspaceID !== '' && workspaceItem.workspaceTitle !== ''){
            const messagesRef = collection(db, 'Messages')
            const addMessage = addDoc(messagesRef, {
                receiver: inputTargetInviteMember,
                sender: workspaceItem.currentUserID,
                message: workspaceItem.currentWorkspaceID,
                workspaceTitle:workspaceItem.workspaceTitle,
                type : 'invitation'
            }).then((e)=> {
                let link = `localhost:3000/invitation/${workspaceItem.currentWorkspaceID}/${inputTargetInviteMember}/${workspaceItem.workspaceTitle}/${e.id}`
                console.log(link)
                alert('copied this ' + link)
                setErrorMsg('')
            })
        } else setErrorMsg('choose a user!')
    }
    
    if(workspaceItem != []){
        console.log(workspaceItem.currentUserID)
        let count = 0
        return (
            <div className="bg-blue-200/50 flex flex-col p-2 font-mono text-2xl items-center w-96 rounded m-5">
                <div className="p-2 flex flex-col items-center">
                    <div className="text-4xl font-black text-blue-500 mb-5 text-center">invite to workspace</div>
                    <select onChange={e => handleChooseMember(e)} className="mb-5 w-64">
                    {memberList.map((member) => (
                        <option key={count++} value={member.userID} className="text-center">{member.userEmail}</option>
                    ))}
                        <option value="" className="text-center">empty</option>
                    </select>
                    <button onClick={() => handleMemberInvitation()} className="bg-blue-500 px-7 py-0.5 rounded hover:bg-blue-500/50 text-white w-64 mb-5">add member</button>
                    <button onClick={() => handleGenerateLink()} className="text-blue-500 px-7 py-0.5 rounded hover:bg-white/50 bg-white w-64 mb-5">generate link</button>
                    <div className="text-red-500 font-black text-3xl">{errorMsg}</div>
                </div>
            </div>
        );
    }     
}
 
export default InvitationForm;