import { fabric } from 'fabric';

const WallLine = fabric.util.createClass(fabric.Line, {
    // console.log("object")
    type: 'measurewall',
    superType: 'drawing',
    initialize(points: any, options: any) {
        if (!points) {
            const { x1, x2, y1, y2 } = options;
            points = [x1, y1, x2, y2];
        }
        options = options || {};
        this.callSuper('initialize', points, options);
    },
    _render(ctx: CanvasRenderingContext2D) {
        this.callSuper('_render', ctx);
    },
});

WallLine.fromObject = (options: any, callback: any) => {
    const { x1, x2, y1, y2 } = options;
    return callback(new WallLine([x1, y1, x2, y2], options));
};

window.fabric.WallLine = WallLine;

export default WallLine;
