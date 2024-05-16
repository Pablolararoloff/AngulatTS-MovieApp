import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';


// Declaring the API URL that will provide data for the client app
const apiUrl = 'https://letflix-0d183cd4a94e.herokuapp.com/';

@Injectable({
  providedIn: 'root'
})
export class FetchApiDataService {

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
    }
    return throwError('Something bad happened; please try again later.');
  }

  private extractResponseData(res: any): any {
    return res || {};
  }

  // USER REGISTRATION
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'users', userDetails).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // USER LOGIN
  public userLogin(userDetails: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}login`, userDetails).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // GET ALL MOVIES
  getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get<any>(`${apiUrl}movies`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // GET MOVIE BY TITLE
  getMovieByTitle(title: string): Observable<any> {
    const encodedTitle = encodeURIComponent(title);
    return this.http.get(`${apiUrl}movies/${encodedTitle}`).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // GET DIRECTOR BY NAME
  getDirector(name: string): Observable<any> {
    const encodedName = encodeURIComponent(name);
    return this.http.get<any>(`${apiUrl}directors/${encodedName}`).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // GET GENRE BY NAME
  getGenreByName(genreName: string): Observable<any> {
    const encodedGenreName = encodeURIComponent(genreName);
    return this.http.get<any>(`${apiUrl}movies/genres/${encodedGenreName}`).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // GET USER BY USERNAME
  getUserByUsername(username: string): Observable<any> {
    return this.http.get<any>(`${apiUrl}users/${encodeURIComponent(username)}`).pipe(
      catchError(this.handleError)
    );
  }

  // GET FAVORITE MOVIES
  getFavouriteMovies(username: string): Observable<any> {
    return this.http.get<any>(`${apiUrl}users/${username}/favorites`).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // ADD FAVORITE MOVIE
  addFavoriteMovie(username: string, movieId: string): Observable<any> {
    return this.http.post<any>(`${apiUrl}users/${encodeURIComponent(username)}/movies/${encodeURIComponent(movieId)}`, {}).pipe(
      catchError(this.handleError)
    );
  }

  // UPDATE USER
  updateUser(userId: string, userData: any): Observable<any> {
    return this.http.put<any>(`${apiUrl}users/${userId}`, userData).pipe(
      catchError(this.handleError)
    );
  }

  // DELETE USER
  deleteUser(userId: string): Observable<any> {
    return this.http.delete<any>(`${apiUrl}users/${userId}`).pipe(
      catchError(this.handleError)
    );
  }

  // REMOVE FAVORITE MOVIE
  removeFavoriteMovie(username: string, movieId: string): Observable<any> {
    return this.http.delete<any>(`${apiUrl}users/${encodeURIComponent(username)}/movies/${encodeURIComponent(movieId)}`).pipe(
      catchError(this.handleError)
    );
  }
}
