/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and  non-exclusive license
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
'use strict';

const math = cc.vmath;
let _mat4_temp = math.mat4.create();

cc.Node.prototype.getWorldRTInAB = function () {
    this.getWorldRT(_mat4_temp);
    _mat4ToArray(_typedArray_temp, _mat4_temp);
    return _mat4_temp.m;
};

cc.Node.prototype.getWorldMatrixInAB = function () {
    this._updateWorldMatrix();
    return this._worldMatrix.m;
};

let RenderFlow = cc.RenderFlow;
LOCAL_TRANSFORM = RenderFlow.FLAG_LOCAL_TRANSFORM;
COLOR = RenderFlow.FLAG_COLOR;
OPACITY = RenderFlow.FLAG_OPACITY;
UPDATE_RENDER_DATA = RenderFlow.FLAG_UPDATE_RENDER_DATA;

cc.js.getset(cc.Node.prototype, "_renderFlag", function () {
    return 0;
}, function (flag) {
    if (flag === 0) return;

    let comp = this._renderComponent;
    let assembler = comp && comp._assembler;

    if ((flag & UPDATE_RENDER_DATA) && assembler) {
        if (assembler.delayUpdateRenderData) {
            comp._renderHandle.delayUpdateRenderData();
        }
        else {
            assembler.updateRenderData(comp);
        }
    }
    if (flag & COLOR) {
        // this._proxy && this._proxy.updateColor();
        comp && comp._updateColor();
    }
});