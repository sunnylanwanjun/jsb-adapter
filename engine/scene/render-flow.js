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

let _cullingMask = 0;
let _parentOpacity = 1;
let _parentOpacityDirty = 0;
let _nativeFlow = null;

function RenderFlow () {
    this._func = init;
    this._next = null;
}
let _proto = RenderFlow.prototype;
_proto._doNothing = function () {
};

_proto._localTransform = function (node) {
    node._proxy.updateLocalTRS();
    node._renderFlag &= ~LOCAL_TRANSFORM;
    this._next._func(node);
};

_proto._color = function (node) {
    let comp = node._renderComponent;
    if (comp) {
        comp._updateColor();
    }
    else {
        node._renderFlag &= ~COLOR;
    }
    this._next._func(node);
};

_proto._opacity = function (node) {
    _parentOpacityDirty++;
    
    node._renderFlag &= ~OPACITY;
    this._next._func(node);
    
    _parentOpacityDirty--;
};

_proto._updateRenderData = function (node) {
    let comp = node._renderComponent;
    comp._assembler.updateRenderData(comp);
    node._renderFlag &= ~UPDATE_RENDER_DATA;
    this._next._func(node);
};

_proto._children = function (node) {
    let cullingMask = _cullingMask;
    
    _parentOpacity *= (node._opacity / 255);
    
    let worldOpacityFlag = _parentOpacityDirty ? COLOR : 0;
    
    let children = node._children;
    for (let i = 0, l = children.length; i < l; i++) {
        let c = children[i];
        c._renderFlag |= worldOpacityFlag;
        if (!c._activeInHierarchy || c._opacity === 0) continue;
        
        _cullingMask = c._cullingMask = c.groupIndex === 0 ? cullingMask : 1 << c.groupIndex;
        // TODO: Maybe has better way to implement cascade opacity
        c._color.a = c._opacity * _parentOpacity;
        flows[c._renderFlag]._func(c);
        c._color.a = 255;
    }
    
    this._next._func(node);
    
    _cullingMask = cullingMask;
};

_proto._postUpdateRenderData = function (node) {
    let comp = node._renderComponent;
    // comp._postAssembler && comp._postAssembler.updateRenderData(comp);
    node._renderFlag &= ~POST_UPDATE_RENDER_DATA;
    this._next._func(node);
};

const EMPTY_FLOW = new RenderFlow();
EMPTY_FLOW._func = EMPTY_FLOW._doNothing;
EMPTY_FLOW._next = EMPTY_FLOW;

let flows = {};

function createFlow (flag, next) {
    let flow = new RenderFlow();
    flow._next = next || EMPTY_FLOW;
    
    switch (flag) {
        case DONOTHING:
            flow._func = flow._doNothing;
            break;
        case LOCAL_TRANSFORM:
            flow._func = flow._localTransform;
            break;
        case COLOR:
            flow._func = flow._color;
            break;
        case OPACITY:
            flow._func = flow._opacity;
            break;
        case UPDATE_RENDER_DATA:
            flow._func = flow._updateRenderData;
            break;
        case CHILDREN:
            flow._func = flow._children;
            break;
        case POST_UPDATE_RENDER_DATA:
            flow._func = flow._postUpdateRenderData;
            break;
    }
    
    return flow;
}

function getFlow (flag) {
    let flow = null;
    let tFlag = FINAL;
    while (tFlag > 0) {
        if (tFlag & flag)
            flow = createFlow(tFlag, flow);
        tFlag = tFlag >> 1;
    }
    return flow;
}

//
function init (node) {
    let flag = node._renderFlag;
    let r = flows[flag] = getFlow(flag);
    r._func(node);
}

RenderFlow.flows = flows;
RenderFlow.createFlow = createFlow;
RenderFlow.visit = function (scene) {
    _cullingMask = 1 << scene.groupIndex;
    _parentOpacity = 1;
    _parentOpacityDirty = 0;
    
    flows[scene._renderFlag]._func(scene);
    
    _nativeFlow.visit(scene._proxy);
};

RenderFlow.init = function (nativeFlow) {
    _nativeFlow = nativeFlow;
    flows[0] = EMPTY_FLOW;
    for (let i = 1; i < FINAL; i++) {
        flows[i] = new RenderFlow();
    }
};

let _RenderFlow = cc.RenderFlow;
_RenderFlow.FLAG_DONOTHING = RenderFlow.FLAG_DONOTHING = DONOTHING;
_RenderFlow.FLAG_LOCAL_TRANSFORM = RenderFlow.FLAG_LOCAL_TRANSFORM = LOCAL_TRANSFORM;
_RenderFlow.FLAG_WORLD_TRANSFORM = RenderFlow.FLAG_WORLD_TRANSFORM = WORLD_TRANSFORM;
_RenderFlow.FLAG_TRANSFORM = RenderFlow.FLAG_TRANSFORM = TRANSFORM;
_RenderFlow.FLAG_COLOR = RenderFlow.FLAG_COLOR = COLOR;
_RenderFlow.FLAG_OPACITY = RenderFlow.FLAG_OPACITY = OPACITY;
_RenderFlow.FLAG_UPDATE_RENDER_DATA = RenderFlow.FLAG_UPDATE_RENDER_DATA = UPDATE_RENDER_DATA;
_RenderFlow.FLAG_RENDER = RenderFlow.FLAG_RENDER = RENDER;
_RenderFlow.FLAG_CUSTOM_IA_RENDER = RenderFlow.FLAG_CUSTOM_IA_RENDER = CUSTOM_IA_RENDER;
_RenderFlow.FLAG_CHILDREN = RenderFlow.FLAG_CHILDREN = CHILDREN;
_RenderFlow.FLAG_POST_UPDATE_RENDER_DATA = RenderFlow.FLAG_POST_UPDATE_RENDER_DATA = POST_UPDATE_RENDER_DATA;
_RenderFlow.FLAG_POST_RENDER = RenderFlow.FLAG_POST_RENDER = POST_RENDER;
_RenderFlow.FLAG_FINAL = RenderFlow.FLAG_FINAL = FINAL;

// Overwrite cc.RenderFlow;
cc.RenderFlow = RenderFlow;
