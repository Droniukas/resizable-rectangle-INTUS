import { RectangleCoordinates } from "src/app/models/interfaces/RectangleCoordinates";

export class RectangleUtils {
  static calculateRectanglePerimeter(rectangleCoords: RectangleCoordinates) {
    return (
      (rectangleCoords.right - rectangleCoords.left) * 2 +
      (rectangleCoords.bottom - rectangleCoords.top) * 2
    );
  }
}
