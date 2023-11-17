import { Component, ElementRef, HostListener, ViewChild } from "@angular/core";
import { RectangleCoordinates } from "./models/interfaces/RectangleCoordinates";
import { Direction } from "./models/enums/Direction";
import { XYCoords } from "./models/interfaces/AnchorCoordinates";
import { AppUtils } from "./utils/AppUtils";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  title = "resizable-rectangle-fe-INTUS";
  readonly Direction = Direction;
  anchorCoords: XYCoords = { x: 0, y: 0 };
  initialResizeState: null | {
    direction: Direction;
    rectangleCoords: RectangleCoordinates;
    mouseCoordsInSvgSpace: XYCoords;
  } = null;

  rectangleCoords: RectangleCoordinates = {
    left: 200,
    right: 600,
    top: 100,
    bottom: 400,
  };

  cornerHandleSize = 10;

  uncalculatedRectangleCoords: RectangleCoordinates | null = null;

  @ViewChild("svg")
  svg!: ElementRef;

  @HostListener("window:mousemove", ["$event"])
  handleMouseMove(event: MouseEvent) {
    if (!this.initialResizeState || !this.uncalculatedRectangleCoords) return;

    const mouseCoordsInSvgSpace = AppUtils.getCoordsInSvgSpace(
      event,
      this.svg.nativeElement
    );
    // const coordsRelativeToAnchor = this.relativeToAnchor(
    //   AppUtils.getCoordsInSvgSpace(event, this.svg.nativeElement)
    // );
    // const initialCoordsRelativeToAnchor = this.relativeToAnchor(
    //   this.initialState.mouseCoordsInSvgSpace
    // );

    // let xGrowthRate =
    //   coordsRelativeToAnchor.x / initialCoordsRelativeToAnchor.x;
    // let yGrowthRate =
    //   coordsRelativeToAnchor.y / initialCoordsRelativeToAnchor.y;
    const initialDir = this.initialResizeState.direction;

    if (
      initialDir === Direction.E ||
      initialDir === Direction.NE ||
      initialDir === Direction.SE
    ) {
      // this.rectangleCoords.right =
      //   (this.initialState.rectangleCoords.right - this.anchorCoords.x) *
      //     xGrowthRate +
      //   this.anchorCoords.x;
      this.uncalculatedRectangleCoords.right = mouseCoordsInSvgSpace.x;
    }
    if (
      initialDir === Direction.W ||
      initialDir === Direction.NW ||
      initialDir === Direction.SW
    ) {
      this.uncalculatedRectangleCoords.left = mouseCoordsInSvgSpace.x;
    }
    if (
      initialDir === Direction.N ||
      initialDir === Direction.NW ||
      initialDir === Direction.NE
    ) {
      this.uncalculatedRectangleCoords.top = mouseCoordsInSvgSpace.y;
    }
    if (
      initialDir === Direction.S ||
      initialDir === Direction.SW ||
      initialDir === Direction.SE
    ) {
      this.uncalculatedRectangleCoords.bottom = mouseCoordsInSvgSpace.y;
    }
    // console.log("uncalculated", this.uncalculatedRectangleCoords);
    // console.log(
    //   "calculated",
    //   this.calculateBbox(
    //     [
    //       this.uncalculatedRectangleCoords.left,
    //       this.uncalculatedRectangleCoords.right,
    //     ],
    //     [
    //       this.uncalculatedRectangleCoords.top,
    //       this.uncalculatedRectangleCoords.bottom,
    //     ]
    //   )
    // );
    this.rectangleCoords = this.calculateBbox(
      [
        this.uncalculatedRectangleCoords.left,
        this.uncalculatedRectangleCoords.right,
      ],
      [
        this.uncalculatedRectangleCoords.top,
        this.uncalculatedRectangleCoords.bottom,
      ]
    );
  }

  calculateBbox(xValues: number[], yValues: number[]): RectangleCoordinates {
    return {
      left: Math.min(...xValues),
      right: Math.max(...xValues),
      top: Math.min(...yValues),
      bottom: Math.max(...yValues),
    };
  }

  @HostListener("window:mouseup")
  handleMouseUp() {
    this.initialResizeState = null;
  }

  // relativeToAnchor = ({ x, y }: XYCoords): XYCoords => ({
  //   x: x - this.anchorCoords.x,
  //   y: y - this.anchorCoords.y,
  // });

  handleResizeOnMouseDown(event: MouseEvent, direction: Direction) {
    // set the anchor point and the initialMouseDownState
    // switch (direction) {
    //   case Direction.E:
    //     this.anchorCoords.x = this.rectangleCoords.left;
    //     break;
    //   case Direction.W:
    //     this.anchorCoords.x = this.rectangleCoords.right;
    //     break;
    //   // and others
    // }
    this.uncalculatedRectangleCoords = {
      ...this.rectangleCoords,
    };
    this.initialResizeState = {
      direction: direction,
      rectangleCoords: { ...this.rectangleCoords },
      mouseCoordsInSvgSpace: AppUtils.getCoordsInSvgSpace(
        event,
        this.svg.nativeElement
      ),
    };
  }
}
