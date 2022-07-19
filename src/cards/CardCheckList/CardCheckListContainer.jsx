import { addDoc, arrayUnion, collection, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useContext } from "react";
import { createContext } from "react";
import { db } from "../../firebase/FirebaseHelper";
import { checkListContext } from "./CardCheckListContainerItem";
import CardCheckListItem from "./CardCheckListItem";
import CardCheckListProgress from "./CardCheckListProgress";


const CardCheckListContainer = (props) => {
    
    const trigger = useContext(checkListContext)
    const cardReference = doc(db, 'Boards', props.checkList.boardID, 'CardLists', props.checkList.cardListID, 'Cards', props.checkList.cardID, 'CardCheckLists', props.checkList.checkListID)
    let checkListTitle = ''
    const checkListTitleInput = (e) => {
        checkListTitle = e.target.value
    }
    const createCheckListController = () => {
        if(checkListTitle !== ''){
            updateDoc(cardReference, {
                toDo: arrayUnion({done:false, toDoTitle:checkListTitle})
            })
            .then(e => {
                trigger[1](!trigger[0])
                setBoolAddItem(!boolAddItem)
            })
        }else alert('check list title must not empty')     
    }

    const [boolAddItem, setBoolAddItem] = useState(false)
    const AddCheckListItem = () => {
        return (
            <div className="">
                    <input onChange={checkListTitleInput} type="text" className="w-60 rounded my-4 p-2 border-2 border-blue-500 placeholder-blue-500" placeholder='add an item...'/>
                <div className="flex gap-4">
                    <button onClick={e => createCheckListController()} className="p-2 px-4 bg-blue-500/80 hover:bg-blue-500/40 rounded text-white">add</button>
                    <button onClick={e => setBoolAddItem(!boolAddItem)} className="p-2 px-4 bg-blue-200/80 hover:bg-blue-200/40 rounded text-blue-500 ">cancel</button>
                </div>
            </div>
        )
    }


    const deleteCheckList =  () => {
        deleteDoc(cardReference)
        .then(e => {
            trigger[1](!trigger[0])
        })
    }

    return ( 
        <div>
            <div className="flex flex-col">
                    <div className="flex items-center justify-between mt-10 px-2">
                        <div className="">{props.checkList.checkListTitle}</div>
                        <button onClick={e => deleteCheckList()} className="p-2 bg-blue-200/80 hover:bg-blue-200/40 w-40 rounded text-blue-500">delete</button>
                    </div>

                    <CardCheckListProgress checkListItem={props.checkList}/>
                    
                    <div className="grid gap-5">
                        {
                            props.checkList.toDo === undefined ? 
                            null :
                            props.checkList.toDo.map(e => (
                                <CardCheckListItem key={e.toDoTitle} checkListItem={e} cardReference={cardReference}/>
                            ))
                        }
                    </div>
                    
                    {
                        boolAddItem ? 
                        <AddCheckListItem/>
                        :
                        <button onClick={e => setBoolAddItem(!boolAddItem)} className="p-2 bg-blue-500/80 hover:bg-blue-500/40 w-40 rounded text-white mt-6">add an item</button>
                    }
            </div>
        </div>
    );
}
 
export default CardCheckListContainer;