import { addDoc, collection, deleteDoc, doc, onSnapshot, query, where } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase/FirebaseHelper";
import CardCommentItem from "./CardCommentItem";
import { MentionsInput, Mention } from "react-mentions";

export const OtherWatcherContext = createContext()

const CardCommentContainer = ({card, trigger, board, item}) => {
    
    const {userID, workspaceID,boardID,boardTitle} = useParams()
    const [otherWatcher, setOtherWatcher] = useState([])

    const getOtherUser = () => {
        const otherCardWatcher = card.cardWatcher.filter(item => {
            return item !== userID
        })
        let otherCardWatcherArr = []
        const queryState = query(collection(db, 'Users'), where('uid','in',otherCardWatcher))
        onSnapshot(queryState, e => {
            e.forEach(item => {
                otherCardWatcherArr.push({id:item.data().uid, display:item.data().email})
                setOtherWatcher(otherCardWatcherArr)
            })
        })
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
        getOtherUser()
    }, [trigger[0]])
    
    const [state, setState] = useState("")
    const [saveMention,setSaveMention] = useState([])
    function handleCreateComment(event, newValue, newPlainTextValue, mentions) {
        setState(newPlainTextValue)
        let mentionArr = []
        if(mentions.length !== 0){
            mentions.forEach(user => {
                mentionArr.push({...user, workspaceID:workspaceID, boardID:boardID, boardTitle:boardTitle})
                setSaveMention(mentionArr)
                console.log(mentionArr)
            })
        }
    }

    const addNewComment = () => {
        if(state !== ''){
            if(saveMention.length !== 0){
                saveMention.forEach(mention => {
                    addDoc(collection(db, 'CardMentions'), {
                        sender:userID,
                        receiver:mention.id,
                        workspaceID:mention.workspaceID,
                        boardID:mention.boardID,
                        boardTitle:mention.boardTitle,
                        cardTitle:card.cardTitle,
                        cardID: card.cardID
                    })
                })
            }
            addDoc(collection(db, 'CardComments'), {
                commentMessage: state,
                commentSender: userID,
                commentMentioned: '',
                cardID: card.cardID
            }).then(e => {
                trigger[1](!trigger[0])
            })
            
        }
    }

    return ( 
        <OtherWatcherContext.Provider value={otherWatcher}>
            <div className="grid">
                <CardCommentItem trigger={trigger} comment={cardComment}/>
                
                <div className="flex mt-5 gap-2">

                    <MentionsInput className="rounded p-2 w-full bg-blue-200 placeholder-white"
                        markup="__type__[[[__display__]]](__id__)"
                        onChange={handleCreateComment}
                        value={state}
                    >
                        <Mention trigger="@" data={otherWatcher} type="@" />
                    </MentionsInput>

                    <button onClick={e => addNewComment()} className="bg-green-500/80 hover:bg-green-500/40 rounded text-white p-2">send</button>
                </div>
                            
            </div>  
        </OtherWatcherContext.Provider>
    );
}
 
export default CardCommentContainer;