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
import { Matrix4 } from "./Matrix4.js";
import { Vector3 } from "./Vector3.js";
export class OrthoCamera {
    position = new Vector3(0, 0, 0);
    direction = new Vector3(0, 0, -1);
    up = new Vector3(0, 1, 0);
    near = 0;
    far = 100;
    zoom = 1;
    viewportWidth = 0;
    viewportHeight = 0;
    projectionView = new Matrix4();
    inverseProjectionView = new Matrix4();
    projection = new Matrix4();
    view = new Matrix4();
    constructor(viewportWidth, viewportHeight) {
        this.viewportWidth = viewportWidth;
        this.viewportHeight = viewportHeight;
        this.update();
    }
    update() {
        let projection = this.projection;
        let view = this.view;
        let projectionView = this.projectionView;
        let inverseProjectionView = this.inverseProjectionView;
        let zoom = this.zoom, viewportWidth = this.viewportWidth, viewportHeight = this.viewportHeight;
        projection.ortho(zoom * (-viewportWidth / 2), zoom * (viewportWidth / 2), zoom * (-viewportHeight / 2), zoom * (viewportHeight / 2), this.near, this.far);
        view.lookAt(this.position, this.direction, this.up);
        projectionView.set(projection.values);
        projectionView.multiply(view);
        inverseProjectionView.set(projectionView.values).invert();
    }
    screenToWorld(screenCoords, screenWidth, screenHeight) {
        let x = screenCoords.x, y = screenHeight - screenCoords.y - 1;
        screenCoords.x = (2 * x) / screenWidth - 1;
        screenCoords.y = (2 * y) / screenHeight - 1;
        screenCoords.z = (2 * screenCoords.z) - 1;
        screenCoords.project(this.inverseProjectionView);
        return screenCoords;
    }
    worldToScreen(worldCoords, screenWidth, screenHeight) {
        worldCoords.project(this.projectionView);
        worldCoords.x = screenWidth * (worldCoords.x + 1) / 2;
        worldCoords.y = screenHeight * (worldCoords.y + 1) / 2;
        worldCoords.z = (worldCoords.z + 1) / 2;
        return worldCoords;
    }
    setViewport(viewportWidth, viewportHeight) {
        this.viewportWidth = viewportWidth;
        this.viewportHeight = viewportHeight;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2FtZXJhLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0NhbWVyYS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OytFQTJCK0U7QUFFL0UsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUN2QyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBRXZDLE1BQU0sT0FBTyxXQUFXO0lBQ3ZCLFFBQVEsR0FBRyxJQUFJLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ2hDLFNBQVMsR0FBRyxJQUFJLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbEMsRUFBRSxHQUFHLElBQUksT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDMUIsSUFBSSxHQUFHLENBQUMsQ0FBQztJQUNULEdBQUcsR0FBRyxHQUFHLENBQUM7SUFDVixJQUFJLEdBQUcsQ0FBQyxDQUFDO0lBQ1QsYUFBYSxHQUFHLENBQUMsQ0FBQztJQUNsQixjQUFjLEdBQUcsQ0FBQyxDQUFDO0lBQ25CLGNBQWMsR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFDO0lBQy9CLHFCQUFxQixHQUFHLElBQUksT0FBTyxFQUFFLENBQUM7SUFDdEMsVUFBVSxHQUFHLElBQUksT0FBTyxFQUFFLENBQUM7SUFDM0IsSUFBSSxHQUFHLElBQUksT0FBTyxFQUFFLENBQUM7SUFFckIsWUFBYSxhQUFxQixFQUFFLGNBQXNCO1FBQ3pELElBQUksQ0FBQyxhQUFhLEdBQUcsYUFBYSxDQUFDO1FBQ25DLElBQUksQ0FBQyxjQUFjLEdBQUcsY0FBYyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNmLENBQUM7SUFFRCxNQUFNO1FBQ0wsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUNqQyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ3JCLElBQUksY0FBYyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUM7UUFDekMsSUFBSSxxQkFBcUIsR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUM7UUFDdkQsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRSxhQUFhLEdBQUcsSUFBSSxDQUFDLGFBQWEsRUFBRSxjQUFjLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQztRQUMvRixVQUFVLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksR0FBRyxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUMsRUFDdkUsSUFBSSxHQUFHLENBQUMsQ0FBQyxjQUFjLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxHQUFHLENBQUMsY0FBYyxHQUFHLENBQUMsQ0FBQyxFQUN6RCxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN0QixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDcEQsY0FBYyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdEMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM5QixxQkFBcUIsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQzNELENBQUM7SUFFRCxhQUFhLENBQUUsWUFBcUIsRUFBRSxXQUFtQixFQUFFLFlBQW9CO1FBQzlFLElBQUksQ0FBQyxHQUFHLFlBQVksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFlBQVksR0FBRyxZQUFZLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM5RCxZQUFZLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLFdBQVcsR0FBRyxDQUFDLENBQUM7UUFDM0MsWUFBWSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxZQUFZLEdBQUcsQ0FBQyxDQUFDO1FBQzVDLFlBQVksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMxQyxZQUFZLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1FBQ2pELE9BQU8sWUFBWSxDQUFDO0lBQ3JCLENBQUM7SUFFRCxhQUFhLENBQUUsV0FBb0IsRUFBRSxXQUFtQixFQUFFLFlBQW9CO1FBQzdFLFdBQVcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ3pDLFdBQVcsQ0FBQyxDQUFDLEdBQUcsV0FBVyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDdEQsV0FBVyxDQUFDLENBQUMsR0FBRyxZQUFZLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN2RCxXQUFXLENBQUMsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDeEMsT0FBTyxXQUFXLENBQUM7SUFDcEIsQ0FBQztJQUVELFdBQVcsQ0FBRSxhQUFxQixFQUFFLGNBQXNCO1FBQ3pELElBQUksQ0FBQyxhQUFhLEdBQUcsYUFBYSxDQUFDO1FBQ25DLElBQUksQ0FBQyxjQUFjLEdBQUcsY0FBYyxDQUFDO0lBQ3RDLENBQUM7Q0FDRCIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqIFNwaW5lIFJ1bnRpbWVzIExpY2Vuc2UgQWdyZWVtZW50XG4gKiBMYXN0IHVwZGF0ZWQgSnVseSAyOCwgMjAyMy4gUmVwbGFjZXMgYWxsIHByaW9yIHZlcnNpb25zLlxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxMy0yMDIzLCBFc290ZXJpYyBTb2Z0d2FyZSBMTENcbiAqXG4gKiBJbnRlZ3JhdGlvbiBvZiB0aGUgU3BpbmUgUnVudGltZXMgaW50byBzb2Z0d2FyZSBvciBvdGhlcndpc2UgY3JlYXRpbmdcbiAqIGRlcml2YXRpdmUgd29ya3Mgb2YgdGhlIFNwaW5lIFJ1bnRpbWVzIGlzIHBlcm1pdHRlZCB1bmRlciB0aGUgdGVybXMgYW5kXG4gKiBjb25kaXRpb25zIG9mIFNlY3Rpb24gMiBvZiB0aGUgU3BpbmUgRWRpdG9yIExpY2Vuc2UgQWdyZWVtZW50OlxuICogaHR0cDovL2Vzb3Rlcmljc29mdHdhcmUuY29tL3NwaW5lLWVkaXRvci1saWNlbnNlXG4gKlxuICogT3RoZXJ3aXNlLCBpdCBpcyBwZXJtaXR0ZWQgdG8gaW50ZWdyYXRlIHRoZSBTcGluZSBSdW50aW1lcyBpbnRvIHNvZnR3YXJlIG9yXG4gKiBvdGhlcndpc2UgY3JlYXRlIGRlcml2YXRpdmUgd29ya3Mgb2YgdGhlIFNwaW5lIFJ1bnRpbWVzIChjb2xsZWN0aXZlbHksXG4gKiBcIlByb2R1Y3RzXCIpLCBwcm92aWRlZCB0aGF0IGVhY2ggdXNlciBvZiB0aGUgUHJvZHVjdHMgbXVzdCBvYnRhaW4gdGhlaXIgb3duXG4gKiBTcGluZSBFZGl0b3IgbGljZW5zZSBhbmQgcmVkaXN0cmlidXRpb24gb2YgdGhlIFByb2R1Y3RzIGluIGFueSBmb3JtIG11c3RcbiAqIGluY2x1ZGUgdGhpcyBsaWNlbnNlIGFuZCBjb3B5cmlnaHQgbm90aWNlLlxuICpcbiAqIFRIRSBTUElORSBSVU5USU1FUyBBUkUgUFJPVklERUQgQlkgRVNPVEVSSUMgU09GVFdBUkUgTExDIFwiQVMgSVNcIiBBTkQgQU5ZXG4gKiBFWFBSRVNTIE9SIElNUExJRUQgV0FSUkFOVElFUywgSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFRIRSBJTVBMSUVEXG4gKiBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSBBTkQgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQVJFXG4gKiBESVNDTEFJTUVELiBJTiBOTyBFVkVOVCBTSEFMTCBFU09URVJJQyBTT0ZUV0FSRSBMTEMgQkUgTElBQkxFIEZPUiBBTllcbiAqIERJUkVDVCwgSU5ESVJFQ1QsIElOQ0lERU5UQUwsIFNQRUNJQUwsIEVYRU1QTEFSWSwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTXG4gKiAoSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFBST0NVUkVNRU5UIE9GIFNVQlNUSVRVVEUgR09PRFMgT1IgU0VSVklDRVMsXG4gKiBCVVNJTkVTUyBJTlRFUlJVUFRJT04sIE9SIExPU1MgT0YgVVNFLCBEQVRBLCBPUiBQUk9GSVRTKSBIT1dFVkVSIENBVVNFRCBBTkRcbiAqIE9OIEFOWSBUSEVPUlkgT0YgTElBQklMSVRZLCBXSEVUSEVSIElOIENPTlRSQUNULCBTVFJJQ1QgTElBQklMSVRZLCBPUiBUT1JUXG4gKiAoSU5DTFVESU5HIE5FR0xJR0VOQ0UgT1IgT1RIRVJXSVNFKSBBUklTSU5HIElOIEFOWSBXQVkgT1VUIE9GIFRIRSBVU0UgT0YgVEhFXG4gKiBTUElORSBSVU5USU1FUywgRVZFTiBJRiBBRFZJU0VEIE9GIFRIRSBQT1NTSUJJTElUWSBPRiBTVUNIIERBTUFHRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuaW1wb3J0IHsgTWF0cml4NCB9IGZyb20gXCIuL01hdHJpeDQuanNcIjtcbmltcG9ydCB7IFZlY3RvcjMgfSBmcm9tIFwiLi9WZWN0b3IzLmpzXCI7XG5cbmV4cG9ydCBjbGFzcyBPcnRob0NhbWVyYSB7XG5cdHBvc2l0aW9uID0gbmV3IFZlY3RvcjMoMCwgMCwgMCk7XG5cdGRpcmVjdGlvbiA9IG5ldyBWZWN0b3IzKDAsIDAsIC0xKTtcblx0dXAgPSBuZXcgVmVjdG9yMygwLCAxLCAwKTtcblx0bmVhciA9IDA7XG5cdGZhciA9IDEwMDtcblx0em9vbSA9IDE7XG5cdHZpZXdwb3J0V2lkdGggPSAwO1xuXHR2aWV3cG9ydEhlaWdodCA9IDA7XG5cdHByb2plY3Rpb25WaWV3ID0gbmV3IE1hdHJpeDQoKTtcblx0aW52ZXJzZVByb2plY3Rpb25WaWV3ID0gbmV3IE1hdHJpeDQoKTtcblx0cHJvamVjdGlvbiA9IG5ldyBNYXRyaXg0KCk7XG5cdHZpZXcgPSBuZXcgTWF0cml4NCgpO1xuXG5cdGNvbnN0cnVjdG9yICh2aWV3cG9ydFdpZHRoOiBudW1iZXIsIHZpZXdwb3J0SGVpZ2h0OiBudW1iZXIpIHtcblx0XHR0aGlzLnZpZXdwb3J0V2lkdGggPSB2aWV3cG9ydFdpZHRoO1xuXHRcdHRoaXMudmlld3BvcnRIZWlnaHQgPSB2aWV3cG9ydEhlaWdodDtcblx0XHR0aGlzLnVwZGF0ZSgpO1xuXHR9XG5cblx0dXBkYXRlICgpIHtcblx0XHRsZXQgcHJvamVjdGlvbiA9IHRoaXMucHJvamVjdGlvbjtcblx0XHRsZXQgdmlldyA9IHRoaXMudmlldztcblx0XHRsZXQgcHJvamVjdGlvblZpZXcgPSB0aGlzLnByb2plY3Rpb25WaWV3O1xuXHRcdGxldCBpbnZlcnNlUHJvamVjdGlvblZpZXcgPSB0aGlzLmludmVyc2VQcm9qZWN0aW9uVmlldztcblx0XHRsZXQgem9vbSA9IHRoaXMuem9vbSwgdmlld3BvcnRXaWR0aCA9IHRoaXMudmlld3BvcnRXaWR0aCwgdmlld3BvcnRIZWlnaHQgPSB0aGlzLnZpZXdwb3J0SGVpZ2h0O1xuXHRcdHByb2plY3Rpb24ub3J0aG8oem9vbSAqICgtdmlld3BvcnRXaWR0aCAvIDIpLCB6b29tICogKHZpZXdwb3J0V2lkdGggLyAyKSxcblx0XHRcdHpvb20gKiAoLXZpZXdwb3J0SGVpZ2h0IC8gMiksIHpvb20gKiAodmlld3BvcnRIZWlnaHQgLyAyKSxcblx0XHRcdHRoaXMubmVhciwgdGhpcy5mYXIpO1xuXHRcdHZpZXcubG9va0F0KHRoaXMucG9zaXRpb24sIHRoaXMuZGlyZWN0aW9uLCB0aGlzLnVwKTtcblx0XHRwcm9qZWN0aW9uVmlldy5zZXQocHJvamVjdGlvbi52YWx1ZXMpO1xuXHRcdHByb2plY3Rpb25WaWV3Lm11bHRpcGx5KHZpZXcpO1xuXHRcdGludmVyc2VQcm9qZWN0aW9uVmlldy5zZXQocHJvamVjdGlvblZpZXcudmFsdWVzKS5pbnZlcnQoKTtcblx0fVxuXG5cdHNjcmVlblRvV29ybGQgKHNjcmVlbkNvb3JkczogVmVjdG9yMywgc2NyZWVuV2lkdGg6IG51bWJlciwgc2NyZWVuSGVpZ2h0OiBudW1iZXIpIHtcblx0XHRsZXQgeCA9IHNjcmVlbkNvb3Jkcy54LCB5ID0gc2NyZWVuSGVpZ2h0IC0gc2NyZWVuQ29vcmRzLnkgLSAxO1xuXHRcdHNjcmVlbkNvb3Jkcy54ID0gKDIgKiB4KSAvIHNjcmVlbldpZHRoIC0gMTtcblx0XHRzY3JlZW5Db29yZHMueSA9ICgyICogeSkgLyBzY3JlZW5IZWlnaHQgLSAxO1xuXHRcdHNjcmVlbkNvb3Jkcy56ID0gKDIgKiBzY3JlZW5Db29yZHMueikgLSAxO1xuXHRcdHNjcmVlbkNvb3Jkcy5wcm9qZWN0KHRoaXMuaW52ZXJzZVByb2plY3Rpb25WaWV3KTtcblx0XHRyZXR1cm4gc2NyZWVuQ29vcmRzO1xuXHR9XG5cblx0d29ybGRUb1NjcmVlbiAod29ybGRDb29yZHM6IFZlY3RvcjMsIHNjcmVlbldpZHRoOiBudW1iZXIsIHNjcmVlbkhlaWdodDogbnVtYmVyKSB7XG5cdFx0d29ybGRDb29yZHMucHJvamVjdCh0aGlzLnByb2plY3Rpb25WaWV3KTtcblx0XHR3b3JsZENvb3Jkcy54ID0gc2NyZWVuV2lkdGggKiAod29ybGRDb29yZHMueCArIDEpIC8gMjtcblx0XHR3b3JsZENvb3Jkcy55ID0gc2NyZWVuSGVpZ2h0ICogKHdvcmxkQ29vcmRzLnkgKyAxKSAvIDI7XG5cdFx0d29ybGRDb29yZHMueiA9ICh3b3JsZENvb3Jkcy56ICsgMSkgLyAyO1xuXHRcdHJldHVybiB3b3JsZENvb3Jkcztcblx0fVxuXG5cdHNldFZpZXdwb3J0ICh2aWV3cG9ydFdpZHRoOiBudW1iZXIsIHZpZXdwb3J0SGVpZ2h0OiBudW1iZXIpIHtcblx0XHR0aGlzLnZpZXdwb3J0V2lkdGggPSB2aWV3cG9ydFdpZHRoO1xuXHRcdHRoaXMudmlld3BvcnRIZWlnaHQgPSB2aWV3cG9ydEhlaWdodDtcblx0fVxufVxuIl19