import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StorageService } from '../services/storage.service';

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
  userData: any = {};
  formUserData: any = {}; 
  user: any = {};
  movies: any[] = [];
  favoritemovie: any[] = [];
  favoriteMoviesIDs: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public router: Router,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.getUserData();
    this.getProfile();
    this.getMovies();
    this.getFavMovies();
  }

  getUserData(): void {
    const user = this.storageService.getItem('user');
    console.log('User from local storage:', user);  // Debugging line
    if (!user) {
      this.router.navigate(['welcome']);
      return;
    }

    const parsedUser = JSON.parse(user);
    const username = parsedUser?.username;
    console.log('Parsed user:', parsedUser);  // Debugging line
    console.log('Username from parsed user:', username);  // Debugging line

    if (!username) {
      this.router.navigate(['welcome']);
      return;
    }

    this.fetchApiData.getUser(username).subscribe(
      (res: any) => {
        console.log('Fetched user data:', res);  // Debugging line
        this.userData = res;
      },
      (error: any) => {
        console.error('Error fetching user data', error);
        this.router.navigate(['welcome']);
      }
    );
  }

  getProfile(): void {
    const storedUser = this.storageService.getItem('user');
    console.log('Stored user from local storage:', storedUser);  // Debugging line
    if (!storedUser) {
      this.router.navigate(['welcome']);
      return;
    }

    const user = JSON.parse(storedUser);
    const username = user?.username;

    console.log('Username from parsed user:', username);  // Debugging line

    if (!username) {
      this.router.navigate(['welcome']);
      return;
    }

    this.fetchApiData.getUser(username).subscribe(
      (result: any) => {
        console.log('Profile data fetched:', result);  // Debugging line
        this.user = result;
        this.userData.Username = this.user.Username;
        this.userData.Email = this.user.Email;
        if (this.user.Birthday) {
          const birthday = new Date(this.user.Birthday);
          if (!isNaN(birthday.getTime())) {
            this.userData.Birthday = birthday.toISOString().split('T')[0];
          }
        }
        this.formUserData = { ...this.userData };  // Initialize formUserData
        this.favoriteMoviesIDs = this.user.FavoriteMovies;

        this.fetchApiData.getAllMovies().subscribe((movies: any[]) => {
          this.favoritemovie = movies.filter((movie: any) => this.favoriteMoviesIDs.includes(movie._id));
        });
      },
      (error: any) => {
        console.error('Error fetching profile data', error);
        this.router.navigate(['welcome']);
      }
    );
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
    const storedUser = this.storageService.getItem('user');
    if (!storedUser) return;

    const user = JSON.parse(storedUser);
    const username = user?.Username;

    if (!username) return;

    this.fetchApiData.getUser(username).subscribe((result: any) => {
      this.favoriteMoviesIDs = result.FavoriteMovies;
    });
  }

  isFav(movie: any): boolean {
    return this.favoriteMoviesIDs.includes(movie._id);
  }

  toggleFav(movie: any): void {
    const isFavorite = this.isFav(movie);
    isFavorite ? this.removeFavMovies(movie) : this.addFavMovies(movie);
  }

  addFavMovies(movie: any): void {
    const storedUser = this.storageService.getItem('user');
    const token = this.storageService.getItem('token'); // Ensure the token is available
    if (!storedUser || !token) {
      this.router.navigate(['welcome']);
      return;
    }
  
    const user = JSON.parse(storedUser);
    const username = user?.Username;
  
    if (!username) {
      this.router.navigate(['welcome']);
      return;
    }
  
    this.fetchApiData.addFavoriteMovie(username, movie._id).subscribe(
      (result: any) => {
        // Update favorite movies in the state
        if (!this.favoriteMoviesIDs.includes(movie._id)) {
          this.favoriteMoviesIDs.push(movie._id);
        }
  
        if (!this.favoritemovie.some(favMovie => favMovie._id === movie._id)) {
          this.favoritemovie.push(movie);
        }
  
        this.snackBar.open(`${movie.Title} has been added to your favorites`, 'OK', {
          duration: 1000,
        });
  
        // Update the user data in local storage
        user.FavoriteMovies = this.favoriteMoviesIDs;
        this.storageService.setItem('user', JSON.stringify(user));
      },
      (error: any) => {
        this.snackBar.open('Failed to add favorite movie', 'OK', {
          duration: 2000,
        });
      }
    );
  }

  removeFavMovies(movie: any): void {
    const storedUser = this.storageService.getItem('user');
    const token = this.storageService.getItem('token'); // Ensure the token is available
    if (!storedUser || !token) {
      this.router.navigate(['welcome']);
      return;
    }
  
    const user = JSON.parse(storedUser);
    const username = user?.username;
  
    if (!username) {
      this.router.navigate(['welcome']);
      return;
    }
  
    this.fetchApiData.removeFavoriteMovie(username, movie._id).subscribe(
      (result: any) => {
        this.favoriteMoviesIDs = this.favoriteMoviesIDs.filter((id) => id !== movie._id);
        this.favoritemovie = this.favoritemovie.filter((favMovie) => favMovie._id !== movie._id);
        this.snackBar.open(`${movie.Title} has been removed from your favorites`, 'OK', {
          duration: 1000,
        });

        user.FavoriteMovies = this.favoriteMoviesIDs;
        this.storageService.setItem('user', JSON.stringify(user));
      },
      (error: any) => {
        this.snackBar.open('Failed to remove favorite movie', 'OK', {
          duration: 2000,
        });
      }
    );
  }

  updateUser(): void {
    const storedUser = this.storageService.getItem('user');
    const token = this.storageService.getItem('token');
    if (!storedUser) {
      this.router.navigate(['welcome']);
      return;
    }

    const userId = JSON.parse(storedUser)._id;  // Use _id instead of Username
    this.fetchApiData.updateUser(userId, this.formUserData).subscribe(
      (result: any) => {
        // Update the local storage with the new user data and preserve the token
        const updatedUser = {
          ...result,
          token: token // Ensure the token is preserved
        };
        this.storageService.setItem('user', JSON.stringify(updatedUser));
        this.snackBar.open('User updated successfully!', 'OK', {
          duration: 2000,
        });
        this.getProfile();
      },
      (error: any) => {
        this.snackBar.open('Failed to update user', 'OK', {
          duration: 2000,
        });
      }
    );
  }

  async deleteUser(): Promise<void> {
    const storedUser = this.storageService.getItem('user');
    const token = this.storageService.getItem('token'); // Ensure the token is available
    if (!storedUser || !token) {
      this.router.navigate(['welcome']);
      return;
    }
  
    const user = JSON.parse(storedUser);
    const userId = user?._id;
  
    if (!userId) {
      this.router.navigate(['welcome']);
      return;
    }
  
    if (confirm('Do you want to delete your account permanently?')) {
      this.fetchApiData.deleteUser(userId).subscribe(
        () => {
          this.snackBar.open('Account deleted successfully!', 'OK', {
            duration: 3000,
          });
          this.storageService.clear();
          this.router.navigate(['welcome']);
        },
        (error: any) => {
          this.snackBar.open('Failed to delete account', 'OK', {
            duration: 2000,
          });
        }
      );
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
