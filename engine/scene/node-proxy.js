cc.js.mixin(renderer.NodeProxy.prototype, {
    _ctor () {
        this._owner = null;
        this.generateTypedArray();
        this._uint8Data = new Uint8Array(this._trs.buffer);
    },

    bind (owner) {
        if (this._owner) {
            this.unbind();
        }
        this._owner = owner;
        
        if (owner)
        {
            owner._proxy = this;
            this.updateZOrder();
            this.updateGroupIndex();
            this.updateLocalTRS();
            if (owner._parent && owner._parent._proxy) {
                this.updateParent(owner._parent._proxy);
            }

            owner.on(cc.Node.EventType.SIBLING_ORDER_CHANGED, this.updateZOrder, this);
            owner.on(cc.Node.EventType.GROUP_CHANGED, this.updateGroupIndex, this);
        }
    },

    unbind () {
        this._owner.off(cc.Node.EventType.SIBLING_ORDER_CHANGED, this.updateZOrder, this);
        this._owner.off(cc.Node.EventType.GROUP_CHANGED, this.updateGroupIndex, this);
        this._owner._proxy = null;
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

    updateLocalTRS () {
        let trs = this._trs;
        let pos = this._owner._position;
        let rotation = this._owner._quat;
        let scale = this._owner._scale;

        this._uint8Data[0] = 1;
        trs[1] = pos.x;
        trs[2] = pos.y;
        trs[3] = pos.z;
        trs[4] = rotation.x;
        trs[5] = rotation.y;
        trs[6] = rotation.z;
        trs[7] = scale.x;
        trs[8] = scale.y;
        trs[9] = scale.z;
    }
});