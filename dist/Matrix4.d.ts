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
import { Vector3 } from "./Vector3.js";
export declare const M00 = 0;
export declare const M01 = 4;
export declare const M02 = 8;
export declare const M03 = 12;
export declare const M10 = 1;
export declare const M11 = 5;
export declare const M12 = 9;
export declare const M13 = 13;
export declare const M20 = 2;
export declare const M21 = 6;
export declare const M22 = 10;
export declare const M23 = 14;
export declare const M30 = 3;
export declare const M31 = 7;
export declare const M32 = 11;
export declare const M33 = 15;
export declare class Matrix4 {
    temp: Float32Array;
    values: Float32Array;
    private static xAxis;
    private static yAxis;
    private static zAxis;
    private static tmpMatrix;
    constructor();
    set(values: ArrayLike<number>): Matrix4;
    transpose(): Matrix4;
    identity(): Matrix4;
    invert(): Matrix4;
    determinant(): number;
    translate(x: number, y: number, z: number): Matrix4;
    copy(): Matrix4;
    projection(near: number, far: number, fovy: number, aspectRatio: number): Matrix4;
    ortho2d(x: number, y: number, width: number, height: number): Matrix4;
    ortho(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix4;
    multiply(matrix: Matrix4): Matrix4;
    multiplyLeft(matrix: Matrix4): Matrix4;
    lookAt(position: Vector3, direction: Vector3, up: Vector3): this;
}