import { SocialNetwork, UserHandle } from "../types"

type HandleDataProps = {
    data: UserHandle
}
export const HandleData = ({ data }: HandleDataProps) => {

    const links: SocialNetwork[] = JSON.parse(data.links).filter((link: SocialNetwork) => link.enabled)
    return (
        <div className="  space-y-6 text-white">
            {data.image && <img src={data.image} className="  max-w-[150px] mx-auto rounded-xl" />}
            <p className="text-4xl font-bold text-center ">{data.name}</p>
            <p className="text-lg text-center">{data.description}</p>

            <div className="flex justify-center items-center gap-4 mt-4">
                {links.map(link => (
                    <a
                        key={link.name}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer noopener"
                    >
                        <img
                            src={`/social/iconwhite_${link.name}.svg`}
                            alt={`Icono de ${link.name}`}
                            className=" w-10 h-10 hover:scale-110 transition-transform hover:invert"
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
                            className={`
                             px-10 py-5 flex items-center gap-4 rounded-lg transition-all duration-300 
                             hover:scale-110 hover:shadow-xl text-white text-lg font-bold 
                            ${link.name === 'github' ? 'bg-cover bg-center bg-no-repeat h-48 justify-start pb-6' : 'bg-black '}
                         `}
                            style={link.name === 'github' ? { backgroundImage: "url('/social/github.jpg')" } : {}}
                            target="_blank"
                            rel="noreferrer noopener"
                        >        
                            {link.name !== 'github' && (
                                <>
                                    <img src={`/social/iconwhite_${link.name}.svg`} alt={`Icono de ${link.name}`} className="w-8" />
                                    <p className="capitalize">Visita mi: {link.name}</p>
                                </>
                            )}

                        </a>
                    ))
                    : <p className="text-center font-bold">No hay enlaces en este perfil</p>}
            </div>
        </div>
    )
}
