import React, { useState, useEffect, useContext } from 'react'
import { useParams, Link, withRouter } from 'react-router-dom'
import Axios from 'axios'
import ReactMarkdown from 'react-markdown'
import ReactTooltip from 'react-tooltip'

import Page from './Page'
import LoadingDotsIcon from './LoadingDotsIcon'
import NotFound from './NotFound'
import StateContext from '../StateContext'
import DispatchContext from '../DispatchContext'

export default withRouter(function ViewSinglePost(props) {
  const [isLoading, setIsLoading] = useState(true)
  const [post, setPost] = useState()
  const { id } = useParams()

  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  useEffect(() => {
    const request = Axios.CancelToken.source()

    async function fetchPost() {
      try {
        const response = await Axios.get(`/post/${id}`, { cancelToken: request.token })
        setPost(response.data)
        setIsLoading(false)
        console.log(response.data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchPost()

    return () => {
      request.cancel()
    }
  }, [id])

  if (!isLoading && !post) {
    return <NotFound />
  }

  if (isLoading)
    return (
      <Page title='...'>
        <LoadingDotsIcon />
      </Page>
    )

  const date = new Date(post.createdDate)
  const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`

  function isOwner() {
    if (appState.loggedIn) {
      return appState.user.username == post.author.username
    }
    return false
  }

  const deleteHandler = async () => {
    const areYouSure = window.confirm('Do you really want to delete this post?')
    if (areYouSure) {
      try {
        const response = await Axios.delete(`/post/${id}`, { data: { token: appState.user.token } })
        if ((response.data = 'Success')) {
          // 1. display a flash message
          appDispatch({ type: 'flashMessage', value: 'Post was successfully deleted' })

          // 2. redirect back to current user's profile
          props.history.push(`/profile/${appState.user.username}`)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  return (
    <Page title={post.title}>
      <div className='d-flex justify-content-between'>
        <h2>{post.title}</h2>
        {isOwner() && (
          <span className='pt-2'>
            <Link to={`/post/${post._id}/edit`} data-tip='Edit' data-for='edit' className='text-primary mr-2'>
              <i className='fas fa-edit'></i>
            </Link>
            <ReactTooltip id='edit' className='custom-tooltip' />{' '}
            <a onClick={deleteHandler} data-tip='Delete' data-for='delete' className='delete-post-button text-danger'>
              <i className='fas fa-trash'></i>
            </a>
            <ReactTooltip id='delete' className='custom-tooltip' />
          </span>
        )}
      </div>

      <p className='text-muted small mb-4'>
        <Link to={`/profile/${post.author.username}`}>
          <img className='avatar-tiny' src={post.author.avatar} />
        </Link>
        Posted by <Link to={`/profile/${post.author.username}`}>{post.author.username}</Link> on {formattedDate}
      </p>

      <div className='body-content'>
        <ReactMarkdown source={post.body} />
      </div>
    </Page>
  )
})
