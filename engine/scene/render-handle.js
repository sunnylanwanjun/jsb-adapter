cc.js.mixin(renderer.RenderHandle.prototype, {
    _ctor () {
        this.vDatas = [];
        this.uintVDatas = [];
        this.iDatas = [];
        this.effects = [];
        this.meshCount = 0;
        this._material = null;
    },

    bind (component) {
        if (this._comp !== component && component instanceof cc.RenderComponent) {
            this._comp = component;
            if (component._assembler) {
                this.setUseModel(!!component._assembler.useModel);
            }
            if (component._vertexFormat) {
                this.setVertexFormat(component._vertexFormat._nativeObj);
            }
        }
    },

    reserveMeshCount (count) {
        if (this.meshCount < count) {
            this.vDatas.length = count;
            this.uintVDatas.length = count;
            this.iDatas.length = count;
            this.effects.length = count;
            this.setMeshCount(count);
        }
    },
    
    updateMesh (index, vertices, indices) {
        this.reserveMeshCount(index+1);

        this.vDatas[index] = vertices;
        this.uintVDatas[index] = new Uint32Array(vertices.buffer);
        this.iDatas[index] = indices;
        this.meshCount = this.vDatas.length;

        this.updateNativeMesh(index, vertices, indices);
    },

    updateMaterial (index, material) {
        this.reserveMeshCount(index + 1);
        let oldEffect = this.effects[index];
        let newEffect;

        if (material) {
            newEffect = this.effects[index] = material.effect;
        } else {
            newEffect = this.effects[index] = null;
        }
        if (newEffect !== oldEffect) {
            this.updateNativeEffect(index, newEffect ? newEffect._nativeObj : null);
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