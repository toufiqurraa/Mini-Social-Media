import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Axios from 'axios'
Axios.defaults.baseURL = 'http://localhost:8080'
import { useImmerReducer } from 'use-immer'

import Header from './components/Header'
import HomeGuest from './components/HomeGuest'
import Home from './components/Home'
import Footer from './components/Footer'
import About from './components/About'
import Terms from './components/Terms'
import CreatePost from './components/CreatePost'
import ViewSinglePost from './components/ViewSinglePost'
import FlashMessages from './components/FlashMessages'
import StateContext from './StateContext'
import DispatchContext from './DispatchContext'
import Profile from './components/Profile'

const Main = () => {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem('token')),
    flashMessages: [],
    user: {
      token: localStorage.getItem('token'),
      username: localStorage.getItem('username'),
      avatar: localStorage.getItem('avatar')
    }
  }

  const reduce = (draft, action) => {
    switch (action.type) {
      case 'login':
        draft.loggedIn = true
        draft.user = action.data
        return
      case 'logout':
        draft.loggedIn = false
        return
      case 'flashMessages':
        draft.flashMessages.push(action.value)
        return
    }
  }

  const [state, dispatch] = useImmerReducer(reduce, initialState)

  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem('token', state.user.token)
      localStorage.setItem('username', state.user.username)
      localStorage.setItem('avatar', state.user.avatar)
    } else {
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      localStorage.removeItem('avatar')
    }
  }, [state.loggedIn])

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <Router>
          <FlashMessages messages={state.flashMessages} />

          <Header />

          <Switch>
            <Route path='/' exact>
              {state.loggedIn ? <Home /> : <HomeGuest />}
            </Route>

            <Route path='/create-post' exact>
              <CreatePost />
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

            <Route path='/profile/:username'>
              <Profile />
            </Route>
          </Switch>

          <Footer />
        </Router>
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}

ReactDOM.render(<Main />, document.getElementById('app'))

if (module.hot) {
  module.hot.accept()
}
