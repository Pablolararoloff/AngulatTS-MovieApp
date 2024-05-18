import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
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
  @Input() movies: any[] = [];
  @Input() favoriteMovies: string[] = [];
  @Output() toggleFavorite = new EventEmitter<any>();
  @Output() openGenreDialogEvent = new EventEmitter<any>();
  @Output() openDirectorDialogEvent = new EventEmitter<any>();
  @Output() openSynopsisDialogEvent = new EventEmitter<any>();

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

/**
   * Fetches all movies.
   */
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log("Movies from API", this.movies);
    });
  }
/**
 * Fetches the favorite movies of the current user from the API and assigns the response to the `favoriteMovies` property.
 * Checks if the user is available in local storage before making the API call.
 */
  getFavoriteMovies(): void {
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      this.fetchApiData.getFavoriteMovies(parsedUser.username).subscribe((resp: any) => {
        this.favoriteMovies = resp;
        console.log("Favorite movies from API", this.favoriteMovies);
      });
    }
  }
/**
 * Opens a dialog to display genre information.
 * @param genre - The genre name.
 * @param description - The description of the genre.
 */
  openGenreDialog(genre: string, description: string): void {
    this.dialog.open(GenreInfoComponent, {
      data: { genre, description },
      width: '500px'
    });
  }

/**
 * Opens a dialog to display director information.
 * @param director - The name of the director.
 * @param bio - The biography of the director.
 * @param birthdate - The birthdate of the director.
 */
  openDirectorDialog(director: string, bio: string, birthdate: string): void {
    this.dialog.open(DirectorInfoComponent, {
      data: { director, bio, birthdate },
      width: '500px',
    });
  }

/**
 * Opens a dialog to display movie synopsis.
 * @param movieName - The name of the movie.
 * @param description - The synopsis of the movie.
 */
  openSynopsisDialog(movieName: string, description: string): void {
    this.dialog.open(MovieSynopsisComponent, {
      data: { movieName, description },
      width: '500px',
    });
  }
/**
 * Checks if a movie is in the list of favorite movies.
 * @param movie - The movie object.
 * @returns True if the movie is a favorite, false otherwise.
 */
  isFav(movie: any): boolean {
    return this.favoriteMovies.includes(movie._id);
  }
/**
 * Toggles the favorite status of a movie.
 * If the movie is a favorite, it will be removed from the favorite list.
 * If the movie is not a favorite, it will be added to the favorite list.
 * @param movie - The movie object.
 */
  toggleFav(movie: any): void {
    const isFavorite = this.isFav(movie);
    isFavorite ? this.removeFavoriteMovie(movie) : this.addFavoriteMovie(movie);
  }

 /**
 * Adds a movie to the user's list of favorite movies.
 * Checks if the user is available in local storage before making the API call.
 * On success, adds the movie ID to the `favoriteMovies` array and shows a confirmation message.
 * @param movie - The movie object to be added to favorites.
 */
  addFavoriteMovie(movie: any): void {
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      this.fetchApiData.addFavoriteMovie(parsedUser.username, movie._id).subscribe((resp: any) => {
        this.favoriteMovies.push(movie._id);
        this.snackBar.open(`${movie.Title} has been added to your favorites`, 'OK', {
          duration: 3000,
        });
      });
    }
  }
/**
 * Removes a movie from the user's list of favorite movies.
 * Checks if the user is available in local storage before making the API call.
 * On success, removes the movie ID from the `favoriteMovies` array and shows a confirmation message.
 * On error, shows a failure message and logs the error.
 * @param movie - The movie object to be removed from favorites.
 */
  removeFavoriteMovie(movie: any): void {
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      this.fetchApiData.removeFavoriteMovie(parsedUser.username, movie._id).subscribe({
        next: (resp: any) => {
          this.favoriteMovies = this.favoriteMovies.filter((favMovieId) => favMovieId !== movie._id);
          this.snackBar.open(`${movie.Title} has been removed from your favorites`, 'OK', {
            duration: 3000,
          });
        },
        error: (err: any) => {
          this.snackBar.open(`Failed to remove ${movie.Title} from your favorites`, 'OK', {
            duration: 3000,
          });
          console.error(err);
        }
      });
    }
  }
 }