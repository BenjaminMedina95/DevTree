import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form'
import ErrorMessage from '../components/ErrorMessage';
import { LoginForm } from '../types';
import { toast } from 'sonner';
import api from '../config/axios';
import { isAxiosError } from 'axios';
import { useState } from 'react';
import { FiEye, FiEyeOff} from "react-icons/fi";
import { LoadingButton } from '../components/LoadingButton';

export default function LoginView() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] =useState(false)
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }
  const navigate = useNavigate()
  const initialValues: LoginForm = {
    email: '',
    password: ''
  }

  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues })

  const handleLogin = async (formData: LoginForm) => {

    setLoading(true)

    try {
      const { data } = await api.post(`/auth/login`, formData)
      localStorage.setItem('AUTH_TOKEN', data)    // Almacena el token de autenticacion en localStorage 
      navigate('/admin') //Direcciona al panel de administracion despues de loguearse
    }
    catch (error) {
      if (isAxiosError(error) && error.response) {
        toast.error(error.response.data.error)

      }
    }
    finally{
      setLoading(false)
    }

  }

  return (

    <>
      <h1 className="text-4xl text-white font-bold">Iniciar Sesión</h1>

      <form
        onSubmit={handleSubmit(handleLogin)}
        className="bg-white px-5 py-12 rounded-lg space-y-10 mt-10"
        noValidate
      >
        <div className="grid grid-cols-1 space-y-3">
          <label htmlFor="email" className="text-2xl text-slate-500">E-mail</label>
          <input
            id="email"
            type="email"
            placeholder="Email de Registro"
            className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
            {...register("email", {
              required: "El Email es obligatorio",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "E-mail no válido",
              },
            })}
          />
          {errors.email && (
            <ErrorMessage>{errors.email.message}</ErrorMessage>
          )}
        </div>
        <div className="grid grid-cols-1 space-y-3 relative">
          <label htmlFor="password" className="text-2xl text-slate-500">Password</label>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password de Registro"
            className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400 w-full pr-12"
            {...register("password", {
              required: "El Password es obligatorio",
            })}
          />
          <div className="absolute right-3 top-12 cursor-pointer text-slate-500"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <FiEyeOff size={22} /> : <FiEye size={22} />}
          </div>

          {errors.password && (
            <ErrorMessage>{errors.password.message}</ErrorMessage>
          )}
        </div>

        <button
          type="submit"
          className="bg-cyan-400 p-3 text-lg w-full uppercase text-slate-600 rounded-lg font-bold cursor-pointer flex items-center justify-center"
          disabled={loading} 
        >
         <LoadingButton loading={loading} text="Iniciar Sesión" type="submit" />
        </button>

      </form>

      <nav className='mt-10'>
        <Link
          className="text-center text-white text-lg block"
          to="/auth/register">
          ¿No tienes una cuenta? Crea una aquí</Link>
      </nav>

    </>

  )
}
