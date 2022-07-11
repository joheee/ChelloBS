import { addDoc, collection, doc, getDoc, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase/FirebaseHelper";

const BoardInviteMember = ({item, trigger}) => {

    const [memberList, setMemberList] = useState([])
    const {workspaceID, userID} = useParams()
    console.log(item)
    
    const getUnjoinedUser = () => {
        let workspaceMemberArray = []
        const queryStatement = query(collection(db, 'Users'), where('uid', 'not-in', item.boardMember))
        onSnapshot(queryStatement, e => {
            e.forEach(item => {
                workspaceMemberArray.push({...item.data()})
                setMemberList(workspaceMemberArray)
            })
        })
    }
    
    let inputTargetInviteMember = ''
    const handleChooseMember = (e) => {
        inputTargetInviteMember = e.target.value
        console.log(inputTargetInviteMember)
    }
    
    const handleMemberInvitation = () => {
        if(inputTargetInviteMember !== ''&& userID !== '' && item.workspaceID !== '' && item.boardID !== ''){
            addDoc(collection(db, 'Messages'), {
                receiver: inputTargetInviteMember,
                sender: userID,
                message: item.boardID,
                boardTitle: item.boardTitle,
                type : 'invitationBoardMember'
            }).then((e)=> {
                alert('success invite ' + e.id)
            })
        } else alert('failed invitation')
    }
    
    const handleGenerateLink = () => {
        if(inputTargetInviteMember !== ''&& userID !== '' && item.workspaceID !== '' && item.boardID !== ''){
            addDoc(collection(db, 'Messages'), {
                receiver: inputTargetInviteMember,
                sender: userID,
                message: item.boardID,
                boardTitle: item.boardTitle,
                type : 'invitationBoardMember'
            }).then((e)=> {
                let link = `localhost:3000/invitation/board/${item.boardID}/${inputTargetInviteMember}/${item.boardTitle}/${e.id}`
                alert('copied this ' + link)
            })
        } else alert('generate link failed')
    }
    
    useEffect(() =>{
        getUnjoinedUser()
    }, [trigger[0]])
    
    return (
        <div className="flex flex-col font-mono text-2xl items-center rounded">
            <div className="flex flex-col items-center gap-4">
                <div className="text-4xl font-black text-white bg-fuchsia-500 text-center break-words w-80 py-2 rounded">invite to <br/> board</div>
                
                <select onClick={e => handleChooseMember(e)} className=" w-full p-2 rounded cursor-pointer">
                {memberList.map((member) => (
                    <option key={member.uid} value={member.uid} className="text-center">{member.email}</option>
                ))}
                    <option value="" className="text-center">empty</option>
                </select>
                <button onClick={e => handleMemberInvitation()} className="bg-blue-500/80 p-2  rounded hover:bg-blue-500/40 text-white w-full">add member</button>
                <button onClick={e => handleGenerateLink()} className="text-blue-500/80 p-2 rounded hover:bg-white/40 bg-white w-full">generate link</button>
            </div>
        </div>
    )
}
 
export default BoardInviteMember;