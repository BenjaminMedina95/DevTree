import {Outlet} from 'react-router-dom'
import {Toaster} from 'sonner'
import { Logo } from '../components/Logo'

export default function AuthLayout() {
  return (
    <>
        <div className=' bg-gradient-to-r from-[#093028] to-[#237A57] min-h-screen'>
                <div className='max-w-lg mx-auto pt-10 px-5'>
                   <Logo/>
                <div className="py-10">
                   <Outlet></Outlet>
                </div>
               </div>
            </div>

            <Toaster position='top-right'/>
    </>
  )
}
