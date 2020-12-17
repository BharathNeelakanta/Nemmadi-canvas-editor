import { fabric } from 'fabric';

const DottedLine = fabric.util.createClass(fabric.Line, {
    // console.log("object")
    type: 'dottedline',
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

DottedLine.fromObject = (options: any, callback: any) => {
    const { x1, x2, y1, y2 } = options;
    return callback(new DottedLine([x1, y1, x2, y2], options));
};

window.fabric.DottedLine = DottedLine;

export default DottedLine;
