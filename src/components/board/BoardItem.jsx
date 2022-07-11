import { arrayRemove, arrayUnion, collection, deleteDoc, doc, getDocs, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../../firebase/FirebaseHelper";
import { triggerContext } from "./Board";
import BoardInviteMember from "./BoardInviteMember";

const BoardItem = ({workspaceID, item, userID}) => {
    
    const trigger = useContext(triggerContext)
    const navigate = useNavigate()
    
    const [boolInputBoardTitle, setBoolInputBoardTitle] = useState(false)
    const handleBoardTitleEnter = (e) => {
        if(e.key === 'Enter'){
            updateDoc(doc(db, 'Boards', item.boardID), {
                boardTitle: e.target.value
            }).then(e => {
                setBoolInputBoardTitle(!boolInputBoardTitle)
                trigger[1](!trigger[0])
            })
        }
    }
    const InputTextWorkspaceTitle = () => {
        return (
            <input onKeyDown={e => handleBoardTitleEnter(e)} type="text" className=" rounded px-2" placeholder={item.boardTitle}/>
        )
    }
    
    const updateBoardVisibility = () => {
        let vis = item.boardVisibility
        if(vis == 'public') vis = 'workspace'
        else if(vis == 'workspace') vis = 'board'
        else if(vis == 'board') vis = 'public'
        updateDoc(doc(db, 'Boards', item.boardID), {
            boardVisibility: vis
        }).then(e => {
            trigger[1](!trigger[0])
        })
    }
    
    const [boolInviteMember, setBoolInviteMember] = useState(false)
    const BoardInviteMemberPopUp = () => {
        if(boolInviteMember == true){
            return (
                <BoardInviteMember item={item} trigger={trigger}/>
            )
        }
    }
  
    
    const [boardAdminRender, setBoardAdminRender] = useState([])
    const getAdminList = () => {
        let adminArr =[]
        const queryStatement = query(collection(db, 'Users'), where('uid' ,'in', item.boardAdmin))
        onSnapshot(queryStatement, e => {
            e.forEach(admin => {
                adminArr.push({...admin.data()})
                setBoardAdminRender(adminArr)
            })
        })
    }
    
    const [boardMemberRender, setBoardMemberRender] = useState([])
    const getMemberList = () => {
        let memberArr =[]
        const queryStatement = query(collection(db, 'Users'), where('uid' ,'in', item.boardMember))
        onSnapshot(queryStatement, e => {
            e.forEach(admin => {
                memberArr.push({...admin.data()})
                setBoardMemberRender(memberArr)
            })
        })
    }
    
    const deleteBoardAndCollection = (boardID) => {
        const cardListStatement = query(collection(db, 'Boards', boardID, 'CardLists'))
        let boardTitle = item.boardTitle
        getDocs(cardListStatement).then(e => {
            if(!e.empty){
                e.forEach(item => {
                    const cardStatement = query(collection(db, 'Boards', boardID, 'CardLists', item.id, 'Cards'))
                    getDocs(cardStatement).then(r => {
                        if(!r.empty){
                            r.forEach(card => {
                                deleteDoc(doc(db, 'Boards', boardID, 'CardLists', item.id, 'Cards', card.id))
                            })
                        } else {
                            deleteDoc(doc(db, 'Boards', boardID, 'CardLists', item.id)).then(e => {
                                deleteDoc(doc(db, 'Boards', boardID)).then(e => {
                                    trigger[1](!trigger[0])
                                    navigate(`/refresh/board/${workspaceID}/${userID}`)
                                })
                            })
                        }
                    })
                })
                
            } else {
                deleteDoc(doc(db, 'Boards', boardID)).then(e => {
                    alert('delete ' + boardTitle)
                    trigger[1](!trigger[0])
                    navigate(`/refresh/board/${workspaceID}/${userID}`)
                })
            }
        })
        
    }
    
    const handleLeaveBoardButton = () => {
        if(item.boardAdmin.length != 0 && item.boardMember.length != 0){
            if(item.boardMember.length == 1){
                deleteBoardAndCollection(item.boardID)
            } else {
                const isUserAdmin = item.boardAdmin.filter(admin => {return admin != userID})
                if(item.boardAdmin.length == 1){
                    if(isUserAdmin.length != item.boardAdmin.length){
                        const getMember = item.boardMember.filter(member => {return !item.boardAdmin.includes(member)})
                        let rand = Math.floor(Math.random() * getMember.length)
                        updateDoc(doc(db, 'Boards', item.boardID), {
                            boardAdmin: arrayRemove(userID),
                            boardMember: arrayRemove(userID)
                        }).then(e => {
                            updateDoc(doc(db, 'Boards', item.boardID), {
                                boardAdmin: arrayUnion(getMember[rand])
                            }).then(e => {
                                alert('success leave board')
                                trigger[1](!trigger[0])
                                navigate(`/refresh/board/${workspaceID}/${userID}`)
                            })
                        })
                    }else {
                        updateDoc(doc(db, 'Boards', item.boardID), {
                            boardMember: arrayRemove(userID)
                        }).then(e => {
                           alert('success leave board') 
                            trigger[1](!trigger[0])
                            navigate(`/refresh/board/${workspaceID}/${userID}`)
                        })
                    }
                }
                else {
                    if(isUserAdmin.length != item.boardAdmin.length){
                        updateDoc(doc(db, 'Boards', item.boardID), {
                            boardMember: arrayRemove(userID),
                            boardAdmin: arrayRemove(userID)
                        }).then(e => {
                            alert('success leave workspace')
                            trigger[1](!trigger[0])
                            navigate(`/refresh/board/${workspaceID}/${userID}`)
                        })
                    } else {
                        updateDoc(doc(db, 'Boards', item.boardID), {
                            boardMember: arrayRemove(userID)
                        }).then(e => {
                            alert('success leave board') 
                            trigger[1](!trigger[0])
                            navigate(`/refresh/board/${workspaceID}/${userID}`)
                        })
                    }
                }
            }
        
        }
    }
    
    const [infoBoard, setInfoBoard] = useState(false)
    const InfoPopUpBoard = () => {
        if(infoBoard == true) {
            return (
                <div className="h-full w-full bg-black/30 fixed top-0 left-0 flex justify-center items-center z-20">
                     <div className="bg-blue-200 p-2 rounded text-xl">
                        <div className="flex justify-between text-3xl">
                                <div className="cursor-text">
                                    {item.boardTitle}
                                </div>
                            <button onClick={e => handleUserPressedX()} className="p-2 bg-blue-500/80 hover:bg-blue-500/40 w-10 rounded text-white">x</button>
                        </div>
                        <div className=" flex items-center gap-5">
                            <div className="">{item.boardVisibility} visibility</div>
                        </div>
                        <div className="grid gap-2">
                                    
                            <div className="mt-4 p-4 flex flex-col items-start gap-4 bg-green-400 text-white rounded-lg">
                                <div className="">admin</div>
                                {boardAdminRender.map((item) => (
                                    <div key={item.uid} className="flex gap-5 items-center">
                                        <div className="w-10 h-10 rounded-full overflow-hidden">
                                            <img src={item.image} className='w-10 h-10'/>
                                        </div>
                                        {item.email}
                                    </div>
                                ))}
                            </div>
                            
                            <div className="p-4 flex flex-col items-start gap-4 bg-yellow-400 text-white rounded-lg">
                            <div className="">member</div>
                                {boardMemberRender.map((item) => (
                                    <div key={item.uid} className="flex gap-5 items-center">
                                        <div className="w-10 h-10 rounded-full overflow-hidden">
                                            <img src={item.image} className='w-10 h-10'/>
                                        </div>
                                        {item.email}
                                    </div>
                                ))}
                            </div>
                
                            <button onClick={e => handleLeaveBoardButton()} className="p-2 bg-blue-500/80 hover:bg-blue-500/40 rounded text-white">leave board</button>
                            
                        </div>
                    </div>
                </div>
            )
        }
    }
    
    const [memberOnlyList, setMemberOnlyList] = useState([])
    const getMemberButNotAdminOfBoard = () => {
        let memberBoardOnlyArr = []
        const newMember = item.boardMember.filter(member => {
            return !item.boardAdmin.includes(member)
        })
        if(newMember.length != 0){
            const queryStatement = query(collection(db, 'Users'), where('uid', 'in', newMember))
            onSnapshot(queryStatement, e => {
                e.forEach(item => {
                    memberBoardOnlyArr.push({...item.data()})
                    setMemberOnlyList(memberBoardOnlyArr)
                })
            })
        }
    }
    
    const [adminExceptUserList, setAdminExceptUserList] = useState([])
    const getAdminExceptCurrentUser = () => {
        let AdminExceptUserArr = []
        const otherAdmin = item.boardAdmin.filter(admin => {
            return admin != userID
        })
        if(otherAdmin.length != 0){
            const queryStatement = query(collection(db, 'Users'), where('uid', 'in', otherAdmin))
            onSnapshot(queryStatement, e => {
                e.forEach(item => {
                    AdminExceptUserArr.push({...item.data()})
                    setAdminExceptUserList(AdminExceptUserArr)
                })
            })
        }
    }
    
    let grantAdminRole = ''
    const handleGrantAdminInput = (e) => {
        grantAdminRole = e.target.value
        console.log(grantAdminRole)
    }
    const grantAdminController = () => {
        if(grantAdminRole != ''){
            updateDoc(doc(db, 'Boards', item.boardID), {
                boardAdmin: arrayUnion(grantAdminRole)
            }).then(e => {
                onSnapshot(query(collection(db, 'Users'), where('uid', '==', grantAdminRole)), e => {
                    e.forEach(item => {
                        alert('success grant admin to ' + item.data().email)
                        trigger[1](!trigger[0])
                    })
                })
            })
        } else {
            alert('choose a user!')
        }
    }    
    
    let revokeAdminRole = ''
    const handleRevokeAdminInput = (e) => {
        revokeAdminRole = e.target.value
    }
    const revokeAdminController = () => {
        if(revokeAdminRole != ''){
            updateDoc(doc(db, 'Boards', item.boardID), {
                boardAdmin: arrayRemove(revokeAdminRole)
            }).then(e => {
                onSnapshot(query(collection(db, 'Users'), where('uid', '==', revokeAdminRole)), e => {
                    e.forEach(item => {
                        alert('success revoke admin to ' + item.data().email)
                        trigger[1](!trigger[0])
                    })
                })
            })
        } else {
            alert('choose a user!')
        }
    }
    
    const [boolGrantRevokeBoard, setBoolGrantRevokeBoard] = useState(false)
    const GrantRevokeBoardContainer = () => {
        if(boolGrantRevokeBoard == true) {
            return (
                <div className="w-80">
                    
                    <div className="text-3xl mb-2 grid">
                        <div className="font-black cursor-text text-center bg-emerald-500 rounded py-2 text-white">grant admin</div>
                    </div>
                    
                    <div className=" flex flex-col gap-2">
                        <select onClick={e => handleGrantAdminInput(e)} className=" w-full p-2 rounded cursor-pointer">
                            <option value='' className="text-center">empty</option>
                            {memberOnlyList.map((item) => (
                                <option key={item.uid} value={item.uid} className="text-center">{item.email}</option>
                            ))}
                        </select>
                        
                        <div className="grid gap-5">
                            <button onClick={e => grantAdminController()} className="p-2 bg-blue-500/80 hover:bg-blue-500/40 rounded text-white">grant admin</button>
                        </div>
                    </div>
                    
                    
                    
                    <div className="text-3xl mt-5 mb-2 grid">
                            <div className="font-black cursor-text text-center bg-pink-400 rounded py-2 text-white">revoke admin</div>
                    </div>
                    
                    <div className=" flex flex-col gap-2">
                        <select onClick={e => handleRevokeAdminInput(e)} className=" w-full p-2 rounded cursor-pointer">
                            <option value='' className="text-center">empty</option>
                            {adminExceptUserList.map((item) => (
                                <option key={item.uid} value={item.uid} className="text-center">{item.email}</option>
                            ))}
                        </select>
                        
                        <div className="grid gap-4">
                            <button onClick={e => revokeAdminController()} className="p-2 bg-blue-500/80 hover:bg-blue-500/40 rounded text-white">revoke admin</button>
                        </div>
                    </div>
                    
                </div>
            )
        }
    }
    
    
    const [MemberExceptCurrentUser, setMemberExceptCurrentUser] = useState([])
    const getMemberExceptCurrentUser = () => {
        const getMember = item.boardMember.filter(member => {
            return member != userID
        })
        let getMemberArr = []
        if(getMember.length != 0){
            const queryStatement = query(collection(db, 'Users'), where('uid', 'in', getMember))
            onSnapshot(queryStatement, e => {
                e.forEach(item => {
                    getMemberArr.push({...item.data()})
                    setMemberExceptCurrentUser(getMemberArr)
                })
            })
        }
    }
    
    let removeBoardMember = ''
    const handleRemoveBoardMember = (e) => {
        removeBoardMember = e.target.value
    }
    
    const removeBoardMemberController = () => {
        if(removeBoardMember != ''){
            updateDoc(doc(db, 'Boards', item.boardID), {
                boardMember: arrayRemove(removeBoardMember)
            }).then(e => {
                onSnapshot(query(collection(db, 'Users'), where('uid', '==', removeBoardMember)), e => {
                    e.forEach(item => {
                        alert('success remove member ' + item.data().email + ' from the board')
                        trigger[1](!trigger[0])
                    })
                })
            })
        }else alert('choose a member')
    }
    
    const [boolRemoveBoardMember, setBoolRemoveBoardMember] = useState(false)
    const RemoveBoardMemberContainer = () => {
        if(boolRemoveBoardMember == true){
            return (
                <div className="w-80">
                    
                    <div className="text-3xl mb-2 grid">
                        <div className="font-black cursor-text text-center bg-fuchsia-500 rounded py-2 text-white">remove member</div>
                    </div>
                    
                    <div className=" flex flex-col gap-2">
                        <select onClick={e => handleRemoveBoardMember(e)} className=" w-full p-2 rounded cursor-pointer">
                            <option value='' className="text-center">empty</option>
                            {MemberExceptCurrentUser.map((item) => (
                                <option key={item.uid} value={item.uid} className="text-center">{item.email}</option>
                            ))}
                        </select>
                        
                        <div className="grid gap-5">
                            <button onClick={e => removeBoardMemberController()} className="p-2 bg-blue-500/80 hover:bg-blue-500/40 rounded text-white">remove</button>
                        </div>
                    </div>
                    
                </div>        
            )
        }
    }
    
    const handleCloseBoard = () => {
        updateDoc(doc(db, 'Boards', item.boardID), {
            boardStatus: !item.boardStatus
        }).then(e => {
            alert('success close ' + item.boardTitle + ' board')
            trigger[1](!trigger[0])
        })
    }
    
    const handleDeleteBoard = (boardID) => {
        deleteBoardAndCollection(boardID)
    }
    
    const [boolCloseAndRemoveBoard, setBoolCloseAndRemoveBoard] = useState(false)
    const CloseAndRemoveBoardContainer = () => {
        if(boolCloseAndRemoveBoard == true) {
            return (
                <div className="w-80">
                    
                    <div className="text-3xl mb-2 grid gap-2">
                        {item.boardStatus ? 
                            <div onClick={e => handleCloseBoard()} className="font-black cursor-pointer text-center bg-red-400 hover:bg-red-400/40 rounded py-2 text-white">close board</div> 
                            : 
                            <div onClick={e => handleCloseBoard()} className="font-black cursor-pointer text-center bg-green-400 hover:bg-red-400/40 rounded py-2 text-white">open board</div>
                        }
                        <div onClick={e => handleDeleteBoard(item.boardID)} className="font-black cursor-pointer text-center bg-red-400 hover:bg-red-400/40 rounded py-2 text-white">delete board</div>
                    </div>
                    
                </div>
            )
        }
    }
    
    const [allWorkspaceExceptThis, setAllWorkspceExceptThis] = useState([])
    const getAllWorkspaceExceptThis = () => {
        let allWorkspaceExceptThisArr = []
        const queryStatement = query(collection(db,'Workspaces'), where('__name__', '!=', workspaceID), where('workspaceMember', 'array-contains', userID))
        onSnapshot(queryStatement, e => {
            e.forEach(item => {
                allWorkspaceExceptThisArr.push({...item.data(), workspaceID:item.id})
                setAllWorkspceExceptThis(allWorkspaceExceptThisArr)
            })
        })
    }
    let currentWorkspaceSelected = ''
    const handleMoveBoard = (e) => {
        currentWorkspaceSelected = e.target.value
    } 
    const moveBoardToWorkspaceController = () => {
        if(currentWorkspaceSelected.length !== 0){
            updateDoc(doc(db, 'Boards', item.boardID), {
                workspaceID: currentWorkspaceSelected
            })
            .then(e => {
                alert('success move ' + item.boardTitle  + ' to ' + currentWorkspaceSelected)
                trigger[1](!trigger[0])
                navigate(`/refresh/board/${workspaceID}/${userID}`)
            })
        } else alert('choose a workspace!')
    }
    
    const [boolMoveBoardToOtherWorkspace, setBoolMoveBoardToOtherWorkspace] = useState(false)
    const MoveBoardToOtherWorkspaceContainer = () => {
        if(boolMoveBoardToOtherWorkspace === true) {
            return (
                <div className="w-80">
                    
                    <div className="text-3xl mb-2 grid">
                        <div className="font-black cursor-text text-center bg-teal-600 rounded py-2 text-white">move board</div>
                    </div>
                    
                    <div className=" flex flex-col gap-2">
                        <select onClick={e => handleMoveBoard(e)} className=" w-full p-2 rounded cursor-pointer">
                            <option value='' className="text-center">empty</option>
                            {allWorkspaceExceptThis.map((item) => (
                                <option key={item.workspaceID} value={item.workspaceID} className="text-center">{item.workspaceTitle}</option>
                            ))}
                        </select>
                        
                        <div className="grid gap-5">
                            <button onClick={e => moveBoardToWorkspaceController()} className="p-2 bg-blue-500/80 hover:bg-blue-500/40 rounded text-white">move</button>
                        </div>
                    </div>
                    
                </div>        
            )
        }
    }
    
    const handleUserPressedX = () => {
        setSettingBoard(false)
        setBoolInputBoardTitle(false)
        setBoolInviteMember(false)
        setInfoBoard(false)
        setBoolGrantRevokeBoard(false)
        setBoolRemoveBoardMember(false)
        setBoolCloseAndRemoveBoard(false)
        setBoolMoveBoardToOtherWorkspace(false)
    }
    useEffect(() => {
        getAdminList()
        getMemberList()
        getMemberButNotAdminOfBoard()
        getAdminExceptCurrentUser()
        getMemberExceptCurrentUser()
        getLoveColor()
        getAllWorkspaceExceptThis()
    }, [trigger[0]])
    
    const [settingBoard, setSettingBoard] = useState(false)
    const SettingPopUpBoard = () => {
        if(settingBoard == true) {
            return (
                <div className="h-full w-full bg-black/30 fixed top-0 left-0  flex justify-center items-center z-20">
                     <div className="bg-blue-200 p-5 rounded text-xl custom-width">
                        <div className="flex justify-between text-3xl">
                            {boolInputBoardTitle ? 
                                <InputTextWorkspaceTitle/> :
                                <div onClick={e => setBoolInputBoardTitle(!boolInputBoardTitle)} className="cursor-text">
                                    {item.boardTitle}
                                </div>
                            }
                            <button onClick={e => handleUserPressedX()} className="p-2 bg-blue-500/80 hover:bg-blue-500/40 w-10 rounded text-white">x</button>
                        </div>
                        <div className=" flex items-center gap-5">
                            <div className="">{item.boardVisibility}</div>
                            <input onClick={updateBoardVisibility} type="checkbox" className="w-5 h-5"/>
                        </div>
                        <div className="mt-5 flex justify-between gap-5">
                            <div className="w-full flex flex-col gap-5">
                            
                                <BoardInviteMemberPopUp/>
                                <GrantRevokeBoardContainer/>
                                <RemoveBoardMemberContainer/>
                                <CloseAndRemoveBoardContainer/>
                                <MoveBoardToOtherWorkspaceContainer/>
                                
                            </div>
                            
                            <div className="flex flex-col gap-2">
                                <button onClick={e => {
                                    setBoolInviteMember(!boolInviteMember)
                                    setBoolRemoveBoardMember(false)
                                    setBoolGrantRevokeBoard(false)
                                    setBoolCloseAndRemoveBoard(false)
                                    setBoolMoveBoardToOtherWorkspace(false)
                                    
                                }} className="p-2 bg-blue-500/80 hover:bg-blue-500/40 rounded text-white">invite member</button>
                                <button onClick={e => {
                                    setBoolInviteMember(false)
                                    setBoolRemoveBoardMember(!boolRemoveBoardMember)
                                    setBoolGrantRevokeBoard(false)
                                    setBoolCloseAndRemoveBoard(false)
                                    setBoolMoveBoardToOtherWorkspace(false)
                                    
                                }} className="p-2 bg-blue-500/80 hover:bg-blue-500/40 rounded text-white">remove member</button>
                                <button onClick={e => {
                                    setBoolInviteMember(false)
                                    setBoolRemoveBoardMember(false)
                                    setBoolGrantRevokeBoard(!boolGrantRevokeBoard)
                                    setBoolCloseAndRemoveBoard(false)
                                    setBoolMoveBoardToOtherWorkspace(false)
                                            
                                }} className="p-2 bg-blue-500/80 hover:bg-blue-500/40 rounded text-white">grant/revoke</button>
                                <button onClick={e => {
                                    setBoolInviteMember(false)
                                    setBoolRemoveBoardMember(false)
                                    setBoolGrantRevokeBoard(false)
                                    setBoolCloseAndRemoveBoard(false)
                                    setBoolMoveBoardToOtherWorkspace(!boolMoveBoardToOtherWorkspace)
                                    
                                }} className="p-2 bg-blue-500/80 hover:bg-blue-500/40 rounded text-white">move board</button>
                                
                                <button onClick={e => {
                                    setBoolInviteMember(false)
                                    setBoolRemoveBoardMember(false)
                                    setBoolGrantRevokeBoard(false)
                                    setBoolCloseAndRemoveBoard(!boolCloseAndRemoveBoard)
                                    setBoolMoveBoardToOtherWorkspace(false)
                                    
                                }} className="p-2 bg-blue-500/80 hover:bg-blue-500/40 rounded text-white">close board</button>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }
    
    const [loveColor, setLoveColor] = useState('bg-slate-400')
    const getLoveColor = () => {
        if(item.boardFavourite === true){
            setLoveColor('bg-pink-500')
        }else {
            setLoveColor('bg-slate-400')
        }
    }
    const favouriteBoardController = () => {
        updateDoc(doc(db, 'Boards', item.boardID), {
            boardFavourite: !item.boardFavourite
        }).then(e => {
            trigger[1](!trigger[0])
        })
    }
    
    return ( 
        (
            <div className="">
                <div className="">
                    {
                        item.boardStatus ? 
                        <div className="">
                        
                            <SettingPopUpBoard/>
                            <InfoPopUpBoard/>
                            
                            <div className="relative hover:scale-105 duration-300">
                                {item.isAdmin ? 
                                    <div onClick={e => setSettingBoard(!settingBoard)} className="p-2 absolute top-2 right-2 bg-green-400 hover:bg-green-400/40 rounded text-white cursor-pointer">custom</div> 
                                    :
                                    null
                                }
                                <div onClick={e => setInfoBoard(!infoBoard)} className="p-2 absolute top-2 left-2 bg-slate-400 px-4 hover:bg-slate-400/40 rounded text-white cursor-pointer">?</div> 
                                <Link to={`/card/${workspaceID}/${item.boardID}/${userID}/${item.boardTitle}`}>
                                    <div  className="p-2 bg-blue-500 w-64 h-64 rounded flex justify-center items-center">
                                        <div className="text-white p-2 text-center">{item.boardTitle}</div>
                                    </div>
                                </Link>
                                <div onClick={e => favouriteBoardController(e)} className={`p-2 absolute bottom-2 left-2 ${loveColor} px-4 hover:bg-slate-400/40 rounded text-white cursor-pointer fa-solid fa-heart`}></div> 
                            </div>
                        </div> : null
                    }
                    {
                        (!item.boardStatus && item.isAdmin) ? 
                        <div className="">
                        
                            <SettingPopUpBoard/>
                            <InfoPopUpBoard/>
                            
                            <div className="relative hover:scale-105 duration-300">
                                {item.isAdmin ? 
                                    <div onClick={e => setSettingBoard(!settingBoard)} className="p-2 absolute top-2 right-2 bg-green-400 hover:bg-green-400/40 rounded text-white cursor-pointer">custom</div> 
                                    :
                                    null
                                }
                                <div onClick={e => setInfoBoard(!infoBoard)} className="p-2 absolute top-2 left-2 bg-slate-400 px-4 hover:bg-slate-400/40 rounded text-white cursor-pointer">?</div> 
                                <Link to={`/card/${workspaceID}/${item.boardID}/${userID}/${item.boardTitle}`}>
                                    <div  className="p-2 bg-blue-500 w-64 h-64 rounded flex justify-center items-center">
                                        <div className="text-white p-2 text-center">{item.boardTitle}</div>
                                    </div>
                                </Link>
                                <div onClick={e => favouriteBoardController(e)} className={`p-3 absolute bottom-2 left-2 ${loveColor} px-4 hover:bg-slate-400/40 rounded text-white cursor-pointer fa-solid fa-heart`}></div> 
                                <div className="p-2 absolute bottom-2 right-2 bg-red-500 px-4 hover:bg-slate-400/40 rounded text-white cursor-pointer">x</div> 
                            </div>
                        </div> : null
                    }
                </div>
            </div>
        )
        
    )
}
 
export default BoardItem;