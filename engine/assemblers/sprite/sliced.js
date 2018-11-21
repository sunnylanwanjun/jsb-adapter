let temp = [
    {x: 0, y: 0},
    {x: 0, y: 0},
    {x: 0, y: 0},
    {x: 0, y: 0},
];

cc.Sprite._assembler.sliced = {
    useModel: false,

    createData (sprite) {
        let renderData = sprite.requestRenderData();
        let indices = renderData.indices;
        renderData.dataLength = 16;
        renderData.vertexCount = 16;
        renderData.indiceCount = 54;

        indices.length = 54;
        let indexOffset = 0;
        for (let r = 0; r < 3; ++r) {
            for (let c = 0; c < 3; ++c) {
                let start = r*4 + c;
                indices[indexOffset++] = start;
                indices[indexOffset++] = start + 1;
                indices[indexOffset++] = start + 4;
                indices[indexOffset++] = start + 1;
                indices[indexOffset++] = start + 5;
                indices[indexOffset++] = start + 4;
            }
        }

        return renderData;
    },

    updateRenderData (sprite) {
        let frame = sprite.spriteFrame;
        
        // TODO: Material API design and export from editor could affect the material activation process
        // need to update the logic here
        if (frame) {
            if (sprite._material._texture !== frame._texture) {
                sprite._activateMaterial();
            }
        }

        let renderData = sprite._renderData;
        if (renderData && frame && sprite._vertsDirty) {
            this.updateVerts(sprite);
            sprite._vertsDirty = false;
        }
    },
    
    updateVerts (sprite) {
        let renderData = sprite._renderData,
            verts = renderData.vertices,
            node = sprite.node,
            color = node._color._val,
            width = node.width, height = node.height,
            appx = node.anchorX * width, appy = node.anchorY * height;
    
        let frame = sprite.spriteFrame;
        let leftWidth = frame.insetLeft;
        let rightWidth = frame.insetRight;
        let topHeight = frame.insetTop;
        let bottomHeight = frame.insetBottom;
    
        let sizableWidth = width - leftWidth - rightWidth;
        let sizableHeight = height - topHeight - bottomHeight;
        let xScale = width / (leftWidth + rightWidth);
        let yScale = height / (topHeight + bottomHeight);
        xScale = (isNaN(xScale) || xScale > 1) ? 1 : xScale;
        yScale = (isNaN(yScale) || yScale > 1) ? 1 : yScale;
        sizableWidth = sizableWidth < 0 ? 0 : sizableWidth;
        sizableHeight = sizableHeight < 0 ? 0 : sizableHeight;
        
        temp[0].x = -appx;
        temp[0].y = -appy;
        temp[1].x = leftWidth * xScale - appx;
        temp[1].y = bottomHeight * yScale - appy;
        temp[2].x = temp[1].x + sizableWidth;
        temp[2].y = temp[1].y + sizableHeight;
        temp[3].x = width - appx;
        temp[3].y = height - appy;

        let uvSliced = sprite.spriteFrame.uvSliced;
        for (let row = 0; row < 4; ++row) {
            let rowD = temp[row];
            for (let col = 0; col < 4; ++col) {
                let uv = uvSliced[row * 4 + col];
                let colD = temp[col];
                let vert = verts[4 + row*4 + col];
                vert.x = colD.x;
                vert.y = rowD.y;
                vert.u = uv.u;
                vert.v = uv.v;
                vert.color = color;
            }
        }
    },
};