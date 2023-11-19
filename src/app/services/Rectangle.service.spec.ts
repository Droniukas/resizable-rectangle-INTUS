/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RectangleService } from './Rectangle.service';

describe('Service: Rectangle', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RectangleService]
    });
  });

  it('should ...', inject([RectangleService], (service: RectangleService) => {
    expect(service).toBeTruthy();
  }));
});
