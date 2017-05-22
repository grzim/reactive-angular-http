import { Component, OnInit } from '@angular/core';
import { DataAndErrorOutput } from './data-and-error-output.service'
import { Observable } from 'rxjs/Observable'

@Component({
  selector: 'app-data-and-error-output',
  templateUrl: './data-and-error-output.component.html',
  styleUrls: ['./data-and-error-output.component.scss']
})
export class DataAndErrorOutputComponent implements OnInit {
  public errorMessages$: Observable<string>;
  public uiErrors$: Observable<string>;

  constructor(dataAndErrorOutput: DataAndErrorOutput) {
    this.errorMessages$ = dataAndErrorOutput.serverErrors$;
    this.uiErrors$ = dataAndErrorOutput.uiErrors$;
  }

  ngOnInit() {
  }

}
