import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [pokemonName, setPokemonName] = useState('');
  const [pokemonData, setPokemonData] = useState(null);

  const fetchPokemonData = async () => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
      if (!response.ok) {
        throw new Error('No se encontró un Pokémon con ese nombre o número.');
      }
      const data = await response.json();
      setPokemonData(data);
    } catch (error) {
      console.error(error);
    }
  };

  //funcion para guardar en mongo
  
  const guardarEnMongoDB = async () => {
    try {
      const apiUrl = 'http://localhost:3001/guardar';
      const { id, name, types } = pokemonData;
      const tipes = (types[0].type.name)

      const response = await axios.post(apiUrl, { id, name, types });
      console.log(response.data.message);
    } catch (error) {
      console.error(error);
    }
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
            setPokemonData((prevData) => ({ ...prevData, image: img }));
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
          <button onClick={guardarEnMongoDB}>Guardar en MongoDB</button>
        </div>
      )}
    </div>
  );
}

export default App;