import { SocialNetwork, UserHandle } from "../types"

type HandleDataProps = {
    data: UserHandle
}
export const HandleData = ({ data }: HandleDataProps) => {

    const links: SocialNetwork[] = JSON.parse(data.links).filter((link: SocialNetwork) => link.enabled)
    return (
        <div className="space-y-6 text-white">
            <p className="text-5xl text-center ">@{data.handle}</p>
            {data.image && <img src={data.image} className="max-w-[250px] mx-auto" />}
            <p className="text-lg text-center font-bold">{data.description}</p>

            <div className="flex justify-center items-center gap-4 mt-4">
                {links.map(link => (
                    <a 
                        key={link.name}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer noopener"
                    >
                        <img 
                        src={`/social/iconblack_${link.name}.svg`}
                        alt={`Icono de ${link.name}`}
                        className="w-10 h-10 hover:scale-110 transition-transform" 
                        />

                    </a>
                ))}
            </div>
            
            <div className="mt-20 flex flex-col gap-6"> 
                {links.length ? 
                    links.map(link => (
                        <a 
                            key={link.name}
                            href={link.url}
                            className="bg-white px-5 py-2 flex items-center gap-5 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-xl "
                            target="_blank"
                            rel="noreferrer noopener">
                                <img src={`/social/icon_${link.name}.svg`} alt="icono red social" className="w-12" />
                              <p className="text-black capitalize font-bold text-lg">Visita mi: {link.name}</p>                         
                        </a>
                    ))
                : <p className="text-center font-bold" >No hay enlaces en este perfil</p>} 
                </div>


        </div>
    )
}
