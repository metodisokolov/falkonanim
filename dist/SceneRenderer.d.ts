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
import { Color, Disposable, Skeleton, TextureAtlasRegion } from "@esotericsoftware/spine-core";
import { OrthoCamera } from "./Camera.js";
import { GLTexture } from "./GLTexture.js";
import { PolygonBatcher } from "./PolygonBatcher.js";
import { SkeletonDebugRenderer } from "./SkeletonDebugRenderer.js";
import { SkeletonRenderer, VertexTransformer } from "./SkeletonRenderer.js";
import { ManagedWebGLRenderingContext } from "./WebGL.js";
export declare class SceneRenderer implements Disposable {
    context: ManagedWebGLRenderingContext;
    canvas: HTMLCanvasElement;
    camera: OrthoCamera;
    batcher: PolygonBatcher;
    private twoColorTint;
    private batcherShader;
    private shapes;
    private shapesShader;
    private activeRenderer;
    skeletonRenderer: SkeletonRenderer;
    skeletonDebugRenderer: SkeletonDebugRenderer;
    constructor(canvas: HTMLCanvasElement, context: ManagedWebGLRenderingContext | WebGLRenderingContext, twoColorTint?: boolean);
    dispose(): void;
    begin(): void;
    drawSkeleton(skeleton: Skeleton, premultipliedAlpha?: boolean, slotRangeStart?: number, slotRangeEnd?: number, transform?: VertexTransformer | null): void;
    drawSkeletonDebug(skeleton: Skeleton, premultipliedAlpha?: boolean, ignoredBones?: Array<string>): void;
    drawTexture(texture: GLTexture, x: number, y: number, width: number, height: number, color?: Color): void;
    drawTextureUV(texture: GLTexture, x: number, y: number, width: number, height: number, u: number, v: number, u2: number, v2: number, color?: Color): void;
    drawTextureRotated(texture: GLTexture, x: number, y: number, width: number, height: number, pivotX: number, pivotY: number, angle: number, color?: Color): void;
    drawRegion(region: TextureAtlasRegion, x: number, y: number, width: number, height: number, color?: Color): void;
    line(x: number, y: number, x2: number, y2: number, color?: Color, color2?: Color): void;
    triangle(filled: boolean, x: number, y: number, x2: number, y2: number, x3: number, y3: number, color?: Color, color2?: Color, color3?: Color): void;
    quad(filled: boolean, x: number, y: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number, color?: Color, color2?: Color, color3?: Color, color4?: Color): void;
    rect(filled: boolean, x: number, y: number, width: number, height: number, color?: Color): void;
    rectLine(filled: boolean, x1: number, y1: number, x2: number, y2: number, width: number, color?: Color): void;
    polygon(polygonVertices: ArrayLike<number>, offset: number, count: number, color?: Color): void;
    circle(filled: boolean, x: number, y: number, radius: number, color?: Color, segments?: number): void;
    curve(x1: number, y1: number, cx1: number, cy1: number, cx2: number, cy2: number, x2: number, y2: number, segments: number, color?: Color): void;
    end(): void;
    resize(resizeMode: ResizeMode): void;
    private enableRenderer;
}
export declare enum ResizeMode {
    Stretch = 0,
    Expand = 1,
    Fit = 2
}
