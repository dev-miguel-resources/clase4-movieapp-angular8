import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'; //para detectar una ruta y realizar x acción

// Services
import { MovieService } from 'src/app/services/movie.service';
import { ActivatedRoute } from '@angular/router'; //capturar parametros
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.sass']
})
export class MovieDetailComponent implements OnInit {

  // declaraciones
  public movie = null;

  constructor(
    public location: Location,
    private router: ActivatedRoute,
    public movieService: MovieService
  ) { }

  ngOnInit() {
    this.router.params.subscribe(routeParams => {
      this.getMovieDetail(routeParams.movie);
    });
  }

  // rescatamos peliculas populares
  public getMovieDetail(movieId: string) {
    this.movieService.getMovieById(movieId)
      .pipe(
        take(1)
      )
      .subscribe(
        res => {
          this.movie = res;
          console.log(this.movie);
        },
        err => {
          console.log(err);
        },
        () => {
          // petición finalizada
        });
  }
}
