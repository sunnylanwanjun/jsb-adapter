
cc.Sprite._assembler.simple = {
    useModel: false,

    createData (sprite) {
        let renderData = sprite.requestRenderData();
        let indices = renderData.indices;
        renderData.dataLength = 4;
        renderData.vertexCount = 4;
        renderData.indiceCount = 6;

        indices.length = 6;
        indices[0] = 0;
        indices[1] = 1;
        indices[2] = 2;
        indices[3] = 1;
        indices[4] = 3;
        indices[5] = 2;

        return renderData;
    },
    
    updateRenderData (sprite) {
        let frame = sprite._spriteFrame;
        
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
            node = sprite.node,
            frame = sprite.spriteFrame,
            color = node._color._val,
            verts = renderData.vertices,
            cw = node.width, ch = node.height,
            appx = node.anchorX * cw, appy = node.anchorY * ch,
            l, b, r, t;
        if (sprite.trim) {
            l = -appx;
            b = -appy;
            r = cw - appx;
            t = ch - appy;
        }
        else {
            let ow = frame._originalSize.width, oh = frame._originalSize.height,
                rw = frame._rect.width, rh = frame._rect.height,
                offset = frame._offset,
                scaleX = cw / ow, scaleY = ch / oh;
            let trimLeft = offset.x + (ow - rw) / 2;
            let trimRight = offset.x - (ow - rw) / 2;
            let trimBottom = offset.y + (oh - rh) / 2;
            let trimTop = offset.y - (oh - rh) / 2;
            l = trimLeft * scaleX - appx;
            b = trimBottom * scaleY - appy;
            r = cw + trimRight * scaleX - appx;
            t = ch + trimTop * scaleY - appy;
        }

        // get uv from sprite frame directly
        let uv = frame.uv;
        
        verts[0].x = l;
        verts[0].y = b;
        verts[0].u = uv[0];
        verts[0].v = uv[1];
        verts[0].color = color;
        verts[1].x = r;
        verts[1].y = b;
        verts[1].u = uv[2];
        verts[1].v = uv[3];
        verts[1].color = color;
        verts[2].x = l;
        verts[2].y = t;
        verts[2].u = uv[4];
        verts[2].v = uv[5];
        verts[2].color = color;
        verts[3].x = r;
        verts[3].y = t;
        verts[3].u = uv[6];
        verts[3].v = uv[7];
        verts[3].color = color;
    }
};
