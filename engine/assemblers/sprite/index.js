cc.Sprite._assembler = {
    getAssembler (sprite) {
        let util = this.simple;
        
        switch (sprite.type) {
            case cc.Sprite.Type.SLICED:
                util = this.sliced;
                break;
            case cc.Sprite.Type.TILED:
                util = this.tiled;
                break;
            case cc.Sprite.Type.FILLED:
                if (sprite._fillType === cc.Sprite.FillType.RADIAL) {
                    util = this.radialFilled;
                }
                else {
                    util = this.barFilled;
                }
                break;
            case cc.Sprite.Type.MESH:
                util = this.mesh;
                break;
        }

        return util;
    },

    // Skip invalid sprites (without own _assembler)
    updateRenderData (sprite) {
        return sprite.__allocedDatas;
    }
};
