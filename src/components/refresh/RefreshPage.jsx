import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const RefreshPageWorkspace = () => {
    
    const navigate = useNavigate()
    const {userID} = useParams()
    
    useEffect(() =>{
        navigate(`/workspace/${userID}`)
    },[])
}

const RefreshPageBoard = () => {
    const navigate = useNavigate()
    const {workspaceID, userID} = useParams()
    
    useEffect(() =>{
        navigate(`/board/${workspaceID}/${userID}`)
    }, [])
}
 
const RefreshPageCardListAndCard = () => {
    const navigate = useNavigate()
    const {workspaceID, boardID, userID, boardTitle} = useParams()
    
    useEffect(() =>{
        navigate(`/card/${workspaceID}/${boardID}/${userID}/${boardTitle}`)
    }, [])
}
 
export {RefreshPageWorkspace, RefreshPageBoard, RefreshPageCardListAndCard}