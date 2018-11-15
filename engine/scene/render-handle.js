cc.js.mixin(renderer.RenderHandle.prototype, {
    bind (component) {
        if (this._comp !== component && component instanceof cc.RenderComponent) {
            this._comp = component;
            if (component._assembler) {
                this.setUseModel(!!component._assembler.useModel);
            }
        }
    },

    _updateRenderData () {
        let comp = this._comp;
        if (comp) {
            comp._assembler.updateRenderData(comp);
            // node._renderFlag &= ~cc.RenderFlow.FLAG_UPDATE_RENDER_DATA;
            let datas = comp.__allocatedDatas;
            for (let i = 0; i < datas.length; i++) {
                let data = datas[i];
                let mesh = new renderer.Mesh(data.vertices, data.indices);
                let effect = data.material.effect;
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
    }
});