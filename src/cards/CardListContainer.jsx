import { addDoc, arrayUnion, collection, doc, getDoc, getDocs, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../components/navigationBar/NavigationBar";
import {db} from '../firebase/FirebaseHelper'
import CardListItem from "./CardListItem";



const CardContainer = () => {
    const {workspaceID, boardID, userID, boardTitle} = useParams()
    
    const [currentBoardInfo, setCurrentBoardInfo] = useState({})
    const getCurrentBoardDetail = () => {
        const queryStatement = query(collection(db, 'Boards'), where('boardMember', 'array-contains', userID))
        onSnapshot(queryStatement, e => {
            e.forEach(item => {
                setCurrentBoardInfo({...item.data(), boardID:item.id})
            })
        })
    }
    
    const [errorMsg, setErrorMsg] = useState('')
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
                cardListArr.push({...item.data(),cardListID:item.id, boardID:boardID})
                setCardListRender(cardListArr)
            })
        })
    }
    
    const handleScroll = () => {
        console.log('ee')
    }
    const currDom = useRef(null)
    const [trigger,setTrigger] = useState(false)
    useEffect(()=>{
        viewCardList(boardID)
        getCurrentBoardDetail()
        const element = currDom.current
        console.log(element)
        // element.addEventListener('scroll', handleScroll)
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
    
    const [popUpBool, setPopUpBool] = useState(false)
    const ViewCardListForm = () => {
        if(popUpBool === true) {
            return (
                <div className="h-full w-full bg-black/30 fixed z-20">
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
    
    
    return ( 
        <div className='h-screen'>
            <ViewCardListForm/>
            <NavBar id={userID}/>
            
            <div className="text-7xl font-black text-blue-500 my-5 text-center">{boardTitle}'s board</div>
            
            <div className="flex flex-col items-center m-5 h-3/4 mt-8">
                <div currDom={currDom} className="bg-blue-200/50 flex p-5 font-mono text-2xl gap-5 items-start w-full h-full rounded overflow-auto">
                    
                    {cardListRender.map((item) => (
                        <CardListItem key={item.cardListID} item={item} trigger={[trigger, setTrigger]} board={currentBoardInfo}/>
                    ))}
                    
                    <button onClick={e => setPopUpBool(!popUpBool)}className="p-2 bg-blue-500/80 hover:bg-blue-500/40 w-64 rounded text-white hover:scale-105 duration-300">+ add list</button>
                
                </div>
            </div>
        
        </div>
    );
}
 
export default CardContainer;