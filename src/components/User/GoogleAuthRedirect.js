import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
//import { toast } from 'react-toastify'; // Assuming you're using react-toastify for toasts
//import 'react-toastify/dist/ReactToastify.css'; // Import toast styles

const GoogleAuthRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Add a delay to ensure the URL is fully loaded with query parameters
    const timer = setTimeout(() => {
      const queryParams = new URLSearchParams(window.location.search);
      const token = queryParams.get('token');
      //const error = queryParams.get('error');
      console.log('Token:', token);

      if (token) {
        localStorage.setItem('token', token);
        navigate('/');
      } else {
        console.error('No token found in the URL');
        navigate('/login');
      }
    }, 100); // 100 ms delay

    // Clean up the timeout
    return () => clearTimeout(timer);
  }, [navigate]);

  return <div>Redirecting...</div>;
};

export default GoogleAuthRedirect;
