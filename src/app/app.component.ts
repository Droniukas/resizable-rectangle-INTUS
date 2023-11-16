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
  initialState: null | {
    direction: Direction;
    rectangleCoords: RectangleCoordinates;
    mouseCoordsInSvgSpace: XYCoords;
  } = null;

  rectangleCoords: RectangleCoordinates = {
    left: 100,
    right: 200,
    top: 100,
    bottom: 200,
  };

  @ViewChild("svg")
  svg!: ElementRef;

  @HostListener("window:mousemove", ["$event"])
  handleMouseMove(event: MouseEvent) {
    if (!this.initialState) return;
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
    const initialDir = this.initialState.direction;

    if (
      initialDir === Direction.E ||
      initialDir === Direction.NE ||
      initialDir === Direction.SE
    ) {
      // this.rectangleCoords.right =
      //   (this.initialState.rectangleCoords.right - this.anchorCoords.x) *
      //     xGrowthRate +
      //   this.anchorCoords.x;
      this.rectangleCoords.right = mouseCoordsInSvgSpace.x;
    }
    if (
      initialDir === Direction.W ||
      initialDir === Direction.NW ||
      initialDir === Direction.SW
    ) {
      this.rectangleCoords.left = mouseCoordsInSvgSpace.x;
    }
    if (
      initialDir === Direction.N ||
      initialDir === Direction.NW ||
      initialDir === Direction.NE
    ) {
      this.rectangleCoords.top = mouseCoordsInSvgSpace.y;
    }
    if (
      initialDir === Direction.S ||
      initialDir === Direction.SW ||
      initialDir === Direction.SE
    ) {
      this.rectangleCoords.bottom = mouseCoordsInSvgSpace.y;
    }
  }

  @HostListener("window:mouseup")
  handleMouseUp() {
    this.initialState = null;
  }

  // relativeToAnchor = ({ x, y }: XYCoords): XYCoords => ({
  //   x: x - this.anchorCoords.x,
  //   y: y - this.anchorCoords.y,
  // });

  handleMouseDown(event: MouseEvent, direction: Direction) {
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
    this.initialState = {
      direction: direction,
      rectangleCoords: { ...this.rectangleCoords },
      mouseCoordsInSvgSpace: AppUtils.getCoordsInSvgSpace(
        event,
        this.svg.nativeElement
      ),
    };
  }
}
