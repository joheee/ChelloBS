import { addDoc, arrayUnion, collection, doc, getDoc, getDocs, query, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../components/navigationBar/NavigationBar";
import {db} from '../firebase/FirebaseHelper'
import CardItemTemplate from "./CardItem";



const CardContainer = () => {
    const {workspaceID, boardID, userID, boardTitle} = useParams()
    
    const handleCard = (e) => {
        console.log(e)
    }
    
    const [errorMsg, setErrorMsg] = useState('')
    const [popUpBool, setPopUpBool] = useState(false)
    const createCardList = (boardID, cardListTitle, messages) => {
        addDoc(collection(db,'Boards',boardID,'CardLists'), {
            cardListTitle:cardListTitle,
            cardListMember:[]
        }).then(newCard => {
            updateDoc(doc(db,'Boards', boardID), {
                cardList: arrayUnion(newCard.id)
            }).then(e => {
                alert(messages)
                setPopUpBool(!popUpBool)
            })
        })
    }
    
    const [cardListRender, setCardListRender] = useState([])
    const viewCardList = (boardID) => {
        let cardListArr = []
        const cardListRef = collection(db, 'Boards', boardID,'CardLists')
        const getAllCardList = query(cardListRef)
        getDocs(getAllCardList).then(res => {
            res.forEach(item => {
                let CardListObj = {
                    cardListID: item.id,
                    cardListMember: item.data().cardListMember,
                    cardListTitle: item.data().cardListTitle
                }
                console.log(CardListObj)
                cardListArr.push(CardListObj)
                setCardListRender(cardListArr)
                console.log(cardListArr)
            })
        })
    }
    
    const [trigger,setTrigger] = useState(false)
    useEffect(()=>{
        viewCardList(boardID)
    }, [trigger])
    
    let cardTitleInput = ''
    const handleCardTitleInput = (e) => {
        cardTitleInput = e.target.value
    }
    const handleCardTitleButton = () => {
        if(cardTitleInput != ''){
            createCardList(boardID, cardTitleInput, 'success create new card list!')
            setTrigger(!trigger)
        } else setErrorMsg('card list title must be filled')
    }
    
    const ViewCardListForm = () => {
        if(popUpBool === true) {
            return (
                <div className="h-full w-full bg-black/30 fixed">
                    <div className="flex justify-center items-center h-full">
                        <div className="bg-white/80 px-10 py-7 rounded relative text-center flex flex-col items-center justify-center gap-2">
                            <button onClick={e => setPopUpBool(!popUpBool)} className="p-2 absolute top-2 right-2 bg-blue-500/80 hover:bg-blue-500/40 w-10 rounded text-white">x</button>
                            <div className="text-blue-500 text-xl font-bold">New List</div>
                            <input onChange={e => handleCardTitleInput(e)}  type="text" className="m-2 p-2 w-64 rounded" name="" id="" placeholder="list title"/>
                            <div className="text-red-500 text-xl font-bold">{errorMsg}</div>
                            <button onClick={e => handleCardTitleButton()}className="p-2 bg-blue-500/80 hover:bg-blue-500/40 w-64 rounded text-white">create list</button>
                        </div>
                    </div>
                </div>
            )
        }
    }
    
    const createCard = (cardListID, cardTitle, cardDesc, cardLabel, cardChecklist, cardDue, cardWatcher, cardLocation, cardVisibility) => {
        console.info(cardListID)
        const cardRef = collection(db, 'Boards', boardID, 'CardLists', cardListID, 'Cards')
        addDoc(cardRef, {
            cardTitle:cardTitle,
            cardDesc:cardDesc,
            cardLabel:cardLabel,
            cardChecklist:cardChecklist,
            cardDue:cardDue,
            cardWatcher:cardWatcher,
            cardLocation:cardLocation
        }).then(e => {
            alert('success create new card')
        })
    }
    const viewCurrentCard = (cardListID) => {
        
    }
    
    const [tempCardListID, setTempCardListID] = useState('')
    const handleCreateNewCard = (cardListID) => {
        setTempCardListID(cardListID)
        setPopUpCardBool(!popUpCardBool)
    }
    
    const handleCardButton = () => {
        console.log(tempCardListID) 
        if(cardTitleInput != '' && tempCardListID != ''){
            setErrorMsg('')
            createCard(tempCardListID, cardTitleInput, '','','','','','','')
            setPopUpCardBool(!popUpCardBool)
            setTrigger(!trigger)
        }else {
            setErrorMsg('card title must be filled!')
        }
    }
    
    
    const [popUpCardBool, setPopUpCardBool] = useState(false)
    const ViewCardForm = () => {
        if(popUpCardBool === true) {
            return (
                <div className="h-full w-full bg-black/30 fixed">
                    <div className="flex justify-center items-center h-full">
                        <div className="bg-white/80 px-10 py-7 rounded relative text-center flex flex-col items-center justify-center gap-2">
                            <button onClick={e => setPopUpCardBool(!popUpCardBool)} className="p-2 absolute top-2 right-2 bg-blue-500/80 hover:bg-blue-500/40 w-10 rounded text-white">x</button>
                            <div className="text-blue-500 text-xl font-bold">New Card</div>
                            <input onChange={e => handleCardTitleInput(e)}  type="text" className="m-2 p-2 w-64 rounded" name="" id="" placeholder="card title"/>
                            <div className="text-red-500 text-xl font-bold">{errorMsg}</div>
                            <button onClick={e => handleCardButton()}className="p-2 bg-blue-500/80 hover:bg-blue-500/40 w-64 rounded text-white">create card</button>
                        </div>
                    </div>
                </div>
            )
        }
    }
    
    const [popUpEditCardBool, setPopUpEditCardBool] = useState(false)
    const EditCardForm = () => {
        if(popUpEditCardBool === true) {
            return (
                <div className="h-full w-full bg-black/30 fixed">
                    <div className="flex justify-center items-center h-full">
                        <div className="bg-white/80 px-10 py-7 rounded relative text-center flex flex-col items-center justify-center gap-2">
                            <button onClick={e => setPopUpCardBool(!popUpCardBool)} className="p-2 absolute top-2 right-2 bg-blue-500/80 hover:bg-blue-500/40 w-10 rounded text-white">x</button>
                            <div className="text-blue-500 text-xl font-bold">New Card</div>
                            <input onChange={e => handleCardTitleInput(e)}  type="text" className="m-2 p-2 w-64 rounded" name="" id="" placeholder="card title"/>
                            <div className="text-red-500 text-xl font-bold">{errorMsg}</div>
                            <button onClick={e => handleCardButton()}className="p-2 bg-blue-500/80 hover:bg-blue-500/40 w-64 rounded text-white">create card</button>
                        </div>
                    </div>
                </div>
            )
        }
    }
    
    let count  = 0
    return ( 
        <div className='h-screen'>
            <ViewCardListForm/>
            <ViewCardForm/>
            <ViewCardForm/>
            <NavBar id={userID}/>
            
            <div className="text-7xl font-black text-blue-500 my-5 text-center">{boardTitle}'s board</div>
            
            <div className="flex flex-col items-center m-5 h-3/4 mt-8">
                <div className="bg-blue-200/50 flex p-5 font-mono text-2xl gap-5 items-start w-full h-full rounded overflow-auto">
                    
                    {cardListRender.map((item) => (
                        <div key={count++} className="p-2 bg-blue-500 w-64 rounded">
                            <div className="text-white p-2">{item.cardListTitle}</div>
                            <div className="flex flex-col text-blue-500">
                            
                                <CardItemTemplate boardID={boardID} cardListID={item.cardListID} triggerCard={trigger} />
                                
                                <button onClick={e => handleCreateNewCard(item.cardListID)} className="bg-white/80 hover:bg-white/40 m-2 p-2 rounded">+ add a card</button>
                            
                            </div>
                        </div>
                    ))}
                    
                    <button onClick={e => setPopUpBool(!popUpBool)}className="p-2 bg-blue-500/80 hover:bg-blue-500/40 w-64 rounded text-white">+ add list</button>
                
                </div>
            </div>
        
        </div>
    );
}
 
export default CardContainer;