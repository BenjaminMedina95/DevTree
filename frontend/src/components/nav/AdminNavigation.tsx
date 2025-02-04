import { useState } from 'react'
import { useQueryClient } from "@tanstack/react-query";
import { LoadingButton } from '../LoadingButton';


export const AdminNavigation = () => {

  const queryClient = useQueryClient()
  const [loading, setLoading] = useState(false)

  const logout = async () => {
    setLoading(true)
    try {
      localStorage.removeItem('AUTH_TOKEN') //SE ELIMINA EL TOKEN
      await queryClient.invalidateQueries({ queryKey: ['user'] }) //SE INVALIDA LOS QUERY'S 

    } catch (error) {
      console.log("Error al cerrar sesión", error);
    }
    finally {
      setLoading(false)
    }
  }
  return (
    <button
      className="bg-lime-500 p-2 text-slate-800 uppercase font-black text-xs rounded-lg cursor-pointer flex items-center justify-center"
      disabled={loading} // Deshabilita el botón mientras carga
    >
      <LoadingButton loading={loading} text="Cerrar Sesión" onClick={logout} />
    </button>
  )
}
