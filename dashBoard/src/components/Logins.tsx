// Login.js
import { useEffect, useContext } from 'react';
import { boardContext } from '../App';
import { useNavigate } from 'react-router-dom';

const CLIENT_ID = "364066402305-bhtao8o6c7nggnfs26k7qdfd73bp55uc.apps.googleusercontent.com";
const REDIRECT_URI = "http://localhost:5173";

function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      fetch('http://localhost:8000/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, redirectUrl: REDIRECT_URI }),
      })
        .then(response => response.json())
        .then(data => {
            localStorage.setItem('token', data.token)
          navigate('/dashboard');
        })
        .catch(error => {
          console.error('Error:', error);
        });
    } else {
      const authUrl =
        `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${CLIENT_ID}&` +
        `redirect_uri=${REDIRECT_URI}&` +
        `response_type=code&` +
        `scope=profile%20email`;

      window.location.href = authUrl;
    }
  }, []);

  return <div>Logging in...</div>;
}

export default Login;
