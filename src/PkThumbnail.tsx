import { useEffect, useState } from "react";

export const PkThumbnail = ({id, pk, image, name, types, moves, weight, height}: any) => {
    const style = types[0].type.name + " thumb-container hover:scale-[1.2]";

    const [modal, setModal] = useState<boolean>(false)
    const [encounter, setEncounter] = useState<[]>([])
    const [flavor, setFlavor] = useState<string>("")

    function toggle(e: React.SyntheticEvent) {
        e.stopPropagation()
        setModal(!modal)
    }

    async function fetchLocation() {
        const res = await fetch(pk.location_area_encounters)
        const data =  await res.json()
        if (data) {
            const locations: any = []
            await data.map((location: any) => locations.push(location.location_area.name))
            setEncounter(locations)
        }
    }

    async function fetchFlavorText() {
        const res = await fetch(pk.species.url)
        const data =  await res.json()

        const flavor_array:any = []

        await data.flavor_text_entries
        .filter((flavor: any) => flavor.language.name === "en")
        .map((flavor:{flavor_text:string}) => flavor_array.push(flavor.flavor_text))

        setFlavor(flavor_array[Math.floor(Math.random() * flavor_array.length)])
    }

    useEffect(() => {
        fetchLocation()
        fetchFlavorText()
        // eslint-disable-next-line
    }, [])
    
    return (
        <>
            <div className={style} onClick={toggle}>
                <div className="number"><small>#0{id}</small></div>
                <img src={image} alt={name} />
                <div className="detail-wrapper">
                    <h3>{name}</h3>
                    <small>Types: {types.map((type: any) =>
                        <span className="listing" key={type.type.name}><span className="font-bold">{type.type.name}</span><span className="px-1">-</span></span>)}
                    </small>
                </div>
            </div>
            {modal &&
                <div className="modale w-full h-full rounded fixed top-0 left-0 content-center bg-black/[.5] flex items-center justify-center" onClick={toggle}>
                    <div className={"w-fit max-w-4xl h-fit glass-component !p-8 relative rounded flex gap-8 md:p-[5rem] " + types[0].type.name}>
                        {/* Immagine */}
                        <div className="image sm:flex-[25%] md:px-[13rem] md:py-[10rem] relative">
                            <img className="hover:scale-[1.2] md:absolute md:top-[2/4] md:left-[2/4] md:translate-x-[-50%] md:translate-y-[-50%] md:scale-[2.2] md:hover:scale-[2.1]" src={image} alt={name} />
                        </div>
                        <div className="uppercase sm:flex-[70%] flex flex-col align-center gap-3">
                        {/* Nome */}
                            <h2 className="font-bold text-2xl pb-2">{name}</h2>
                        {/* Tipi */}
                            <h3 className="">Types: {types.map((type: any) => 
                                <span key={type.type.name}><span className="font-bold">{type.type.name}</span><span className="px-1">-</span></span>)}<br/>
                            </h3>
                        {/* Peso */}
                            <h3>Weight: <span className="font-bold">{(weight * 0.45).toFixed(2)}Kg</span><br/></h3> {/* Non ho capito l'unità di misura */}
                        {/* Lunghezza */}
                            <h3>Length: <span className="font-bold">{(height * 0.30).toFixed(2)}M</span></h3>  {/* Non ho capito l'unità di misura */}
                        {/* Mosse */}
                            <h3>Moves: {moves.slice(0, 5).map((move: any) => 
                                <span key={move.move.name}><span className="font-bold">{move.move.name.split('-').join(' ')}</span><span className="px-1">-</span></span>)}
                            </h3>
                        {/* CONDIZIONE: Aree di incontro */}
                            {encounter.length>0 && 
                                <h3>Encounter areas: {encounter.slice(0, 3).map((encounter: any) => 
                                    <span key={encounter}><span className="font-bold">{`${encounter.split('-').slice(0, 4).join(' ')}`}</span><span className="px-1">-</span></span>)}
                                </h3>
                            }
                        {/* Flavor text - Pokemon description */}
                            {flavor && 
                                <h3>Description: <span className="font-bold">{flavor}</span></h3>
                            }
                        </div>
                    </div>
                </div>
            }
        </>
    )
}