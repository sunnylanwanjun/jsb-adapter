cc.js.mixin(renderer.NodeProxy.prototype, {
    _ctor () {
        this._owner = null;
        this.generateJSMatrix();
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
            this.updateLocalMatrix();
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

    updateLocalMatrix () {
        let ab = this._matrix;
        if (ab && this._owner) {
            let m = this._owner._matrix;
            ab[0]  = m.m00;
            ab[1]  = m.m01;
            ab[2]  = m.m02;
            ab[3]  = m.m03;
            ab[4]  = m.m04;
            ab[5]  = m.m05;
            ab[6]  = m.m06;
            ab[7]  = m.m07;
            ab[8]  = m.m08;
            ab[9]  = m.m09;
            ab[10] = m.m10;
            ab[11] = m.m11;
            ab[12] = m.m12;
            ab[13] = m.m13;
            ab[14] = m.m14;
            ab[15] = m.m15;
        }
        this.setMatrixDirty();
    }
});