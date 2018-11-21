cc.js.mixin(renderer.RenderHandle.prototype, {
    bind (component) {
        if (this._comp !== component && component instanceof cc.RenderComponent) {
            this._comp = component;
            if (component._assembler) {
                this.setUseModel(!!component._assembler.useModel);
            }
            if (component._vertexFormat) {
                this.setVertexFormat(component._vertexFormat._nativeObj);
            }
            if (!this._meshes) {
                this._meshes = [];
            }
            else {
                this._meshes.length = 0;
            }
        }
    },

    _updateRenderData () {
        let comp = this._comp;
        if (comp) {
            comp._assembler.updateRenderData(comp);
            // node._renderFlag &= ~cc.RenderFlow.FLAG_UPDATE_RENDER_DATA;
            let datas = comp.__allocedDatas;
            for (let i = 0; i < datas.length; i++) {
                let data = datas[i];
                if (!data.material) {
                    continue;
                }
                let mesh = this._meshes[i];
                if (!mesh) {
                    mesh = new renderer.Mesh(data.vertices, data.indices);
                    this._meshes[i] = mesh;
                }
                else {
                    mesh.updateVertices(data.vertices);
                    mesh.updateIndices(data.indices);
                }
                let effect = data.material.effect._nativeObj;
                this.addMesh(mesh, effect);
            }
        }
    },

    _updateColor () {
        let comp = this._comp;
        if (comp) {
            comp._updateColor();
            // node._renderFlag &= ~cc.RenderFlow.FLAG_COLOR;
        }
    },

    updateEnabled (enabled) {
        if (enabled) {
            this.enable();
            let node = this._comp.node;
            if (node) {
                node._proxy.addHandle("render", this);
            }
        }
        else {
            this.disable();
            let node = this._comp.node;
            if (node) {
                node._proxy.removeHandle("render");
            }
        }
    }
});