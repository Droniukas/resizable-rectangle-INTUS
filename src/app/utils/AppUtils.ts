import { XYCoords } from "../models/interfaces/AnchorCoordinates";

export class AppUtils {
  static getCoordsInSvgSpace(event: MouseEvent, svg: any): XYCoords {
    const pt = svg.createSVGPoint();
    pt.x = event.clientX;
    pt.y = event.clientY;
    const { x, y } = pt.matrixTransform(svg.getScreenCTM().inverse());
    return { x, y };
  }
}
