import React, { useState, useContext } from 'react'
import { withRouter } from 'react-router'
import Axios from 'axios'

import Page from './Page'
import DispatchContext from '../DispatchContext'
import StateContext from '../StateContext'

export default withRouter(function CreatePost(props) {
  const [title, setTitle] = useState()
  const [body, setBody] = useState()
  const appDispatch = useContext(DispatchContext)
  const appState = useContext(StateContext)

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const response = await Axios.post('/create-post', { title, body, token: appState.user.token })
      // Redirect to new post url
      appDispatch({ type: 'flashMessages', value: 'Congrats, The New Post was Created Successfully!' })
      props.history.push(`/post/${response.data}`)
      console.log('New post was created')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Page title='Create New Post'>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor='post-title' className='text-muted mb-1'>
            <small>Title</small>
          </label>
          <input onChange={e => setTitle(e.target.value)} autoFocus name='title' id='post-title' className='form-control form-control-lg form-control-title' type='text' placeholder='' autoComplete='off' />
        </div>

        <div className='form-group'>
          <label htmlFor='post-body' className='text-muted mb-1 d-block'>
            <small>Body Content</small>
          </label>
          <textarea onChange={e => setBody(e.target.value)} name='body' id='post-body' className='body-content tall-textarea form-control' type='text'></textarea>
        </div>

        <button className='btn btn-primary'>Save New Post</button>
      </form>
    </Page>
  )
})
