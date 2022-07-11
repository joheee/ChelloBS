import { collection, getDocs, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase/FirebaseHelper";
import EachCardItem from "./CardItem";

const CardContainer = ({item, trigger, board}) => {
    
    const [cardRender, setCardRender] = useState([])
    const viewCurrentCard = (boardID, cardListID) => {
        let cardArr = []
        const collRef = query(collection(db, 'Boards', boardID, 'CardLists', cardListID, 'Cards'))
        getDocs(collRef).then(e => {
            e.forEach(item => {
                cardArr.push({...item.data(), cardID:item.id})
                setCardRender(cardArr)
            })
        })
    }
    
    useEffect(()=>{
        viewCurrentCard(item.boardID,item.cardListID)
    },[trigger[0]])
     
    return (
        <div className="">
            {cardRender.map((card) => (
                <EachCardItem card={card} trigger={trigger} key={card.cardID} board={board} item={item}/>
            ))}
        </div>
    );
}
 
export default CardContainer;