import { Injectable } from '@angular/core';

import { Pokemon } from './pokemon';
import { POKEMONS } from './mock-pokemons';

@Injectable({
  providedIn: 'root'
})
export class PokemonsService {

  constructor() { }

  // Retourne tous les pokémons
  getPokemons(): Pokemon[] {
    return POKEMONS;
  }
  // Retourne le pokémon avec l'identifiant passé en paramètre
  getPokemon(id: number): Pokemon {
    const pokemons = this.getPokemons();

    for (let index of pokemons) {
      if (id === index.id) {
        return index;
      }
    }
  }
}