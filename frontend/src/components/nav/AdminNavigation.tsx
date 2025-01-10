import { useQueryClient } from "@tanstack/react-query";


export const AdminNavigation = () => {

  const queryClient = useQueryClient()

  const logout =() =>{    
    localStorage.removeItem('AUTH_TOKEN') //SE ELIMINA EL TOKEN
    queryClient.invalidateQueries({queryKey: ['user']}) //SE INVALIDA LOS QUERY'S 
  }
  return (
    <button
      className=" bg-lime-500 p-2 text-slate-800 uppercase font-black text-xs rounded-lg cursor-pointer"
      onClick={logout }>
      Cerrar Sesión
    </button>
  )
}
