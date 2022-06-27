import { collection, getDocs, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase/FirebaseHelper";

const CardItemTemplate = ({boardID, cardListID, triggerCard}) => {
    
    const [cardRender, setCardRender] = useState([])
    const viewCurrentCard = (boardID, cardListID) => {
        let cardArr = []
        const collRef = query(collection(db, 'Boards', boardID, 'CardLists', cardListID, 'Cards'))
        getDocs(collRef).then(e => {
            e.forEach(item => {
                let CardObj = {
                    cardID: item.id,
                    cardTitle: item.data().cardTitle,
                    cardChecklist: item.data().cardChecklist,
                    cardDesc: item.data().cardDesc,
                    cardDue: item.data().cardDue,
                    cardLabel: item.data().cardLabel,
                    cardLocation: item.data().cardLocation,
                    cardWatcher: item.data().cardWatcher
                }
                cardArr.push(CardObj)
                setCardRender(cardArr)
                console.log(cardArr)
            })
        })
    }
    
    useEffect(()=>{
        viewCurrentCard(boardID,cardListID)
    },[triggerCard])
    
    
    const [editTriger, setEditTriger] = useState(false)
    const EditCardForm = ({cards}) => {
        if(editTriger === true) {
            return (
                <div className="absolute bg-black/60 h-screen w-screen top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center font-mono">
                    <div className="bg-white w-1/2 p-5 rounded text-xl">
                        <div className="flex justify-between text-3xl">
                            {cards.cardTitle}
                            <button onClick={e => setEditTriger(!editTriger)} className="p-2 bg-blue-500/80 hover:bg-blue-500/40 w-10 rounded text-white">x</button>
                        </div>
                        <div className="mt-5 flex justify-between gap-5">
                            <div className="w-full flex flex-col gap-5">
                            
                                <div className="">
                                    <div className="">due date</div>
                                    <div className="">Jun 19 at 10:43 PM</div>
                                </div>
                                
                                <div className="">
                                    <div className="">description</div>
                                    <div className="">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officiis obcaecati, aperiam reprehenderit commodi, quae iste, suscipit laboriosam nulla ipsa veniam doloribus nobis perspiciatis nisi aliquam esse rerum ipsum provident nemo.</div>
                                </div>
                            
                                <div className="">
                                    <div className="">comment</div>
                                    <div className="">Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut consequatur corporis magni eligendi deserunt eius, placeat eveniet, quasi explicabo reiciendis facere, similique ut nihil suscipit velit rerum! Nam, totam voluptate.</div>
                                </div>
                            
                            </div>
                            
                            <div className="flex flex-col gap-2">
                                <div className="mb-3">add to card</div>
                                <button className="p-2 bg-blue-500/80 hover:bg-blue-500/40 w-64 rounded text-white">watchers</button>
                                <button className="p-2 bg-blue-500/80 hover:bg-blue-500/40 w-64 rounded text-white">labels</button>
                                <button className="p-2 bg-blue-500/80 hover:bg-blue-500/40 w-64 rounded text-white">checklist</button>
                                <button className="p-2 bg-blue-500/80 hover:bg-blue-500/40 w-64 rounded text-white">dates</button>
                                
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }
    
    
     
    let count = 0
    return (
        <div className="">
            
            {cardRender.map((item) => (
                <div className="" key={count++}>
                    <EditCardForm cards={item}/>
                    <div onClick={e => setEditTriger(!editTriger)} className="bg-white hover:bg-white/90 m-2 p-2 rounded cursor-pointer">{item.cardTitle}</div>
                </div>
            ))}
        </div>
    );
}
 
export default CardItemTemplate;