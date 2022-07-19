import { arrayRemove, arrayUnion, updateDoc } from "firebase/firestore";
import { useContext, useState } from "react";
import { checkListContext } from "./CardCheckListContainerItem";

const CardCheckListItem = (props) => {

    const [isChecked, setIsChecked] = useState(props.checkListItem.done)
    const trigger = useContext(checkListContext)

    const deleteCheckListItem = () => {
        updateDoc(props.cardReference, {
            toDo:arrayRemove({done:props.checkListItem.done, toDoTitle:props.checkListItem.toDoTitle})
        })
        .then(e => {
            trigger[1](!trigger[0])
        })
    }

    const setCheckListBoolean = () => {
        let done = !props.checkListItem.done
        let title = props.checkListItem.toDoTitle
        updateDoc(props.cardReference, {
            toDo:arrayRemove({done:props.checkListItem.done, toDoTitle:props.checkListItem.toDoTitle})
        })
        .then(e => {
            updateDoc(props.cardReference, {
                toDo:arrayUnion({done:done, toDoTitle:title})
            })
            .then(e => {
                setIsChecked(done)
                trigger[1](!trigger[0])
            })
        })
    }    

    return ( 
        <div className="flex items-center gap-2">
            <input type="checkbox" className="w-5 h-5" defaultChecked={props.checkListItem.done} onClick={e => setCheckListBoolean()}/>
            <div className="flex items-center justify-between w-full pr-3">
                {
                    !isChecked ? 
                    <p>{props.checkListItem.toDoTitle}</p>
                    :
                    <del>{props.checkListItem.toDoTitle}</del>
                }
                <div onClick={e => deleteCheckListItem()} className="cursor-pointer text-white bg-blue-500/80 hover:bg-blue-500/40 p-2 rounded">del</div>
            </div>
        </div>
     );
}
 
export default CardCheckListItem;