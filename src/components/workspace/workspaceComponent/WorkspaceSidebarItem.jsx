import { arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { useCallback, useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { db } from "../../../firebase/FirebaseHelper";
import InvitationForm from "./InvitationForm";
import { refreshContext } from "./WorkspaceSidebar";

const WorkspaceSidebarItem = ({workspaceObj}) => {
    
    const {id} = useParams()
    const refresh = useContext(refreshContext)
    const navigate = useNavigate()
    
    const updateWorkspaceVisibility = () => {
        let vis = workspaceObj.workspaceVisibility
        if(vis == 'public') vis = 'private'
        else if(vis == 'private') vis = 'public'
        updateDoc(doc(db, 'Workspaces', workspaceObj.workspaceID), {
            workspaceVisibility: vis
        }).then(e => {
            refresh[1](!refresh[0])
            navigate(`/refresh/${id}`)
        })
    }
    
    const [workspaceMemberRender, setWorkspaceMemberRender] = useState([])
    const [workspaceAdminRender, setWorkspaceAdminRender] = useState([])
    const getWorkspaceUser = (workspaceMember, workspaceAdmin) => {
        let userWorkspaceMember = []
        const queryStatement = query(collection(db, 'Users'), where('uid', 'in', workspaceMember))
        getDocs(queryStatement).then(e => {
            e.forEach(item => {
                userWorkspaceMember.push({...item.data()})
                setWorkspaceMemberRender(userWorkspaceMember)
            })
        })
        
        let userWorkspaceAdmin = []
        const queryWorkspaceAdmin = query(collection(db, 'Users'), where('uid', 'in', workspaceAdmin))
        getDocs(queryWorkspaceAdmin).then(e => {
            e.forEach(item => {
                userWorkspaceAdmin.push({...item.data()})
                setWorkspaceAdminRender(userWorkspaceAdmin)
            })
        })
    }
    
    const handleLeaveWorkspaceButton = (workspaceID, userID) => {
        if(workspaceObj.workspaceAdmin.length != 0 && workspaceObj.workspaceMember.length != 0){
            if(workspaceObj.workspaceMember.length == 1){
                setCloseBoardAndDeleteWorkspace()
            }else {
                const isUserAdmin = workspaceObj.workspaceAdmin.filter(admin => {return admin != userID})
                if(workspaceObj.workspaceAdmin.length == 1){
                    // user sekarang admin
                    if(isUserAdmin.length != workspaceObj.workspaceAdmin.length){
                        const newMember = workspaceObj.workspaceMember.filter((member)=>{
                            return !workspaceObj.workspaceAdmin.includes(member)
                        })
                        let rand = Math.floor(Math.random() * newMember.length)
                        
                        updateDoc(doc(db,'Workspaces', workspaceID), {
                            workspaceAdmin: arrayUnion(newMember[rand]),
                            workspaceAdmin: arrayRemove(userID),
                            workspaceMember: arrayRemove(userID)
                        })
                        .then(e => {
                            updateDoc(doc(db,'Workspaces', workspaceID), {
                                workspaceAdmin: arrayUnion(newMember[rand])
                            })
                            .then(e => {
                                alert('success leave workspace [admin at admin 1]')
                                refresh[1](!refresh[0])
                                navigate(`/refresh/${id}`)
                            })
                        })
                        
                    } else {
                        updateDoc(doc(db,'Workspaces', workspaceID), {
                            workspaceMember: arrayRemove(userID)
                        })
                        .then(e => {
                            alert('success leave workspace [member only at admin 1]')
                            refresh[1](!refresh[0])
                            navigate(`/refresh/${id}`)
                        })
                    }
                }
                else {
                    if(isUserAdmin.length != workspaceObj.workspaceAdmin.length){
                        updateDoc(doc(db,'Workspaces', workspaceID), {
                            workspaceMember: arrayRemove(userID),
                            workspaceAdmin: arrayRemove(userID)
                        })
                        .then(e => {
                            alert('success leave workspace [more than 1 admin]')
                            refresh[1](!refresh[0])
                            navigate(`/refresh/${id}`)
                        })
                    } else {
                        updateDoc(doc(db,'Workspaces', workspaceID), {
                            workspaceMember: arrayRemove(userID)
                        })
                        .then(e => {
                            alert('success leave workspace [member only at more than 1 admin]')
                            refresh[1](!refresh[0])
                            navigate(`/refresh/${id}`)
                        })
                    }
                }
            }
        }
    }

    const [boolUserRender, setBoolUserRender] = useState(false)
    const DisplayAllMember = () => {
        if(boolUserRender == true){
            return (
                <div className="h-full w-full bg-black/30 fixed top-0 left-0  flex justify-center items-center">
                    <div className="bg-blue-200 p-2 rounded m-5 relative">
                        
                            <button onClick={() => setBoolUserRender(!boolUserRender)} className="p-2 absolute top-2 right-2 bg-blue-500/80 hover:bg-blue-500/40 w-10 rounded text-white">x</button>
                            <div className="text-3xl grid gap-2">
                                <div className="font-black">{workspaceObj.workspaceTitle}</div>
                                
                                <div className="mt-4 p-4 flex flex-col items-start gap-5 bg-green-400 text-white rounded-lg">
                                    <div className="">admin</div>
                                    {workspaceAdminRender.map((item) => (
                                       <div key={item.uid} className="flex gap-5 items-center">
                                           <div className="w-10 h-10 rounded-full overflow-hidden">
                                               <img src={item.image} className='w-10 h-10'/>
                                           </div>
                                           {item.email}
                                       </div>
                                    ))}
                                </div>
                                
                                <div className="p-4 flex flex-col items-start gap-5 bg-yellow-400 text-white rounded-lg">
                                    <div className="">member</div>
                                    {workspaceMemberRender.map((item) => (
                                         <div key={item.uid} className="flex gap-5 items-center">
                                             <div className="w-10 h-10 rounded-full overflow-hidden">
                                                 <img src={item.image} className='w-10 h-10'/>
                                             </div>
                                             {item.email}
                                         </div>
                                    ))}
                                </div>
                            
                                <button onClick={e => handleLeaveWorkspaceButton(workspaceObj.workspaceID, id)} className="p-2 bg-blue-500/80 hover:bg-blue-500/40 rounded text-white">leave workspace</button>
                            </div>
                        
                    </div>
                </div>
            )
        }
    }
    
    const [boolInputText, setBoolInputText] = useState(false)
    const handleWorkspaceTitleEnter = (e) => {
        console.log(e.target.value)
        if(e.key === 'Enter'){
            updateDoc(doc(db, 'Workspaces', workspaceObj.workspaceID), {
                workspaceTitle: e.target.value
            }).then(e => {
                setBoolInputText(!boolInputText)
                refresh[1](!refresh[0])
                navigate(`/refresh/${id}`)
            })
        }
    }
    const InputTextWorkspaceName = () => {
        return (
            <input onKeyDown={e => handleWorkspaceTitleEnter(e)} type="text" className="w-80 px-2 py-1 rounded" placeholder={workspaceObj.workspaceTitle}/>
        )
    }
    
    const [isNotMemberWorkspace, setIsNotMemberWorkspace] = useState([])
    const getMemberAdmin = (userID, workspaceID) => {
        const docRef = doc(db,'Workspaces', workspaceID)
        getDoc(docRef).then((e) => {
            let workspaceData = {
                currentWorkspaceID: '',
                currentUserID: '',
                workspaceTitle:'',
                workspaceAdmin:[],
                workspaceMember:[]
            }
            workspaceData.currentWorkspaceID = workspaceID
            workspaceData.currentUserID = userID
            workspaceData.workspaceTitle = e.data().workspaceTitle
            workspaceData.workspaceAdmin = e.data().workspaceAdmin
            workspaceData.workspaceMember = e.data().workspaceMember    
            setIsNotMemberWorkspace(workspaceData)
        })
    }
    
   
    
    const [boolInviteWorkspaceMember, setBoolInviteWorkspaceMember] = useState(false)
    const InvitationWorkspaceForm = () => {
        if(boolInviteWorkspaceMember == true){
            return (
                <InvitationForm workspaceItem={isNotMemberWorkspace}/>
            )
        }
    }
    
   
    
    const [dropdownWorkspace, setDropdownWorkspace] = useState(false)
    const WorkspaceDetailDropdown = () => {
        if(dropdownWorkspace == true){
            return ( 
                <div className="ml-10 mb-2">
                
                    <Link to={`/board/${workspaceObj.workspaceID}/${id}`}>
                        <div className="hover:bg-blue-500/40 px-2 rounded cursor-pointer mb-1">boards</div>
                    </Link>
                    
                    <div onClick={() => setBoolUserRender(!boolUserRender)} className="hover:bg-blue-500/40 px-2 rounded cursor-pointer mb-1">member</div>
                    
                    {workspaceObj.isAdmin ? (
                        <div onClick={() => setSettingWorkspace(!settingWorkspace)} className="hover:bg-blue-500/40 px-2 rounded cursor-pointer bg-green-400 text-white mb-1">setting</div>
                    ) : null}
                
                </div>
            );
        }
    }
    
    const [grantAdminWorkspace, setGrantAdminWorkspace] = useState([])
    const getMemberButNotAdminOfWorkspace = (workspaceMember, workspaceAdmin) => {
        let memberWorkspaceOnlyArr = []
        const newMember = workspaceMember.filter((member)=>{
            return !workspaceAdmin.includes(member)
        })
        if(newMember.length != 0){
            const queryStatement = query(collection(db, 'Users'), where('uid', 'in', newMember))
            getDocs(queryStatement).then(e => {
                e.forEach(item => {
                    let userObj = {
                        userID: item.data().uid,
                        userEmail: item.data().email,
                        userName: item.data().username
                    }
                    memberWorkspaceOnlyArr.push(userObj)
                    setGrantAdminWorkspace(memberWorkspaceOnlyArr)
                })
            })
        }
        
    }
    
    let grantWorkspaceAdminID = ''
    const handleGrantWorkspaceAdmin = (e) => grantWorkspaceAdminID = e.target.value
    const handleGrantWorkspaceAdminButton = (e) => {
        console.log(grantWorkspaceAdminID)
        if(grantWorkspaceAdminID !== ''){
            updateDoc(doc(db, 'Workspaces', workspaceObj.workspaceID), {
                workspaceAdmin: arrayUnion(grantWorkspaceAdminID)
            }).then(() => {
                refresh[1](!refresh[0])
                alert('success grant workspace admin')
                navigate(`/refresh/${id}`)
            })
        } else alert('choose a member!')
    }
    
    const [boolWorkspaceGrantAdmin, setBoolWorkspaceGrantAdmin] = useState(false)
    const WorkspaceGrantAdminPopUpManager = () =>{
        if(boolWorkspaceGrantAdmin == true){
            return (
                <div className="bg-blue-200 p-2 rounded w-96 m-5 relative">
                    
                    <div className="text-3xl mb-5 grid gap-4">
                            <div className="font-black cursor-text text-center bg-emerald-500 rounded py-2 text-white">grant admin</div>
                            <div className="font-black cursor-text text-center" >{workspaceObj.workspaceTitle}</div>
                    </div>
                    
                    <div className=" flex flex-col gap-4">
                        <select onClick={e => handleGrantWorkspaceAdmin(e)} className=" w-full p-2 rounded cursor-pointer">
                            <option value='' className="text-center">empty</option>
                            {grantAdminWorkspace.map((item) => (
                                <option key={item.userID} value={item.userID} className="text-center">{item.userEmail}</option>
                            ))}
                        </select>
                        
                        <div className="grid gap-4">
                            <button onClick={e => handleGrantWorkspaceAdminButton(e)} className="p-2 bg-blue-500/80 hover:bg-blue-500/40 rounded text-white">grant admin</button>
                        </div>
                    </div>
                </div>
            )
        }
    }
    
    let revokeWorkspaceAdminID = ''
    const handleRevokeWorkspaceAdmin = (e) => revokeWorkspaceAdminID = e.target.value
    
    const handleRevokeWorkspaceAdminButton = (e) => {
        if(revokeWorkspaceAdminID !== ''){
            updateDoc(doc(db, 'Workspaces', workspaceObj.workspaceID), {
                workspaceAdmin: arrayRemove(revokeWorkspaceAdminID)
            }).then(e => {
                refresh[1](!refresh[0])
                alert('success revoke workspace admin')
                navigate(`/refresh/${id}`)
            })
        } else alert('choose a member!')
    }
    
    const [AllAdminExceptCurrentUserState, setAllAdminExceptCurrentUserState] = useState([])
    const getAllAdminExceptCurrentUser = (workspaceAdmin, userID) => {
        let allAdminExceptUserArr = []
        const otherAdmin = workspaceAdmin.filter((admin)=>{
            return admin != userID
        })
        if(otherAdmin.length != 0){
            const queryStatement = query(collection(db, 'Users'), where('uid', 'in', otherAdmin))
            getDocs(queryStatement).then(e => {
                e.forEach(item => {
                    let userObj = {
                        userID: item.data().uid,
                        userEmail: item.data().email,
                        userName: item.data().username
                    }
                    allAdminExceptUserArr.push(userObj)
                    setAllAdminExceptCurrentUserState(allAdminExceptUserArr)
                })
            })
        }
    }
    
    
    const [boolWorkspaceRevokeAdmin, setBoolWorkspaceRevokeAdmin] = useState(false)
    const WorkspaceRevokeAdminPopUpManager = () => {
        if(boolWorkspaceRevokeAdmin == true){
            return (
                <div className="bg-blue-200 p-2 rounded w-96 m-5 relative">
                    
                    <div className="text-3xl mb-5 grid gap-4">
                            <div className="font-black cursor-text text-center bg-pink-400 rounded py-2 text-white">revoke admin</div>
                            <div className="font-black cursor-text text-center" >{workspaceObj.workspaceTitle}</div>
                    </div>
                    
                    <div className=" flex flex-col gap-4">
                        <select onClick={e => handleRevokeWorkspaceAdmin(e)} className=" w-full p-2 rounded cursor-pointer">
                            <option value='' className="text-center">empty</option>
                            {AllAdminExceptCurrentUserState.map((item) => (
                                <option key={item.userID} value={item.userID} className="text-center">{item.userEmail}</option>
                            ))}
                        </select>
                        
                        <div className="grid gap-4">
                            <button onClick={e => handleRevokeWorkspaceAdminButton(e)} className="p-2 bg-blue-500/80 hover:bg-blue-500/40 rounded text-white">revoke admin</button>
                        </div>
                    </div>
                </div>
            )
        }
    }
    
    let removeWorkspaceMember = ''
    const handleRemoveWorkspaceMember = (e) => removeWorkspaceMember = e.target.value 
    const handleRemoveWorkspaceMemberButton = () => {
        if(removeWorkspaceMember != ''){
            updateDoc(doc(db, 'Workspaces', workspaceObj.workspaceID), {
                workspaceMember : arrayRemove(removeWorkspaceMember)
            }).then(e => {
                alert('success remove member')
                navigate(`/refresh/${id}`)
            })
        } else alert('choose a member!')
    }
    
    const [boolRemoveWorkspace, setBoolRemoveWorkspace] = useState(false)
    const RemoveWorkspaceMemberForm = () => {
        if(boolRemoveWorkspace == true){
            return (
                <div className="bg-blue-200 p-2 rounded w-96 m-5 relative">
                    
                    <div className="text-3xl mb-5 grid gap-4">
                            <div className="font-black cursor-text text-center bg-indigo-500 rounded py-2 text-white">remove member</div>
                            <div className="font-black cursor-text text-center" >{workspaceObj.workspaceTitle}</div>
                    </div>
                    
                    <div className=" flex flex-col gap-4">
                        <select onClick={e => handleRemoveWorkspaceMember(e)} className=" w-full p-2 rounded cursor-pointer">
                            <option value='' className="text-center">empty</option>
                            {grantAdminWorkspace.map((item) => (
                                <option key={item.userID} value={item.userID} className="text-center">{item.userEmail}</option>
                            ))}
                        </select>
                        
                        <div className="grid gap-4">
                            <button onClick={e => handleRemoveWorkspaceMemberButton(e)} className="p-2 bg-blue-500/80 hover:bg-blue-500/40 rounded text-white">remove member</button>
                        </div>
                    </div>
                </div>
            )
        }
    }
    
    const setCloseBoardAndDeleteWorkspace = () => {
        const queryGetBoard = query(collection(db, 'Boards'), where('workspaceID', '==', workspaceObj.workspaceID), where('boardStatus', '==', true))
        onSnapshot(queryGetBoard, (e) => {
            e.forEach(item => {
                updateDoc(doc(db, 'Boards',item.id), {
                    boardStatus: false
                })
            })
        })
        deleteDoc(doc(db,'Workspaces', workspaceObj.workspaceID))
        .then(e => {
            alert('success delete workspace')
            refresh[1](!refresh[0])
            navigate(`/refresh/${id}`)
        })
    }
    
    const handleDeleteWorkspaceButton = ()  => {
        setCloseBoardAndDeleteWorkspace()
    }
    
    const [boolDeleteWorkspace, setBoolDeleteWorkspace] = useState(false)
    const ConfirmDeleteWorkspace = () => {
        if(boolDeleteWorkspace == true){
            return (
                <div className="bg-blue-200 p-2 rounded w-96 m-5 relative">
                    
                    <div className="text-3xl mb-2 grid gap-4">
                            <div className="font-black cursor-text text-center bg-red-400 rounded py-2 text-white">delete {workspaceObj.workspaceTitle}?</div>
                    </div>
                    
                    <div className=" flex flex-col ">
                        <div className="flex justify-evenly gap-2">
                            <button onClick={e => handleDeleteWorkspaceButton(e)} className="p-2 bg-blue-500/80 w-full hover:bg-blue-500/40 rounded text-white">yes</button>
                            <button onClick={()=> setBoolDeleteWorkspace(!boolDeleteWorkspace)} className="p-2 bg-white/80 w-full hover:bg-white/40 rounded text-blue-500">no</button>
                        </div>
                    </div>
                </div>
            )
        }
    }
    
    const [settingWorkspace, setSettingWorkspace] = useState(false)
    const SettingPopUp = () => {
        if(settingWorkspace == true) {
            return (
                <div className="h-full w-full bg-black/30 fixed top-0 left-0  flex justify-center items-center">
                    <div className="bg-blue-200 p-2 rounded w-96 m-5 relative">
                        <button onClick={handleExitSetting} className="p-2 absolute top-2 right-2 bg-blue-500/80 hover:bg-blue-500/40 w-10 rounded text-white">x</button>
                        <div className="text-3xl">
                            {boolInputText ? 
                                <InputTextWorkspaceName/> : 
                                <div className="font-black cursor-text w-72" onClick={() => setBoolInputText(!boolInputText)}>{workspaceObj.workspaceTitle}</div>
                            }
                            <div className="my-4 flex items-center gap-5">
                                <div className="">{workspaceObj.workspaceVisibility}</div>
                                <input onClick={e => updateWorkspaceVisibility()} type="checkbox" className="w-5 h-5"/>
                            </div>
                        </div>
                        
                        <div className="grid gap-4">
                            <button onClick={() => setBoolInviteWorkspaceMember(!boolInviteWorkspaceMember)} className="p-2 bg-fuchsia-500 hover:bg-fuchsia-500/40 rounded text-white">invite member</button>
                            <button onClick={()=> setBoolWorkspaceGrantAdmin(!boolWorkspaceGrantAdmin)} className="p-2 bg-emerald-500 hover:bg-emerald-500/40 rounded text-white">grant admin</button>
                            <button onClick={()=> setBoolWorkspaceRevokeAdmin(!boolWorkspaceRevokeAdmin)} className="p-2 bg-pink-400 hover:bg-pink-400/40 rounded text-white">revoke admin</button>
                            <button onClick={()=> setBoolRemoveWorkspace(!boolRemoveWorkspace)} className="p-2 bg-indigo-500 hover:bg-indigo-500/40 rounded text-white">remove member</button>
                            <button onClick={()=> setBoolDeleteWorkspace(!boolDeleteWorkspace)} className="p-2 bg-red-400 hover:bg-red-400/40 rounded text-white">delete workspace</button>
                        </div>
                        </div>
                        <InvitationWorkspaceForm/>
                        <div className="flex flex-col">
                            <WorkspaceGrantAdminPopUpManager/>
                            <WorkspaceRevokeAdminPopUpManager/>
                            <RemoveWorkspaceMemberForm/>
                        </div>
                        <ConfirmDeleteWorkspace/>
                </div>
            )
        }
    }
    
    const handleExitSetting = () => {
        setSettingWorkspace(!settingWorkspace)
        setBoolInviteWorkspaceMember(false)
        setBoolInputText(false)
        setBoolWorkspaceGrantAdmin(false)
        setBoolWorkspaceRevokeAdmin(false)
        setBoolRemoveWorkspace(false)
        setBoolDeleteWorkspace(false)
    }
    
    useEffect(() =>{
        getWorkspaceUser(workspaceObj.workspaceMember, workspaceObj.workspaceAdmin)
        getMemberAdmin(id, workspaceObj.workspaceID)
        getMemberButNotAdminOfWorkspace(workspaceObj.workspaceMember, workspaceObj.workspaceAdmin)
        getAllAdminExceptCurrentUser(workspaceObj.workspaceAdmin , id)
    },[refresh[0]])
    
    const escapeIsPressed = useCallback(e => {
        if(e.keyCode === 27){
            setBoolUserRender(false)
            setDropdownWorkspace(false)
            setBoolInviteWorkspaceMember(false)
            setSettingWorkspace(false)
            setBoolWorkspaceGrantAdmin(false)
            setBoolWorkspaceRevokeAdmin(false)
            setBoolRemoveWorkspace(false)
            setBoolDeleteWorkspace(false)
        }
    }, [])
    document.addEventListener('keydown', escapeIsPressed)
    
    return ( 
        <div className="">
            <DisplayAllMember/>
            <SettingPopUp/>
            <div onClick={() => setDropdownWorkspace(!dropdownWorkspace)}className="ml-3 flex justify-between mb-2 items-center hover:bg-blue-500/20 px-2 rounded cursor-pointer">
                <div className="">{workspaceObj.workspaceTitle}</div>
                <div className="p-1 text-bg-blue-500">^</div>
            </div>
            <WorkspaceDetailDropdown/>
        </div>
    );
}
 
export default WorkspaceSidebarItem;