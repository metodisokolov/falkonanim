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
import { Disposable, Color } from "@esotericsoftware/spine-core";
import { Shader } from "./Shader.js";
import { ManagedWebGLRenderingContext } from "./WebGL.js";
export declare class ShapeRenderer implements Disposable {
    private context;
    private isDrawing;
    private mesh;
    private shapeType;
    private color;
    private shader;
    private vertexIndex;
    private tmp;
    private srcColorBlend;
    private srcAlphaBlend;
    private dstBlend;
    constructor(context: ManagedWebGLRenderingContext | WebGLRenderingContext, maxVertices?: number);
    begin(shader: Shader): void;
    setBlendMode(srcColorBlend: number, srcAlphaBlend: number, dstBlend: number): void;
    setColor(color: Color): void;
    setColorWith(r: number, g: number, b: number, a: number): void;
    point(x: number, y: number, color?: Color): void;
    line(x: number, y: number, x2: number, y2: number, color?: Color): void;
    triangle(filled: boolean, x: number, y: number, x2: number, y2: number, x3: number, y3: number, color?: Color, color2?: Color, color3?: Color): void;
    quad(filled: boolean, x: number, y: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number, color?: Color, color2?: Color, color3?: Color, color4?: Color): void;
    rect(filled: boolean, x: number, y: number, width: number, height: number, color?: Color): void;
    rectLine(filled: boolean, x1: number, y1: number, x2: number, y2: number, width: number, color?: Color): void;
    x(x: number, y: number, size: number): void;
    polygon(polygonVertices: ArrayLike<number>, offset: number, count: number, color?: Color): void;
    circle(filled: boolean, x: number, y: number, radius: number, color?: Color, segments?: number): void;
    curve(x1: number, y1: number, cx1: number, cy1: number, cx2: number, cy2: number, x2: number, y2: number, segments: number, color?: Color): void;
    private vertex;
    end(): void;
    private flush;
    private check;
    dispose(): void;
}
export declare enum ShapeType {
    Point = 0,
    Line = 1,
    Filled = 4
}