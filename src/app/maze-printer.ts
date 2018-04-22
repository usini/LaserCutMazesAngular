import Big from "big.js";

import { ZERO } from "app/misc/big-util";
import SVG_HEADER from "app/misc/svg-header";
import CalibrationRectangle from "app/models/calibration-rectangle";
import SheetWallModel from "app/models/sheet-wall-model";
import VectorNumber from "app/models/vector-number";
import Rect from "app/svg/rect";
import SvgElementGenerator from "app/svg/svg-element-generator";

export default class MazePrinter {
    private sheetWallModel: SheetWallModel;
    private maxWidth: Big;
    private maxHeight: Big;
    precision: number = 5;

    constructor(sheetWallModel: SheetWallModel, maxWidth: Big, maxHeight: Big) {
        this.sheetWallModel = sheetWallModel;
        this.maxWidth = maxWidth;
        this.maxHeight = maxHeight;
    }

    /**
     * Prints an SVG with shapes representing cut-out sections that will be the walls and floor of a maze
     * @param name filename to create
     */
    printSvg(calibrationRectangle?: CalibrationRectangle): string {
        let result = SVG_HEADER;
        const svgElementGenerator = new SvgElementGenerator();

        result += "<g id=\"floor\">";
        for (const notch of this.sheetWallModel.floorNotches.paths) {
            const svgPath = svgElementGenerator.modelPathToSvgPath(notch);
            result += svgElementGenerator.pathToSvgText(svgPath, this.precision);
        }

        for (const outlinePath of this.sheetWallModel.floorOutline.paths) {
            const svgPath = svgElementGenerator.modelPathToSvgPath(outlinePath);
            svgPath.style = svgPath.style.replace("#000000", "#ff0000");
            result += svgElementGenerator.pathToSvgText(svgPath, this.precision);
        }
        result += "</g>\n";

        result += "<g id=\"walls\">";
        for (const shape of this.sheetWallModel.walls) {
            for (const wall of shape.paths) {
                const svgPath = svgElementGenerator.modelPathToSvgPath(wall);
                result += svgElementGenerator.pathToSvgText(svgPath, this.precision);
            }
        }
        result += "</g>\n";

        result += "<g id=\"floor-numbers\">";
        for (const floorNumber of this.sheetWallModel.floorNumbers) {
            result += svgElementGenerator.vectorNumberToSvgText(floorNumber, this.precision);
        }
        result += "</g>\n";

        result += "<g id=\"wall-numbers\">";
        const wallLabelValues: VectorNumber[] = [];
        const valIter = this.sheetWallModel.wallLabels.values();
        let vObj;
        while (!(vObj = valIter.next()).done) {
            wallLabelValues.push(vObj.value);
        }
        for (const wallNumber of wallLabelValues) {
            result += svgElementGenerator.vectorNumberToSvgText(wallNumber, this.precision);
        }
        result += "</g>\n";

        if (calibrationRectangle != null) {
            result += svgElementGenerator.rectToSvgText(this.buildCalibrationRectangle(calibrationRectangle), this.precision);
        }

        result += "</svg>\n";
        return result;
    }

    private buildCalibrationRectangle(calibrationRectangle: CalibrationRectangle): Rect {
        let width: Big, height: Big, x: Big, y: Big;
        width = calibrationRectangle.unit.pixelsPer.mul(new Big(calibrationRectangle.width));
        height = calibrationRectangle.unit.pixelsPer.mul(new Big(calibrationRectangle.height));
        if (calibrationRectangle.leftAligned) {
            x = ZERO;
        } else {
            x = this.maxWidth.sub(width);
        }
        if (calibrationRectangle.topAligned) {
            y = ZERO;
        } else {
            y = this.maxHeight.sub(height);
        }
        const rect = new Rect("calibration-rectangle", width, height, x, y);
        rect.style = rect.style.replace("000000", "00ff00");
        return rect;
    }
}
