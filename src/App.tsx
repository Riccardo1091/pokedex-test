import React, { useCallback, useEffect, useRef, useState } from 'react'

import { PkThumbnail } from './PkThumbnail'

export function App() {
  const [allPokemons, setAllPokemons] = useState<any>([])
  const [loadMore, setLoadMore] = useState<string>('https://pokeapi.co/api/v2/pokemon?limit=20/')
  const [search, setSearch] = useState<string>('')
  const [types, setTypes] = useState<any>([])
  const [filteredType, setFilteredType] = useState<string>('')
  const bottomRef = useRef<any>(null)

  const fetchPokemons = useCallback(async () => {
    // Aggiornamento Link Load more e setup nuova elenco di pokemon per il load more
    const res = await fetch(loadMore)
    const data = await res.json()
    // Raccolta dettagli
    function addPokemon(results: any)  {
      results.forEach(async (pokemon: any) => {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`)
        const data =  await res.json()
        setAllPokemons((currentList: any) => [...currentList, data]
        // Ordinamento
        .sort((a:any, b:any) => a.id - b.id))
      }) 
    }  
    // Esecuzione funzioni
    setLoadMore(data.next)
    addPokemon(data.results)
  }, [loadMore])

  // Raccolta tipi di pokemon da pokemon caricati
  function fetchTypes() {
    const tipi:any = []
    allPokemons.forEach((pk:any) =>
      pk.types.forEach((type: {type: {name: string}}) => tipi.push(type.type.name)))
    // Rimozione tipi duplicati
    setTypes([...new Set(tipi)]
    // Ordinamento
    .sort((a:any, b:any) => a.localeCompare(b)))
  }

  // Fetch Iniziale dei singoli pokemon e link Next per il Load More
  useEffect(() => {
      fetchPokemons()
      // eslint-disable-next-line
  }, [])

  // Scrolling automatico verso il basso ad ogni caricamento batch di pokemon;
  useEffect(() => {
    bottomRef.current?.scrollIntoView({behavior: 'smooth'})
  }, [fetchPokemons])
  // Attivazione raccolta tipi da pokemon caricati
  useEffect(() => {
    fetchTypes()
  }, [allPokemons])

  return (
    <div className="app-contaner">
      <h1 className="text-4xl font-bold pb-5">POKEDEX</h1>
      <div className="pokemon-container">
        {/* Search bar */}
        <input className="border mb-4 border-gray-300 text-gray-900 text-sm rounded-lg block w-80 p-2.5" value={search} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)} placeholder='Search Pokemon...'></input>
        <div className="type-container container justify-center flex gap-2 flex-wrap mb-3">
          {/* RESET BUTTON */}
          <button name="" onClick={(e: React.ChangeEvent<HTMLInputElement> & React.MouseEvent<HTMLButtonElement>) => setFilteredType(e.target.name)} className="capitalize hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow ">RESET</button>
          {/* Bottoni filtro   */}
          {types && types.map((type:string) =>
            <button name={type} onClick={(e: React.ChangeEvent<HTMLInputElement> & React.MouseEvent<HTMLButtonElement>) => setFilteredType(e.target.name)} className={"capitalize hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow " + type}
              key={type}>{type}</button>
          )}
        </div>
        <div className="all-container">
          {/* Renderizzazione primi 100 pokemon ed eventuale filtro ricerca e tipologia */}
          {allPokemons && allPokemons
          // Filtro Ricerca
          .filter((pk:any) =>
            {return search.toLowerCase() === '' ? pk : pk.name.includes(search.toLowerCase())
          })
          // Filtro Tipologia con bottoni
          .filter((pk:any) =>
            {return filteredType === '' ? pk : pk.types[0].type.name.includes(filteredType) || pk.types[1]?.type.name.includes(filteredType)}
          )
          // Rendering pokemon
          .map((pk:any) => 
            <PkThumbnail key={pk.name} pk={pk} id={pk.id} name={pk.name}
              image={pk.sprites.other.dream_world.front_default}
              types={pk.types} weight={pk.weight} height={pk.height} moves={pk.moves}
            />
          )}
        </div>
        {/* Bottone per caricarne altri 100 */}
          <button ref={bottomRef} className="load-more" onClick={fetchPokemons}>Load more...</button>
      </div>
    </div>
  )
}
