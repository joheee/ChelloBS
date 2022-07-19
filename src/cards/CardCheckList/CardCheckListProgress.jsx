import ProgressBar from '@ramonak/react-progress-bar'

const CardCheckListProgress = (props) => {
    
  let allToDo = props.checkListItem.toDo.length
  
  let percentageMecha = () => {
    if(allToDo !== 0){
      let trueCount = 0
      props.checkListItem.toDo.forEach(e => {
        if(e.done === true) trueCount++
      })
      return (trueCount*100/allToDo)
    } else return 0
  }

  return ( 
      <ProgressBar 
        completed={percentageMecha()}
        className='my-5 px-2'
      />
  )
}
 
export default CardCheckListProgress;