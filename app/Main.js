import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Axios from 'axios'
Axios.defaults.baseURL = 'http://localhost:8080'

import Header from './components/Header'
import HomeGuest from './components/HomeGuest'
import Home from './components/Home'
import Footer from './components/Footer'
import About from './components/About'
import Terms from './components/Terms'
import CreatePost from './components/CreatePost'
import ViewSinglePost from './components/ViewSinglePost'
import FlashMessages from './components/FlashMessages'

const Main = () => {
  const [loggedIn, setLoggedIn] = useState(Boolean(localStorage.getItem('token')))
  const [flashMessages, setFlashMessages] = useState([])

  const addFlashMessages = msg => {
    setFlashMessages(prev => prev.concat(msg))
  }

  return (
    <Router>
      <FlashMessages messages={flashMessages} />

      <Header loggedIn={loggedIn} setLoggedIn={setLoggedIn} />

      <Switch>
        <Route path='/' exact>
          {loggedIn ? <Home /> : <HomeGuest />}
        </Route>

        <Route path='/create-post' exact>
          <CreatePost addFlashMessages={addFlashMessages} />
        </Route>

        <Route path='/post/:id'>
          <ViewSinglePost />
        </Route>

        <Route path='/about-us' exact>
          <About />
        </Route>

        <Route path='/terms' exact>
          <Terms />
        </Route>
      </Switch>

      <Footer />
    </Router>
  )
}

ReactDOM.render(<Main />, document.getElementById('app'))

if (module.hot) {
  module.hot.accept()
}
