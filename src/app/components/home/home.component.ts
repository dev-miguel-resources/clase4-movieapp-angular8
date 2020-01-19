import { Component, OnInit, OnDestroy } from '@angular/core';
import { trigger, transition, query, stagger, animate, style } from '@angular/animations';
import { take } from 'rxjs/operators'; //especificar cuantos elementos devuelve una respuesta de un observable
import { ActivatedRoute, Params, Router } from '@angular/router';
//activadedRoute = recordar que es para capturar parametros de las rutas
// Services
import { MovieService } from '../../services/movie.service';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass'],
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        query(':leave', [
          stagger(100, [
            animate('0.5s', style({ opacity: 0 }))
          ])
        ], { optional: true }),
        query(':enter', [
          style({ opacity: 0 }),
          stagger(100, [
            animate('0.5s', style({ opacity: 1 }))
          ])
        ], { optional: true })
      ])
    ])
  ],
})
export class HomeComponent implements OnInit, OnDestroy {

  // declaraciones
  public viewCount = 9;
  public page = 0;
  public pageSize = 9;
  public previousPage = 0;
  public movies = [];
  public moviesStorage = [];
  public objectMovie: any;
  public subscriptionSearchData: Subscription;
  private componentDestroyed: Subject<boolean> = new Subject();
  public message = null;

  constructor(
    private movieService: MovieService,
    private router: ActivatedRoute
  ) {
    this.subscriptionSearchData = this.movieService.observableSearchData$
      .subscribe(
        dataSearch => {
          if (dataSearch) {
            this.getDataSearch(dataSearch);
          }
        });
  }

  ngOnInit() {
    this.router.params.subscribe(routeParams => {
      this.getPopular(routeParams.category);
    });
  }

  ngOnDestroy(): void { //ngondestroy: deja de manera limpia el componente, luego de cargarse lo del constructor y ngoninit, lo resetea y las subscripciones se van desligando a medida que se sueltan
    this.componentDestroyed.next(true);
    this.componentDestroyed.complete();
    this.subscriptionSearchData.unsubscribe();
  }

  // cambio cantidad de peliculas a visualizar vía
  public changeViewMovie() {
    this.movies = [];
    this.movies = this.moviesStorage.slice(0, this.viewCount);
  }

  // rescatamos peliculas populares
  public getPopular(category: string) {
    this.movies = [];
    this.movieService.getPopular(category)
      .pipe(
        take(1)
      )
      .subscribe(
        res => {
          this.moviesStorage = res.results; //results: la estructura de la respuesta
          this.movies = res.results.slice(0, this.viewCount); //slice:define el rango a mostrar
          console.log(this.movies);
        },
        err => {
          console.log(err);
        },
        () => {
          // petición finalizada
        });
  }

  // rescatamos peliculas populares
  public getDataSearch(search: string) {
    this.movies = [];
    this.movieService.getSearch(search)
      .pipe(
        take(1) //take: me permite especificar que la info en cuestión se va a cargar una vez
      ) //en simples palabras especificar la cantidad de las respuestas 
      .subscribe(
        res => {
          if (res.results.length === 0) {
            this.message = 'no existen resultados para tú búsqueda';
          }
          this.moviesStorage = res.results;
          this.movies = res.results.slice(0, this.viewCount);
          console.log(this.movies);
        },
        err => {
          console.log(err);
        },
        () => {
          // petición finalizada
        });
  }
}
