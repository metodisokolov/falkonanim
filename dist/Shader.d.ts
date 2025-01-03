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
import { ManagedWebGLRenderingContext } from "./WebGL.js";
export declare class Shader implements Disposable, Restorable {
    private vertexShader;
    private fragmentShader;
    static MVP_MATRIX: string;
    static POSITION: string;
    static COLOR: string;
    static COLOR2: string;
    static TEXCOORDS: string;
    static SAMPLER: string;
    private context;
    private vs;
    private vsSource;
    private fs;
    private fsSource;
    private program;
    private tmp2x2;
    private tmp3x3;
    private tmp4x4;
    getProgram(): WebGLProgram | null;
    getVertexShader(): string;
    getFragmentShader(): string;
    getVertexShaderSource(): string;
    getFragmentSource(): string;
    constructor(context: ManagedWebGLRenderingContext | WebGLRenderingContext, vertexShader: string, fragmentShader: string);
    private compile;
    private compileShader;
    private compileProgram;
    restore(): void;
    bind(): void;
    unbind(): void;
    setUniformi(uniform: string, value: number): void;
    setUniformf(uniform: string, value: number): void;
    setUniform2f(uniform: string, value: number, value2: number): void;
    setUniform3f(uniform: string, value: number, value2: number, value3: number): void;
    setUniform4f(uniform: string, value: number, value2: number, value3: number, value4: number): void;
    setUniform2x2f(uniform: string, value: ArrayLike<number>): void;
    setUniform3x3f(uniform: string, value: ArrayLike<number>): void;
    setUniform4x4f(uniform: string, value: ArrayLike<number>): void;
    getUniformLocation(uniform: string): WebGLUniformLocation | null;
    getAttributeLocation(attribute: string): number;
    dispose(): void;
    static newColoredTextured(context: ManagedWebGLRenderingContext | WebGLRenderingContext): Shader;
    static newTwoColoredTextured(context: ManagedWebGLRenderingContext | WebGLRenderingContext): Shader;
    static newColored(context: ManagedWebGLRenderingContext | WebGLRenderingContext): Shader;
}
