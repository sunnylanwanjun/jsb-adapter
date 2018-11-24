
cc.Sprite._assembler.simple = {
    useModel: false,

    createData (sprite) {
        let renderHandle = sprite._renderHandle;

        if (renderHandle.meshCount === 0) {
            let vertices = new Float32Array(20);
            let indices = new Uint16Array(6);
            indices[0] = 0;
            indices[1] = 1;
            indices[2] = 2;
            indices[3] = 1;
            indices[4] = 3;
            indices[5] = 2;
            renderHandle.updateMesh(0, vertices, indices);
        }

        // No render data needed for native
        return renderHandle;
    },
    
    updateRenderData (sprite) {
        let frame = sprite._spriteFrame;
        
        // TODO: Material API design and export from editor could affect the material activation process
        // need to update the logic here
        if (frame) {
            if (sprite._material._texture !== frame._texture) {
                sprite._activateMaterial();
            }
            sprite._renderHandle.updateMaterial(0, sprite._material);
        }

        if (frame && sprite._vertsDirty) {
            this.updateVerts(sprite);
            sprite._vertsDirty = false;
            sprite._renderHandle.setVertsDirty();
        }
    },

    updateVerts (sprite) {
        let renderHandle = sprite._renderHandle,
            node = sprite.node,
            frame = sprite.spriteFrame,
            color = node._color._val,
            verts = renderHandle.vDatas[0],
            uintVerts = renderHandle.uintVDatas[0],
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
        
        verts[0] = l;
        verts[1] = b;
        verts[2] = uv[0];
        verts[3] = uv[1];
        verts[5] = r;
        verts[6] = b;
        verts[7] = uv[2];
        verts[8] = uv[3];
        verts[10] = l;
        verts[11] = t;
        verts[12] = uv[4];
        verts[13] = uv[5];
        verts[15] = r;
        verts[16] = t;
        verts[17] = uv[6];
        verts[18] = uv[7];
        uintVerts[4] = color;
        uintVerts[9] = color;
        uintVerts[14] = color;
        uintVerts[19] = color;
    }
};