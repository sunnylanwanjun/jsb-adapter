cc.js.mixin(renderer.NodeProxy.prototype, {
    bind (owner) {
        if (this._owner) {
            this.unbind();
        }
        this._owner = owner;
        owner._proxy = this;
        if (owner._parent && owner._parent._proxy) {
            this.updateParent(owner._parent._proxy);
        }

        this._owner.on(cc.Node.EventType.SIBLING_ORDER_CHANGED, this.updateZOrder, this);
        this._owner.on(cc.Node.EventType.GROUP_CHANGED, this.updateGroupIndex, this);
    },

    unbind () {
        this._owner.off(cc.Node.EventType.SIBLING_ORDER_CHANGED, this.updateZOrder, this);
        this._owner.off(cc.Node.EventType.GROUP_CHANGED, this.updateGroupIndex, this);
        this._owner = null;
        this.reset();
    },

    updateParent (parentProxy) {
        // detach from old parent
        let oldParent = this.getParent();
        if (oldParent) {
            oldParent.removeChild(this);
        }
        // attach to new parent
        parentProxy.addChild(this);
    },

    updateZOrder () {
        this.setLocalZOrder(this._owner._localZOrder);
    },

    updateGroupIndex () {
        this.setGroupID(this._owner.groupIndex);
    },

    updateLocalMatrix () {
        this.setLocalMatrix(this._owner._matrix);
    }
});