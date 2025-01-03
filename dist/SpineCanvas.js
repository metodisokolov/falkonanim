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
import { TimeKeeper, AssetManager, ManagedWebGLRenderingContext, SceneRenderer, Input } from "./index.js";
/** Manages the life-cycle and WebGL context of a {@link SpineCanvasApp}. The app loads
 * assets and initializes itself, then updates and renders its state at the screen refresh rate. */
export class SpineCanvas {
    config;
    context;
    /** Tracks the current time, delta, and other time related statistics. */
    time = new TimeKeeper();
    /** The HTML canvas to render to. */
    htmlCanvas;
    /** The WebGL rendering context. */
    gl;
    /** The scene renderer for easy drawing of skeletons, shapes, and images. */
    renderer;
    /** The asset manager to load assets with. */
    assetManager;
    /** The input processor used to listen to mouse, touch, and keyboard events. */
    input;
    disposed = false;
    /** Constructs a new spine canvas, rendering to the provided HTML canvas. */
    constructor(canvas, config) {
        this.config = config;
        if (!config.pathPrefix)
            config.pathPrefix = "";
        if (!config.app)
            config.app = {
                loadAssets: () => { },
                initialize: () => { },
                update: () => { },
                render: () => { },
                error: () => { },
                dispose: () => { },
            };
        if (!config.webglConfig)
            config.webglConfig = { alpha: true };
        this.htmlCanvas = canvas;
        this.context = new ManagedWebGLRenderingContext(canvas, config.webglConfig);
        this.renderer = new SceneRenderer(canvas, this.context);
        this.gl = this.context.gl;
        this.assetManager = new AssetManager(this.context, config.pathPrefix);
        this.input = new Input(canvas);
        if (config.app.loadAssets)
            config.app.loadAssets(this);
        let loop = () => {
            if (this.disposed)
                return;
            requestAnimationFrame(loop);
            this.time.update();
            if (config.app.update)
                config.app.update(this, this.time.delta);
            if (config.app.render)
                config.app.render(this);
        };
        let waitForAssets = () => {
            if (this.disposed)
                return;
            if (this.assetManager.isLoadingComplete()) {
                if (this.assetManager.hasErrors()) {
                    if (config.app.error)
                        config.app.error(this, this.assetManager.getErrors());
                }
                else {
                    if (config.app.initialize)
                        config.app.initialize(this);
                    loop();
                }
                return;
            }
            requestAnimationFrame(waitForAssets);
        };
        requestAnimationFrame(waitForAssets);
    }
    /** Clears the canvas with the given color. The color values are given in the range [0,1]. */
    clear(r, g, b, a) {
        this.gl.clearColor(r, g, b, a);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    }
    /** Disposes the app, so the update() and render() functions are no longer called. Calls the dispose() callback.*/
    dispose() {
        if (this.config.app.dispose)
            this.config.app.dispose(this);
        this.disposed = true;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3BpbmVDYW52YXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvU3BpbmVDYW52YXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsrRUEyQitFO0FBRS9FLE9BQU8sRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLDRCQUE0QixFQUFFLGFBQWEsRUFBRSxLQUFLLEVBQWEsTUFBTSxZQUFZLENBQUM7QUErQnJIO21HQUNtRztBQUNuRyxNQUFNLE9BQU8sV0FBVztJQW1CeUI7SUFsQnZDLE9BQU8sQ0FBK0I7SUFFL0MseUVBQXlFO0lBQ2hFLElBQUksR0FBRyxJQUFJLFVBQVUsRUFBRSxDQUFDO0lBQ2pDLG9DQUFvQztJQUMzQixVQUFVLENBQW9CO0lBQ3ZDLG1DQUFtQztJQUMxQixFQUFFLENBQXdCO0lBQ25DLDRFQUE0RTtJQUNuRSxRQUFRLENBQWdCO0lBQ2pDLDZDQUE2QztJQUNwQyxZQUFZLENBQWU7SUFDcEMsK0VBQStFO0lBQ3RFLEtBQUssQ0FBUTtJQUVkLFFBQVEsR0FBRyxLQUFLLENBQUM7SUFFekIsNEVBQTRFO0lBQzVFLFlBQWEsTUFBeUIsRUFBVSxNQUF5QjtRQUF6QixXQUFNLEdBQU4sTUFBTSxDQUFtQjtRQUN4RSxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVU7WUFBRSxNQUFNLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztRQUMvQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUc7WUFBRSxNQUFNLENBQUMsR0FBRyxHQUFHO2dCQUM3QixVQUFVLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztnQkFDckIsVUFBVSxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUM7Z0JBQ3JCLE1BQU0sRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO2dCQUNqQixNQUFNLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztnQkFDakIsS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUM7Z0JBQ2hCLE9B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T0FBTztZQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMzRCxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztJQUN0QixDQUFDO0NBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiBTcGluZSBSdW50aW1lcyBMaWNlbnNlIEFncmVlbWVudFxuICogTGFzdCB1cGRhdGVkIEp1bHkgMjgsIDIwMjMuIFJlcGxhY2VzIGFsbCBwcmlvciB2ZXJzaW9ucy5cbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAyMywgRXNvdGVyaWMgU29mdHdhcmUgTExDXG4gKlxuICogSW50ZWdyYXRpb24gb2YgdGhlIFNwaW5lIFJ1bnRpbWVzIGludG8gc29mdHdhcmUgb3Igb3RoZXJ3aXNlIGNyZWF0aW5nXG4gKiBkZXJpdmF0aXZlIHdvcmtzIG9mIHRoZSBTcGluZSBSdW50aW1lcyBpcyBwZXJtaXR0ZWQgdW5kZXIgdGhlIHRlcm1zIGFuZFxuICogY29uZGl0aW9ucyBvZiBTZWN0aW9uIDIgb2YgdGhlIFNwaW5lIEVkaXRvciBMaWNlbnNlIEFncmVlbWVudDpcbiAqIGh0dHA6Ly9lc290ZXJpY3NvZnR3YXJlLmNvbS9zcGluZS1lZGl0b3ItbGljZW5zZVxuICpcbiAqIE90aGVyd2lzZSwgaXQgaXMgcGVybWl0dGVkIHRvIGludGVncmF0ZSB0aGUgU3BpbmUgUnVudGltZXMgaW50byBzb2Z0d2FyZSBvclxuICogb3RoZXJ3aXNlIGNyZWF0ZSBkZXJpdmF0aXZlIHdvcmtzIG9mIHRoZSBTcGluZSBSdW50aW1lcyAoY29sbGVjdGl2ZWx5LFxuICogXCJQcm9kdWN0c1wiKSwgcHJvdmlkZWQgdGhhdCBlYWNoIHVzZXIgb2YgdGhlIFByb2R1Y3RzIG11c3Qgb2J0YWluIHRoZWlyIG93blxuICogU3BpbmUgRWRpdG9yIGxpY2Vuc2UgYW5kIHJlZGlzdHJpYnV0aW9uIG9mIHRoZSBQcm9kdWN0cyBpbiBhbnkgZm9ybSBtdXN0XG4gKiBpbmNsdWRlIHRoaXMgbGljZW5zZSBhbmQgY29weXJpZ2h0IG5vdGljZS5cbiAqXG4gKiBUSEUgU1BJTkUgUlVOVElNRVMgQVJFIFBST1ZJREVEIEJZIEVTT1RFUklDIFNPRlRXQVJFIExMQyBcIkFTIElTXCIgQU5EIEFOWVxuICogRVhQUkVTUyBPUiBJTVBMSUVEIFdBUlJBTlRJRVMsIElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLCBUSEUgSU1QTElFRFxuICogV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFkgQU5EIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFSRVxuICogRElTQ0xBSU1FRC4gSU4gTk8gRVZFTlQgU0hBTEwgRVNPVEVSSUMgU09GVFdBUkUgTExDIEJFIExJQUJMRSBGT1IgQU5ZXG4gKiBESVJFQ1QsIElORElSRUNULCBJTkNJREVOVEFMLCBTUEVDSUFMLCBFWEVNUExBUlksIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFU1xuICogKElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLCBQUk9DVVJFTUVOVCBPRiBTVUJTVElUVVRFIEdPT0RTIE9SIFNFUlZJQ0VTLFxuICogQlVTSU5FU1MgSU5URVJSVVBUSU9OLCBPUiBMT1NTIE9GIFVTRSwgREFUQSwgT1IgUFJPRklUUykgSE9XRVZFUiBDQVVTRUQgQU5EXG4gKiBPTiBBTlkgVEhFT1JZIE9GIExJQUJJTElUWSwgV0hFVEhFUiBJTiBDT05UUkFDVCwgU1RSSUNUIExJQUJJTElUWSwgT1IgVE9SVFxuICogKElOQ0xVRElORyBORUdMSUdFTkNFIE9SIE9USEVSV0lTRSkgQVJJU0lORyBJTiBBTlkgV0FZIE9VVCBPRiBUSEUgVVNFIE9GIFRIRVxuICogU1BJTkUgUlVOVElNRVMsIEVWRU4gSUYgQURWSVNFRCBPRiBUSEUgUE9TU0lCSUxJVFkgT0YgU1VDSCBEQU1BR0UuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmltcG9ydCB7IFRpbWVLZWVwZXIsIEFzc2V0TWFuYWdlciwgTWFuYWdlZFdlYkdMUmVuZGVyaW5nQ29udGV4dCwgU2NlbmVSZW5kZXJlciwgSW5wdXQsIFN0cmluZ01hcCB9IGZyb20gXCIuL2luZGV4LmpzXCI7XG5cbi8qKiBBbiBhcHAgcnVubmluZyBpbnNpZGUgYSB7QGxpbmsgU3BpbmVDYW52YXN9LiBUaGUgYXBwIGxpZmUtY3ljbGVcbiAqIGlzIGFzIGZvbGxvd3M6XG4gKlxuICogMS4gYGxvYWRBc3NldHMoKWAgaXMgY2FsbGVkLiBUaGUgYXBwIGNhbiBxdWV1ZSBhc3NldHMgZm9yIGxvYWRpbmcgdmlhIHtAbGluayBTcGluZUNhbnZhcy5hc3NldE1hbmFnZXJ9LlxuICogMi4gYGluaXRpYWxpemUoKWAgaXMgY2FsbGVkIHdoZW4gYWxsIGFzc2V0cyBhcmUgbG9hZGVkLiBUaGUgYXBwIGNhbiBzZXR1cCBhbnl0aGluZyBpdCBuZWVkcyB0byBlbnRlciB0aGUgbWFpbiBhcHBsaWNhdGlvbiBsb2dpYy5cbiAqIDMuIGB1cGRhdGUoKWAgaXMgY2FsbGVkIHBlcmlvZGljYWxseSBhdCBzY3JlZW4gcmVmcmVzaCByYXRlLiBUaGUgYXBwIGNhbiB1cGRhdGUgaXRzIHN0YXRlLlxuICogNC4gYHJlbmRlcigpYCBpcyBjYWxsZWQgcGVyaW9kaWNhbGx5IGF0IHNjcmVlbiByZWZyZXNoIHJhdGUuIFRoZSBhcHAgY2FuIHJlbmRlciBpdHMgc3RhdGUgdmlhIHtAbGluayBTcGluZUNhbnZhcy5yZW5kZXJlcn0gb3IgZGlyZWN0bHkgdmlhIHRoZSBXZWJHTCBjb250ZXh0IGluIHtAbGluayBTcGluZUNhbnZhcy5nbH0uXG4gKlxuICogVGhlIGBlcnJvcigpYCBtZXRob2QgaXMgY2FsbGVkIGluIGNhc2UgdGhlIGFzc2V0cyBjb3VsZCBub3QgYmUgbG9hZGVkLiBUaGUgYGRpc3Bvc2UoKWAgbWV0aG9kIGlzIGNhbGxlZCBpbiBjYXNlIHRoZSBjYW52YXMgaGFzIGJlZW4gZGlzcG9zZWQgdmlhIHtAbGluayBTcGluZUNhbnZhcy5kaXNwb3NlfS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBTcGluZUNhbnZhc0FwcCB7XG5cdGxvYWRBc3NldHM/KGNhbnZhczogU3BpbmVDYW52YXMpOiB2b2lkO1xuXHRpbml0aWFsaXplPyhjYW52YXM6IFNwaW5lQ2FudmFzKTogdm9pZDtcblx0dXBkYXRlPyhjYW52YXM6IFNwaW5lQ2FudmFzLCBkZWx0YTogbnVtYmVyKTogdm9pZDtcblx0cmVuZGVyPyhjYW52YXM6IFNwaW5lQ2FudmFzKTogdm9pZDtcblx0ZXJyb3I/KGNhbnZhczogU3BpbmVDYW52YXMsIGVycm9yczogU3RyaW5nTWFwPHN0cmluZz4pOiB2b2lkO1xuXHRkaXNwb3NlPyhjYW52YXM6IFNwaW5lQ2FudmFzKTogdm9pZDtcbn1cblxuLyoqIENvbmZpZ3VyYXRpb24gcGFzc2VkIHRvIHRoZSB7QGxpbmsgU3BpbmVDYW52YXN9IGNvbnN0cnVjdG9yICovXG5leHBvcnQgaW50ZXJmYWNlIFNwaW5lQ2FudmFzQ29uZmlnIHtcblx0LyogVGhlIHtAbGluayBTcGluZUNhbnZhc0FwcH0gdG8gYmUgcnVuIGluIHRoZSBjYW52YXMuICovXG5cdGFwcDogU3BpbmVDYW52YXNBcHA7XG5cdC8qIFRoZSBwYXRoIHByZWZpeCB0byBiZSB1c2VkIGJ5IHRoZSB7QGxpbmsgQXNzZXRNYW5hZ2VyfS4gKi9cblx0cGF0aFByZWZpeD86IHN0cmluZztcblx0LyogVGhlIFdlYkdMIGNvbnRleHQgY29uZmlndXJhdGlvbiAqL1xuXHR3ZWJnbENvbmZpZz86IGFueTtcbn1cblxuLyoqIE1hbmFnZXMgdGhlIGxpZmUtY3ljbGUgYW5kIFdlYkdMIGNvbnRleHQgb2YgYSB7QGxpbmsgU3BpbmVDYW52YXNBcHB9LiBUaGUgYXBwIGxvYWRzXG4gKiBhc3NldHMgYW5kIGluaXRpYWxpemVzIGl0c2VsZiwgdGhlbiB1cGRhdGVzIGFuZCByZW5kZXJzIGl0cyBzdGF0ZSBhdCB0aGUgc2NyZWVuIHJlZnJlc2ggcmF0ZS4gKi9cbmV4cG9ydCBjbGFzcyBTcGluZUNhbnZhcyB7XG5cdHJlYWRvbmx5IGNvbnRleHQ6IE1hbmFnZWRXZWJHTFJlbmRlcmluZ0NvbnRleHQ7XG5cblx0LyoqIFRyYWNrcyB0aGUgY3VycmVudCB0aW1lLCBkZWx0YSwgYW5kIG90aGVyIHRpbWUgcmVsYXRlZCBzdGF0aXN0aWNzLiAqL1xuXHRyZWFkb25seSB0aW1lID0gbmV3IFRpbWVLZWVwZXIoKTtcblx0LyoqIFRoZSBIVE1MIGNhbnZhcyB0byByZW5kZXIgdG8uICovXG5cdHJlYWRvbmx5IGh0bWxDYW52YXM6IEhUTUxDYW52YXNFbGVtZW50O1xuXHQvKiogVGhlIFdlYkdMIHJlbmRlcmluZyBjb250ZXh0LiAqL1xuXHRyZWFkb25seSBnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0O1xuXHQvKiogVGhlIHNjZW5lIHJlbmRlcmVyIGZvciBlYXN5IGRyYXdpbmcgb2Ygc2tlbGV0b25zLCBzaGFwZXMsIGFuZCBpbWFnZXMuICovXG5cdHJlYWRvbmx5IHJlbmRlcmVyOiBTY2VuZVJlbmRlcmVyO1xuXHQvKiogVGhlIGFzc2V0IG1hbmFnZXIgdG8gbG9hZCBhc3NldHMgd2l0aC4gKi9cblx0cmVhZG9ubHkgYXNzZXRNYW5hZ2VyOiBBc3NldE1hbmFnZXI7XG5cdC8qKiBUaGUgaW5wdXQgcHJvY2Vzc29yIHVzZWQgdG8gbGlzdGVuIHRvIG1vdXNlLCB0b3VjaCwgYW5kIGtleWJvYXJkIGV2ZW50cy4gKi9cblx0cmVhZG9ubHkgaW5wdXQ6IElucHV0O1xuXG5cdHByaXZhdGUgZGlzcG9zZWQgPSBmYWxzZTtcblxuXHQvKiogQ29uc3RydWN0cyBhIG5ldyBzcGluZSBjYW52YXMsIHJlbmRlcmluZyB0byB0aGUgcHJvdmlkZWQgSFRNTCBjYW52YXMuICovXG5cdGNvbnN0cnVjdG9yIChjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50LCBwcml2YXRlIGNvbmZpZzogU3BpbmVDYW52YXNDb25maWcpIHtcblx0XHRpZiAoIWNvbmZpZy5wYXRoUHJlZml4KSBjb25maWcucGF0aFByZWZpeCA9IFwiXCI7XG5cdFx0aWYgKCFjb25maWcuYXBwKSBjb25maWcuYXBwID0ge1xuXHRcdFx0bG9hZEFzc2V0czogKCkgPT4geyB9LFxuXHRcdFx0aW5pdGlhbGl6ZTogKCkgPT4geyB9LFxuXHRcdFx0dXBkYXRlOiAoKSA9PiB7IH0sXG5cdFx0XHRyZW5kZXI6ICgpID0+IHsgfSxcblx0XHRcdGVycm9yOiAoKSA9PiB7IH0sXG5cdFx0XHRkaXNwb3NlOiAoKSA9PiB7IH0sXG5cdFx0fVxuXHRcdGlmICghY29uZmlnLndlYmdsQ29uZmlnKSBjb25maWcud2ViZ2xDb25maWcgPSB7IGFscGhhOiB0cnVlIH07XG5cblx0XHR0aGlzLmh0bWxDYW52YXMgPSBjYW52YXM7XG5cdFx0dGhpcy5jb250ZXh0ID0gbmV3IE1hbmFnZWRXZWJHTFJlbmRlcmluZ0NvbnRleHQoY2FudmFzLCBjb25maWcud2ViZ2xDb25maWcpO1xuXHRcdHRoaXMucmVuZGVyZXIgPSBuZXcgU2NlbmVSZW5kZXJlcihjYW52YXMsIHRoaXMuY29udGV4dCk7XG5cdFx0dGhpcy5nbCA9IHRoaXMuY29udGV4dC5nbDtcblx0XHR0aGlzLmFzc2V0TWFuYWdlciA9IG5ldyBBc3NldE1hbmFnZXIodGhpcy5jb250ZXh0LCBjb25maWcucGF0aFByZWZpeCk7XG5cdFx0dGhpcy5pbnB1dCA9IG5ldyBJbnB1dChjYW52YXMpO1xuXG5cdFx0aWYgKGNvbmZpZy5hcHAubG9hZEFzc2V0cykgY29uZmlnLmFwcC5sb2FkQXNzZXRzKHRoaXMpO1xuXG5cdFx0bGV0IGxvb3AgPSAoKSA9PiB7XG5cdFx0XHRpZiAodGhpcy5kaXNwb3NlZCkgcmV0dXJuO1xuXHRcdFx0cmVxdWVzdEFuaW1hdGlvbkZyYW1lKGxvb3ApO1xuXHRcdFx0dGhpcy50aW1lLnVwZGF0ZSgpO1xuXHRcdFx0aWYgKGNvbmZpZy5hcHAudXBkYXRlKSBjb25maWcuYXBwLnVwZGF0ZSh0aGlzLCB0aGlzLnRpbWUuZGVsdGEpO1xuXHRcdFx0aWYgKGNvbmZpZy5hcHAucmVuZGVyKSBjb25maWcuYXBwLnJlbmRlcih0aGlzKTtcblx0XHR9XG5cblx0XHRsZXQgd2FpdEZvckFzc2V0cyA9ICgpID0+IHtcblx0XHRcdGlmICh0aGlzLmRpc3Bvc2VkKSByZXR1cm47XG5cdFx0XHRpZiAodGhpcy5hc3NldE1hbmFnZXIuaXNMb2FkaW5nQ29tcGxldGUoKSkge1xuXHRcdFx0XHRpZiAodGhpcy5hc3NldE1hbmFnZXIuaGFzRXJyb3JzKCkpIHtcblx0XHRcdFx0XHRpZiAoY29uZmlnLmFwcC5lcnJvcikgY29uZmlnLmFwcC5lcnJvcih0aGlzLCB0aGlzLmFzc2V0TWFuYWdlci5nZXRFcnJvcnMoKSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0aWYgKGNvbmZpZy5hcHAuaW5pdGlhbGl6ZSkgY29uZmlnLmFwcC5pbml0aWFsaXplKHRoaXMpO1xuXHRcdFx0XHRcdGxvb3AoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUod2FpdEZvckFzc2V0cyk7XG5cdFx0fVxuXHRcdHJlcXVlc3RBbmltYXRpb25GcmFtZSh3YWl0Rm9yQXNzZXRzKTtcblx0fVxuXG5cdC8qKiBDbGVhcnMgdGhlIGNhbnZhcyB3aXRoIHRoZSBnaXZlbiBjb2xvci4gVGhlIGNvbG9yIHZhbHVlcyBhcmUgZ2l2ZW4gaW4gdGhlIHJhbmdlIFswLDFdLiAqL1xuXHRjbGVhciAocjogbnVtYmVyLCBnOiBudW1iZXIsIGI6IG51bWJlciwgYTogbnVtYmVyKSB7XG5cdFx0dGhpcy5nbC5jbGVhckNvbG9yKHIsIGcsIGIsIGEpO1xuXHRcdHRoaXMuZ2wuY2xlYXIodGhpcy5nbC5DT0xPUl9CVUZGRVJfQklUKTtcblx0fVxuXG5cdC8qKiBEaXNwb3NlcyB0aGUgYXBwLCBzbyB0aGUgdXBkYXRlKCkgYW5kIHJlbmRlcigpIGZ1bmN0aW9ucyBhcmUgbm8gbG9uZ2VyIGNhbGxlZC4gQ2FsbHMgdGhlIGRpc3Bvc2UoKSBjYWxsYmFjay4qL1xuXHRkaXNwb3NlICgpIHtcblx0XHRpZiAodGhpcy5jb25maWcuYXBwLmRpc3Bvc2UpIHRoaXMuY29uZmlnLmFwcC5kaXNwb3NlKHRoaXMpO1xuXHRcdHRoaXMuZGlzcG9zZWQgPSB0cnVlO1xuXHR9XG59XG4iXX0=