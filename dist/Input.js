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
export class Input {
    element;
    mouseX = 0;
    mouseY = 0;
    buttonDown = false;
    touch0 = null;
    touch1 = null;
    initialPinchDistance = 0;
    listeners = new Array();
    eventListeners = [];
    constructor(element) {
        this.element = element;
        this.setupCallbacks(element);
    }
    setupCallbacks(element) {
        let mouseDown = (ev) => {
            if (ev instanceof MouseEvent) {
                let rect = element.getBoundingClientRect();
                this.mouseX = ev.clientX - rect.left;
                ;
                this.mouseY = ev.clientY - rect.top;
                this.buttonDown = true;
                this.listeners.map((listener) => { if (listener.down)
                    listener.down(this.mouseX, this.mouseY); });
                document.addEventListener("mousemove", mouseMove);
                document.addEventListener("mouseup", mouseUp);
            }
        };
        let mouseMove = (ev) => {
            if (ev instanceof MouseEvent) {
                let rect = element.getBoundingClientRect();
                this.mouseX = ev.clientX - rect.left;
                ;
                this.mouseY = ev.clientY - rect.top;
                this.listeners.map((listener) => {
                    if (this.buttonDown) {
                        if (listener.dragged)
                            listener.dragged(this.mouseX, this.mouseY);
                    }
                    else {
                        if (listener.moved)
                            listener.moved(this.mouseX, this.mouseY);
                    }
                });
            }
        };
        let mouseUp = (ev) => {
            if (ev instanceof MouseEvent) {
                let rect = element.getBoundingClientRect();
                this.mouseX = ev.clientX - rect.left;
                ;
                this.mouseY = ev.clientY - rect.top;
                this.buttonDown = false;
                this.listeners.map((listener) => { if (listener.up)
                    listener.up(this.mouseX, this.mouseY); });
                document.removeEventListener("mousemove", mouseMove);
                document.removeEventListener("mouseup", mouseUp);
            }
        };
        let mouseWheel = (e) => {
            e.preventDefault();
            let deltaY = e.deltaY;
            if (e.deltaMode == WheelEvent.DOM_DELTA_LINE)
                deltaY *= 8;
            if (e.deltaMode == WheelEvent.DOM_DELTA_PAGE)
                deltaY *= 24;
            this.listeners.map((listener) => { if (listener.wheel)
                listener.wheel(e.deltaY); });
        };
        element.addEventListener("mousedown", mouseDown, true);
        element.addEventListener("mousemove", mouseMove, true);
        element.addEventListener("mouseup", mouseUp, true);
        element.addEventListener("wheel", mouseWheel, true);
        element.addEventListener("touchstart", (ev) => {
            if (!this.touch0 || !this.touch1) {
                var touches = ev.changedTouches;
                let nativeTouch = touches.item(0);
                if (!nativeTouch)
                    return;
                let rect = element.getBoundingClientRect();
                let x = nativeTouch.clientX - rect.left;
                let y = nativeTouch.clientY - rect.top;
                let touch = new Touch(nativeTouch.identifier, x, y);
                this.mouseX = x;
                this.mouseY = y;
                this.buttonDown = true;
                if (!this.touch0) {
                    this.touch0 = touch;
                    this.listeners.map((listener) => { if (listener.down)
                        listener.down(touch.x, touch.y); });
                }
                else if (!this.touch1) {
                    this.touch1 = touch;
                    let dx = this.touch1.x - this.touch0.x;
                    let dy = this.touch1.x - this.touch0.x;
                    this.initialPinchDistance = Math.sqrt(dx * dx + dy * dy);
                    this.listeners.map((listener) => { if (listener.zoom)
                        listener.zoom(this.initialPinchDistance, this.initialPinchDistance); });
                }
            }
            ev.preventDefault();
        }, false);
        element.addEventListener("touchmove", (ev) => {
            if (this.touch0) {
                var touches = ev.changedTouches;
                let rect = element.getBoundingClientRect();
                for (var i = 0; i < touches.length; i++) {
                    var nativeTouch = touches[i];
                    let x = nativeTouch.clientX - rect.left;
                    let y = nativeTouch.clientY - rect.top;
                    if (this.touch0.identifier === nativeTouch.identifier) {
                        this.touch0.x = this.mouseX = x;
                        this.touch0.y = this.mouseY = y;
                        this.listeners.map((listener) => { if (listener.dragged)
                            listener.dragged(x, y); });
                    }
                    if (this.touch1 && this.touch1.identifier === nativeTouch.identifier) {
                        this.touch1.x = this.mouseX = x;
                        this.touch1.y = this.mouseY = y;
                    }
                }
                if (this.touch0 && this.touch1) {
                    let dx = this.touch1.x - this.touch0.x;
                    let dy = this.touch1.x - this.touch0.x;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    this.listeners.map((listener) => { if (listener.zoom)
                        listener.zoom(this.initialPinchDistance, distance); });
                }
            }
            ev.preventDefault();
        }, false);
        let touchEnd = (ev) => {
            if (this.touch0) {
                var touches = ev.changedTouches;
                let rect = element.getBoundingClientRect();
                for (var i = 0; i < touches.length; i++) {
                    var nativeTouch = touches[i];
                    let x = nativeTouch.clientX - rect.left;
                    let y = nativeTouch.clientY - rect.top;
                    if (this.touch0.identifier === nativeTouch.identifier) {
                        this.touch0 = null;
                        this.mouseX = x;
                        this.mouseY = y;
                        this.listeners.map((listener) => { if (listener.up)
                            listener.up(x, y); });
                        if (!this.touch1) {
                            this.buttonDown = false;
                            break;
                        }
                        else {
                            this.touch0 = this.touch1;
                            this.touch1 = null;
                            this.mouseX = this.touch0.x;
                            this.mouseX = this.touch0.x;
                            this.buttonDown = true;
                            this.listeners.map((listener) => { if (listener.down)
                                listener.down(this.touch0.x, this.touch0.y); });
                        }
                    }
                    if (this.touch1 && this.touch1.identifier) {
                        this.touch1 = null;
                    }
                }
            }
            ev.preventDefault();
        };
        element.addEventListener("touchend", touchEnd, false);
        element.addEventListener("touchcancel", touchEnd);
    }
    addListener(listener) {
        this.listeners.push(listener);
    }
    removeListener(listener) {
        let idx = this.listeners.indexOf(listener);
        if (idx > -1) {
            this.listeners.splice(idx, 1);
        }
    }
}
export class Touch {
    identifier;
    x;
    y;
    constructor(identifier, x, y) {
        this.identifier = identifier;
        this.x = x;
        this.y = y;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW5wdXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvSW5wdXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsrRUEyQitFO0FBRS9FLE1BQU0sT0FBTyxLQUFLO0lBQ2pCLE9BQU8sQ0FBYztJQUNyQixNQUFNLEdBQUcsQ0FBQyxDQUFDO0lBQ1gsTUFBTSxHQUFHLENBQUMsQ0FBQztJQUNYLFVBQVUsR0FBRyxLQUFLLENBQUM7SUFDbkIsTUFBTSxHQUFpQixJQUFJLENBQUM7SUFDNUIsTUFBTSxHQUFpQixJQUFJLENBQUM7SUFDNUIsb0JBQW9CLEdBQUcsQ0FBQyxDQUFDO0lBQ2pCLFNBQVMsR0FBRyxJQUFJLEtBQUssRUFBaUIsQ0FBQztJQUN2QyxjQUFjLEdBQWtELEVBQUUsQ0FBQztJQUUzRSxZQUFhLE9BQW9CO1FBQ2hDLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUVPLGNBQWMsQ0FBRSxPQUFvQjtRQUMzQyxJQUFJLFNBQVMsR0FBRyxDQUFDLEVBQVcsRUFBRSxFQUFFO1lBQy9CLElBQUksRUFBRSxZQUFZLFVBQVUsRUFBRSxDQUFDO2dCQUM5QixJQUFJLElBQUksR0FBRyxPQUFPLENBQUMscUJBQXFCLEVBQUUsQ0FBQztnQkFDM0MsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7Z0JBQUEsQ0FBQztnQkFDdEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7Z0JBQ3BDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO2dCQUN2QixJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsRUFBRSxFQUFFLEdBQUcsSUFBSSxR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SUFDRztJQUEyQjtJQUFrQjtJQUFqRSxZQUFvQixVQUFrQixFQUFTLENBQVMsRUFBUyxDQUFTO1FBQXRELGVBQVUsR0FBVixVQUFVLENBQVE7UUFBUyxNQUFDLEdBQUQsQ0FBQyxDQUFRO1FBQVMsTUFBQyxHQUFELENBQUMsQ0FBUTtJQUMxRSxDQUFDO0NBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiBTcGluZSBSdW50aW1lcyBMaWNlbnNlIEFncmVlbWVudFxuICogTGFzdCB1cGRhdGVkIEp1bHkgMjgsIDIwMjMuIFJlcGxhY2VzIGFsbCBwcmlvciB2ZXJzaW9ucy5cbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAyMywgRXNvdGVyaWMgU29mdHdhcmUgTExDXG4gKlxuICogSW50ZWdyYXRpb24gb2YgdGhlIFNwaW5lIFJ1bnRpbWVzIGludG8gc29mdHdhcmUgb3Igb3RoZXJ3aXNlIGNyZWF0aW5nXG4gKiBkZXJpdmF0aXZlIHdvcmtzIG9mIHRoZSBTcGluZSBSdW50aW1lcyBpcyBwZXJtaXR0ZWQgdW5kZXIgdGhlIHRlcm1zIGFuZFxuICogY29uZGl0aW9ucyBvZiBTZWN0aW9uIDIgb2YgdGhlIFNwaW5lIEVkaXRvciBMaWNlbnNlIEFncmVlbWVudDpcbiAqIGh0dHA6Ly9lc290ZXJpY3NvZnR3YXJlLmNvbS9zcGluZS1lZGl0b3ItbGljZW5zZVxuICpcbiAqIE90aGVyd2lzZSwgaXQgaXMgcGVybWl0dGVkIHRvIGludGVncmF0ZSB0aGUgU3BpbmUgUnVudGltZXMgaW50byBzb2Z0d2FyZSBvclxuICogb3RoZXJ3aXNlIGNyZWF0ZSBkZXJpdmF0aXZlIHdvcmtzIG9mIHRoZSBTcGluZSBSdW50aW1lcyAoY29sbGVjdGl2ZWx5LFxuICogXCJQcm9kdWN0c1wiKSwgcHJvdmlkZWQgdGhhdCBlYWNoIHVzZXIgb2YgdGhlIFByb2R1Y3RzIG11c3Qgb2J0YWluIHRoZWlyIG93blxuICogU3BpbmUgRWRpdG9yIGxpY2Vuc2UgYW5kIHJlZGlzdHJpYnV0aW9uIG9mIHRoZSBQcm9kdWN0cyBpbiBhbnkgZm9ybSBtdXN0XG4gKiBpbmNsdWRlIHRoaXMgbGljZW5zZSBhbmQgY29weXJpZ2h0IG5vdGljZS5cbiAqXG4gKiBUSEUgU1BJTkUgUlVOVElNRVMgQVJFIFBST1ZJREVEIEJZIEVTT1RFUklDIFNPRlRXQVJFIExMQyBcIkFTIElTXCIgQU5EIEFOWVxuICogRVhQUkVTUyBPUiBJTVBMSUVEIFdBUlJBTlRJRVMsIElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLCBUSEUgSU1QTElFRFxuICogV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFkgQU5EIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFSRVxuICogRElTQ0xBSU1FRC4gSU4gTk8gRVZFTlQgU0hBTEwgRVNPVEVSSUMgU09GVFdBUkUgTExDIEJFIExJQUJMRSBGT1IgQU5ZXG4gKiBESVJFQ1QsIElORElSRUNULCBJTkNJREVOVEFMLCBTUEVDSUFMLCBFWEVNUExBUlksIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFU1xuICogKElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLCBQUk9DVVJFTUVOVCBPRiBTVUJTVElUVVRFIEdPT0RTIE9SIFNFUlZJQ0VTLFxuICogQlVTSU5FU1MgSU5URVJSVVBUSU9OLCBPUiBMT1NTIE9GIFVTRSwgREFUQSwgT1IgUFJPRklUUykgSE9XRVZFUiBDQVVTRUQgQU5EXG4gKiBPTiBBTlkgVEhFT1JZIE9GIExJQUJJTElUWSwgV0hFVEhFUiBJTiBDT05UUkFDVCwgU1RSSUNUIExJQUJJTElUWSwgT1IgVE9SVFxuICogKElOQ0xVRElORyBORUdMSUdFTkNFIE9SIE9USEVSV0lTRSkgQVJJU0lORyBJTiBBTlkgV0FZIE9VVCBPRiBUSEUgVVNFIE9GIFRIRVxuICogU1BJTkUgUlVOVElNRVMsIEVWRU4gSUYgQURWSVNFRCBPRiBUSEUgUE9TU0lCSUxJVFkgT0YgU1VDSCBEQU1BR0UuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmV4cG9ydCBjbGFzcyBJbnB1dCB7XG5cdGVsZW1lbnQ6IEhUTUxFbGVtZW50O1xuXHRtb3VzZVggPSAwO1xuXHRtb3VzZVkgPSAwO1xuXHRidXR0b25Eb3duID0gZmFsc2U7XG5cdHRvdWNoMDogVG91Y2ggfCBudWxsID0gbnVsbDtcblx0dG91Y2gxOiBUb3VjaCB8IG51bGwgPSBudWxsO1xuXHRpbml0aWFsUGluY2hEaXN0YW5jZSA9IDA7XG5cdHByaXZhdGUgbGlzdGVuZXJzID0gbmV3IEFycmF5PElucHV0TGlzdGVuZXI+KCk7XG5cdHByaXZhdGUgZXZlbnRMaXN0ZW5lcnM6IEFycmF5PHsgdGFyZ2V0OiBhbnksIGV2ZW50OiBhbnksIGZ1bmM6IGFueSB9PiA9IFtdO1xuXG5cdGNvbnN0cnVjdG9yIChlbGVtZW50OiBIVE1MRWxlbWVudCkge1xuXHRcdHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XG5cdFx0dGhpcy5zZXR1cENhbGxiYWNrcyhlbGVtZW50KTtcblx0fVxuXG5cdHByaXZhdGUgc2V0dXBDYWxsYmFja3MgKGVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XG5cdFx0bGV0IG1vdXNlRG93biA9IChldjogVUlFdmVudCkgPT4ge1xuXHRcdFx0aWYgKGV2IGluc3RhbmNlb2YgTW91c2VFdmVudCkge1xuXHRcdFx0XHRsZXQgcmVjdCA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdFx0XHRcdHRoaXMubW91c2VYID0gZXYuY2xpZW50WCAtIHJlY3QubGVmdDs7XG5cdFx0XHRcdHRoaXMubW91c2VZID0gZXYuY2xpZW50WSAtIHJlY3QudG9wO1xuXHRcdFx0XHR0aGlzLmJ1dHRvbkRvd24gPSB0cnVlO1xuXHRcdFx0XHR0aGlzLmxpc3RlbmVycy5tYXAoKGxpc3RlbmVyKSA9PiB7IGlmIChsaXN0ZW5lci5kb3duKSBsaXN0ZW5lci5kb3duKHRoaXMubW91c2VYLCB0aGlzLm1vdXNlWSk7IH0pO1xuXG5cdFx0XHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgbW91c2VNb3ZlKTtcblx0XHRcdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgbW91c2VVcCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0bGV0IG1vdXNlTW92ZSA9IChldjogVUlFdmVudCkgPT4ge1xuXHRcdFx0aWYgKGV2IGluc3RhbmNlb2YgTW91c2VFdmVudCkge1xuXHRcdFx0XHRsZXQgcmVjdCA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdFx0XHRcdHRoaXMubW91c2VYID0gZXYuY2xpZW50WCAtIHJlY3QubGVmdDs7XG5cdFx0XHRcdHRoaXMubW91c2VZID0gZXYuY2xpZW50WSAtIHJlY3QudG9wO1xuXG5cdFx0XHRcdHRoaXMubGlzdGVuZXJzLm1hcCgobGlzdGVuZXIpID0+IHtcblx0XHRcdFx0XHRpZiAodGhpcy5idXR0b25Eb3duKSB7XG5cdFx0XHRcdFx0XHRpZiAobGlzdGVuZXIuZHJhZ2dlZCkgbGlzdGVuZXIuZHJhZ2dlZCh0aGlzLm1vdXNlWCwgdGhpcy5tb3VzZVkpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRpZiAobGlzdGVuZXIubW92ZWQpIGxpc3RlbmVyLm1vdmVkKHRoaXMubW91c2VYLCB0aGlzLm1vdXNlWSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0bGV0IG1vdXNlVXAgPSAoZXY6IFVJRXZlbnQpID0+IHtcblx0XHRcdGlmIChldiBpbnN0YW5jZW9mIE1vdXNlRXZlbnQpIHtcblx0XHRcdFx0bGV0IHJlY3QgPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHRcdFx0XHR0aGlzLm1vdXNlWCA9IGV2LmNsaWVudFggLSByZWN0LmxlZnQ7O1xuXHRcdFx0XHR0aGlzLm1vdXNlWSA9IGV2LmNsaWVudFkgLSByZWN0LnRvcDtcblx0XHRcdFx0dGhpcy5idXR0b25Eb3duID0gZmFsc2U7XG5cdFx0XHRcdHRoaXMubGlzdGVuZXJzLm1hcCgobGlzdGVuZXIpID0+IHsgaWYgKGxpc3RlbmVyLnVwKSBsaXN0ZW5lci51cCh0aGlzLm1vdXNlWCwgdGhpcy5tb3VzZVkpOyB9KTtcblxuXHRcdFx0XHRkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIG1vdXNlTW92ZSk7XG5cdFx0XHRcdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIG1vdXNlVXApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGxldCBtb3VzZVdoZWVsID0gKGU6IFdoZWVsRXZlbnQpID0+IHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdGxldCBkZWx0YVkgPSBlLmRlbHRhWTtcblx0XHRcdGlmIChlLmRlbHRhTW9kZSA9PSBXaGVlbEV2ZW50LkRPTV9ERUxUQV9MSU5FKSBkZWx0YVkgKj0gODtcblx0XHRcdGlmIChlLmRlbHRhTW9kZSA9PSBXaGVlbEV2ZW50LkRPTV9ERUxUQV9QQUdFKSBkZWx0YVkgKj0gMjQ7XG5cdFx0XHR0aGlzLmxpc3RlbmVycy5tYXAoKGxpc3RlbmVyKSA9PiB7IGlmIChsaXN0ZW5lci53aGVlbCkgbGlzdGVuZXIud2hlZWwoZS5kZWx0YVkpOyB9KTtcblx0XHR9O1xuXG5cdFx0ZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIG1vdXNlRG93biwgdHJ1ZSk7XG5cdFx0ZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIG1vdXNlTW92ZSwgdHJ1ZSk7XG5cdFx0ZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCBtb3VzZVVwLCB0cnVlKTtcblx0XHRlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJ3aGVlbFwiLCBtb3VzZVdoZWVsLCB0cnVlKTtcblxuXG5cdFx0ZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hzdGFydFwiLCAoZXY6IFRvdWNoRXZlbnQpID0+IHtcblx0XHRcdGlmICghdGhpcy50b3VjaDAgfHwgIXRoaXMudG91Y2gxKSB7XG5cdFx0XHRcdHZhciB0b3VjaGVzID0gZXYuY2hhbmdlZFRvdWNoZXM7XG5cdFx0XHRcdGxldCBuYXRpdmVUb3VjaCA9IHRvdWNoZXMuaXRlbSgwKTtcblx0XHRcdFx0aWYgKCFuYXRpdmVUb3VjaCkgcmV0dXJuO1xuXHRcdFx0XHRsZXQgcmVjdCA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdFx0XHRcdGxldCB4ID0gbmF0aXZlVG91Y2guY2xpZW50WCAtIHJlY3QubGVmdDtcblx0XHRcdFx0bGV0IHkgPSBuYXRpdmVUb3VjaC5jbGllbnRZIC0gcmVjdC50b3A7XG5cdFx0XHRcdGxldCB0b3VjaCA9IG5ldyBUb3VjaChuYXRpdmVUb3VjaC5pZGVudGlmaWVyLCB4LCB5KTtcblx0XHRcdFx0dGhpcy5tb3VzZVggPSB4O1xuXHRcdFx0XHR0aGlzLm1vdXNlWSA9IHk7XG5cdFx0XHRcdHRoaXMuYnV0dG9uRG93biA9IHRydWU7XG5cblx0XHRcdFx0aWYgKCF0aGlzLnRvdWNoMCkge1xuXHRcdFx0XHRcdHRoaXMudG91Y2gwID0gdG91Y2g7XG5cdFx0XHRcdFx0dGhpcy5saXN0ZW5lcnMubWFwKChsaXN0ZW5lcikgPT4geyBpZiAobGlzdGVuZXIuZG93bikgbGlzdGVuZXIuZG93bih0b3VjaC54LCB0b3VjaC55KSB9KVxuXHRcdFx0XHR9IGVsc2UgaWYgKCF0aGlzLnRvdWNoMSkge1xuXHRcdFx0XHRcdHRoaXMudG91Y2gxID0gdG91Y2g7XG5cdFx0XHRcdFx0bGV0IGR4ID0gdGhpcy50b3VjaDEueCAtIHRoaXMudG91Y2gwLng7XG5cdFx0XHRcdFx0bGV0IGR5ID0gdGhpcy50b3VjaDEueCAtIHRoaXMudG91Y2gwLng7XG5cdFx0XHRcdFx0dGhpcy5pbml0aWFsUGluY2hEaXN0YW5jZSA9IE1hdGguc3FydChkeCAqIGR4ICsgZHkgKiBkeSk7XG5cdFx0XHRcdFx0dGhpcy5saXN0ZW5lcnMubWFwKChsaXN0ZW5lcikgPT4geyBpZiAobGlzdGVuZXIuem9vbSkgbGlzdGVuZXIuem9vbSh0aGlzLmluaXRpYWxQaW5jaERpc3RhbmNlLCB0aGlzLmluaXRpYWxQaW5jaERpc3RhbmNlKSB9KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0ZXYucHJldmVudERlZmF1bHQoKTtcblx0XHR9LCBmYWxzZSk7XG5cblx0XHRlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaG1vdmVcIiwgKGV2OiBUb3VjaEV2ZW50KSA9PiB7XG5cdFx0XHRpZiAodGhpcy50b3VjaDApIHtcblx0XHRcdFx0dmFyIHRvdWNoZXMgPSBldi5jaGFuZ2VkVG91Y2hlcztcblx0XHRcdFx0bGV0IHJlY3QgPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHRvdWNoZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHR2YXIgbmF0aXZlVG91Y2ggPSB0b3VjaGVzW2ldO1xuXHRcdFx0XHRcdGxldCB4ID0gbmF0aXZlVG91Y2guY2xpZW50WCAtIHJlY3QubGVmdDtcblx0XHRcdFx0XHRsZXQgeSA9IG5hdGl2ZVRvdWNoLmNsaWVudFkgLSByZWN0LnRvcDtcblxuXHRcdFx0XHRcdGlmICh0aGlzLnRvdWNoMC5pZGVudGlmaWVyID09PSBuYXRpdmVUb3VjaC5pZGVudGlmaWVyKSB7XG5cdFx0XHRcdFx0XHR0aGlzLnRvdWNoMC54ID0gdGhpcy5tb3VzZVggPSB4O1xuXHRcdFx0XHRcdFx0dGhpcy50b3VjaDAueSA9IHRoaXMubW91c2VZID0geTtcblx0XHRcdFx0XHRcdHRoaXMubGlzdGVuZXJzLm1hcCgobGlzdGVuZXIpID0+IHsgaWYgKGxpc3RlbmVyLmRyYWdnZWQpIGxpc3RlbmVyLmRyYWdnZWQoeCwgeSkgfSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICh0aGlzLnRvdWNoMSAmJiB0aGlzLnRvdWNoMS5pZGVudGlmaWVyID09PSBuYXRpdmVUb3VjaC5pZGVudGlmaWVyKSB7XG5cdFx0XHRcdFx0XHR0aGlzLnRvdWNoMS54ID0gdGhpcy5tb3VzZVggPSB4O1xuXHRcdFx0XHRcdFx0dGhpcy50b3VjaDEueSA9IHRoaXMubW91c2VZID0geTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHRoaXMudG91Y2gwICYmIHRoaXMudG91Y2gxKSB7XG5cdFx0XHRcdFx0bGV0IGR4ID0gdGhpcy50b3VjaDEueCAtIHRoaXMudG91Y2gwLng7XG5cdFx0XHRcdFx0bGV0IGR5ID0gdGhpcy50b3VjaDEueCAtIHRoaXMudG91Y2gwLng7XG5cdFx0XHRcdFx0bGV0IGRpc3RhbmNlID0gTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5KTtcblx0XHRcdFx0XHR0aGlzLmxpc3RlbmVycy5tYXAoKGxpc3RlbmVyKSA9PiB7IGlmIChsaXN0ZW5lci56b29tKSBsaXN0ZW5lci56b29tKHRoaXMuaW5pdGlhbFBpbmNoRGlzdGFuY2UsIGRpc3RhbmNlKSB9KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0ZXYucHJldmVudERlZmF1bHQoKTtcblx0XHR9LCBmYWxzZSk7XG5cblx0XHRsZXQgdG91Y2hFbmQgPSAoZXY6IFRvdWNoRXZlbnQpID0+IHtcblx0XHRcdGlmICh0aGlzLnRvdWNoMCkge1xuXHRcdFx0XHR2YXIgdG91Y2hlcyA9IGV2LmNoYW5nZWRUb3VjaGVzO1xuXHRcdFx0XHRsZXQgcmVjdCA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cblx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0b3VjaGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0dmFyIG5hdGl2ZVRvdWNoID0gdG91Y2hlc1tpXTtcblx0XHRcdFx0XHRsZXQgeCA9IG5hdGl2ZVRvdWNoLmNsaWVudFggLSByZWN0LmxlZnQ7XG5cdFx0XHRcdFx0bGV0IHkgPSBuYXRpdmVUb3VjaC5jbGllbnRZIC0gcmVjdC50b3A7XG5cblx0XHRcdFx0XHRpZiAodGhpcy50b3VjaDAuaWRlbnRpZmllciA9PT0gbmF0aXZlVG91Y2guaWRlbnRpZmllcikge1xuXHRcdFx0XHRcdFx0dGhpcy50b3VjaDAgPSBudWxsO1xuXHRcdFx0XHRcdFx0dGhpcy5tb3VzZVggPSB4O1xuXHRcdFx0XHRcdFx0dGhpcy5tb3VzZVkgPSB5O1xuXHRcdFx0XHRcdFx0dGhpcy5saXN0ZW5lcnMubWFwKChsaXN0ZW5lcikgPT4geyBpZiAobGlzdGVuZXIudXApIGxpc3RlbmVyLnVwKHgsIHkpIH0pO1xuXG5cdFx0XHRcdFx0XHRpZiAoIXRoaXMudG91Y2gxKSB7XG5cdFx0XHRcdFx0XHRcdHRoaXMuYnV0dG9uRG93biA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHRoaXMudG91Y2gwID0gdGhpcy50b3VjaDE7XG5cdFx0XHRcdFx0XHRcdHRoaXMudG91Y2gxID0gbnVsbDtcblx0XHRcdFx0XHRcdFx0dGhpcy5tb3VzZVggPSB0aGlzLnRvdWNoMC54O1xuXHRcdFx0XHRcdFx0XHR0aGlzLm1vdXNlWCA9IHRoaXMudG91Y2gwLng7XG5cdFx0XHRcdFx0XHRcdHRoaXMuYnV0dG9uRG93biA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdHRoaXMubGlzdGVuZXJzLm1hcCgobGlzdGVuZXIpID0+IHsgaWYgKGxpc3RlbmVyLmRvd24pIGxpc3RlbmVyLmRvd24odGhpcy50b3VjaDAhLngsIHRoaXMudG91Y2gwIS55KSB9KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAodGhpcy50b3VjaDEgJiYgdGhpcy50b3VjaDEuaWRlbnRpZmllcikge1xuXHRcdFx0XHRcdFx0dGhpcy50b3VjaDEgPSBudWxsO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0ZXYucHJldmVudERlZmF1bHQoKTtcblx0XHR9O1xuXHRcdGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsIHRvdWNoRW5kLCBmYWxzZSk7XG5cdFx0ZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hjYW5jZWxcIiwgdG91Y2hFbmQpO1xuXHR9XG5cblx0YWRkTGlzdGVuZXIgKGxpc3RlbmVyOiBJbnB1dExpc3RlbmVyKSB7XG5cdFx0dGhpcy5saXN0ZW5lcnMucHVzaChsaXN0ZW5lcik7XG5cdH1cblxuXHRyZW1vdmVMaXN0ZW5lciAobGlzdGVuZXI6IElucHV0TGlzdGVuZXIpIHtcblx0XHRsZXQgaWR4ID0gdGhpcy5saXN0ZW5lcnMuaW5kZXhPZihsaXN0ZW5lcik7XG5cdFx0aWYgKGlkeCA+IC0xKSB7XG5cdFx0XHR0aGlzLmxpc3RlbmVycy5zcGxpY2UoaWR4LCAxKTtcblx0XHR9XG5cdH1cbn1cblxuZXhwb3J0IGNsYXNzIFRvdWNoIHtcblx0Y29uc3RydWN0b3IgKHB1YmxpYyBpZGVudGlmaWVyOiBudW1iZXIsIHB1YmxpYyB4OiBudW1iZXIsIHB1YmxpYyB5OiBudW1iZXIpIHtcblx0fVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIElucHV0TGlzdGVuZXIge1xuXHRkb3duPyh4OiBudW1iZXIsIHk6IG51bWJlcik6IHZvaWQ7XG5cdHVwPyh4OiBudW1iZXIsIHk6IG51bWJlcik6IHZvaWQ7XG5cdG1vdmVkPyh4OiBudW1iZXIsIHk6IG51bWJlcik6IHZvaWQ7XG5cdGRyYWdnZWQ/KHg6IG51bWJlciwgeTogbnVtYmVyKTogdm9pZDtcblx0d2hlZWw/KGRlbHRhOiBudW1iZXIpOiB2b2lkO1xuXHR6b29tPyhpbml0aWFsRGlzdGFuY2U6IG51bWJlciwgZGlzdGFuY2U6IG51bWJlcik6IHZvaWQ7XG59XG4iXX0=