import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'

const OAuth = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if(token){
      const decoded = jwtDecode(token);
      if(decoded.role == 'admin'){
        localStorage.setItem('CBTtrisakti:token', token);
        navigate('/admin');
      } else if(decoded.role == 'participant'){
        localStorage.setItem('CBTtrisakti:token', token);
        navigate('/dashboard')
      } else {
        navigate('/');
      }
    } else {
      console.log('tidak ada');
    }
  }, []);
  return (
    <div>OAuth</div>
  )
}

export default OAuth