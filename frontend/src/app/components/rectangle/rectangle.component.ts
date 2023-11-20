import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  Renderer2,
} from "@angular/core";
import { Direction } from "src/app/models/enums/Direction";
import { RectangleCoordinates } from "src/app/models/interfaces/RectangleCoordinates";
import { XYCoords } from "src/app/models/interfaces/XYCoords";
import { RectangleUtils } from "./utils/RectangleUtils";

@Component({
  selector: "g[rectangle]",
  templateUrl: "./rectangle.component.html",
  styleUrls: ["./rectangle.component.css"],
})
export class RectangleComponent implements OnInit {
  readonly Direction = Direction;

  @Input({ required: true })
  getCoordsInSvgSpace!: (event: MouseEvent) => XYCoords;

  @Input({ required: true, alias: "initialRectangleCoords" })
  rectangleCoords!: RectangleCoordinates;

  @Output()
  saveRectangleCoords: EventEmitter<RectangleCoordinates> = new EventEmitter();

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    this.rectanglePerimeter = RectangleUtils.calculateRectanglePerimeter(
      this.rectangleCoords
    );
  }

  windowMouseMoveListener: (() => void) | null = null;
  windowMouseResizeListener: (() => void) | null = null;
  windowMouseUpListener: (() => void) | null = null;

  cornerHandleSize = 10;

  rectanglePerimeter!: number;

  initialResizeState: null | {
    directions: Direction[];
    rectangleCoords: RectangleCoordinates;
  } = null;

  initialMoveState: null | {
    mouseCoordsInSvgSpace: XYCoords;
    rectangleCoords: RectangleCoordinates;
  } = null;

  handleResizeOnMouseMove(event: MouseEvent) {
    if (!this.initialResizeState) return;

    const mouseCoordsInSvgSpace = this.getCoordsInSvgSpace(event);

    const rectangleCoords = this.initialResizeState.rectangleCoords;
    const initialDirections = this.initialResizeState.directions;

    if (initialDirections.includes(Direction.E)) {
      rectangleCoords.right = mouseCoordsInSvgSpace.x;
    }
    if (initialDirections.includes(Direction.W)) {
      rectangleCoords.left = mouseCoordsInSvgSpace.x;
    }
    if (initialDirections.includes(Direction.N)) {
      rectangleCoords.top = mouseCoordsInSvgSpace.y;
    }
    if (initialDirections.includes(Direction.S)) {
      rectangleCoords.bottom = mouseCoordsInSvgSpace.y;
    }

    const xValues = [rectangleCoords.left, rectangleCoords.right];
    const yValues = [rectangleCoords.top, rectangleCoords.bottom];

    this.rectangleCoords.left = Math.min(...xValues);
    this.rectangleCoords.right = Math.max(...xValues);
    this.rectangleCoords.top = Math.min(...yValues);
    this.rectangleCoords.bottom = Math.max(...yValues);

    this.rectanglePerimeter = RectangleUtils.calculateRectanglePerimeter(
      this.rectangleCoords
    );
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
    this.initialResizeState = {
      directions: directions,
      rectangleCoords: { ...this.rectangleCoords },
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
