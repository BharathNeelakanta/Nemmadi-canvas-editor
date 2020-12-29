import { fabric } from 'fabric';
import uuid from 'uuid';

import Handler from './Handler';
import { FabricEvent, FabricObject } from '../utils';
import { Arrow, Line, DottedLine , Partition, Measurewall, Measureroom} from '../objects';
// import { Partition } from 'fabric/fabric-impl';

class DrawingHandler {
    handler: Handler;
    constructor(handler: Handler) {
        this.handler = handler;
    }

    polygon = {
        init: () => {
            this.handler.modeHandler.drawing(null, 'polygon');
            this.handler.pointArray = [];
            this.handler.lineArray = [];
            this.handler.activeLine = null;
            this.handler.activeShape = null;
        },
        finish: () => {
            this.handler.pointArray.forEach(point => {
                this.handler.canvas.remove(point);
            });
            this.handler.lineArray.forEach(line => {
                this.handler.canvas.remove(line);
            });
            this.handler.canvas.remove(this.handler.activeLine);
            this.handler.canvas.remove(this.handler.activeShape);
            this.handler.pointArray = [];
            this.handler.lineArray = [];
            this.handler.activeLine = null;
            this.handler.activeShape = null;
            this.handler.canvas.renderAll();
            this.handler.modeHandler.selection();
        },
        addPoint: (opt: FabricEvent) => {
            const { e, absolutePointer } = opt;
            const { x, y } = absolutePointer;
            const circle = new fabric.Circle({
                radius: 3,
                fill: '#ffffff',
                stroke: '#333333',
                strokeWidth: 0.5,
                left: x,
                top: y,
                selectable: false,
                hasBorders: false,
                hasControls: false,
                originX: 'center',
                originY: 'center',
                hoverCursor: 'pointer',
            }) as FabricObject<fabric.Circle>;
            circle.set({
                id: uuid(),
            });
            if (!this.handler.pointArray.length) {
                circle.set({
                    fill: 'red',
                });
            }
            const points = [x, y, x, y];
            const line = new fabric.Line(points, {
                strokeWidth: 2,
                fill: '#999999',
                stroke: '#999999',
                originX: 'center',
                originY: 'center',
                selectable: false,
                hasBorders: false,
                hasControls: false,
                evented: false,
            }) as FabricObject<fabric.Line>;
            line.set({
                class: 'line',
            });
            if (this.handler.activeShape) {
                const position = this.handler.canvas.getPointer(e);
                const activeShapePoints = this.handler.activeShape.get('points') as Array<{ x: number, y: number }>;
                activeShapePoints.push({
                    x: position.x,
                    y: position.y,
                });
                const polygon = new fabric.Polygon(activeShapePoints, {
                    stroke: '#333333',
                    strokeWidth: 1,
                    fill: '#cccccc',
                    opacity: 0.1,
                    selectable: false,
                    hasBorders: false,
                    hasControls: false,
                    evented: false,
                });
                this.handler.canvas.remove(this.handler.activeShape);
                this.handler.canvas.add(polygon);
                this.handler.activeShape = polygon;
                this.handler.canvas.renderAll();
            } else {
                const polyPoint = [{ x, y }];
                const polygon = new fabric.Polygon(polyPoint, {
                    stroke: '#333333',
                    strokeWidth: 1,
                    fill: '#cccccc',
                    opacity: 0.1,
                    selectable: false,
                    hasBorders: false,
                    hasControls: false,
                    evented: false,
                });
                this.handler.activeShape = polygon;
                this.handler.canvas.add(polygon);
            }
            this.handler.activeLine = line;
            this.handler.pointArray.push(circle);
            this.handler.lineArray.push(line);
            this.handler.canvas.add(line);
            this.handler.canvas.add(circle);
        },
        generate: (pointArray: FabricObject<fabric.Circle>[]) => {
            const points = [] as any[];
            const id = uuid();
            pointArray.forEach(point => {
                points.push({
                    x: point.left,
                    y: point.top,
                });
                this.handler.canvas.remove(point);
            });
            this.handler.lineArray.forEach(line => {
                this.handler.canvas.remove(line);
            });
            this.handler.canvas.remove(this.handler.activeShape).remove(this.handler.activeLine);
            const option = {
                id,
                points,
                type: 'polygon',
                stroke: 'rgba(0, 0, 0, 1)',
                strokeWidth: 3,
                fill: 'rgba(0, 0, 0, 0.25)',
                opacity: 1,
                objectCaching: !this.handler.editable,
                name: 'New polygon',
                superType: 'drawing',
            };
            this.handler.add(option, false);
            this.handler.pointArray = [];
            this.handler.activeLine = null;
            this.handler.activeShape = null;
            this.handler.modeHandler.selection();
        },
        // TODO... polygon resize
        // createResize: (target, points) => {
        //     points.forEach((point, index) => {
        //         const { x, y } = point;
        //         const circle = new fabric.Circle({
        //             name: index,
        //             radius: 3,
        //             fill: '#ffffff',
        //             stroke: '#333333',
        //             strokeWidth: 0.5,
        //             left: x,
        //             top: y,
        //             hasBorders: false,
        //             hasControls: false,
        //             originX: 'center',
        //             originY: 'center',
        //             hoverCursor: 'pointer',
        //             parentId: target.id,
        //         });
        //         this.handler.pointArray.push(circle);
        //     });
        //     const group = [target].concat(this.pointArray);
        //     this.handler.canvas.add(new fabric.Group(group, { type: 'polygon', id: uuid() }));
        // },
        // removeResize: () => {
        //     if (this.handler.pointArray) {
        //         this.handler.pointArray.forEach((point) => {
        //             this.handler.canvas.remove(point);
        //         });
        //         this.handler.pointArray = [];
        //     }
        // },
        // movingResize: (target, e) => {
        //     const points = target.diffPoints || target.points;
        //     const diffPoints = [];
        //     points.forEach((point) => {
        //         diffPoints.push({
        //             x: point.x + e.movementX,
        //             y: point.y + e.movementY,
        //         });
        //     });
        //     target.set({
        //         diffPoints,
        //     });
        //     this.handler.canvas.renderAll();
        // },
    }

    line = {
        init: () => {
            this.handler.modeHandler.drawing(null, 'line');
            this.handler.pointArray = [];
            this.handler.activeLine = null;
        },
        finish: () => {
            this.handler.pointArray.forEach(point => {
                this.handler.canvas.remove(point);
            });
            this.handler.canvas.remove(this.handler.activeLine);
            this.handler.pointArray = [];
            this.handler.activeLine = null;
            this.handler.canvas.renderAll();
            this.handler.modeHandler.selection();
        },
        addPoint: (opt: FabricEvent) => {
            const { absolutePointer } = opt;
            const { x, y } = absolutePointer;
            const circle = new fabric.Circle({
                radius: 3,
                fill: 'blue',
                stroke: 'blue',
                strokeWidth: 0.5,
                left: x,
                top: y,
                selectable: false,
                hasBorders: false,
                hasControls: false,
                originX: 'center',
                originY: 'center',
                hoverCursor: 'pointer',
            });
            if (!this.handler.pointArray.length) {
                circle.set({
                    fill: 'blue',
                });
            }
            const points = [x, y, x, y];
            this.handler.activeLine = new Line(points, {
                strokeWidth: 2,
                fill: 'blue',
                stroke: 'blue',
                originX: 'center',
                originY: 'center',
                selectable: false,
                hasBorders: false,
                hasControls: false,
                evented: false,
            });
            this.handler.activeLine.set({
                class: 'line',
            });
            this.handler.pointArray.push(circle);
            this.handler.canvas.add(this.handler.activeLine);
            this.handler.canvas.add(circle);
        },
        generate: (opt: FabricEvent) => {
            const { absolutePointer } = opt;
            const { x, y } = absolutePointer;
            let points = [] as number[];
            const id = uuid();
            this.handler.pointArray.forEach(point => {
                points = points.concat(point.left, point.top, x, y);
                this.handler.canvas.remove(point);
            });
            this.handler.canvas.remove(this.handler.activeLine);
            const option = {
                id,
                points,
                type: 'line',
                stroke: 'blue',
                strokeWidth: 3,
                opacity: 1,
                objectCaching: !this.handler.editable,
                name: 'Interior Line',
                superType: 'drawing',
            };
            this.handler.add(option, false);
            this.handler.pointArray = [];
            this.handler.activeLine = null;
            this.handler.modeHandler.selection();
        },
    }

    arrow = {
        init: () => {
            this.handler.modeHandler.drawing(null, 'arrow');
            this.handler.pointArray = [];
            this.handler.activeLine = null;
        },
        finish: () => {
            this.handler.pointArray.forEach(point => {
                this.handler.canvas.remove(point);
            });
            this.handler.canvas.remove(this.handler.activeLine);
            this.handler.pointArray = [];
            this.handler.activeLine = null;
            this.handler.canvas.renderAll();
            this.handler.modeHandler.selection();
        },
        addPoint: (opt: FabricEvent) => {
            const { absolutePointer } = opt;
            const { x, y } = absolutePointer;
            const circle = new fabric.Circle({
                radius: 3,
                fill: '#ffffff',
                stroke: '#333333',
                strokeWidth: 0.5,
                left: x,
                top: y,
                selectable: false,
                hasBorders: false,
                hasControls: false,
                originX: 'center',
                originY: 'center',
                hoverCursor: 'pointer',
            });
            if (!this.handler.pointArray.length) {
                circle.set({
                    fill: 'red',
                });
            }
            const points = [x, y, x, y];
            this.handler.activeLine = new Arrow(points, {
                strokeWidth: 2,
                fill: '#999999',
                stroke: '#999999',
                class: 'line',
                originX: 'center',
                originY: 'center',
                selectable: false,
                hasBorders: false,
                hasControls: false,
                evented: false,
            });
            this.handler.pointArray.push(circle);
            this.handler.canvas.add(this.handler.activeLine);
            this.handler.canvas.add(circle);
        },
        generate: (opt: FabricEvent) => {
            const { absolutePointer } = opt;
            const { x, y } = absolutePointer;
            let points = [] as number[];
            this.handler.pointArray.forEach(point => {
                points = points.concat(point.left, point.top, x, y);
                this.handler.canvas.remove(point);
            });
            this.handler.canvas.remove(this.handler.activeLine);
            const option = {
                id: uuid(),
                points,
                type: 'arrow',
                stroke: 'rgba(0, 0, 0, 1)',
                strokeWidth: 3,
                opacity: 1,
                objectCaching: !this.handler.editable,
                name: 'Interior Line',
                superType: 'drawing',
            };
            this.handler.add(option, false);
            this.handler.pointArray = [];
            this.handler.activeLine = null;
            this.handler.modeHandler.selection();
        },
    }

    dottedline = {
        init: () => {
            this.handler.modeHandler.drawing(null, 'dottedline');
            this.handler.pointArray = [];
            this.handler.activeLine = null;
        },
        finish: () => {
            this.handler.pointArray.forEach(point => {
                this.handler.canvas.remove(point);
            });
            this.handler.canvas.remove(this.handler.activeLine);
            this.handler.pointArray = [];
            this.handler.activeLine = null;
            this.handler.canvas.renderAll();
            this.handler.modeHandler.selection();
        },
        addPoint: (opt: FabricEvent) => {
            const { absolutePointer } = opt;
            const { x, y } = absolutePointer;
            const circle = new fabric.Circle({
                radius: 3,
                fill: 'grey',
                stroke: 'grey',
                strokeWidth: 0.5,
                left: x,
                top: y,
                selectable: false,
                hasBorders: false,
                hasControls: false,
                originX: 'center',
                originY: 'center',
                hoverCursor: 'pointer',
            });
            if (!this.handler.pointArray.length) {
                circle.set({
                    fill: 'grey',
                });
            }
            const points = [x, y, x, y];
            this.handler.activeLine = new DottedLine(points, {
                strokeDashArray: [5, 5],
                strokeWidth: 2,
                fill: 'grey',
                stroke: 'grey',
                originX: 'center',
                originY: 'center',
                selectable: false,
                hasBorders: false,
                hasControls: false,
                evented: false,
            });
            this.handler.activeLine.set({
                class: 'dottedline',
            });
            this.handler.pointArray.push(circle);
            this.handler.canvas.add(this.handler.activeLine);
            this.handler.canvas.add(circle);
        },
        generate: (opt: FabricEvent) => {
            const { absolutePointer } = opt;
            const { x, y } = absolutePointer;
            let points = [] as number[];
            const id = uuid();
            this.handler.pointArray.forEach(point => {
                points = points.concat(point.left, point.top, x, y);
                this.handler.canvas.remove(point);
            });
            this.handler.canvas.remove(this.handler.activeLine);
            const option = {
                id,
                points,
                type: 'dottedline',
                stroke: 'grey',
                strokeWidth: 3,
                strokeDashArray: [5, 5],
                opacity: 1,
                objectCaching: !this.handler.editable,
                name: 'Partition Line',
                superType: 'drawing',
            };
            this.handler.add(option, false);
            this.handler.pointArray = [];
            this.handler.activeLine = null;
            this.handler.modeHandler.selection();
        },
    }


    partition = {
        init: () => {
            this.handler.modeHandler.drawing(null, 'partition');
            this.handler.pointArray = [];
            this.handler.activeLine = null;
        },
        finish: () => {
            this.handler.pointArray.forEach(point => {
                this.handler.canvas.remove(point);
            });
            this.handler.canvas.remove(this.handler.activeLine);
            this.handler.pointArray = [];
            this.handler.activeLine = null;
            this.handler.canvas.renderAll();
            this.handler.modeHandler.selection();
        },
        addPoint: (opt: FabricEvent) => {
            const { absolutePointer } = opt;
            const { x, y } = absolutePointer;
            const circle = new fabric.Circle({
                radius: 3,
                fill: 'DeepPink',
                stroke: 'DeepPink',
                strokeWidth: 0.5,
                left: x,
                top: y,
                selectable: false,
                hasBorders: false,
                hasControls: false,
                originX: 'center',
                originY: 'center',
                hoverCursor: 'pointer',
            });
            if (!this.handler.pointArray.length) {
                circle.set({
                    fill: 'partition',
                });
            }
            const points = [x, y, x, y];
            this.handler.activeLine = new Partition(points, {
                strokeWidth: 2,
                fill: 'DeepPink',
                stroke: 'DeepPink',
                originX: 'center',
                originY: 'center',
                selectable: false,
                hasBorders: false,
                hasControls: false,
                evented: false,
            });
            this.handler.activeLine.set({
                class: 'partition',
            });
            this.handler.pointArray.push(circle);
            this.handler.canvas.add(this.handler.activeLine);
            this.handler.canvas.add(circle);
        },
        generate: (opt: FabricEvent) => {
            const { absolutePointer } = opt;
            const { x, y } = absolutePointer;
            let points = [] as number[];
            const id = uuid();
            this.handler.pointArray.forEach(point => {
                points = points.concat(point.left, point.top, x, y);
                this.handler.canvas.remove(point);
            });
            this.handler.canvas.remove(this.handler.activeLine);
            const option = {
                id,
                points,
                type: 'partition',
                stroke: 'DeepPink',
                strokeWidth: 3,
                opacity: 1,
                objectCaching: !this.handler.editable,
                name: 'Exterior Line',
                superType: 'drawing',
            };
            this.handler.add(option, false);
            this.handler.pointArray = [];
            this.handler.activeLine = null;
            this.handler.modeHandler.selection();
        },
    }

    measureroom = {
        init: () => {
            this.handler.modeHandler.drawing(null, 'measureroom');
            this.handler.pointArray = [];
            this.handler.activeLine = null;
        },
        finish: () => {
            this.handler.pointArray.forEach(point => {
                this.handler.canvas.remove(point);
            });
            this.handler.canvas.remove(this.handler.activeLine);
            this.handler.pointArray = [];
            this.handler.activeLine = null;
            this.handler.canvas.renderAll();
            this.handler.modeHandler.selection();
        },
        addPoint: (opt: FabricEvent) => {
            const { absolutePointer } = opt;
            const { x, y } = absolutePointer;
            const circle = new fabric.Circle({
                radius: 3,
                fill: 'green',
                stroke: 'green',
                strokeWidth: 0.5,
                left: x,
                top: y,
                selectable: false,
                hasBorders: false,
                hasControls: false,
                originX: 'center',
                originY: 'center',
                hoverCursor: 'pointer',
            });
            if (!this.handler.pointArray.length) {
                circle.set({
                    fill: 'measureroom',
                });
            }
            const points = [x, y, x, y];
            this.handler.activeLine = new Measureroom(points, {
                strokeWidth: 2,
                fill: 'green',
                stroke: 'green',
                originX: 'center',
                originY: 'center',
                selectable: false,
                hasBorders: false,
                hasControls: false,
                evented: false,
            });
            this.handler.activeLine.set({
                class: 'measureroom',
            });
            this.handler.pointArray.push(circle);
            this.handler.canvas.add(this.handler.activeLine);
            this.handler.canvas.add(circle);
        },
        generate: (opt: FabricEvent) => {
            const { absolutePointer } = opt;
            const { x, y } = absolutePointer;
            let points = [] as number[];
            const id = uuid();
            this.handler.pointArray.forEach(point => {
                points = points.concat(point.left, point.top, x, y);
                this.handler.canvas.remove(point);
            });
            this.handler.canvas.remove(this.handler.activeLine);
            const option = {
                id,
                points,
                type: 'measureroom',
                stroke: 'green',
                strokeWidth: 3,
                opacity: 1,
                objectCaching: !this.handler.editable,
                name: 'Measure Room',
                superType: 'drawing',
            };
            this.handler.add(option, false);
            this.handler.pointArray = [];
            this.handler.activeLine = null;
            this.handler.modeHandler.selection();
        },
    }
    measurewall = {
        init: () => {
            this.handler.modeHandler.drawing(null, 'measurewall');
            this.handler.pointArray = [];
            this.handler.activeLine = null;
        },
        finish: () => {
            this.handler.pointArray.forEach(point => {
                this.handler.canvas.remove(point);
            });
            this.handler.canvas.remove(this.handler.activeLine);
            this.handler.pointArray = [];
            this.handler.activeLine = null;
            this.handler.canvas.renderAll();
            this.handler.modeHandler.selection();
        },
        addPoint: (opt: FabricEvent) => {
            const { absolutePointer } = opt;
            const { x, y } = absolutePointer;
            const circle = new fabric.Circle({
                radius: 3,
                fill: 'Navy',
                stroke: 'Navy',
                strokeWidth: 0.5,
                left: x,
                top: y,
                selectable: false,
                hasBorders: false,
                hasControls: false,
                originX: 'center',
                originY: 'center',
                hoverCursor: 'pointer',
            });
            if (!this.handler.pointArray.length) {
                circle.set({
                    fill: 'measurewall',
                });
            }
            const points = [x, y, x, y];
            this.handler.activeLine = new Measurewall(points, {
                strokeWidth: 2,
                fill: 'Navy',
                stroke: 'Navy',
                originX: 'center',
                originY: 'center',
                selectable: false,
                hasBorders: false,
                hasControls: false,
                evented: false,
            });
            this.handler.activeLine.set({
                class: 'measurewall',
            });
            this.handler.pointArray.push(circle);
            this.handler.canvas.add(this.handler.activeLine);
            this.handler.canvas.add(circle);
        },
        generate: (opt: FabricEvent) => {
            const { absolutePointer } = opt;
            const { x, y } = absolutePointer;
            let points = [] as number[];
            const id = uuid();
            this.handler.pointArray.forEach(point => {
                points = points.concat(point.left, point.top, x, y);
                this.handler.canvas.remove(point);
            });
            this.handler.canvas.remove(this.handler.activeLine);
            const option = {
                id,
                points,
                type: 'measurewall',
                stroke: 'Navy',
                strokeWidth: 3,
                opacity: 1,
                objectCaching: !this.handler.editable,
                name: 'Measure Wall',
                superType: 'drawing',
            };
            this.handler.add(option, false);
            this.handler.pointArray = [];
            this.handler.activeLine = null;
            this.handler.modeHandler.selection();
        },
    }

    orthogonal = {

    }

    curve = {

    }
}

export default DrawingHandler;
