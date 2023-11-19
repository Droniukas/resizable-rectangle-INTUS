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
import { AppUtils } from "./utils/AppUtils";
import { RectangleService } from "./services/Rectangle.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit, AfterViewInit {
  rectangleCoords!: RectangleCoordinates;

  @ViewChild("svg", { static: false })
  svg!: ElementRef;

  getCoordsInSvgSpace(event: MouseEvent): XYCoords {
    console.log(this);
    return AppUtils.getCoordsInSvgSpace(event, this.svg.nativeElement);
  }

  constructor(private rectangleService: RectangleService) {}

  ngOnInit(): void {
    this.rectangleService
      .getRectangleCoordinates()
      .subscribe((rectangleCoords: RectangleCoordinates) => {
        console.log(rectangleCoords);
        this.rectangleCoords = rectangleCoords;
      });
  }

  ngAfterViewInit(): void {
    console.log(this);
  }
}
