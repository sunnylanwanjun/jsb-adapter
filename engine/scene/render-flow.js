const DONOTHING = 0;
const RENDER = 0;
const CUSTOM_IA_RENDER = 0;
const POST_RENDER = 0;
const LOCAL_TRANSFORM = 1 << 0;
const WORLD_TRANSFORM = 1 << 0;
const TRANSFORM = LOCAL_TRANSFORM | WORLD_TRANSFORM;
const UPDATE_RENDER_DATA = 1 << 1;
const OPACITY = 1 << 2;
const COLOR = 1 << 3;
const CHILDREN = 1 << 4;
const POST_UPDATE_RENDER_DATA = 5;
const FINAL = 1 << 6;
const INV_LOCAL_TRANSFORM = ~LOCAL_TRANSFORM;
const INV_UPDATE_RENDER_DATA = ~UPDATE_RENDER_DATA;
const INV_OPACITY = ~OPACITY;
const INV_COLOR = ~COLOR;

let _nativeFlow = null;

let RenderFlow = cc.RenderFlow;
RenderFlow.EventType = {
    BEFORE_RENDER: 'before-render'
};
cc.js.mixin(RenderFlow, cc.EventTarget.prototype);

RenderFlow.render = function (scene) {
    this.emit(this.EventType.BEFORE_RENDER);
    _nativeFlow.render(scene._proxy);
};

RenderFlow.init = function (nativeFlow) {
    cc.EventTarget.call(this);
    _nativeFlow = nativeFlow;
};

RenderFlow.FLAG_DONOTHING = DONOTHING;
RenderFlow.FLAG_LOCAL_TRANSFORM = LOCAL_TRANSFORM;
RenderFlow.FLAG_WORLD_TRANSFORM = WORLD_TRANSFORM;
RenderFlow.FLAG_TRANSFORM = TRANSFORM;
RenderFlow.FLAG_COLOR = COLOR;
RenderFlow.FLAG_OPACITY = OPACITY;
RenderFlow.FLAG_UPDATE_RENDER_DATA = UPDATE_RENDER_DATA;
RenderFlow.FLAG_RENDER = RENDER;
RenderFlow.FLAG_CUSTOM_IA_RENDER = CUSTOM_IA_RENDER;
RenderFlow.FLAG_CHILDREN = CHILDREN;
RenderFlow.FLAG_POST_UPDATE_RENDER_DATA = POST_UPDATE_RENDER_DATA;
RenderFlow.FLAG_POST_RENDER = POST_RENDER;
RenderFlow.FLAG_FINAL = FINAL;
