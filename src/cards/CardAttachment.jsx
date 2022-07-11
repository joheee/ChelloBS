import { arrayRemove, arrayUnion, collection, doc, onSnapshot, query, updateDoc } from "firebase/firestore"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { db, storages } from "../firebase/FirebaseHelper"

const CardAttachment = ({card, trigger, board, item}) => {
    console.log(trigger)
    const cardReference = doc(db, 'Boards', item.boardID, 'CardLists', item.cardListID, 'Cards', card.cardID)
    const navigate = useNavigate()
    const {workspaceID, boardID, userID, boardTitle} = useParams()
    
    const handleFile = (e) => {
        const file = e.target.files[0].name
        const userRef = ref(storages, `/card/attachment/${card.cardID}/${file}`)
        const metadata = {contentType : 'profile pic'}
        uploadBytes(userRef, e.target.files[0], metadata)
        .then(e => {
            getDownloadURL(userRef)
            .then(url => {
                updateDoc(cardReference,{
                    cardAttachment: arrayUnion({url:url, file:file}),
                })
                .then(e => {
                    navigate(`/refresh/card/${workspaceID}/${boardID}/${userID}/${boardTitle}`)
                })
            })
        })
    }
    
    let attachmentInputLink = ''
    const handleInputLink = (e) => {
        attachmentInputLink = e.target.value
    } 
    let attachmentInputTitle = ''
    const handleInputTitle = (e) => {
        attachmentInputTitle = e.target.value
    }
    
    
    const attachLink = () => {
        if(attachmentInputLink !== '' && attachmentInputTitle !== ''){
            updateDoc(cardReference, {
                cardAttachment: arrayUnion({url:attachmentInputLink, file:attachmentInputTitle})
            })
            .then(e => {
                navigate(`/refresh/card/${workspaceID}/${boardID}/${userID}/${boardTitle}`)
            })
        }
    }
    const detachLink = () => {
        if(attachmentInputTitle !== ''){
            const queryState = query(collection(db, 'Boards', item.boardID, 'CardLists', item.cardListID, 'Cards'))
            onSnapshot(queryState, e => {
                e.forEach(item => {
                    console.log(item.data())
                    if(item.data().cardAttachment !== undefined){
                        item.data().cardAttachment.map(attach => {
                            if(attach.file === attachmentInputTitle){
                                updateDoc(cardReference,{
                                   cardAttachment: arrayRemove({url:attach.url, file:attachmentInputTitle})
                                })
                                .then(e => {
                                    navigate(`/refresh/card/${workspaceID}/${boardID}/${userID}/${boardTitle}`)
                                })
                            }
                        })
                    } 
                })
            })
        }
    }
    
    
    return ( 
        <div className="bg-white p-4 rounded flex flex-col items-center gap-4 ">
            <div className="">attachment</div>
            
            <input type="file" onChange={e => handleFile(e)} className="mb-5"/>
            
            <div className="h-1 bg-blue-500 w-80 my-2"></div>
            
            <input onChange={e => handleInputTitle(e)} type="text" className="w-80 rounded p-2 border-2 border-blue-500 placeholder-blue-500 " placeholder='named your link'/>
            <input onChange={e => handleInputLink(e)} type="text" className="w-80 rounded p-2 border-2 border-blue-500 placeholder-blue-500 " placeholder='attach link'/>
            <button onClick={e => attachLink()} className="p-2 bg-pink-500/80 hover:bg-pink-500/40 w-80 rounded text-white">attach link</button>
            
            <div className="h-1 bg-blue-500 w-80 my-2"></div>
            <input onChange={e => handleInputTitle(e)} type="text" className="w-80 rounded p-2 border-2 border-blue-500 placeholder-blue-500 " placeholder='delete your file'/>
            <button onClick={e => detachLink()} className="p-2 bg-green-500/80 hover:bg-green-500/40 w-80 rounded text-white">detach link</button>
            
        </div>
    );
}
 
export default CardAttachment;