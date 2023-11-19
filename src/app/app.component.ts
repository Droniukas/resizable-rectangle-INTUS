import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from "@angular/core";
import { RectangleCoordinates } from "./models/interfaces/RectangleCoordinates";
import { Direction } from "./models/enums/Direction";
import { XYCoords } from "./models/interfaces/XYCoords";
import { ShapesUtils } from "./components/shapes/utils/ShapesUtils";
import { RectangleService } from "./services/Rectangle.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {}
