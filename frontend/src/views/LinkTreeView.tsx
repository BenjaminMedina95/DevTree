import { useEffect, useState } from 'react'
import {social} from '../data/social'
import DevTreeInput from '../components/DevTreeInput'
import { isValidlUrl } from '../utils'
import { toast } from 'sonner'
import { useMutation,useQueryClient } from '@tanstack/react-query'
import { updateProfile } from '../api/DevTreeAPI'
import { SocialNetwork, User } from '../types'


export default function LinkTreeView() {
  const [devTreeLinks, setDevTreeLinks] = useState(social)

  const queryClient = useQueryClient()
  const user: User = queryClient.getQueryData(['user'])!
  
  const {mutate} = useMutation({
    mutationFn: updateProfile,
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess:()=>{
      toast.success('Actualizado Correctamente')
    }
  })

  useEffect(() =>{
    const updatedData = devTreeLinks.map(item => {
      const userlink = JSON.parse(user.links).find((link: SocialNetwork) => link.name ===item.name)
      if(userlink){
        return {...item, url: userlink.url , enabled: userlink.enabled}
      }
      return item
    })
    setDevTreeLinks(updatedData)       
  },[])

  const handleUrlChange = (e:  React.ChangeEvent<HTMLInputElement>)=>{
    //Se posiciona en el url correspondiente
    const updatedLinks = devTreeLinks.map(link => link.name === e.target.name ? {...link, url: e.target.value}: link)
    setDevTreeLinks(updatedLinks)

    
  }

  const links: SocialNetwork[] = JSON.parse(user.links)

  const handleEnableLink = (socialNetwork: string) =>{
    const updatedLinks = devTreeLinks.map (link => {
     if (link.name === socialNetwork){
      if(isValidlUrl(link.url)){
        return{...link, enabled: !link.enabled}
      }
      else{
        toast.error('URL no válida')
      }
     }   
      return link     
    })
    setDevTreeLinks(updatedLinks)
    let updatedItems: SocialNetwork[] = []
    const selectedSocialNetwork = updatedLinks.find(link=> link.name === socialNetwork)
    if(selectedSocialNetwork?.enabled){
      const newItem ={
        ...selectedSocialNetwork,
        id:links.length+1
      }   
      updatedItems = [...links, newItem]
    
    }
    else{
      updatedItems = links.filter(link => link.name !== socialNetwork)
      
    }
    console.log(updatedItems);
    
    
    //Almacena en la base de datos
    queryClient.setQueryData(['user'], (prevData:User) =>{
      return{
        ...prevData,
        links:JSON.stringify(updatedItems) //Se transforma el json a string
      }
    })
  } 
  return (
    <>
    <div className='space-y-5' >
      {devTreeLinks.map(item => (
          <DevTreeInput
            key={item.name}
            item = {item}
            handleUrlChange={handleUrlChange}
            handleEnableLink = {handleEnableLink}
            
          />
      ))}
        <button 
          className='bg-cyan-400 p-2 text-lg- w-full uppercase text-slate-600 rounded font-bold hover:bg-cyan-500'
          onClick={() => mutate(user)}>
          Guardar Cambios
        </button>

    </div>
    </>

  )
}
