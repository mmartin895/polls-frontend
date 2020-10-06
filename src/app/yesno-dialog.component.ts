import { Component } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'nb-name-prompt',
  template: `
    <nb-card>
      <nb-card-header>{{title}}</nb-card-header>
      <nb-card-body>
        {{body}}
      </nb-card-body>
      <nb-card-footer >
        <button nbButton status="danger" (click)="cancel()" style="margin-right:5px">Cancel</button>
        <button nbButton status="success" (click)="submit(true)">Yes</button>
      </nb-card-footer>
    </nb-card>
  `,
})
export class YesNoDialogComponent {
  constructor(protected dialogRef: NbDialogRef<YesNoDialogComponent>) {
  }

  public title: String;
  public body: String;

  cancel() {
    this.dialogRef.close();
  }

  submit(name) {
    this.dialogRef.close(name);
  }
}