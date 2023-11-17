import { RectangleCoordinates } from "../models/interfaces/RectangleCoordinates";
import { XYCoords } from "../models/interfaces/XYCoords";

export class AppUtils {
  static getCoordsInSvgSpace(event: MouseEvent, svg: any): XYCoords {
    const pt = svg.createSVGPoint();
    pt.x = event.clientX;
    pt.y = event.clientY;
    const { x, y } = pt.matrixTransform(svg.getScreenCTM().inverse());
    return { x, y };
  }

  static calculateBox(
    xValues: number[],
    yValues: number[]
  ): RectangleCoordinates {
    return {
      left: Math.min(...xValues),
      right: Math.max(...xValues),
      top: Math.min(...yValues),
      bottom: Math.max(...yValues),
    };
  }

  static getRectangleCoordsWithinLimits(
    rectangleCoords: RectangleCoordinates,
    svg: any
  ): RectangleCoordinates {
    return {
      top: rectangleCoords.top < 5 ? 5 : rectangleCoords.top,
      left: rectangleCoords.left < 5 ? 5 : rectangleCoords.left,
      bottom:
        rectangleCoords.bottom > svg.clientHeight - 5
          ? svg.clientHeight - 5
          : rectangleCoords.bottom,
      right:
        rectangleCoords.right > svg.clientWidth - 5
          ? svg.clientWidth - 5
          : rectangleCoords.right,
    };
  }
}
