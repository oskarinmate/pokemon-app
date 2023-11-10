import React, { useState, useEffect } from 'react';


function App() {
  // creamos estados  y utilizamos hook useState y useState null y set 
  //y una función para actualizar ese estado (setPokemonName).
  const [pokemonName, setPokemonName] = useState('');
  const [pokemonData, setPokemonData] = useState(null);

  const fetchPokemonData = () => {
    //para realizar una solicitud GET a la PokeAPI
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('No se encontró un Pokémon con ese nombre o número.');
        }
        return response.json();
      })
      .then((data) => {
        //actualiza los datos
        setPokemonData(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    if (pokemonData) {
      const { sprites } = pokemonData;
      if (sprites) {
        const imageUrl = sprites.front_default;
        if (imageUrl) {
         
          const img = new Image();
          img.src = imageUrl;
          img.onload = () => {
            setPokemonData({ ...pokemonData, image: img });
          };
        }
      }
    }
  }, [pokemonData]);

  return (
    
    <div className="App">
      
      <h1>PokeAPI Search</h1>
      <input
        type="text"
        placeholder="Nombre o número del Pokémon"
        value={pokemonName}
        onChange={(e) => setPokemonName(e.target.value)}
      />
      <button onClick={fetchPokemonData}>Buscar</button>
      {pokemonData && (
        <div className='pokemon-details'>
          <h2>Número: {pokemonData.id}</h2>
          <h3>Tipos:</h3>
          <ul>
            {pokemonData.types.map((type, index) => (
              <li key={index}>{type.type.name}</li>
            ))}
          </ul>
          <h3>Nombre: {pokemonData.name}</h3>
          {pokemonData.image && (
            <div>
              
              <img src={pokemonData.image.src} alt={pokemonData.name} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;