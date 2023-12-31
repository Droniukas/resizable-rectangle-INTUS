import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppComponent } from "./app.component";
import { RectangleService } from "./services/Rectangle.service";
import { HttpClientModule } from "@angular/common/http";
import { RectangleComponent } from "./components/rectangle/rectangle.component";
import { ShapesComponent } from "./components/shapes/shapes.component";

@NgModule({
  declarations: [AppComponent, RectangleComponent, ShapesComponent],
  imports: [BrowserModule, HttpClientModule],
  providers: [RectangleService],
  bootstrap: [AppComponent],
})
export class AppModule {}
