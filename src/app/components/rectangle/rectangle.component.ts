import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
  Renderer2,
} from "@angular/core";
import { Direction } from "src/app/models/enums/Direction";
import { RectangleCoordinates } from "src/app/models/interfaces/RectangleCoordinates";
import { XYCoords } from "src/app/models/interfaces/XYCoords";

@Component({
  selector: "g[rectangle]",
  templateUrl: "./rectangle.component.html",
  styleUrls: ["./rectangle.component.css"],
})
export class RectangleComponent {
  readonly Direction = Direction;

  @Input({ required: true })
  getCoordsInSvgSpace!: (event: MouseEvent) => XYCoords;

  @Input({ required: true })
  rectangleCoords!: RectangleCoordinates;

  @Output()
  saveRectangleCoords: EventEmitter<RectangleCoordinates> = new EventEmitter();

  constructor(private renderer: Renderer2) {}

  windowMouseMoveListener: (() => void) | null = null;
  windowMouseResizeListener: (() => void) | null = null;
  windowMouseUpListener: (() => void) | null = null;

  cornerHandleSize = 10;

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

  handleResizeOnMouseMove(event: MouseEvent) {
    if (!this.initialResizeState || this._uncalculatedRectangleCoords === null)
      return;

    const mouseCoordsInSvgSpace = this.getCoordsInSvgSpace(event);

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

  handleMoveOnMouseMove(event: MouseEvent) {
    if (this.initialMoveState === null) return;
    const mouseCoordsInSvgSpace = this.getCoordsInSvgSpace(event);

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

  @HostListener("window:mouseup")
  handleMouseUp() {
    if (this.initialResizeState === null && this.initialMoveState === null)
      return;
    this.saveRectangleCoords.emit(this.rectangleCoords);
    this.initialResizeState = null;
    this.initialMoveState = null;
    if (this.windowMouseMoveListener) this.windowMouseMoveListener();
    if (this.windowMouseResizeListener) this.windowMouseResizeListener();
  }

  handleResizeOnMouseDown(directions: Direction[]) {
    this._uncalculatedRectangleCoords = {
      ...this.rectangleCoords,
    };
    this.initialResizeState = {
      directions: directions,
    };
    this.windowMouseResizeListener = this.renderer.listen(
      "window",
      "mousemove",
      (event) => this.handleResizeOnMouseMove(event)
    );
  }

  handleMoveOnMouseDown(event: MouseEvent) {
    this.initialMoveState = {
      mouseCoordsInSvgSpace: this.getCoordsInSvgSpace(event),
      rectangleCoords: { ...this.rectangleCoords },
    };
    this.windowMouseMoveListener = this.renderer.listen(
      "window",
      "mousemove",
      (event) => this.handleMoveOnMouseMove(event)
    );
  }
}
