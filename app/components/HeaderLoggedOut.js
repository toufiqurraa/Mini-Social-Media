import React, { useState } from 'react'
import Axios from 'axios'

export default function HeaderLoggedOut(props) {
  const [username, setUsername] = useState()
  const [password, setPassword] = useState()

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const response = await Axios.post('/login', { username, password })
      if (response.data) {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('username', response.data.username)
        localStorage.setItem('avatar', response.data.avatar)
        props.setLoggedIn(true)
      } else {
        console.log('Incorrect username or password')
      }
    } catch (error) {
      console.log('False')
    }
  }

  return (
    <form onSubmit={handleSubmit} className='mb-0 pt-2 pt-md-0'>
      <div className='row align-items-center'>
        <div className='col-md mr-0 pr-md-0 mb-3 mb-md-0'>
          <input onChange={e => setUsername(e.target.value)} name='username' className='form-control form-control-sm input-dark' type='text' placeholder='Username' autoComplete='off' />
        </div>
        <div className='col-md mr-0 pr-md-0 mb-3 mb-md-0'>
          <input onChange={e => setPassword(e.target.value)} name='password' className='form-control form-control-sm input-dark' type='password' placeholder='Password' />
        </div>
        <div className='col-md-auto'>
          <button className='btn btn-success btn-sm'>Sign In</button>
        </div>
      </div>
    </form>
  )
}
