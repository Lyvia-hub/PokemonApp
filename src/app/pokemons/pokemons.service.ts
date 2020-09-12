import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { PokeAPIUrl, PokeAPIData } from './pokeAPI';


@Injectable({
  providedIn: 'root'
})
export class PokemonsService {

  /**
   * Injection of HttpClient into the Service
   *
   */
  constructor(private http: HttpClient) { }

  private baseUrl = 'https://pokeapi.co/api/v2/pokemon/';


  // Fetch Pokemons
  getPokemons(limit: number, offset: number): Observable<PokeAPIUrl> {
    return this.http.get<PokeAPIUrl>(`${this.baseUrl}?limit=${limit}&offset=${offset}`);
  }

  // Get all data from each pokemon's url
  getDataFromUrl(result: string): Observable<PokeAPIData> {
    return this.http.get<PokeAPIData>(result);
  }

  // Get Pokemon Data by id
  // getPokemonFullDescription(id: number): Observable<pokeAPIData> {
  //   return this.http.get<pokeAPIData>(`${this.baseUrl}${id}/`
  //   );
  // }

  // searchPokemons(term: string): Observable<PokeAPIData> {
  //   if (!term.trim()) { // si champs de recherche vide
  //     return of([]); // retourner un tableau vide
  //   }

  //   return this.http.get<PokeAPIData>(`${this.baseUrl}/?name=${term}`);
  // }

  // Retourne la liste des types des Pokémons
  getPokemonTypes(): Array<string> {
    return [
      'grass', 'fire', 'water', 'bug', 'normal', 'electrik',
      'poison', 'fairy', 'flying', 'ground', 'psy'
    ];
  }
}
