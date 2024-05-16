// Import necessary modules
import { Component, OnInit } from '@angular/core';
import { UserLoginFormComponent } from '../user-login-form/user-login-form.component';
import { UserRegistrationFormComponent } from '../user-registration-form/user-registration-form.component';
import { MatDialog } from '@angular/material/dialog';
/**
 * WelcomePageComponent class
 * 
 * This class is responsible for handling the welcome page and user interactions related to registration and login.
 */
@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss']
})
export class WelcomePageComponent implements OnInit {
  /**
   * Constructor for the WelcomePageComponent class.
   * 
   * @param dialog - The service to handle dialogs.
   */
  constructor(public dialog: MatDialog) {}

  // ngOnInit lifecycle hook
  ngOnInit(): void {
  }

  /**
   * Function to open the user registration dialog.
   * 
   * This function opens a dialog with the UserRegistrationFormComponent.
   */
  openUserLoginDialog(): void {
    this.dialog.open(UserLoginFormComponent, {
      width: '400px'
    });
  }

  /**
   * Function to open the user login dialog.
   * 
   * This function opens a dialog with the UserLoginFormComponent.
   */
  openUserRegistrationDialog(): void {
    this.dialog.open(UserRegistrationFormComponent, {
      width: '400px'
    });
  }
}
