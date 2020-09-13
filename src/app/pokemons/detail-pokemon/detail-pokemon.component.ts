import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

import { Pokemon } from '../pokemon';

import { PokemonsService } from '../pokemons.service';

@Component({
  selector: 'app-detail-pokemon',
  templateUrl: './detail-pokemon.component.html',
  styleUrls: ['./detail-pokemon.component.css']
})
export class DetailPokemonComponent implements OnInit {

  // Pokémon à afficher à l'utilisateur
  pokemon: Pokemon;
  selectedPokemon: Pokemon = new Pokemon();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pokemonsService: PokemonsService) { }

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.selectedPokemon.id = id;
    this.getSelectedPokemon(this.selectedPokemon);
    this.getPokemonSpecies(this.selectedPokemon);
  }

  // Get data about selected pokemon
  getSelectedPokemon(pokemon: Pokemon) {
    this.pokemonsService.getPokemonData(pokemon.id)
      .subscribe(data => {
        console.log(data);
        this.selectedPokemon.id = data.id;
        this.selectedPokemon.name = data.name;
        this.selectedPokemon.height = data.height;
        this.selectedPokemon.weight = data.weight;

        const pokemonTypes: string[] = [];
        // tslint:disable-next-line: forin
        for (const type in data.types) {
          pokemonTypes.push(data.types[type].type.name);
        }
        this.selectedPokemon.types = pokemonTypes;

        this.selectedPokemon.sprites = data.sprites;
      });
  }

  // Get Species data as evolution chain url
  getPokemonSpecies(pokemon: Pokemon) {
    this.pokemonsService.getPokomonSpeciesData(pokemon.id)
      .subscribe(data => {
        this.selectedPokemon.evolution_chain = data.evolution_chain;

        const evolutionUrl = data.evolution_chain['url'];
        const pokemonName = data.name;

        console.log('species data');
        console.log(data);
        console.log(pokemonName);

        this.getPokomonEvolution(pokemonName, evolutionUrl);
      });
  }

  // Get different Pokemon evolution forms
  getPokomonEvolution(pokName: string, url: string) {
    this.pokemonsService.getPokomonNextEvolution(url)
      .subscribe(data => {

        const pokemonEvolForms = [];
        const evolutionChain = this.loopEvo(data);
        console.log(evolutionChain);

        console.log('get each name of evolution chain in an array :');
        // tslint:disable-next-line: forin
        for (let i in evolutionChain) {
          pokemonEvolForms.push(evolutionChain[i].speciesName);
        }
        console.log(pokemonEvolForms);

        for (let i = 0; i < pokemonEvolForms.length; i++) {
          console.log(pokemonEvolForms[i]);
          if (pokName === pokemonEvolForms[i]) {
            console.log('match en position ' + [i]);
            this.selectedPokemon.evolutionName = pokemonEvolForms[i + 1];
            console.log("Forme évoluée : " + this.selectedPokemon.evolutionName);
            if (pokemonEvolForms[i + 1] === undefined) {
              this.selectedPokemon.evolutionName = 'Last evolution form';
            }
            console.log("Forme évoluée : " + this.selectedPokemon.evolutionName);
          }
        }
      });
  }

  // Redirect to List-pokemon view
  goBack(): void {
    this.router.navigate(['/pokemons']);
  }

  // Get an object Array of chain Evolution from data.chain
  loopEvo(data: any): any {
    let pokemonEvols = [];
    let evoData = data.chain;

    do {
      // Get number of evolutions
      const numberOfEvolutions = evoData['evolves_to'].length;

      pokemonEvols.push({ speciesName: evoData['species'].name });

      if (numberOfEvolutions > 1) {
        for (let i = 1; i < numberOfEvolutions; i++) {
          pokemonEvols.push({
            speciesName: evoData['evolves_to'][i]['species'].name
          });
        }
      }

      evoData = evoData['evolves_to'][0];

    } while (!!evoData && evoData.hasOwnProperty('evolves_to'));

    return pokemonEvols;
  }
}
