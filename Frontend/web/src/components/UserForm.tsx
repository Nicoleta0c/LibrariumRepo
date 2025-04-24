import React, { useState } from 'react';
import Input from './Inputs';
import Button from './Buttons';

type User = {
  name: string;
  email: string;
  password?: string;
  profilePicture?: string;
};

type Props = {
  initialData: User;
  onSubmit: (data: User) => void;
  mode: 'edit' | 'register';
};

const UserForm: React.FC<Props> = ({ initialData, onSubmit, mode }) => {
  const [name, setName] = useState(initialData.name || '');
  const [email, setEmail] = useState(initialData.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState(initialData.profilePicture || '');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name) newErrors.name = 'Name is required';
    if (!email) newErrors.email = 'Email is required';
    else if (!/^[\w.%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) newErrors.email = 'Invalid email address';
    if (mode === 'register' && !password) newErrors.password = 'Password is required';
    if (mode === 'register' && password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    if (Object.keys(newErrors).length === 0) {
      onSubmit({ name, email, password, profilePicture });
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto mt-5">
      <h2 className="text-2xl font-bold text-cyan-700 mb-4 text-center">
        {mode === 'edit' ? 'Editar Perfil' : 'Registro de Usuario'}
      </h2>
      <div className="space-y-4">
        <Input type="text" name="name" label="Nombre" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} />
        <Input type="email" name="email" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />

        {mode === 'register' && (
          <>
            <Input type="password" name="password" label="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} />
            <Input type="password" name="confirmPassword" label="Confirmar Contraseña" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} error={errors.confirmPassword} />
          </>
        )}

        {mode === 'edit' && (
          <>
            <Input
              type="password"
              name="password"
              label="Nueva contraseña (opcional)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Input
              type="text"
              name="profilePicture"
              label="Foto de perfil (URL)"
              value={profilePicture}
              onChange={(e) => setProfilePicture(e.target.value)}
            />

            {profilePicture && (
              <div className="flex justify-center mt-2">
                <img
                  src={profilePicture}
                  alt="Preview"
                  className="h-16 w-16 rounded-full border"
                />
              </div>
            )}
          </>
        )}

        <div className="text-center">
          <Button type="button" text={mode === 'edit' ? 'Guardar Cambios' : 'Registrarse'} onClick={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

export default UserForm;
