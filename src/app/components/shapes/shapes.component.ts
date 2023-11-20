import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { RectangleCoordinates } from "src/app/models/interfaces/RectangleCoordinates";
import { XYCoords } from "src/app/models/interfaces/XYCoords";
import { RectangleService } from "src/app/services/Rectangle.service";
import { ShapesUtils } from "src/app/components/shapes/utils/ShapesUtils";

@Component({
  selector: "shapes",
  templateUrl: "./shapes.component.html",
  styleUrls: ["./shapes.component.css"],
})
export class ShapesComponent implements OnInit {
  initialRectangleCoords: RectangleCoordinates | null = null;

  @ViewChild("svg")
  svg!: ElementRef;

  getCoordsInSvgSpace = (event: MouseEvent): XYCoords => {
    return ShapesUtils.getCoordsInSvgSpace(event, this.svg.nativeElement);
  };

  saveRectangleCoords(rectangleCoords: RectangleCoordinates) {
    this.rectangleService.updateRectangleCoordinates(rectangleCoords);
  }

  constructor(private rectangleService: RectangleService) {}

  ngOnInit(): void {
    this.rectangleService
      .getRectangleCoordinates()
      .subscribe((rectangleCoords: RectangleCoordinates) => {
        this.initialRectangleCoords = rectangleCoords;
      });
  }
}
