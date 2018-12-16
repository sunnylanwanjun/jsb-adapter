
const Helper = cc.Graphics.helper;
const PointFlags = cc.Graphics.types.PointFlags;
const Point = cc.GraphicsPoint;

function Path () {
    this.reset();
}

cc.js.mixin(Path.prototype, {
    reset () {
        this.closed = false;
        this.nbevel = 0;
        this.complex = true;

        if (this.points) {
            this.points.length = 0;
        }
        else {
            this.points = [];
        }
    }
});

let RenderData = function RenderData () {
    this.index = 0;
    this.indiceStart = 0;
    this.indiceOffset = 0;
    this.vertexStart = 0;
    this.vertexOffset = 0;
};

cc.Graphics.Impl = function Impl (graphics) {
    // inner properties
    this._tessTol = 0.25;
    this._distTol = 0.01;
    this._updatePathOffset = false;
    
    this._paths = null;
    this._pathLength = 0;
    this._pathOffset = 0;
    
    this._points = null;
    this._pointsOffset = 0;
    
    this._commandx = 0;
    this._commandy = 0;

    this._paths = [];
    this._points = [];

    this._renderDatas = [];
    
    this._dataOffset = 0;
}

cc.js.mixin(cc.Graphics.Impl.prototype, {
    moveTo (x, y) {
        if (this._updatePathOffset) {
            this._pathOffset = this._pathLength;
            this._updatePathOffset = false;
        }
    
        this._addPath();
        this._addPoint(x, y, PointFlags.PT_CORNER);
    
        this._commandx = x;
        this._commandy = y;
    },

    lineTo (x, y) {
        this._addPoint(x, y, PointFlags.PT_CORNER);
        
        this._commandx = x;
        this._commandy = y;
    },

    bezierCurveTo (c1x, c1y, c2x, c2y, x, y) {
        var path = this._curPath;
        var last = path.points[path.points.length - 1];
    
        if (last.x === c1x && last.y === c1y && c2x === x && c2y === y) {
            this.lineTo(x, y);
            return;
        }
    
        Helper.tesselateBezier(this, last.x, last.y, c1x, c1y, c2x, c2y, x, y, 0, PointFlags.PT_CORNER);
    
        this._commandx = x;
        this._commandy = y;
    },

    quadraticCurveTo (cx, cy, x, y) {
        var x0 = this._commandx;
        var y0 = this._commandy;
        this.bezierCurveTo(x0 + 2.0 / 3.0 * (cx - x0), y0 + 2.0 / 3.0 * (cy - y0), x + 2.0 / 3.0 * (cx - x), y + 2.0 / 3.0 * (cy - y), x, y);
    },

    arc (cx, cy, r, startAngle, endAngle, counterclockwise) {
        Helper.arc(this, cx, cy, r, startAngle, endAngle, counterclockwise);
    },

    ellipse (cx, cy, rx, ry) {
        Helper.ellipse(this, cx, cy, rx, ry);
        this._curPath.complex = false;
    },

    circle (cx, cy, r) {
        Helper.ellipse(this, cx, cy, r, r);
        this._curPath.complex = false;
    },

    rect (x, y, w, h) {
        this.moveTo(x, y);
        this.lineTo(x, y + h);
        this.lineTo(x + w, y + h);
        this.lineTo(x + w, y);
        this.close();
        this._curPath.complex = false;
    },

    roundRect (x, y, w, h, r) {
        Helper.roundRect(this, x, y, w, h, r);
        this._curPath.complex = false;
    },

    clear (comp, clean) {
        this._pathLength = 0;
        this._pathOffset = 0;
        this._pointsOffset = 0;
        
        this._dataOffset = 0;
        
        this._curPath = null;
    
        let datas = this._renderDatas;
        this._paths.length = 0;
        this._points.length = 0;
        datas.length = 0;
        comp._renderHandle.clear();
    },

    close () {
        this._curPath.closed = true;
    },

    _addPath () {
        var offset = this._pathLength;
        var path = this._paths[offset];
    
        if (!path) {
            path = new Path();
    
            this._paths.push(path);
        } else {
            path.reset();
        }
    
        this._pathLength++;
        this._curPath = path;
    
        return path;
    },
    
    _addPoint (x, y, flags) {
        var path = this._curPath;
        if (!path) return;
    
        var pt;
        var points = this._points;
        var pathPoints = path.points;
    
        var offset = this._pointsOffset++;
        pt = points[offset];
    
        if (!pt) {
            pt = new Point(x, y);
            points.push(pt);
        } else {
            pt.x = x;
            pt.y = y;
        }
    
        pt.flags = flags;
        pathPoints.push(pt);
    },

    requestRenderData (graphics, cverts) {
        let renderHandle = graphics._renderHandle;
        let vBytes = (cverts && cverts > 0) ?  cverts : 64;
        let iBytes = vBytes * 3;
        let vertices = new Float32Array(vBytes);
        let indices = new Uint16Array(iBytes);
        let renderData = new RenderData();
        renderData.index = this._dataOffset;
        renderData.vertexStart = 0;
        renderData.vertexOffset = vBytes;
        renderData.indiceStart = 0;
        renderData.indiceOffset = iBytes;
        this._renderDatas.push(renderData);

        renderHandle.updateMesh(this._dataOffset, vertices, indices);

        return renderData;
    },

    getRenderDatas (graphics, cverts) {
        if (this._renderDatas.length === 0) {
            this.requestRenderData(graphics, cverts);
        }

        return this._renderDatas;
    },

    reallocVData (graphics, index, vBytes) {
        let renderHandler = graphics._renderHandle;
        let vData = renderHandler.vDatas[index];
        let renderData = this._renderDatas[index];
        let oldVData;
        if (vData) {
            oldVData = new Uint8Array(vData.buffer);
        }

        renderData.vertexOffset += vBytes;

        let vertices = new Float32Array(vBytes);
        let newData = new Uint8Array(vertices.buffer);
        
        if (oldVData) {
            for (let i = 0, l = oldVData.length; i < l; i++) {
                newData[i] = oldVData[i];
            }
        }

        return vertices
    },

    reallocIData (graphics, index, iBytes) {
        let renderHandler = graphics._renderHandle;
        let oldIData = renderHandler.iDatas[index];
        let renderData = this._renderDatas[index];

        renderData.indiceOffset += iBytes;

        let indices = new Uint16Array(iBytes);

        if (oldIData) {
            for (let i = 0, l = oldIData.length; i < l; i++) {
                indices[i] = oldIData[i];
            }
        }

        return indices;
    },
});
