import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GenreInfoComponent } from '../genre-info/genre-info.component';
import { DirectorInfoComponent } from '../director-info/director-info.component';
import { MovieSynopsisComponent } from '../movie-synopsis/movie-synopsis.component';

/**
 * Component for displaying movie cards.
 */

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  favoriteMovies: string[] = [];
  user: any = {};

  /**
   * Constructor for MovieCardComponent.
   * @param fetchApiData - Service for fetching data from API.
   * @param dialog - Service for opening dialogs.
   * @param snackBar - Service for displaying snack bar messages.
   */

  constructor(
    private fetchApiData: FetchApiDataService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  /**
   * Lifecycle hook that is called after data-bound properties of a directive are initialized.
   */

   ngOnInit(): void {
    this.getMovies();
    this.getFavoriteMovies();
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log("Movies from API", this.movies);
    });
  }

  getFavoriteMovies(): void {
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      this.fetchApiData.getFavouriteMovies(parsedUser.userName).subscribe((resp: any) => {
        this.favoriteMovies = resp;
        console.log("Favorite movies from API", this.favoriteMovies);
      });
    }
  }

  openGenreDialog(genre: string, description: string): void {
    this.dialog.open(GenreInfoComponent, {
      data: { genre, description },
      width: '500px'
    });
  }

  openDirectorDialog(director: string, bio: string, birthdate: string): void {
    this.dialog.open(DirectorInfoComponent, {
      data: { director, bio, birthdate },
      width: '500px',
    });
  }

  openSynopsisDialog(movieName: string, description: string): void {
    this.dialog.open(MovieSynopsisComponent, {
      data: { movieName, description },
      width: '500px',
    });
  }

  isFav(movie: any): boolean {
    return this.favoriteMovies.includes(movie._id);
  }

  toggleFav(movie: any): void {
    const isFavorite = this.isFav(movie);
    isFavorite ? this.removeFavoriteMovie(movie) : this.addFavoriteMovie(movie);
  }

  addFavoriteMovie(movie: any): void {
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      this.fetchApiData.addFavoriteMovie(parsedUser.userName, movie._id).subscribe((resp: any) => {
        this.favoriteMovies.push(movie._id);
        this.snackBar.open(`${movie.Title} has been added to your favorites`, 'OK', {
          duration: 3000,
        });
      });
    }
  }

  removeFavoriteMovie(movie: any): void {
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      this.fetchApiData.removeFavoriteMovie(parsedUser.userName, movie._id).subscribe((resp: any) => {
        this.favoriteMovies = this.favoriteMovies.filter((id) => id !== movie._id);
        this.snackBar.open(`${movie.Title} has been removed from your favorites`, 'OK', {
          duration: 3000,
        });
      });
    }
  }
}