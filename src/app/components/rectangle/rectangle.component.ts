import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from "@angular/core";
import { Direction } from "src/app/models/enums/Direction";
import { RectangleCoordinates } from "src/app/models/interfaces/RectangleCoordinates";
import { XYCoords } from "src/app/models/interfaces/XYCoords";
import { AppUtils } from "src/app/utils/AppUtils";

@Component({
  selector: "g[app-rectangle]",
  templateUrl: "./rectangle.component.html",
  styleUrls: ["./rectangle.component.css"],
})
export class RectangleComponent {
  @Input({ required: true })
  getCoordsInSvgSpace!: (event: MouseEvent) => XYCoords;

  @Input({ required: true })
  rectangleCoords!: RectangleCoordinates;

  @Input({ required: true })
  parentSvg!: HTMLElement | SVGSVGElement;

  cornerHandleSize = 10;

  readonly Direction = Direction;

  _uncalculatedRectangleCoords: RectangleCoordinates | null = null;

  initialResizeState: null | {
    directions: Direction[];
  } = null;

  initialMoveState: null | {
    mouseCoordsInSvgSpace: XYCoords;
    rectangleCoords: RectangleCoordinates;
  } = null;

  get rectanglePerimeter(): number {
    return (
      (this.rectangleCoords.right - this.rectangleCoords.left) * 2 +
      (this.rectangleCoords.bottom - this.rectangleCoords.top) * 2
    );
  }

  calculateDirection(
    initialDirections: Direction[],
    mouseCoordsInSvgSpace: XYCoords
  ) {
    if (this._uncalculatedRectangleCoords === null) return;
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
  }

  @HostListener("window:mousemove", ["$event"])
  handleMouseMove(event: MouseEvent) {
    if (!this.initialMoveState && !this.initialResizeState) return;

    const mouseCoordsInSvgSpace = this.getCoordsInSvgSpace(event);

    // const mouseCoordsInSvgSpace = AppUtils.getCoordsInSvgSpace(
    //   event,
    //   this.parentSvg as SVGSVGElement
    // );

    if (
      this.initialResizeState !== null &&
      this._uncalculatedRectangleCoords !== null
    ) {
      const initialDirections = this.initialResizeState.directions;

      this.calculateDirection(initialDirections, mouseCoordsInSvgSpace);

      const xValues = [
        this._uncalculatedRectangleCoords.left,
        this._uncalculatedRectangleCoords.right,
      ];
      const yValues = [
        this._uncalculatedRectangleCoords.top,
        this._uncalculatedRectangleCoords.bottom,
      ];

      this.rectangleCoords.left = Math.min(...xValues);
      this.rectangleCoords.right = Math.max(...xValues);
      this.rectangleCoords.top = Math.min(...yValues);
      this.rectangleCoords.bottom = Math.max(...yValues);
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

  handleResizeOnMouseDown(directions: Direction[]) {
    this._uncalculatedRectangleCoords = {
      ...this.rectangleCoords,
    };
    this.initialResizeState = {
      directions: directions,
    };
  }

  handleMoveOnMouseDown(event: MouseEvent) {
    this.initialMoveState = {
      mouseCoordsInSvgSpace: this.getCoordsInSvgSpace(event),
      // mouseCoordsInSvgSpace: AppUtils.getCoordsInSvgSpace(
      //   event,
      //   this.parentSvg as SVGSVGElement
      // ),

      rectangleCoords: { ...this.rectangleCoords },
    };
  }
}
