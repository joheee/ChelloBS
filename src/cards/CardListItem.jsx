import { addDoc, collection, deleteDoc, doc, onSnapshot, query, updateDoc, where } from "firebase/firestore"
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { db } from "../firebase/FirebaseHelper"
import CardContainer from "./CardContainer"

const CardListItem = ({item, trigger, board}) => {
    
    const navigate = useNavigate()
    const {workspaceID, boardID, userID, boardTitle} = useParams()
    
    const handleCreateNewCard = () => {
        setBoolEditCard(!boolEditCard)
    }
    let cardTitleInputUser = ''
    const handleCardTitleInput = (e) => {
        cardTitleInputUser = e.target.value
    }
    const createCardController = () => {
        if(cardTitleInputUser !== '') {
            const cardRef = collection(db, 'Boards', item.boardID, 'CardLists', item.cardListID, 'Cards')
            addDoc(cardRef, {
                cardTitle:cardTitleInputUser,
                cardDesc:'',
                cardChecklist:'',
                cardDue:'',
                cardWatcher:board.boardMember,
                cardLocation:''
            }).then(e => {
                alert('success create new card')
                trigger[1](!trigger[0])
            })
        } else alert('input card title!')
    }
    
    const [boolEditCard, setBoolEditCard] = useState(false)
    const EditCardForm = () => {
        if(boolEditCard === true) {
            return (
                <div className="h-full w-full bg-black/30 fixed top-0 left-0 z-30">
                    <div className="flex justify-center items-center h-full">
                        <div className="bg-white/80 px-10 py-7 rounded relative text-center flex flex-col items-center justify-center gap-2">
                            <button onClick={e => handleCreateNewCard()} className="p-2 absolute top-2 right-2 bg-blue-500/80 hover:bg-blue-500/40 w-10 rounded text-white">x</button>
                            <div className="text-blue-500 text-xl font-bold">New Card <br/> on {item.cardListTitle}</div>
                            <input onChange={e => handleCardTitleInput(e)} type="text" className="m-2 p-2 w-64 rounded" name="" id="" placeholder="card title"/>
                            <button onClick={e => createCardController()} className="p-2 bg-blue-500/80 hover:bg-blue-500/40 w-64 rounded text-white">create card</button>
                        </div>
                    </div>
                </div>
            )
        }
    }
    
    const [boolInputCardListTitle, setBoolInputCardListTitle] = useState(false)
    const handleCardListTitleEnter = (e) => {
        if(e.key === 'Enter'){
            updateDoc(doc(db, 'Boards', item.boardID, 'CardLists', item.cardListID), {
                cardListTitle: e.target.value
            }).then(e => {
                setBoolInputCardListTitle(!boolInputCardListTitle)
                trigger[1](!trigger[0])
            })
        }
    }
    const InputTextBoardTitle = () => {
        return (
            <input onKeyDown={e => handleCardListTitleEnter(e)} type="text" className="rounded p-2 w-44 " placeholder={item.cardListTitle}/>
        )
    }
    
    const handleDeleteList = () => {
        const queryCardState = query(collection(db, 'Boards',item.boardID, 'CardLists'), where('__name__', '==', item.cardListID))
        onSnapshot(queryCardState, e => {
            e.forEach(document => {
                deleteDoc(document.ref)
            })
            navigate(`/refresh/card/${workspaceID}/${boardID}/${userID}/${boardTitle}`)
        })
        
    }
    
    const [boolEditCardList, setBoolEditCardList] = useState(false)
    const EditCardListContainer = () => {
        if(boolEditCardList){
            return (
                <div className="absolute top-20 z-20 bg-blue-500  rounded p-2 w-48 text-white">
                    <div className="text-center">list action</div>
                    <div className="text-blue-500">
                        <button onClick={e => handleDeleteList()} className="bg-white/80 hover:bg-white/40 m-2 p-2 rounded">delete list</button>
                    </div>
                </div>
            )
        }
    }
    
    return (
        <div className="">
            <EditCardForm/>
            <div key={item.cardListID} className="p-2 w-64 bg-blue-500 rounded relative">
                
                <div className="flex justify-center gap-2 m-2">
                    {
                        boolInputCardListTitle ? 
                        <InputTextBoardTitle/> 
                        :
                        <div onClick={e => setBoolInputCardListTitle(!boolInputCardListTitle)} className="text-white p-2">{item.cardListTitle}</div>
                    }
                    <div className="relative">
                        <button onClick={e => setBoolEditCardList(!boolEditCardList)} className="bg-white/80 hover:bg-white/40 w-10 h-full rounded text-bg-blue-500">:</button>
                        <EditCardListContainer/>
                    </div>
                </div>
                
                <div className="flex flex-col text-blue-500">
                
                    <CardContainer item={item} trigger={trigger} board={board}/>
                    
                    <button onClick={e => handleCreateNewCard()} className="bg-white/80 hover:bg-white/40 m-2 p-2 rounded">+ add a card</button>
                
                </div>
            </div>
        </div>
    )
}
export default CardListItem