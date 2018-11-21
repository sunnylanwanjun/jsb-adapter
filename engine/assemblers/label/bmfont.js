/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

cc.Label._assembler.bmfont = cc.js.addon({
    createData (comp) {
        var renderData = comp.requestRenderData();
        return renderData;
    },

    appendQuad (comp, texture, rect, rotated, x, y, scale) {
        let renderData = comp._renderData;
        let verts = renderData.vertices,
            indices = renderData.indices;
        let dataOffset = renderData.dataLength;
        let indexOffset = indices.length;
        
        renderData.dataLength += 4;
        indices.length += 6;
        renderData.vertexCount = renderData.dataLength;
        renderData.indiceCount = renderData.dataLength / 2 * 3;

        let texw = texture.width,
            texh = texture.height,
            rectWidth = rect.width,
            rectHeight = rect.height,
            color = comp.node._color._val;

        let l, b, r, t;
        if (!rotated) {
            l = (rect.x) / texw;
            r = (rect.x + rectWidth) / texw;
            b = (rect.y + rectHeight) / texh;
            t = (rect.y) / texh;

            verts[dataOffset].u = l;
            verts[dataOffset].v = b;
            verts[dataOffset+1].u = r;
            verts[dataOffset+1].v = b;
            verts[dataOffset+2].u = l;
            verts[dataOffset+2].v = t;
            verts[dataOffset+3].u = r;
            verts[dataOffset+3].v = t;
        } else {
            l = (rect.x) / texw;
            r = (rect.x + rectHeight) / texw;
            b = (rect.y + rectWidth) / texh;
            t = (rect.y) / texh;

            verts[dataOffset].u = l;
            verts[dataOffset].v = t;
            verts[dataOffset+1].u = l;
            verts[dataOffset+1].v = b;
            verts[dataOffset+2].u = r;
            verts[dataOffset+2].v = t;
            verts[dataOffset+3].u = r;
            verts[dataOffset+3].v = b;
        }

        verts[dataOffset].x = x;
        verts[dataOffset].y = y - rectHeight * scale;
        verts[dataOffset].color = color;
        verts[dataOffset+1].x = x + rectWidth * scale;
        verts[dataOffset+1].y = y - rectHeight * scale;
        verts[dataOffset+1].color = color;
        verts[dataOffset+2].x = x;
        verts[dataOffset+2].y = y;
        verts[dataOffset+2].color = color;
        verts[dataOffset+3].x = x + rectWidth * scale;
        verts[dataOffset+3].y = y;
        verts[dataOffset+3].color = color;

        // fill indice data
        indices[indexOffset++] = dataOffset;
        indices[indexOffset++] = dataOffset+1;
        indices[indexOffset++] = dataOffset+2;
        indices[indexOffset++] = dataOffset+1;
        indices[indexOffset++] = dataOffset+3;
        indices[indexOffset++] = dataOffset+2;
    },
}, cc.textUtils.bmfont);
