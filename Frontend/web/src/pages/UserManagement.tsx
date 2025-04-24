import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Inputs';
import Button from '../components/Buttons';
import { useAppContext } from '../context/AppContext';


const UserLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { loginUser } = useAppContext();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await fetch('http://localhost:4000/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
  
      const data = await response.json();
  
      if (response.ok) {
        const { user } = data;
  
        loginUser(user);
  
        if (user.admin_user) {
          navigate('/adminProfile');
        } else {
          navigate('/userProfile');
        }
  
        setEmail('');
        setPassword('');
      } else {
        setError(data.error || 'Error al iniciar sesión');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-cyan-700 mb-6 text-center">Login</h1>
        <div className="space-y-6">
          <Input
            name="email"
            type="email"
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            name="password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div className="flex justify-center">
            <Button
              type="button"
              text="Login"
              onClick={handleLogin}
              className="bg-cyan-500 text-white hover:bg-cyan-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
