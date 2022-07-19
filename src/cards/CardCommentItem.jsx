import { useContext } from "react";
import { useParams } from "react-router-dom";
import { OtherWatcherContext } from "./CardCommentContainer";

const CardCommentItem = (prop) => {
    
    const {userID} = useParams()
    const otherWatcher = useContext(OtherWatcherContext)
    
    return ( 
        <div className="grid text-base gap-5 overflow-auto h-60">
            {
                prop.comment.map(item => (
                    <div key={item.cardCommentID} className="">
                        {
                            userID === item.commentSender ? 
                            <div className="flex justify-end text-white">
                                <div className="bg-green-300 max-w-xs text-end p-2 rounded">{item.commentMessage}</div>
                            </div>
                            :
                            <div className="flex justify-start text-white">
                                <div className="bg-blue-300 max-w-xs p-2 rounded">{item.commentMessage}</div>
                            </div>
                        }
                    </div>
                ))
            }
        </div>
    );
}
 
export default CardCommentItem;