import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
} from "@angular/core";
import { RectangleCoordinates } from "./models/interfaces/RectangleCoordinates";
import { Direction } from "./models/enums/Direction";
import { XYCoords } from "./models/interfaces/XYCoords";
import { AppUtils } from "./utils/AppUtils";
import { RectangleSide } from "./models/interfaces/RectangleSide";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements AfterViewInit {
  ngAfterViewInit(): void {}
  readonly Direction = Direction;
  _uncalculatedRectangleCoords: RectangleCoordinates | null = null;

  initialResizeState: null | {
    directions: Direction[];
  } = null;

  initialMoveState: null | {
    mouseCoordsInSvgSpace: XYCoords;
    rectangleCoords: RectangleCoordinates;
  } = null;

  rectangleCoords: RectangleCoordinates = {
    left: 200,
    right: 600,
    top: 100,
    bottom: 400,
  };

  get rectanglePerimeter(): string {
    return (
      (this.rectangleCoords.right - this.rectangleCoords.left) * 2 +
      (this.rectangleCoords.bottom - this.rectangleCoords.top) * 2
    ).toFixed(2);
  }

  cornerHandleSize = 10;

  @ViewChild("svg")
  svg!: ElementRef;

  @HostListener("window:mousemove", ["$event"])
  handleMouseMove(event: MouseEvent) {
    if (!this.initialMoveState && !this.initialResizeState) return;

    const mouseCoordsInSvgSpace = AppUtils.getCoordsInSvgSpace(
      event,
      this.svg.nativeElement
    );

    if (
      this.initialResizeState !== null &&
      this._uncalculatedRectangleCoords !== null
    ) {
      const initialDirections = this.initialResizeState.directions;

      if (initialDirections.includes(Direction.E)) {
        this._uncalculatedRectangleCoords.right = mouseCoordsInSvgSpace.x;
      }
      if (initialDirections.includes(Direction.W)) {
        this._uncalculatedRectangleCoords.left = mouseCoordsInSvgSpace.x;
      }
      if (initialDirections.includes(Direction.N)) {
        this._uncalculatedRectangleCoords.top = mouseCoordsInSvgSpace.y;
      }
      if (initialDirections.includes(Direction.S)) {
        this._uncalculatedRectangleCoords.bottom = mouseCoordsInSvgSpace.y;
      }

      const rectangleCoords = AppUtils.calculateBox(
        [
          this._uncalculatedRectangleCoords.left,
          this._uncalculatedRectangleCoords.right,
        ],
        [
          this._uncalculatedRectangleCoords.top,
          this._uncalculatedRectangleCoords.bottom,
        ]
      );

      this.rectangleCoords = AppUtils.getRectangleCoordsWithinLimits(
        rectangleCoords,
        this.svg.nativeElement
      );
    }

    if (this.initialMoveState !== null) {
      const xDistanceMoved =
        mouseCoordsInSvgSpace.x - this.initialMoveState.mouseCoordsInSvgSpace.x;
      const yDistanceMoved =
        mouseCoordsInSvgSpace.y - this.initialMoveState.mouseCoordsInSvgSpace.y;

      this.rectangleCoords.left =
        xDistanceMoved + this.initialMoveState.rectangleCoords.left;
      this.rectangleCoords.right =
        xDistanceMoved + this.initialMoveState.rectangleCoords.right;
      this.rectangleCoords.top =
        yDistanceMoved + this.initialMoveState.rectangleCoords.top;
      this.rectangleCoords.bottom =
        yDistanceMoved + this.initialMoveState.rectangleCoords.bottom;
    }
  }

  @HostListener("window:mouseup")
  handleMouseUp() {
    this.initialResizeState = null;
    this.initialMoveState = null;
  }

  handleResizeOnMouseDown(event: MouseEvent, directions: Direction[]) {
    this._uncalculatedRectangleCoords = {
      ...this.rectangleCoords,
    };
    this.initialResizeState = {
      directions: directions,
    };
  }

  handleMoveOnMouseDown(event: MouseEvent) {
    this.initialMoveState = {
      mouseCoordsInSvgSpace: AppUtils.getCoordsInSvgSpace(
        event,
        this.svg.nativeElement
      ),
      rectangleCoords: { ...this.rectangleCoords },
    };
  }
}
