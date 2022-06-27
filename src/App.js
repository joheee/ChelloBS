import LoginForm from './components/auth/Login/Login.jsx'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Workspace from './components/workspace/Workspace.jsx'
import Profile from './components/profile/Profile.jsx'
import BoardContainer from './components/board/Board.jsx'
import InvitationPageContainer from './components/notification/InvitationPage.jsx'
import CardContainer from './cards/CardContainer.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<LoginForm/>}></Route>
        <Route exact path="/workspace/:id" element={<Workspace/>}></Route>
        <Route exact path="/profile/:id" element={<Profile/>}></Route>
        <Route exact path="/board/:workspaceID/:userID" element={<BoardContainer/>}></Route>
        <Route exact path="/card/:workspaceID/:boardID/:userID/:boardTitle" element={<CardContainer/>}></Route>
        
        <Route exact path="/invitation/:workspaceID/:userID/:title/:messageID" element={<InvitationPageContainer/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;