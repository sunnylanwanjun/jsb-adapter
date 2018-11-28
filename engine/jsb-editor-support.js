/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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
(function(){
    if (window.jsbEditor === undefined) return;

    var renderEngine = cc.renderer.renderEngine;
    var gfx = renderEngine.gfx;

    var editorMgr = jsbEditor.EditorManager.getInstance();
    var vbid = editorMgr.getGLVBID();
    var ibid = editorMgr.getGLIBID();

    var EditorIA = cc.Class({
        ctor () {
            this._vertexBuffer = {
                _format : gfx.VertexFormat.XY_UV_Color,
                _usage : gfx.USAGE_DYNAMIC,
                _glID : {
                    _id : vbid,
                }
            };
            this._indexBuffer = {
                _format : gfx.INDEX_FMT_UINT16,
                _usage : gfx.USAGE_STATIC,
                _glID : {
                    _id : ibid,
                },
                _bytesPerIndex : 2,
            };
            this._primitiveType = gfx.PT_TRIANGLES;
            this._start = 0;
            this._count = -1;
        },

        getPrimitiveCount () {
            return this._count;
        }
    });

    jsbEditor.EditorIA = EditorIA;
})();