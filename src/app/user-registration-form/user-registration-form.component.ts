import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
* @description Component representing the user registration form.
* @selector: 'app-user-registration-form'
* @templateUrl: './user-registration-form.component.html'
* @styleUrls: ['./user-registration-form.component.scss']
*/
@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrls: ['./user-registration-form.component.scss']
})
 /** Input for user data including username, password, email, and birthday. */
export class UserRegistrationFormComponent implements OnInit {
  userData = { Username: '', Password: '', Email: '', Birthday: '' };

   /**
    * @constructor
    * @param {fetchApiData} FetchApiDataService - Service for user registration API calls.
    * @param {MatDialogRef<UserRegistrationFormComponent>} dialogRef - Reference to the dialog for closing.
    * @param {MatSnackBar} snackBar - Angular Material's MatSnackBar service for notifications.
    */
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void { }
  /**
    * @description Sends user registration form information to the backend.
    * Closes the dialog on success and displays a success message. Shows an error message on failure.
    */
  registerUser(): void {
    this.fetchApiData.userRegistration(this.userData).subscribe(
      (result: any) => {
        this.dialogRef.close();
        this.snackBar.open('Registration successful', 'OK', {
          duration: 2000
        });
      },
      (error: any) => {
        this.snackBar.open('Registration failed: ' + error, 'OK', {
          duration: 2000
        });
    });
  }
}
