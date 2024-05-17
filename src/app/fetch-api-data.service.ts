import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class FetchApiDataService {

// Declaring the API URL that will provide data for the client app
  private apiUrl = 'https://letflix-0d183cd4a94e.herokuapp.com';

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
userRegistration(userDetails: any): Observable<any> {
  console.log(userDetails);
  return this.http.post(this.apiUrl + '/users', userDetails).pipe(
    map(this.extractResponseData),
    catchError(this.handleError)
  );
}

// USER LOGIN
public userLogin(userDetails: any): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/login`, userDetails).pipe(
    map(this.extractResponseData),
    catchError(this.handleError)
  );
}

// GET ALL MOVIES
getAllMovies(): Observable<any> {
  const token = localStorage.getItem('token');
  return this.http.get<any>(`${this.apiUrl}/movies`, {
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
  return this.http.get(`${this.apiUrl}/movies/${encodedTitle}`).pipe(
    map(this.extractResponseData),
    catchError(this.handleError)
  );
}

// GET DIRECTOR BY NAME
getDirector(name: string): Observable<any> {
  const encodedName = encodeURIComponent(name);
  return this.http.get<any>(`${this.apiUrl}/directors/${encodedName}`).pipe(
    map(this.extractResponseData),
    catchError(this.handleError)
  );
}

// GET GENRE BY NAME
getGenreByName(genreName: string): Observable<any> {
  const encodedGenreName = encodeURIComponent(genreName);
  return this.http.get<any>(`${this.apiUrl}/movies/genres/${encodedGenreName}`).pipe(
    map(this.extractResponseData),
    catchError(this.handleError)
  );
}

// GET USER BY USERNAME
getUser(username: string): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });
  return this.http.get<any>(`${this.apiUrl}/users/${username}`, { headers }).pipe(
    catchError(this.handleError)
  );
}

// GET FAVORITE MOVIES
getFavoriteMovies(username: string): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get<any>(`${this.apiUrl}/users/${username}/favorites`, { headers }).pipe(
    map(this.extractResponseData),
    catchError(this.handleError)
  );
}

// ADD FAVORITE MOVIE
addFavoriteMovie(username: string, movieId: string): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.post<any>(`${this.apiUrl}/users/${username}/movies/${movieId}`, {}, { headers }).pipe(
    map(this.extractResponseData),
    catchError(this.handleError)
  );
}

// UPDATE USER
updateUser(userId: string, userData: any): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });
  return this.http.put<any>(`${this.apiUrl}/users/${userId}`, userData, { headers }).pipe(
    map(this.extractResponseData),
    catchError(this.handleError)
  );
}

// DELETE USER
deleteUser(userId: string): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.delete<any>(`${this.apiUrl}/users/${userId}`, { headers }).pipe(
    catchError(this.handleError)
  );
}

// REMOVE FAVORITE MOVIE
removeFavoriteMovie(username: string, movieId: string): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });
  return this.http.delete<any>(`${this.apiUrl}/users/${username}/movies/${movieId}`, { headers }).pipe(
    catchError(this.handleError)
  );
}
}