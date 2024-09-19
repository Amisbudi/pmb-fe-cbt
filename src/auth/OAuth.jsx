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
      if(decoded.scopes[0] == 'admission-admin'){
        const data = {
          expired: 86400,
          received: Math.floor(Date.now() / 1000),
          token: token,
        }
        localStorage.setItem('CBTtrisakti:token', JSON.stringify(data));
        navigate('/admin');
      } else if(decoded.scopes[0] == 'admission-participant'){
        const data = {
          expired: 86400,
          received: Math.floor(Date.now() / 1000),
          token: token,
        }
        localStorage.setItem('CBTtrisakti:token', JSON.stringify(data));
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