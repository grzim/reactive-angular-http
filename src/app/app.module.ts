import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { DataAndErrorOutput } from './resources/data-and-error-output/data-and-error-output.service';
import { DataAndErrorOutputComponent } from './resources/data-and-error-output/data-and-error-output.component'
import { HttpDriver } from './resources/backend-drivers/http-driver.service'
import { AaaResource, Session, Users } from './resources/data-resources/app-resources'
import { WebsocketDriver } from './resources/backend-drivers/websocket-driver.service';
import { SampleComponent } from './resources/sample-ui/sample/sample.component'
import 'rxjs/';


@NgModule({
  declarations: [
    AppComponent,
    DataAndErrorOutputComponent,
    SampleComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [
    HttpDriver,
    AaaResource,
    Users,
    Session,
    WebsocketDriver,
    DataAndErrorOutput],
  bootstrap: [AppComponent]
})
export class AppModule { }