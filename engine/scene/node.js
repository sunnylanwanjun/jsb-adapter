/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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

let _typedArray_temp = new Float32Array(16);
let _mat4_temp = math.mat4.create();

function _mat4ToArray(typedArray, mat4) {
    typedArray[0] = mat4.m00;
    typedArray[1] = mat4.m01;
    typedArray[2] = mat4.m02;
    typedArray[3] = mat4.m03;
    typedArray[4] = mat4.m04;
    typedArray[5] = mat4.m05;
    typedArray[6] = mat4.m06;
    typedArray[7] = mat4.m07;
    typedArray[8] = mat4.m08;
    typedArray[9] = mat4.m09;
    typedArray[10] = mat4.m10;
    typedArray[11] = mat4.m11;
    typedArray[12] = mat4.m12;
    typedArray[13] = mat4.m13;
    typedArray[14] = mat4.m14;
    typedArray[15] = mat4.m15;
}

cc.Node.prototype.getWorldRTInAB = function () {
    this.getWorldRT(_mat4_temp);
    _mat4ToArray(_typedArray_temp, _mat4_temp);
    return _typedArray_temp;
};

cc.Node.prototype.getWorldMatrixInAB = function () {
    this._updateWorldMatrix();
    _mat4ToArray(_typedArray_temp, this._worldMatrix);
    return _typedArray_temp;
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

    if (flag & LOCAL_TRANSFORM) {
        this._proxy && this._proxy.updateLocalTRS();
    }
    if (assembler && (flag & UPDATE_RENDER_DATA)) {
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