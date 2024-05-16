import { Component, Input, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

// Component Imports
import { DirectorInfoComponent } from '../director-info/director-info.component';
import { GenreInfoComponent } from '../genre-info/genre-info.component';
import { MovieSynopsisComponent } from '../movie-synopsis/movie-synopsis.component';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  @Input() userData: any = { userName: '', password: '', email: '', birthday: '' };

  formUserData: any = {
    userName: '',
    password: '',
    email: '',
    birthday: '',
    favoriteMovie: []
  };

  user: any = {};
  movies: any[] = [];
  favoritemovie: any[] = [];
  favoriteMoviesIDs: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.getProfile();
    this.getMovies();
    this.getFavMovies();
  }

  getProfile(): void {
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;
    const username = user ? user.Username : '';

    if (username) {
      this.fetchApiData.getUser(username).subscribe((result: any) => {
        this.user = result;
        this.userData.userName = this.user.Username;
        this.userData.email = this.user.Email;
        if (this.user.Birthday) {
          const birthday = new Date(this.user.Birthday);
          if (!isNaN(birthday.getTime())) {
            this.userData.birthday = birthday.toISOString().split('T')[0];
          }
        }
        this.formUserData = { ...this.userData };
        this.favoriteMoviesIDs = this.user.FavoriteMovies;

        this.fetchApiData.getAllMovies().subscribe((movies: any[]) => {
          this.favoritemovie = movies.filter((movie: any) => this.favoriteMoviesIDs.includes(movie._id));
        });
      });
    } else {
      this.router.navigate(['welcome']);
    }
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((result: any) => {
      if (Array.isArray(result)) {
        this.movies = result;
      }
      return this.movies;
    });
  }

  getFavMovies(): void {
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;
    const username = user ? user.Username : '';

    if (username) {
      this.fetchApiData.getUser(username).subscribe((result: any) => {
        this.favoriteMoviesIDs = result.FavoriteMovies;
      });
    }
  }

  isFav(movie: any): boolean {
    return this.favoriteMoviesIDs.includes(movie._id);
  }

  toggleFav(movie: any): void {
    const isFavorite = this.isFav(movie);
    isFavorite ? this.removeFavMovies(movie) : this.addFavMovies(movie);
  }

  addFavMovies(movie: any): void {
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;
    const username = user ? user.Username : '';

    if (username && movie) {
      this.fetchApiData.addFavoriteMovie(username, movie._id).subscribe((result: any) => {
        localStorage.setItem('user', JSON.stringify(result));
        this.getFavMovies();
        this.snackBar.open(`${movie.Title} has been added to your favorites`, 'OK', {
          duration: 1000,
        });
      });
    } else {
      this.router.navigate(['welcome']);
    }
  }
  removeFavMovies(movie: any): void {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      this.router.navigate(['welcome']);
      return;
    }

    const username = JSON.parse(storedUser).Username;
    this.fetchApiData.removeFavoriteMovie(username, movie._id).subscribe((result: any) => {
      localStorage.setItem('user', JSON.stringify(result));
      this.favoriteMoviesIDs = this.favoriteMoviesIDs.filter((id) => id !== movie._id);
      this.getFavMovies();
      this.snackBar.open(`${movie.Title} has been removed from your favorites`, 'OK', {
        duration: 1000,
      });
    });
  }

  updateUser(): void {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      this.router.navigate(['welcome']);
      return;
    }

    const username = JSON.parse(storedUser).Username;
    this.fetchApiData.updateUser(username, this.formUserData).subscribe((result: any) => {
      localStorage.setItem('user', JSON.stringify(result));
      this.snackBar.open('User updated successfully!', 'OK', {
        duration: 2000,
      });
      this.getProfile();
    }, (error: any) => {
      this.snackBar.open('Failed to update user', 'OK', {
        duration: 2000,
      });
    });
  }

  async deleteUser(): Promise<void> {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      this.router.navigate(['welcome']);
      return;
    }

    const username = JSON.parse(storedUser).Username;
    if (confirm('Do you want to delete your account permanently?')) {
      this.fetchApiData.deleteUser(username).subscribe(() => {
        this.snackBar.open('Account deleted successfully!', 'OK', {
          duration: 3000,
        });
        localStorage.clear();
        this.router.navigate(['welcome']);
      });
    }
  }

  openGenreDialog(genre: string, description: string): void {
    this.dialog.open(GenreInfoComponent, {
      data: {
        genre: genre,
        description: description
      },
      width: '500px',
    });
  }

  openDirectorDialog(director: string, bio: string, birthdate: string): void {
    this.dialog.open(DirectorInfoComponent, {
      data: {
        director: director,
        bio: bio,
        birthdate: birthdate,
      },
      width: '500px',
    });
  }

  openSynopsisDialog(movieName: string, description: string): void {
    this.dialog.open(MovieSynopsisComponent, {
      data: {
        movieName: movieName,
        description: description
      },
      width: '500px',
    });
  }
}