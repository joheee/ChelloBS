import { arrayUnion, doc, updateDoc, query, where, collection, getDocs, deleteField, deleteDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import {db} from '../../firebase/FirebaseHelper'

const InvitationPageContainer = () => {

    const {workspaceID, userID, title, messageID} = useParams()
    const navigate = useNavigate()
    console.log(userID)
    
    const deleteMessage = (text) => {
        const queryStatement = query(collection(db, 'Messages'), where('message', '==', workspaceID), where('receiver', '==', userID), where('workspaceTitle', '==', title))
        getDocs(queryStatement).then(e => {
            e.forEach(item => {
                deleteDoc(item.ref).then(() => {
                    alert(text)
                    navigate(`/workspace/${userID}`)
                })
            })
        })
    }

    const handleReject = () => {
        console.log('asdfasd')
        deleteMessage(`reject ${title}\'s invitation`)
    }
    
    const handleAccept = () => {
        updateDoc(doc(db, 'Workspaces', workspaceID), {
            workspaceMember: arrayUnion(userID)
        }).then(e => {
            deleteMessage(`succes join ${title}\'s workspace`)
        })
    }

    return ( 
        <div>
        <div className="bg-blue-400 p-5 flex items-center gap-5 justify-center h-screen">
        
            <div className="text-7xl font-black text-white m-5">{title}</div>
            <div className="bg-green-200 p-2 font-mono rounded">
                <button onClick={() => handleAccept()} className="font-black text-3xl my-3">accept</button>
            </div>
            <div className="bg-red-200 p-2 font-mono rounded">
                <button onClick={()=> handleReject()} className="font-black text-3xl my-3">reject</button>
            </div>
        </div>
    </div>
    );
}
 
export default InvitationPageContainer;