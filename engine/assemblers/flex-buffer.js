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

cc.FlexBuffer = function (bytes) {
    this._reallocBuffer(bytes || 64, false);
}

cc.js.mixin(cc.FlexBuffer.prototype, {
    _reallocBuffer (bytes, copyOldData) {
        let oldData;
        if (this.buffer) {
            oldData = new Uint8Array(this.buffer);
        }

        this.buffer = new ArrayBuffer(bytes);
        let newData = new Uint8Array(this.buffer);

        // Only copy data if old buffer is smaller
        if (oldData && copyOldData && newData.length >= oldData.length) {
            newData.set(oldData);
        }
    },
    
    // return true if array buffer changed
    reserve (bytes) {
        let byteLength = this.buffer.byteLength;
        if (bytes > byteLength) {
            while (byteLength < bytes) {
                byteLength *= 2;
            }
            this._reallocBuffer(byteLength);
            return true;
        }
        return false;
    },
});