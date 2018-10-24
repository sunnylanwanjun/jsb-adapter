cc.js.mixin(renderer.RenderHandle.prototype, {
    bind (component) {
        if (this._comp !== component && component instanceof cc.RenderComponent) {
            this._comp = component;
        }
    },

    _updateRenderData () {

    }
});