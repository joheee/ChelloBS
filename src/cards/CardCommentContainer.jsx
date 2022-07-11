import { addDoc, collection, deleteDoc, doc, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase/FirebaseHelper";
import CardCommentItem from "./CardCommentItem";

const CardCommentContainer = ({card, trigger, board, item}) => {
    
    const {userID} = useParams()
    console.log(trigger)
    
    let getMessageInput = ''
    const handleCreateComment = (e) => {
        getMessageInput = e.target.value
    }
    const addNewComment = () => {
        if(getMessageInput !== ''){
            addDoc(collection(db, 'CardComments'), {
                commentMessage: getMessageInput,
                commentSender: userID,
                commentMentioned: '',
                cardID: card.cardID
            }).then(e => {
                trigger[1](!trigger[0])
            })
        }
    }
    const [cardComment, setCardComment] = useState([])
    const getCardComment = () => {
        let cardCommentArr = []
        const queryState = query(collection(db, 'CardComments'), where('cardID','==',card.cardID))
        onSnapshot(queryState, e => {
            e.forEach(comment => {
                cardCommentArr.push({...comment.data(), cardCommentID:comment.id})
                setCardComment(cardCommentArr)
            })
        })
    }
    
    useEffect(() =>{
        getCardComment()
    }, [trigger[0]])
    
    return ( 
        <div className="grid">
            <CardCommentItem card={card} trigger={trigger} board={board} item={item} comment={cardComment}/>
            
            <div className="flex mt-5 gap-2">
                <input onChange={e => handleCreateComment(e)} type="text" className="rounded p-2 w-full bg-blue-400 placeholder-white text-white" placeholder='write a comment...'/>
                <button onClick={e => addNewComment()} className="bg-green-500/80 hover:bg-green-500/40 rounded text-white p-2">send</button>
            </div>
                        
        </div>  
    );
}
 
export default CardCommentContainer;