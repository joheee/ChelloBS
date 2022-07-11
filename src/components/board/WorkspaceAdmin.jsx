import { useContext, useEffect, useState } from 'react';
import {WorkspaceContext} from './Board'
import {db} from '../../firebase/FirebaseHelper'
import {query, collection, where, getDocs} from 'firebase/firestore'

const WorkspaceAdmin = () => {
        
    const [adminID, setAdminID] = useState([''])
    const workspaceItem = useContext(WorkspaceContext)
    
    const testFunction = () => {
        if(workspaceItem.workspaceAdmin != undefined) {
            let workspaceMemberArray = []
            const queryStatement = query(collection(db, 'Users'), where('uid', 'in', workspaceItem.workspaceAdmin))
            let getQuery = getDocs(queryStatement).then(res => {
                res.forEach(item => {
                    workspaceMemberArray.push(item.data().email)
                    setAdminID(workspaceMemberArray)
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
                <div className="bg-green-300 px-2 rounded mb-5 text-center">admin(s)</div>
                    {adminID.map((email) => (
                        <div key={count++} className="bg-green-300 px-2 rounded mb-2 text-center">{email}</div>
                    ))}
            </div>
        );
    }
}
 
export default WorkspaceAdmin;