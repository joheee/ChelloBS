import { useParams } from "react-router-dom";

const CardCommentItem = ({card, trigger, board, item, comment}) => {
    
    const {userID} = useParams()
    console.log(comment)
    
    return ( 
        <div className="grid text-base gap-5 overflow-auto h-60">
            {
                comment.map(item => (
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