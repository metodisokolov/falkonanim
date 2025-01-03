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
import { NumberArrayLike, SkeletonClipping, Skeleton } from "@esotericsoftware/spine-core";
import { PolygonBatcher } from "./PolygonBatcher.js";
import { ManagedWebGLRenderingContext } from "./WebGL.js";
export type VertexTransformer = (vertices: NumberArrayLike, numVertices: number, stride: number) => void;
export declare class SkeletonRenderer {
    static QUAD_TRIANGLES: number[];
    premultipliedAlpha: boolean;
    private tempColor;
    private tempColor2;
    private vertices;
    private vertexSize;
    private twoColorTint;
    private renderable;
    private clipper;
    private temp;
    private temp2;
    private temp3;
    private temp4;
    constructor(context: ManagedWebGLRenderingContext, twoColorTint?: boolean);
    draw(batcher: PolygonBatcher, skeleton: Skeleton, slotRangeStart?: number, slotRangeEnd?: number, transformer?: VertexTransformer | null): void;
    /** Returns the {@link SkeletonClipping} used by this renderer for use with e.g. {@link Skeleton.getBounds} **/
    getSkeletonClipping(): SkeletonClipping;
}
