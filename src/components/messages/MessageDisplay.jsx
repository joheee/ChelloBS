import {useState} from 'react'

const MessageDisplay = ({text}) => {

    const [display, setDisplay] = useState(true)

    const handleDisplay = (e) => {
        e.preventDefault()
        setDisplay(false)
    }

    if(display === true) {
        return (
            <div className="h-full w-full bg-black/30 fixed">
                <div className="flex justify-center items-center h-full">
                    <a href="/display/error" onClick={(e) => handleDisplay(e)}>
                        <div className="bg-white/80 px-10 py-7 rounded text-center">
                            <div className="text-red-500 text-xl font-bold">{text}</div>
                        </div>
                    </a>
                </div>
            </div>
        )
    }
}

export default MessageDisplay