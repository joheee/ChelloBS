import { useContext, useEffect, useState } from "react";
import {WorkspaceContext} from './Board'
import {db} from '../../firebase/FirebaseHelper'
import {query, collection, where, getDocs} from 'firebase/firestore'

const WorkspaceMember = () => {
    
    const [memberID, setMemberID] = useState([''])
    const workspaceItem = useContext(WorkspaceContext)
    
    const testFunction = () => {
        if(workspaceItem.workspaceMember != undefined) {
            let workspaceMemberArray = []
            const queryStatement = query(collection(db, 'Users'), where('uid', 'in', workspaceItem.workspaceMember))
            let getQuery = getDocs(queryStatement).then(res => {
                res.forEach(item => {
                    workspaceMemberArray.push(item.data().email)
                    setMemberID(workspaceMemberArray)
                    console.log(workspaceMemberArray)
                })
            })
        }
    }
    
    useEffect(()=>{
        testFunction()
    },[workspaceItem])
    
    let count = 0
    if(workspaceItem != []){
        return ( 
            <div className="">
                <div className="bg-yellow-200 px-2 rounded mb-5 mt-9 text-center">member(s)</div>
                    {memberID.map((curr) => (
                        <div key={count++} className="bg-yellow-200 px-2 rounded mb-2 text-center">{curr}</div>
                    ))}
            </div>
        );
    }
}
 
export default WorkspaceMember;