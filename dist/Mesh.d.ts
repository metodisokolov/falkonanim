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
import { Disposable, Restorable } from "@esotericsoftware/spine-core";
import { Shader } from "./Shader.js";
import { ManagedWebGLRenderingContext } from "./WebGL.js";
export declare class Mesh implements Disposable, Restorable {
    private attributes;
    private context;
    private vertices;
    private verticesBuffer;
    private verticesLength;
    private dirtyVertices;
    private indices;
    private indicesBuffer;
    private indicesLength;
    private dirtyIndices;
    private elementsPerVertex;
    getAttributes(): VertexAttribute[];
    maxVertices(): number;
    numVertices(): number;
    setVerticesLength(length: number): void;
    getVertices(): Float32Array;
    maxIndices(): number;
    numIndices(): number;
    setIndicesLength(length: number): void;
    getIndices(): Uint16Array;
    getVertexSizeInFloats(): number;
    constructor(context: ManagedWebGLRenderingContext | WebGLRenderingContext, attributes: VertexAttribute[], maxVertices: number, maxIndices: number);
    setVertices(vertices: Array<number>): void;
    setIndices(indices: Array<number>): void;
    draw(shader: Shader, primitiveType: number): void;
    drawWithOffset(shader: Shader, primitiveType: number, offset: number, count: number): void;
    bind(shader: Shader): void;
    unbind(shader: Shader): void;
    private update;
    restore(): void;
    dispose(): void;
}
export declare class VertexAttribute {
    name: string;
    type: VertexAttributeType;
    numElements: number;
    constructor(name: string, type: VertexAttributeType, numElements: number);
}
export declare class Position2Attribute extends VertexAttribute {
    constructor();
}
export declare class Position3Attribute extends VertexAttribute {
    constructor();
}
export declare class TexCoordAttribute extends VertexAttribute {
    constructor(unit?: number);
}
export declare class ColorAttribute extends VertexAttribute {
    constructor();
}
export declare class Color2Attribute extends VertexAttribute {
    constructor();
}
export declare enum VertexAttributeType {
    Float = 0
}
