import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Axios from 'axios'
import ReactMarkdown from 'react-markdown'

import Page from './Page'
import LoadingDotsIcon from './LoadingDotsIcon'

export default function ViewSinglePost() {
  const [isLoading, setIsLoading] = useState(true)
  const [post, setPost] = useState()
  const { id } = useParams()

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
  }, [])

  if (isLoading)
    return (
      <Page title='...'>
        <LoadingDotsIcon />
      </Page>
    )

  const date = new Date(post.createdDate)
  const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`

  return (
    <Page title={post.title}>
      <div className='d-flex justify-content-between'>
        <h2>{post.title}</h2>
        <span className='pt-2'>
          <a href='#' className='text-primary mr-2' title='Edit'>
            <i className='fas fa-edit'></i>
          </a>
          <a className='delete-post-button text-danger' title='Delete'>
            <i className='fas fa-trash'></i>
          </a>
        </span>
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
}
