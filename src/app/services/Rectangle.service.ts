import { Injectable } from "@angular/core";
import { RectangleCoordinates } from "../models/interfaces/RectangleCoordinates";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class RectangleService {
  readonly RECTANGLE_API = "https://localhost:7192/api/Rectangle";
  constructor(private http: HttpClient) {}

  getRectangleCoordinates(): Observable<RectangleCoordinates> {
    return this.http.get<RectangleCoordinates>(this.RECTANGLE_API);
  }
}
