import { useParams } from 'react-router-dom'
import { useState, useEffect, createContext } from 'react'
import { Link } from 'react-router-dom'
import { db } from '../../../firebase/FirebaseHelper'
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'
import { async } from '@firebase/util'
import WorkspaceList from './WorkspaceList'

const WorkspaceContainer = () => {
    
    const {id} = useParams()
    
    let workspaceObj = {title:'', visibility:''}
    const [workspaceRender, setWorkspaceRender] = useState([])
    const [idWorkspace, setIdWorkspace] = useState([])
    const [errorMsg, setErrorMsg] = useState('')
    
    var currentWorkspaceData = createContext(null)
    
    const insertWorkspaceCollection = async () => {
        if(workspaceObj.title !== '' && workspaceObj.visibility !== ''){
            const colls = collection(db, 'Workspaces')
            const docRef = await addDoc(colls, {
                workspaceTitle: workspaceObj.title,
                workspaceVisibility: workspaceObj.visibility,
                workspaceMember: [id],
                workspaceAdmin: [id]
            }).then(()=> {console.log('perform create new workspace')})
            setErrorMsg('')
        } else {
            setErrorMsg('title or visibility must be filled')
        }
    }
    
    const renderWorkspace = async () =>{
        let workspaceCon = []
        let workspaceID = []
        const queryStatement = query(collection(db, 'Workspaces'), where('workspaceMember', 'array-contains' ,id))
        let getQuery = await getDocs(queryStatement)
        getQuery.forEach((e) => {
            workspaceID.push(e.id)
            setIdWorkspace(workspaceID)
            
            workspaceCon.push(e.data())
            setWorkspaceRender(workspaceCon)
        })
    }
    
    const [trigger, setTrigger] = useState(0)
    useEffect(()=>{
        renderWorkspace()
        console.log(workspaceRender)
    }, [trigger])
    
    useEffect(() => {
        console.log(idWorkspace)
    }, [idWorkspace])
    
    const handleTitle = (e) => {
        workspaceObj.title = e.target.value
        console.log(workspaceObj.title)
    }
    
    const handleVisibility = (e) => {
        workspaceObj.visibility = e.target.value
        console.log(workspaceObj.visibility)
    }
    
    const handleWorkspace = () => {
        insertWorkspaceCollection()
        setTrigger(1)
    }
    
    return ( 
        <div className="flex flex-wrap justify-center">
        
            <div className="bg-blue-200/50 flex flex-col p-2 font-mono items-center rounded w-64 m-5">
                <h1 className="font-black text-3xl my-3">new workspace</h1>
                <input onChange={(e) => handleTitle(e)} type="text" className="m-2 w-44 p-0.5 px-2 py-2 rounded" placeholder="title"/>
                <select onChange={(e) => handleVisibility(e)}className="w-44 rounded py-2">
                    <option value="public">public</option>
                    <option value="private">private</option>
                </select>
                
                <div className="mt-3 text-red-500 font- w-44 text-center">{errorMsg}</div>
                
                <button onClick={() => handleWorkspace()} className="bg-blue-700 px-7 w-32 my-3 rounded hover:bg-blue-700/50 text-white">add workspace</button>
            </div>
            
            <WorkspaceList idWorkspace={idWorkspace} workspaceRender={workspaceRender} idUser={id}/>  
        </div>
    );

}
 
export default WorkspaceContainer;