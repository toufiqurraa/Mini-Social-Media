import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import Axios from 'axios'

import LoadingDotsIcon from './LoadingDotsIcon'

export default function ProfilePost() {
  const { username } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const request = Axios.CancelToken.source()

    async function fetchPosts() {
      try {
        const response = await Axios.get(`/profile/${username}/posts`, { cancelToken: request.token })
        setPosts(response.data)
        setIsLoading(false)
        console.log(response.data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchPosts()

    return () => {
      request.cancel()
    }
  }, [])

  if (isLoading) return <LoadingDotsIcon />

  return (
    <div className='list-group'>
      {posts.map(post => {
        const date = new Date(post.createdDate)
        const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`

        return (
          <Link key={post._id} to={`/post/${post._id}`} className='list-group-item list-group-item-action'>
            <img className='avatar-tiny' src={post.author.avatar} /> <strong>{post.title}</strong> <span className='text-muted small'>on {formattedDate} </span>
          </Link>
        )
      })}
    </div>
  )
}
