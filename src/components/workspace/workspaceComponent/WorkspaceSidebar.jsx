import { collection, getDocs, query, where } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../../firebase/FirebaseHelper";
import WorkspaceContainer from "./WorkspaceContainer";
import WorkspaceSidebarItem from "./WorkspaceSidebarItem";

export const refreshContext = createContext()

const WorkspaceSidebar = () => {
    
    const {id} = useParams()
    
    const [renderWorkspace, setRenderWorkspace] = useState([])
    
    const getAdminIdentifier = (workspaceAdmin, userID) => {
        return workspaceAdmin.indexOf(userID)
    }
    
    const getCurrentWorkspace = (userID) => {
        let workspaceArr = []
        const queryState = query(collection(db, 'Workspaces'), where('workspaceMember', 'array-contains', userID))
        getDocs(queryState).then(e => {
            e.forEach(item => {
                let isAdmin = false
                if(getAdminIdentifier(item.data().workspaceAdmin, id) != -1){
                    isAdmin = true
                }
                workspaceArr.push({...item.data(), workspaceID:item.id, isAdmin:isAdmin})
                setRenderWorkspace(workspaceArr)
            })
        })
    }
    
    const [refresh, setRefresh] = useState(false)
    useEffect(() =>{
        getCurrentWorkspace(id)
    }, [refresh])
    
    const [boolCreateWorkspace, setBoolCreateWorkspace] = useState(false)    
    const WorkspaceContainerComponent = () => {
        if (boolCreateWorkspace == true){
            return ( 
                <div className="h-full w-full bg-black/30 fixed top-0 left-0  flex justify-center items-center">
                    <div className="bg-blue-200 p-2 rounded w-96 m-5 relative">
                        <button onClick ={() => setBoolCreateWorkspace(!boolCreateWorkspace)} className="p-2 absolute top-2 right-2 bg-blue-500/80 hover:bg-blue-500/40 w-10 rounded text-white">x</button>
                        <WorkspaceContainer/>            
                    </div>
                </div>
            )
        }
    }

    return ( 
        <refreshContext.Provider value={[refresh, setRefresh]}>
            <div className="flex flex-col sticky top-0 h-0 px-10 py-5 font-mono text-xl text-blue-500 w-96">
                <WorkspaceContainerComponent/>
                <div className="flex gap-24 items-center mb-2 justify-between">
                    <div className="">workspaces</div>
                    <button onClick={() => setBoolCreateWorkspace(!boolCreateWorkspace)} className="p-1 bg-blue-500/80 hover:bg-blue-500/40 w-9 rounded text-white">+</button>
                </div>
            
                {renderWorkspace.map((item) => (
                    <WorkspaceSidebarItem key={item.workspaceID} workspaceObj={item}/>
                ))}
                
            </div>
        </refreshContext.Provider>
    );
}
 
export default WorkspaceSidebar;