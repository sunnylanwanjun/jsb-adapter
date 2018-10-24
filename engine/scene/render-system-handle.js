var RenderSystemHandle = function (node) {
    this._node = node;
    this._node.addHandle('render', this);
    this._meshes = [];
    this._materials = [];
};

RenderSystemHandle.prototype = {
    constructor: RenderSystemHandle,

};

module.exports = RenderSystemHandle;