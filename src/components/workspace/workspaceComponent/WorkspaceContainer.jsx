import { useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect, useContext } from 'react'
import { db } from '../../../firebase/FirebaseHelper'
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'
import {refreshContext} from './WorkspaceSidebar'

const WorkspaceContainer = () => {
    
    const {id} = useParams()
    const refresh = useContext(refreshContext)
    
    let workspaceObj = {title:'', visibility:''}
    const [workspaceRender, setWorkspaceRender] = useState([])
    const [idWorkspace, setIdWorkspace] = useState([])
    const [errorMsg, setErrorMsg] = useState('')
    const navigate = useNavigate()
    
    const insertWorkspaceCollection = async () => {
        if(workspaceObj.title !== '' && workspaceObj.visibility !== ''){
            const colls = collection(db, 'Workspaces')
            const docRef = await addDoc(colls, {
                workspaceTitle: workspaceObj.title,
                workspaceVisibility: workspaceObj.visibility,
                workspaceMember: [id],
                workspaceAdmin: [id]
            }).then(()=> {
                alert(workspaceObj.title + ' is added to your workspace')
                refresh[1](!refresh[0])
                setErrorMsg('')
                navigate(`/refresh/${id}`)
            })
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
    }, [trigger])
    
    useEffect(() => {
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
        <div className="flex flex-col font-mono items-center">
            <h1 className="font-black text-3xl my-3">new workspace</h1>
            <input onChange={(e) => handleTitle(e)} type="text" className="m-2 w-60 p-0.5 px-2 py-2 rounded" placeholder="title"/>
            <select onChange={(e) => handleVisibility(e)}className="w-60 rounded py-2">
                <option value="public">public</option>
                <option value="private">private</option>
            </select>
            
            <div className="mt-3 text-red-500 font- w-44 text-center">{errorMsg}</div>
            
            <button onClick={() => handleWorkspace()} className="bg-blue-500/80 hover:bg-blue-500/40 px-5 py-3 rounded text-white">add workspace</button>
        </div>
    );

}
 
export default WorkspaceContainer;