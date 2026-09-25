import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { bestFloorPattern, truckload } from "./calculators";
import { trailerFloorPositions } from "./trailer-layout";

describe("trailerFloorPositions", () => {
  it("places one rectangle per floor count for a 53 ft van of 48x40", () => {
    const floorL = 630;
    const floorW = 98;
    const palletL = 48;
    const palletW = 40;
    const floor = bestFloorPattern(floorL, floorW, palletL, palletW);
    const boxes = trailerFloorPositions({ floorL, floorW, palletL, palletW, floor });
    assert.equal(boxes.length, floor.count);
    assert.ok(floor.count > 0);
  });

  it("matches truckload().floor.count for the same inputs", () => {
    const input = {
      floorL: 630,
      floorW: 98,
      interiorH: 110,
      palletL: 48,
      palletW: 40,
      loadH: 48,
      loadWeight: 1500,
      maxLevels: 2,
      payload: 44000,
    };
    const result = truckload(input);
    const boxes = trailerFloorPositions({
      floorL: input.floorL,
      floorW: input.floorW,
      palletL: input.palletL,
      palletW: input.palletW,
      floor: result.floor,
    });
    assert.equal(boxes.length, result.floor.count);
  });

  it("returns empty when the footprint does not fit", () => {
    const floor = bestFloorPattern(20, 20, 48, 40);
    const boxes = trailerFloorPositions({
      floorL: 20,
      floorW: 20,
      palletL: 48,
      palletW: 40,
      floor,
    });
    assert.equal(boxes.length, 0);
  });
});
