/******************************************************************************
 * Spine Runtimes License Agreement
 * Last updated July 28, 2023. Replaces all prior versions.
 *
 * Copyright (c) 2013-2023, Esoteric Software LLC
 *
 * Integration of the Spine Runtimes into software or otherwise creating
 * derivative works of the Spine Runtimes is permitted under the terms and
 * conditions of Section 2 of the Spine Editor License Agreement:
 * http://esotericsoftware.com/spine-editor-license
 *
 * Otherwise, it is permitted to integrate the Spine Runtimes into software or
 * otherwise create derivative works of the Spine Runtimes (collectively,
 * "Products"), provided that each user of the Products must obtain their own
 * Spine Editor license and redistribution of the Products in any form must
 * include this license and copyright notice.
 *
 * THE SPINE RUNTIMES ARE PROVIDED BY ESOTERIC SOFTWARE LLC "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL ESOTERIC SOFTWARE LLC BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES,
 * BUSINESS INTERRUPTION, OR LOSS OF USE, DATA, OR PROFITS) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THE
 * SPINE RUNTIMES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *****************************************************************************/
import { Texture, TextureFilter } from "@esotericsoftware/spine-core";
import { ManagedWebGLRenderingContext } from "./WebGL.js";
export class GLTexture extends Texture {
    context;
    texture = null;
    boundUnit = 0;
    useMipMaps = false;
    static DISABLE_UNPACK_PREMULTIPLIED_ALPHA_WEBGL = false;
    constructor(context, image, useMipMaps = false) {
        super(image);
        this.context = context instanceof ManagedWebGLRenderingContext ? context : new ManagedWebGLRenderingContext(context);
        this.useMipMaps = useMipMaps;
        this.restore();
        this.context.addRestorable(this);
    }
    setFilters(minFilter, magFilter) {
        let gl = this.context.gl;
        this.bind();
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, GLTexture.validateMagFilter(magFilter));
        this.useMipMaps = GLTexture.usesMipMaps(minFilter);
        if (this.useMipMaps)
            gl.generateMipmap(gl.TEXTURE_2D);
    }
    static validateMagFilter(magFilter) {
        switch (magFilter) {
            case TextureFilter.MipMapLinearLinear:
            case TextureFilter.MipMapLinearNearest:
            case TextureFilter.MipMapNearestLinear:
            case TextureFilter.MipMapNearestNearest:
                return TextureFilter.Linear;
            default:
                return magFilter;
        }
    }
    static usesMipMaps(filter) {
        switch (filter) {
            case TextureFilter.MipMapLinearLinear:
            case TextureFilter.MipMapLinearNearest:
            case TextureFilter.MipMapNearestLinear:
            case TextureFilter.MipMapNearestNearest:
                return true;
            default:
                return false;
        }
    }
    setWraps(uWrap, vWrap) {
        let gl = this.context.gl;
        this.bind();
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, uWrap);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, vWrap);
    }
    update(useMipMaps) {
        let gl = this.context.gl;
        if (!this.texture)
            this.texture = this.context.gl.createTexture();
        this.bind();
        if (GLTexture.DISABLE_UNPACK_PREMULTIPLIED_ALPHA_WEBGL)
            gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this._image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, useMipMaps ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        if (useMipMaps)
            gl.generateMipmap(gl.TEXTURE_2D);
    }
    restore() {
        this.texture = null;
        this.update(this.useMipMaps);
    }
    bind(unit = 0) {
        let gl = this.context.gl;
        this.boundUnit = unit;
        gl.activeTexture(gl.TEXTURE0 + unit);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
    }
    unbind() {
        let gl = this.context.gl;
        gl.activeTexture(gl.TEXTURE0 + this.boundUnit);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
    dispose() {
        this.context.removeRestorable(this);
        let gl = this.context.gl;
        gl.deleteTexture(this.texture);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR0xUZXh0dXJlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0dMVGV4dHVyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OytFQTJCK0U7QUFFL0UsT0FBTyxFQUFFLE9BQU8sRUFBMEIsYUFBYSxFQUFlLE1BQU0sOEJBQThCLENBQUM7QUFDM0csT0FBTyxFQUFFLDRCQUE0QixFQUFFLE1BQU0sWUFBWSxDQUFDO0FBRTFELE1BQU0sT0FBTyxTQUFVLFNBQVEsT0FBTztJQUNyQyxPQUFPLENBQStCO0lBQzlCLE9BQU8sR0FBd0IsSUFBSSxDQUFDO0lBQ3BDLFNBQVMsR0FBRyxDQUFDLENBQUM7SUFDZCxVQUFVLEdBQUcsS0FBSyxDQUFDO0lBRXBCLE1BQU0sQ0FBQyx3Q0FBd0MsR0FBRyxLQUFLLENBQUM7SUFFL0QsWUFBYSxPQUE2RCxFQUFFLEtBQXFDLEVBQUUsYUFBc0IsS0FBSztRQUM3SSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDYixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sWUFBWSw0QkFBNEIsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLDRCQUE0QixDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3JILElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO1FBQzdCLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNmLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFFRCxVQUFVLENBQUUsU0FBd0IsRUFBRSxTQUF3QjtRQUM3RCxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztRQUN6QixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDWixFQUFFLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLGtCQUFrQixFQUFF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QUMsYUFBYSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNoQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogU3BpbmUgUnVudGltZXMgTGljZW5zZSBBZ3JlZW1lbnRcbiAqIExhc3QgdXBkYXRlZCBKdWx5IDI4LCAyMDIzLiBSZXBsYWNlcyBhbGwgcHJpb3IgdmVyc2lvbnMuXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDEzLTIwMjMsIEVzb3RlcmljIFNvZnR3YXJlIExMQ1xuICpcbiAqIEludGVncmF0aW9uIG9mIHRoZSBTcGluZSBSdW50aW1lcyBpbnRvIHNvZnR3YXJlIG9yIG90aGVyd2lzZSBjcmVhdGluZ1xuICogZGVyaXZhdGl2ZSB3b3JrcyBvZiB0aGUgU3BpbmUgUnVudGltZXMgaXMgcGVybWl0dGVkIHVuZGVyIHRoZSB0ZXJtcyBhbmRcbiAqIGNvbmRpdGlvbnMgb2YgU2VjdGlvbiAyIG9mIHRoZSBTcGluZSBFZGl0b3IgTGljZW5zZSBBZ3JlZW1lbnQ6XG4gKiBodHRwOi8vZXNvdGVyaWNzb2Z0d2FyZS5jb20vc3BpbmUtZWRpdG9yLWxpY2Vuc2VcbiAqXG4gKiBPdGhlcndpc2UsIGl0IGlzIHBlcm1pdHRlZCB0byBpbnRlZ3JhdGUgdGhlIFNwaW5lIFJ1bnRpbWVzIGludG8gc29mdHdhcmUgb3JcbiAqIG90aGVyd2lzZSBjcmVhdGUgZGVyaXZhdGl2ZSB3b3JrcyBvZiB0aGUgU3BpbmUgUnVudGltZXMgKGNvbGxlY3RpdmVseSxcbiAqIFwiUHJvZHVjdHNcIiksIHByb3ZpZGVkIHRoYXQgZWFjaCB1c2VyIG9mIHRoZSBQcm9kdWN0cyBtdXN0IG9idGFpbiB0aGVpciBvd25cbiAqIFNwaW5lIEVkaXRvciBsaWNlbnNlIGFuZCByZWRpc3RyaWJ1dGlvbiBvZiB0aGUgUHJvZHVjdHMgaW4gYW55IGZvcm0gbXVzdFxuICogaW5jbHVkZSB0aGlzIGxpY2Vuc2UgYW5kIGNvcHlyaWdodCBub3RpY2UuXG4gKlxuICogVEhFIFNQSU5FIFJVTlRJTUVTIEFSRSBQUk9WSURFRCBCWSBFU09URVJJQyBTT0ZUV0FSRSBMTEMgXCJBUyBJU1wiIEFORCBBTllcbiAqIEVYUFJFU1MgT1IgSU1QTElFRCBXQVJSQU5USUVTLCBJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTywgVEhFIElNUExJRURcbiAqIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZIEFORCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBUkVcbiAqIERJU0NMQUlNRUQuIElOIE5PIEVWRU5UIFNIQUxMIEVTT1RFUklDIFNPRlRXQVJFIExMQyBCRSBMSUFCTEUgRk9SIEFOWVxuICogRElSRUNULCBJTkRJUkVDVCwgSU5DSURFTlRBTCwgU1BFQ0lBTCwgRVhFTVBMQVJZLCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVNcbiAqIChJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTywgUFJPQ1VSRU1FTlQgT0YgU1VCU1RJVFVURSBHT09EUyBPUiBTRVJWSUNFUyxcbiAqIEJVU0lORVNTIElOVEVSUlVQVElPTiwgT1IgTE9TUyBPRiBVU0UsIERBVEEsIE9SIFBST0ZJVFMpIEhPV0VWRVIgQ0FVU0VEIEFORFxuICogT04gQU5ZIFRIRU9SWSBPRiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQ09OVFJBQ1QsIFNUUklDVCBMSUFCSUxJVFksIE9SIFRPUlRcbiAqIChJTkNMVURJTkcgTkVHTElHRU5DRSBPUiBPVEhFUldJU0UpIEFSSVNJTkcgSU4gQU5ZIFdBWSBPVVQgT0YgVEhFIFVTRSBPRiBUSEVcbiAqIFNQSU5FIFJVTlRJTUVTLCBFVkVOIElGIEFEVklTRUQgT0YgVEhFIFBPU1NJQklMSVRZIE9GIFNVQ0ggREFNQUdFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5pbXBvcnQgeyBUZXh0dXJlLCBEaXNwb3NhYmxlLCBSZXN0b3JhYmxlLCBUZXh0dXJlRmlsdGVyLCBUZXh0dXJlV3JhcCB9IGZyb20gXCJAZXNvdGVyaWNzb2Z0d2FyZS9zcGluZS1jb3JlXCI7XG5pbXBvcnQgeyBNYW5hZ2VkV2ViR0xSZW5kZXJpbmdDb250ZXh0IH0gZnJvbSBcIi4vV2ViR0wuanNcIjtcblxuZXhwb3J0IGNsYXNzIEdMVGV4dHVyZSBleHRlbmRzIFRleHR1cmUgaW1wbGVtZW50cyBEaXNwb3NhYmxlLCBSZXN0b3JhYmxlIHtcblx0Y29udGV4dDogTWFuYWdlZFdlYkdMUmVuZGVyaW5nQ29udGV4dDtcblx0cHJpdmF0ZSB0ZXh0dXJlOiBXZWJHTFRleHR1cmUgfCBudWxsID0gbnVsbDtcblx0cHJpdmF0ZSBib3VuZFVuaXQgPSAwO1xuXHRwcml2YXRlIHVzZU1pcE1hcHMgPSBmYWxzZTtcblxuXHRwdWJsaWMgc3RhdGljIERJU0FCTEVfVU5QQUNLX1BSRU1VTFRJUExJRURfQUxQSEFfV0VCR0wgPSBmYWxzZTtcblxuXHRjb25zdHJ1Y3RvciAoY29udGV4dDogTWFuYWdlZFdlYkdMUmVuZGVyaW5nQ29udGV4dCB8IFdlYkdMUmVuZGVyaW5nQ29udGV4dCwgaW1hZ2U6IEhUTUxJbWFnZUVsZW1lbnQgfCBJbWFnZUJpdG1hcCwgdXNlTWlwTWFwczogYm9vbGVhbiA9IGZhbHNlKSB7XG5cdFx0c3VwZXIoaW1hZ2UpO1xuXHRcdHRoaXMuY29udGV4dCA9IGNvbnRleHQgaW5zdGFuY2VvZiBNYW5hZ2VkV2ViR0xSZW5kZXJpbmdDb250ZXh0ID8gY29udGV4dCA6IG5ldyBNYW5hZ2VkV2ViR0xSZW5kZXJpbmdDb250ZXh0KGNvbnRleHQpO1xuXHRcdHRoaXMudXNlTWlwTWFwcyA9IHVzZU1pcE1hcHM7XG5cdFx0dGhpcy5yZXN0b3JlKCk7XG5cdFx0dGhpcy5jb250ZXh0LmFkZFJlc3RvcmFibGUodGhpcyk7XG5cdH1cblxuXHRzZXRGaWx0ZXJzIChtaW5GaWx0ZXI6IFRleHR1cmVGaWx0ZXIsIG1hZ0ZpbHRlcjogVGV4dHVyZUZpbHRlcikge1xuXHRcdGxldCBnbCA9IHRoaXMuY29udGV4dC5nbDtcblx0XHR0aGlzLmJpbmQoKTtcblx0XHRnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUlOX0ZJTFRFUiwgbWluRmlsdGVyKTtcblx0XHRnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUFHX0ZJTFRFUiwgR0xUZXh0dXJlLnZhbGlkYXRlTWFnRmlsdGVyKG1hZ0ZpbHRlcikpO1xuXHRcdHRoaXMudXNlTWlwTWFwcyA9IEdMVGV4dHVyZS51c2VzTWlwTWFwcyhtaW5GaWx0ZXIpO1xuXHRcdGlmICh0aGlzLnVzZU1pcE1hcHMpIGdsLmdlbmVyYXRlTWlwbWFwKGdsLlRFWFRVUkVfMkQpO1xuXHR9XG5cblx0c3RhdGljIHZhbGlkYXRlTWFnRmlsdGVyIChtYWdGaWx0ZXI6IFRleHR1cmVGaWx0ZXIpIHtcblx0XHRzd2l0Y2ggKG1hZ0ZpbHRlcikge1xuXHRcdFx0Y2FzZSBUZXh0dXJlRmlsdGVyLk1pcE1hcExpbmVhckxpbmVhcjpcblx0XHRcdGNhc2UgVGV4dHVyZUZpbHRlci5NaXBNYXBMaW5lYXJOZWFyZXN0OlxuXHRcdFx0Y2FzZSBUZXh0dXJlRmlsdGVyLk1pcE1hcE5lYXJlc3RMaW5lYXI6XG5cdFx0XHRjYXNlIFRleHR1cmVGaWx0ZXIuTWlwTWFwTmVhcmVzdE5lYXJlc3Q6XG5cdFx0XHRcdHJldHVybiBUZXh0dXJlRmlsdGVyLkxpbmVhcjtcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdHJldHVybiBtYWdGaWx0ZXI7XG5cdFx0fVxuXHR9XG5cblx0c3RhdGljIHVzZXNNaXBNYXBzIChmaWx0ZXI6IFRleHR1cmVGaWx0ZXIpIHtcblx0XHRzd2l0Y2ggKGZpbHRlcikge1xuXHRcdFx0Y2FzZSBUZXh0dXJlRmlsdGVyLk1pcE1hcExpbmVhckxpbmVhcjpcblx0XHRcdGNhc2UgVGV4dHVyZUZpbHRlci5NaXBNYXBMaW5lYXJOZWFyZXN0OlxuXHRcdFx0Y2FzZSBUZXh0dXJlRmlsdGVyLk1pcE1hcE5lYXJlc3RMaW5lYXI6XG5cdFx0XHRjYXNlIFRleHR1cmVGaWx0ZXIuTWlwTWFwTmVhcmVzdE5lYXJlc3Q6XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0fVxuXG5cdHNldFdyYXBzICh1V3JhcDogVGV4dHVyZVdyYXAsIHZXcmFwOiBUZXh0dXJlV3JhcCkge1xuXHRcdGxldCBnbCA9IHRoaXMuY29udGV4dC5nbDtcblx0XHR0aGlzLmJpbmQoKTtcblx0XHRnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9TLCB1V3JhcCk7XG5cdFx0Z2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfVCwgdldyYXApO1xuXHR9XG5cblx0dXBkYXRlICh1c2VNaXBNYXBzOiBib29sZWFuKSB7XG5cdFx0bGV0IGdsID0gdGhpcy5jb250ZXh0LmdsO1xuXHRcdGlmICghdGhpcy50ZXh0dXJlKSB0aGlzLnRleHR1cmUgPSB0aGlzLmNvbnRleHQuZ2wuY3JlYXRlVGV4dHVyZSgpO1xuXHRcdHRoaXMuYmluZCgpO1xuXHRcdGlmIChHTFRleHR1cmUuRElTQUJMRV9VTlBBQ0tfUFJFTVVMVElQTElFRF9BTFBIQV9XRUJHTCkgZ2wucGl4ZWxTdG9yZWkoZ2wuVU5QQUNLX1BSRU1VTFRJUExZX0FMUEhBX1dFQkdMLCBmYWxzZSk7XG5cdFx0Z2wudGV4SW1hZ2UyRChnbC5URVhUVVJFXzJELCAwLCBnbC5SR0JBLCBnbC5SR0JBLCBnbC5VTlNJR05FRF9CWVRFLCB0aGlzLl9pbWFnZSk7XG5cdFx0Z2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX01BR19GSUxURVIsIGdsLkxJTkVBUik7XG5cdFx0Z2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX01JTl9GSUxURVIsIHVzZU1pcE1hcHMgPyBnbC5MSU5FQVJfTUlQTUFQX0xJTkVBUiA6IGdsLkxJTkVBUik7XG5cdFx0Z2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfUywgZ2wuQ0xBTVBfVE9fRURHRSk7XG5cdFx0Z2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfVCwgZ2wuQ0xBTVBfVE9fRURHRSk7XG5cdFx0aWYgKHVzZU1pcE1hcHMpIGdsLmdlbmVyYXRlTWlwbWFwKGdsLlRFWFRVUkVfMkQpO1xuXHR9XG5cblx0cmVzdG9yZSAoKSB7XG5cdFx0dGhpcy50ZXh0dXJlID0gbnVsbDtcblx0XHR0aGlzLnVwZGF0ZSh0aGlzLnVzZU1pcE1hcHMpO1xuXHR9XG5cblx0YmluZCAodW5pdDogbnVtYmVyID0gMCkge1xuXHRcdGxldCBnbCA9IHRoaXMuY29udGV4dC5nbDtcblx0XHR0aGlzLmJvdW5kVW5pdCA9IHVuaXQ7XG5cdFx0Z2wuYWN0aXZlVGV4dHVyZShnbC5URVhUVVJFMCArIHVuaXQpO1xuXHRcdGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIHRoaXMudGV4dHVyZSk7XG5cdH1cblxuXHR1bmJpbmQgKCkge1xuXHRcdGxldCBnbCA9IHRoaXMuY29udGV4dC5nbDtcblx0XHRnbC5hY3RpdmVUZXh0dXJlKGdsLlRFWFRVUkUwICsgdGhpcy5ib3VuZFVuaXQpO1xuXHRcdGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIG51bGwpO1xuXHR9XG5cblx0ZGlzcG9zZSAoKSB7XG5cdFx0dGhpcy5jb250ZXh0LnJlbW92ZVJlc3RvcmFibGUodGhpcyk7XG5cdFx0bGV0IGdsID0gdGhpcy5jb250ZXh0LmdsO1xuXHRcdGdsLmRlbGV0ZVRleHR1cmUodGhpcy50ZXh0dXJlKTtcblx0fVxufVxuIl19