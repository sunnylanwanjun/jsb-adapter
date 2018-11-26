/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

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