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

let _parentOpacity = 1;
let _parentOpacityDirty = 0;
let _nativeFlow = null;

let RenderFlow = cc.RenderFlow;

function updateTransform (node) {
    if (node._renderFlag & LOCAL_TRANSFORM) {
        node._proxy.updateLocalTRS();
        node._renderFlag &= INV_LOCAL_TRANSFORM;
    }
}

function updateRenderData (node, comp) {
    if (node._renderFlag & UPDATE_RENDER_DATA) {
        comp._assembler.updateRenderData(comp);
        node._renderFlag &= INV_UPDATE_RENDER_DATA;
    }
}

function updateColor (node, comp) {
    if (node._renderFlag & COLOR) {
        if (comp) {
            comp._updateColor();
        }
        else {
            node._renderFlag &= INV_COLOR;
        }
    }
}

function visitNode (node) {
    let flag = node._renderFlag;
    let comp = node._renderComponent;
    let children = node._children, child;
    let parentOpacityDirty = _parentOpacityDirty;
    let opacity = node._opacity * _parentOpacity;
    let color = node._color._val;
    node._color._val = ((color & 0x00ffffff) | ((opacity << 24) >>> 0)) >>> 0;

    updateTransform(node);
    updateRenderData(node, comp);
    updateColor(node, comp);
    if (flag & OPACITY) {
        _parentOpacityDirty++;
        node._renderFlag &= INV_OPACITY;
    }

    _parentOpacity *= (node._opacity / 255);
    let worldOpacityFlag = _parentOpacityDirty ? COLOR : 0;
    for (let i = 0, l = children.length; i < l; ++i) {
        child = children[i];
        child._renderFlag |= worldOpacityFlag;
        if (!child._activeInHierarchy || child._opacity === 0) continue;
        visitNode(child);
    }
    node._color._val = color;
    _parentOpacityDirty = parentOpacityDirty;
}

RenderFlow.visit = function (scene) {
    _parentOpacity = 1;
    _parentOpacityDirty = 0;
    
    visitNode(scene);
    
    _nativeFlow.visit(scene._proxy);
};

RenderFlow.init = function (nativeFlow) {
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
