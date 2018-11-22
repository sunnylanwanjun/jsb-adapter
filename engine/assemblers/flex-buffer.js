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