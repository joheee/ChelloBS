import { collection, onSnapshot } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { db } from "../../firebase/FirebaseHelper";
import CardCheckListContainer from "./CardCheckListContainer";

export const checkListContext = createContext()

const CardCheckListContainerItem = (prop) => {
    
    const [checkList, setCheckList] = useState([])
    const getAllCheckList = () => {
        const cardReference = collection(db, 'Boards', prop.item.boardID, 'CardLists', prop.item.cardListID, 'Cards', prop.card.cardID, 'CardCheckLists')
        
        let checkListArr = []
        onSnapshot(cardReference, e => {
            e.forEach(item => {
                checkListArr.push({...item.data(), checkListID:item.id, cardID:prop.card.cardID, boardID:prop.item.boardID, cardListID:prop.item.cardListID})
                setCheckList(checkListArr)
            })
        })
    }

    useEffect(()=> {
        getAllCheckList()
    },[prop.trigger[0]])

    return ( 
        <checkListContext.Provider value={prop.trigger}>
            {
                checkList.length !== 0 ?
                <div className="overflow-auto h-96">
                    {
                        checkList.map(e => (
                            <CardCheckListContainer key={e.checkListID} checkList={e}/>
                        )) 
                    }
                </div>
                : null
            }
        </checkListContext.Provider>
    )
}
 
export default CardCheckListContainerItem;