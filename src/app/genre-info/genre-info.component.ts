import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * Component for displaying genre information in a dialog.
 * Uses the 'app-genre-info' selector, associated with 'genre-info.component.html' template and 'genre-info.component.scss' styles.
 */
@Component({
  selector: 'app-genre-info',
  templateUrl: './genre-info.component.html',
  styleUrls: ['./genre-info.component.scss']
})
export class GenreInfoComponent {

/**
 * Constructor for the GenreInfoComponent dialog.
 * @param dialogRef - Reference to the dialog opened.
 * @param data - Data injected into the dialog, containing the genre and description.
 */
  constructor(
    public dialogRef: MatDialogRef<GenreInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { genre: string; description: string }
  ) { }
}
