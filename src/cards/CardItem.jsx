import { addDoc, arrayRemove, arrayUnion, collection, deleteDoc, doc, getDocs, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../firebase/FirebaseHelper";
import moment from 'moment'
import "react-big-calendar/lib/css/react-big-calendar.css";
import CardCommentContainer from "./CardCommentContainer";
import CardMap from "./CardMap";
import CardAttachment from "./CardAttachment";

const EachCardItem = ({card, trigger, board, item}) => {
    const navigate = useNavigate()
    const {workspaceID, boardID, userID, boardTitle} = useParams()
    
    const [boolInputCardTitle, setBoolInputCardTitle] = useState(false)
    const cardReference = doc(db, 'Boards', item.boardID, 'CardLists', item.cardListID, 'Cards', card.cardID)
    const handleCardListTitleEnter = (e) => {
        if(e.key === 'Enter'){
            updateDoc(doc(db, 'Boards', item.boardID, 'CardLists', item.cardListID, 'Cards', card.cardID), {
                cardTitle: e.target.value
            }).then(e => {
                setBoolInputCardTitle(false)
                trigger[1](!trigger[0])
            })
        }
    }
    const InputTextCardTitle = () => {
        return (
            <input onKeyDown={e => handleCardListTitleEnter(e)} type="text" className="rounded px-2 bg-blue-400 placeholder-white text-white" placeholder={card.cardTitle}/>
        )
    }
    
    const handleDeleteCard = () => {
        deleteDoc(doc(db, 'Boards', item.boardID, 'CardLists', item.cardListID, 'Cards', card.cardID))
        .then(e => {
            alert('success delete card name : ' + card.cardTitle)
            trigger[1](!trigger[0])
            navigate(`/refresh/card/${workspaceID}/${boardID}/${userID}/${boardTitle}`)
        })
    }
    
    const [boolInputCardDesc, setBoolInputCardDesc] = useState(false)
    const handleCardListDescEnter = (e) => {
        if(e.key === 'Enter'){
            updateDoc(cardReference, {
                cardDesc: e.target.value
            }).then(e => {
                setBoolInputCardDesc(false)
                trigger[1](!trigger[0])
            })
        }
    }
    const InputTextCardDesc = () => {
        return (
            <input onKeyDown={e => handleCardListDescEnter(e)} type="textarea" className="w-full h-40 rounded px-2 bg-blue-400 placeholder-white text-white"/>
        )
    }
    
    const localizer = momentLocalizer(moment)
    const MyCardCalendar = () => {
        const cardEvent = [{
            id: card.cardID,
            title: card.cardTitle,
            start: new Date(card.cardDue),
            end: new Date(card.cardDue)
        }]
        return (
            <Calendar
                localizer={localizer}
                events={cardEvent}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}>
            </Calendar>
        )
    }
    let cardDateInput = ''
    const handleCardDateInput = (e) => {
        cardDateInput = e.target.value
        console.log(cardDateInput)
    }
    const cardDateController = () => {
        if(cardDateInput !== ''){
            updateDoc(cardReference, {
                cardDue: cardDateInput
            })
            .then(e => {
                alert('success update date')
                trigger[1](!trigger[0])
                navigate(`/refresh/card/${workspaceID}/${boardID}/${userID}/${boardTitle}`)
            })
        } else alert('choose a date!')
    }
    const cardRemoveDateController = () => {
        updateDoc(cardReference, {
            cardDue: ''
        })
        .then(e => {
            alert('success remove date')
            trigger[1](!trigger[0])
            navigate(`/refresh/card/${workspaceID}/${boardID}/${userID}/${boardTitle}`)
        })
    }
    const [boolDateCard, setBoolDateCard] = useState(false)
    const DateCardContainer = () => {
        if(boolDateCard === true){
            return (
                <div className="bg-blue-200 p-4 rounded flex flex-col items-center gap-4">
                    <MyCardCalendar/>
                    <div className="bg-blue-500 p-4 rounded">
                        <div className="text-white mb-4">
                            {card.cardTitle}'s due date : {card.cardDue}
                        </div>
                        <div className="flex gap-4">
                            <input onChange={e => handleCardDateInput(e)} type="date" name="" id="" className="p-2 rounded w-full"/>
                            <button onClick={e => cardDateController()} className="p-2 w-full bg-blue-200 hover:bg-blue-200/40 rounded text-white">set due date</button>
                        </div>
                        <button onClick={e => cardRemoveDateController()} className="p-2 w-full bg-blue-200 mt-4 hover:bg-blue-200/40 rounded text-white">remove due date</button>
                    </div>
                </div>
            )
        }
    }
    
    let cardLabelInputUser = ''
    const handleCardLabelInput = (e) => {
        cardLabelInputUser = e.target.value
    }
    let cardLabelInputColor = ''
    const handleCardLabelColorInput = (e) => {
        cardLabelInputColor = e
    }
    const [cardLabelItem, setCardLabelItem] = useState([])
    const [cardLabelOther, setCardLabelOther] = useState([])
    const getCardLabelItem = () => {
        let cardLabelItemArr = []
        const cardLabelRef = query(collection(db, 'CardLabels'), where('cardID', 'array-contains', card.cardID))
        onSnapshot(cardLabelRef, e => {
            e.forEach(cardLabel => {
                cardLabelItemArr.push({...cardLabel.data(), cardLabelID:cardLabel.id})
                
                setCardLabelItem(cardLabelItemArr)
            })
        })
        let cardLabelAllArr = []
        const cardLabelAllRef = query(collection(db, 'CardLabels'))
        onSnapshot(cardLabelAllRef, e => {
            e.forEach(cardLabel => {
                cardLabelAllArr.push({...cardLabel.data(), cardLabelID:cardLabel.id})
                setCardLabelOther(cardLabelAllArr)
            })
        })
    }
    const addCardLabelItem = () => {
        if(cardLabelInputUser !== '' && cardLabelInputColor !== ''){
            const cardLabelRef = collection(db, 'CardLabels')
            const cardLabelCheckRef = query(collection(db, 'CardLabels'), where('cardLabelText', '==', cardLabelInputUser), where('cardLabelColor', '==', cardLabelInputColor))
            getDocs(cardLabelCheckRef).then(e => {
                if(e.empty) {
                    addDoc(cardLabelRef, {
                        cardLabelText:cardLabelInputUser,
                        cardLabelColor:cardLabelInputColor,
                        cardID: arrayUnion(card.cardID)
                    }).then(e => {
                        trigger[1](!trigger[0])
                        navigate(`/refresh/card/${workspaceID}/${boardID}/${userID}/${boardTitle}`)
                    })
                } else {
                    console.log(e.empty)
                }
            })
        }
    }
    const deleteCardLabelItem = () => {
        if(cardLabelInputUser !== '' && cardLabelInputColor !== ''){
            console.log(cardLabelInputUser)
            console.log(cardLabelInputColor)
            const cardLabelRef = query(collection(db, 'CardLabels'), where('cardLabelText', '==', cardLabelInputUser), where('cardLabelColor', '==', cardLabelInputColor))
            getDocs(cardLabelRef).then(e => {
                e.forEach(cardLabel => {
                    deleteDoc(doc(db, 'CardLabels', cardLabel.id))
                    .then(e => {
                        trigger[1](!trigger[0])
                        navigate(`/refresh/card/${workspaceID}/${boardID}/${userID}/${boardTitle}`)
                    })
                })
            })
        }else {
            alert('text or color must be inputed!')
        }
    }
    const attachDetachCardLabelController = (label) => {
        const getAnotherLabel = label.cardID.filter(label => {
            return label != card.cardID
        })
        if(getAnotherLabel.length !== label.cardID.length){
            updateDoc(doc(db, 'CardLabels', label.cardLabelID), {
                cardID: arrayRemove(card.cardID)
            })
            .then(e => {
                navigate(`/refresh/card/${workspaceID}/${boardID}/${userID}/${boardTitle}`)
            })
        } else {
            updateDoc(doc(db, 'CardLabels', label.cardLabelID), {
                cardID: arrayUnion(card.cardID)
            })
            .then(e => {
                navigate(`/refresh/card/${workspaceID}/${boardID}/${userID}/${boardTitle}`)
            })
        }
    }
    const setLabelColor = ['bg-blue-500','bg-green-500','bg-yellow-500','bg-red-500','bg-gray-500','bg-purple-500']
    const [boolLabelCard, setBoolLabelCard] = useState(false)
    const LabelCardContainer = () => {
        if(boolLabelCard === true){
            return (
                <div className="bg-white p-4 rounded flex flex-col items-center gap-4 w-72">
                    <div className="">edit label</div>
                    
                    <input onChange={e => handleCardLabelInput(e)} type="text" className="w-60 rounded p-2 border-2 border-blue-500 placeholder-white " placeholder=''/>
                    
                    <div className="grid grid-cols-3 gap-4 justify-items-center w-60">
                        {
                            setLabelColor.map(color => (
                                <div onClick={e => handleCardLabelColorInput(color)} key={color} value={color} className={`${color} w-16 h-10 rounded cursor-pointer`}></div>
                                ))
                        }
                    </div>
                    
                    <button onClick={e => addCardLabelItem()} className="p-2 bg-blue-500/80 hover:bg-blue-500/40 w-60 rounded text-white">create label</button>
                    <button onClick={e => deleteCardLabelItem()} className="p-2 bg-pink-500/80 hover:bg-pink-500/40 w-60 rounded text-white">delete label</button>
                    
                    <div className="h-1 bg-blue-500 w-60 my-2"></div>
                    <div className="">attach/detach</div>
                    
                    <div className="flex flex-col gap-4 h-40 overflow-auto">
                        {
                        cardLabelOther.map((label => (
                            <button key={label.cardLabelID} onClick={e => attachDetachCardLabelController(label)} className={`p-2 ${label.cardLabelColor} hover:bg-blue-500/40 w-60 rounded text-white`}>{label.cardLabelText}</button>
                            )))
                        }
                    </div>
                    
                </div>
            )
        }
    }
    
    const [uninvitedMember, setUninvitedMember] = useState([])
    const [cardWatcherExceptUser, setCardWatcherExceptUser] = useState([])
    const getUninvitedCardWatcher = () => {
        let userArr = []
        const queryState = query(collection(db, 'Users'), where('uid', 'not-in', card.cardWatcher))
        onSnapshot(queryState, e => {
            e.forEach(user => {
                userArr.push({...user.data()})
                setUninvitedMember(userArr)
            })
        })
        const cardWatcher = card.cardWatcher.filter(watcher => {
            return watcher != userID
        })
        let otherUserArr = []
        const queryStateSecond = query(collection(db, 'Users'), where('uid', 'in', cardWatcher))
        onSnapshot(queryStateSecond, e => {
            e.forEach(user => {
                otherUserArr.push({...user.data()})
                setCardWatcherExceptUser(otherUserArr)
            })
        })
    }
    let uninvitedMemberInput = ''
    const handleUninvitedMember = (e) => {
        uninvitedMemberInput = e.target.value
    }
    const uninvitedMemberController = () => {
        if(uninvitedMemberInput !== ''){
            updateDoc(cardReference, {
                cardWatcher: arrayUnion(uninvitedMemberInput)
            })
            .then(e => {
                navigate(`/refresh/card/${workspaceID}/${boardID}/${userID}/${boardTitle}`)
            })
        } else alert('choose a user')
    }
    let cardWatcherInput = ''
    const handleCardWatcher = (e) => {
        cardWatcherInput = e.target.value
    }
    const removeCardWatcherController = () => {
        if(cardWatcherInput !== ''){
            updateDoc(cardReference, {
                cardWatcher: arrayRemove(cardWatcherInput)
            })
            .then(e => {
                navigate(`/refresh/card/${workspaceID}/${boardID}/${userID}/${boardTitle}`)
            })
        } else alert('choose a user')
    }
    const [boolUninvitedMember, setBoolUninvitedMember] = useState(false)
    const UninvitedCardWatcherContainer = () => {
        if(boolUninvitedMember === true){
            return (
                <div className="bg-white p-4 rounded flex flex-col items-center gap-4 w-72">
                    <div className="">card watcher</div>
                    
                    <select onClick={e => handleUninvitedMember(e)}  className=" w-full p-2 rounded cursor-pointer">
                        <option className="text-center">empty</option>
                        {uninvitedMember.map((item) => (
                            <option key={item.uid} value={item.uid} className="text-center">{item.email}</option>
                        ))}
                    </select>
                    
                    <button onClick={e => uninvitedMemberController()} className="p-2 bg-blue-500/80 hover:bg-blue-500/40 w-60 rounded text-white">assign watcher</button>
                    
                    <select onClick={e => handleCardWatcher(e)} className=" w-full p-2 rounded cursor-pointer">
                        <option value='' className="text-center">empty</option>
                        {cardWatcherExceptUser.map((item) => (
                            <option key={item.uid} value={item.uid} className="text-center">{item.email}</option>
                        ))}
                    </select>
                    
                    <button onClick={e => removeCardWatcherController()} className="p-2 bg-pink-500/80 hover:bg-pink-500/40 w-60 rounded text-white">unassign watcher</button>
                    
                </div>
            )
        }
    }
    
    const generateLinkController = () => {
        if(uninvitedMemberInput !== ''){
            addDoc(collection(db, 'Messages'), {
                cardTitle: card.cardTitle,
                sender: userID,
                receiver: uninvitedMemberInput,
                boardID: item.boardID,
                cardListID: item.cardListID,
                cardID: card.cardID,
                type: 'invitationCardMember'
            }).then(e => {
                alert('send invitation to ' + uninvitedMemberInput + '\n\ncopied this link\n\n' + `localhost:3000/invitation/card/${item.boardID}/${item.cardListID}/${card.cardID}/${uninvitedMemberInput}/${card.cardTitle}`)
                console.log(`localhost:3000/invitation/card/${item.boardID}/${item.cardListID}/${card.cardID}/${uninvitedMemberInput}/${card.cardTitle}`)
            })
        } else alert('choose an user!')
    }
    
    const [linkUninvitedUser, setLinkUninvitedUser] = useState(false)
    const LinkUninvitedUserContainer = () => {
        if(linkUninvitedUser === true){
            return (
                <div className="bg-white p-4 rounded flex flex-col items-center gap-4 w-72">
                    <div className="">generate link</div>
                    
                    <select onClick={e => handleUninvitedMember(e)}  className=" w-full p-2 rounded cursor-pointer">
                        <option className="text-center">empty</option>
                        {uninvitedMember.map((item) => (
                            <option key={item.uid} value={item.uid} className="text-center">{item.email}</option>
                        ))}
                    </select>
                    
                    <button onClick={e => generateLinkController()} className="p-2 bg-blue-500/80 hover:bg-blue-500/40 w-60 rounded text-white">assign watcher</button>
                
                </div>
            )
        }
    }
    
    const [boolCardMap, sestBoolCardMap] = useState(false)
    const [boolCardAttachment, setBoolCardAttachment] = useState(false)
    const handleExitPressed = () => {
        setBoolEditCardForm(false)
        setBoolInputCardTitle(false)
        setBoolInputCardDesc(false)
        setBoolDateCard(false)
        setBoolUninvitedMember(false)
        setBoolLabelCard(false)
        setLinkUninvitedUser(false)
        setBoolCardAttachment(false)
    }
    useEffect(() => {
        MyCardCalendar()
        getCardLabelItem()
        getUninvitedCardWatcher()
        getMonthCardDue()
    },[trigger[0]])
    
    let count = 0
    const [boolEditCardForm, setBoolEditCardForm] = useState(false)
    const EditCardForm = () => {
        if(boolEditCardForm === true) {
            return (
                <div className="fixed bg-black/60 h-screen w-screen top-0 left-0 flex justify-center items-center font-mono gap-4 z-40">
                    
                    <DateCardContainer/>
                    {
                        boolCardMap ? 
                        <CardMap card={card.cardID}/>
                        :
                        null
                    }
                    
                    <div className="bg-white w-1/2 p-5 rounded text-xl">
                        
                        <div className="flex justify-between text-3xl">
                            {
                                boolInputCardTitle ? 
                                <InputTextCardTitle/>
                                :
                                <div onClick={e => {
                                    setBoolInputCardTitle(!boolInputCardTitle)
                                    setBoolInputCardDesc(false)
                                }} className="w-full">
                                    {card.cardTitle}
                                </div>
                            }
                            <button onClick={e => handleExitPressed()} className="p-2 bg-blue-500/80 hover:bg-blue-500/40 w-10 rounded text-white">x</button>
                        </div>
                        <div className="mt-5 flex justify-between gap-5">
                            <div className="w-full flex flex-col gap-5">
                            
                                <div className="flex gap-4">
                                    <div className="grid">
                                        
                                        {
                                            cardLabelItem.length !== 0 ?
                                            <div className="">
                                                <div className="">labels</div>
                                                <div className="flex flex-wrap gap-2 w-72">
                                                    {cardLabelItem.map(cardLabel => (
                                                    <div key={cardLabel.cardLabelID} className={`${cardLabel.cardLabelColor} p-2 text-white rounded`}>{cardLabel.cardLabelText}</div>
                                                    ))}
                                                </div> 
                                            </div>
                                            : 
                                            null
                                        }
                                        
                                    </div>
                                        {
                                            card.cardDue === '' ?
                                            null
                                            :
                                            <div className="">
                                                <div className="">due date</div>
                                                <div className="">{card.cardDue}</div>
                                            </div>
                                        }
                                </div>
                                
                                <div className="">
                                    <div onClick={e => {
                                        setBoolInputCardTitle(false)
                                        setBoolInputCardDesc(!boolInputCardDesc)
                                    }}  className="bg-blue-500/80 text-white p-2 w-40 text-center rounded hover:bg-blue-500/40 mb-2 cursor-pointer">description</div>
                                    {
                                        boolInputCardDesc ? 
                                        <InputTextCardDesc/>
                                        :
                                        <div className="">
                                            <p>{card.cardDesc}</p>
                                        </div>
                                    }
                                </div>
                            
                                {
                                    card.cardAttachment !==    undefined      ? 
                                    <div className="grid">
                                        <div className="">Attachment</div>
                                        {
                                            card.cardAttachment.map((item, index) => (
                                                <a key={index} href={item.url} target="_blank" className="hover:underline mb-1">
                                                   {++index}. {item.file}
                                                </a>
                                            ))
                                        }
                                    </div> : null
                                }
                            
                                <div className="">
                                    <div className="">comment</div>
                                    <CardCommentContainer card={card} trigger={trigger} board={board} item={item}/>
                                </div>
                            
                            </div>
                            
                            <div className="flex flex-col gap-2">
                                
                                <button onClick={e => {
                                    setBoolUninvitedMember(!boolUninvitedMember)
                                    setBoolLabelCard(false)
                                    setBoolDateCard(false)
                                    setLinkUninvitedUser(false)
                                    sestBoolCardMap(false)
                                    setBoolCardAttachment(false)
                                }}
                                className="p-2 bg-blue-500/80 hover:bg-blue-500/40 w-64 rounded text-white">watchers</button>
                                
                                <button onClick={e => {
                                    setBoolUninvitedMember(false)
                                    setBoolLabelCard(!boolLabelCard)
                                    setBoolDateCard(false)
                                    setLinkUninvitedUser(false)
                                    sestBoolCardMap(false)
                                    setBoolCardAttachment(false)
                                    
                                }} className="p-2 bg-blue-500/80 hover:bg-blue-500/40 w-64 rounded text-white">labels</button>
                                
                                <button onClick={e => {
                                    setBoolUninvitedMember(false)
                                    setBoolLabelCard(false)
                                    setBoolDateCard(false)
                                    setLinkUninvitedUser(!linkUninvitedUser)
                                    sestBoolCardMap(false)
                                    setBoolCardAttachment(false)
                                    
                                }} className="p-2 bg-blue-500/80 hover:bg-blue-500/40 w-64 rounded text-white">generate link</button>
                                
                                <button className="p-2 bg-blue-500/80 hover:bg-blue-500/40 w-64 rounded text-white">checklist</button>
                                
                                <button onClick={e => {
                                    setBoolUninvitedMember(false)
                                    setBoolLabelCard(false)
                                    setBoolDateCard(false)
                                    setLinkUninvitedUser(false)
                                    sestBoolCardMap(false)
                                    setBoolCardAttachment(!boolCardAttachment)
                                    
                                }} className="p-2 bg-blue-500/80 hover:bg-blue-500/40 w-64 rounded text-white">attachment</button>
                                
                                <button onClick={e => {
                                    setBoolUninvitedMember(false)
                                    setBoolLabelCard(false)
                                    setBoolDateCard(!boolDateCard)
                                    setLinkUninvitedUser(false)
                                    sestBoolCardMap(false)
                                    setBoolCardAttachment(false)
                                    
                                }} className="p-2 bg-blue-500/80 hover:bg-blue-500/40 w-64 rounded text-white">dates</button>
                                
                                <button onClick={e => {
                                    setBoolUninvitedMember(false)
                                    setBoolLabelCard(false)
                                    setBoolDateCard(false)
                                    setLinkUninvitedUser(false)
                                    sestBoolCardMap(!boolCardMap)
                                    setBoolCardAttachment(false)
                                    
                                }}className="p-2 bg-blue-500/80 hover:bg-blue-500/40 w-64 rounded text-white">location</button>
                                
                                <button onClick={e => handleDeleteCard()} className="p-2 bg-red-500/80 hover:bg-red-500/40 w-64 rounded text-white">delete card</button>
                                
                            </div>
                        </div>
                    </div>
                    
                    <LabelCardContainer/>
                    <UninvitedCardWatcherContainer/>
                    <LinkUninvitedUserContainer/>
                    {
                        boolCardAttachment ?
                        <CardAttachment card={card} trigger={trigger} board={board} item={item}/>
                        : null
                    }
                    
                </div>
            )
        }
    }
    const [monthArr, setMonthArr] = useState('')
    const monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const getMonthCardDue = () => {
        setMonthArr(monthList[new Date(card.cardDue).getMonth()])
    }
    return ( 
        <div className="" key={card.cardID}>
            <EditCardForm/>
            <div onClick={e => setBoolEditCardForm(!boolEditCardForm)} className="bg-white hover:bg-white/90 m-2 p-2 rounded cursor-pointer">
                {
                    cardLabelItem.length !== 0 ?
                    <div className="">
                        <div className="flex flex-wrap gap-2">
                            {cardLabelItem.map(cardLabel => (
                            <div key={cardLabel.cardLabelID} className={`${cardLabel.cardLabelColor} p-2 px-4 text-white rounded`}></div>
                            ))}
                        </div> 
                    </div>
                    : 
                    null
                }
                {card.cardTitle}
                {
                    card.cardDue !== '' ?
                        (new Date().getMonth() === new Date(card.cardDue).getMonth()) &&
                        (new Date().getDate() === new Date(card.cardDue).getDate())
                        ? 
                        <div className="text-base bg-yellow-500 w-20 text-center text-white rounded">{new Date(card.cardDue).getDate()} {monthArr}</div>
                        :
                        <div className="text-base bg-green-400 w-20 text-center text-white rounded">{new Date(card.cardDue).getDate()} {monthArr}</div>
                    :
                    null
                }
            </div>
        </div>
    );
}
 
export default EachCardItem;