import { Cylinder } from "./cylinder";

// GLOBALS
let width = 0;
let height = 0;
let intersectingObjects: THREE.Intersection<THREE.Object3D | Cylinder>[] = [];
let hoveredObjects = {};
let isAnimating = false;

const responsive = (camera: THREE.PerspectiveCamera) => {
    width = window.innerWidth;
    height = window.innerHeight;
    camera.updateProjectionMatrix();
};

const onPointerMove = (
    e: MouseEvent,
    camera: THREE.PerspectiveCamera,
    scene: THREE.Scene,
    mouse: THREE.Vector2,
    raycaster: THREE.Raycaster,
) => {
    mouse.set((e.clientX / width) * 2 - 1, -(e.clientY / height) * 2 + 1);
    raycaster.setFromCamera(mouse, camera);
    intersectingObjects = raycaster.intersectObjects(scene.children, true);

    Object.keys(hoveredObjects).forEach((key) => {
        const obj = intersectingObjects.find((obj) => obj.object.uuid === key);
        if (obj === undefined) {
            const hoveredItem = hoveredObjects[key];
            if (hoveredItem.object instanceof Cylinder) hoveredItem.object.onPointerOut(hoveredItem);
            delete hoveredObjects[key];
        }
    });

    intersectingObjects.forEach((obj) => {
        if (!hoveredObjects[obj.object.uuid]) {
            hoveredObjects[obj.object.uuid] = obj;
            if (obj.object instanceof Cylinder) {
                obj.object.onPointerOver(obj);
            }
        }
    });
};

const onClickScene = (e: MouseEvent) => {
    e.preventDefault();
    intersectingObjects.forEach((hoveredItem) => {
        if (hoveredItem.object instanceof Cylinder) hoveredItem.object.onClick();
    });
};

const setAnimate = (animationStatus: boolean) => (isAnimating = animationStatus);
const getAnimateStatus = () => isAnimating;

export {
    onPointerMove,
    onClickScene,
    responsive,
    setAnimate,
    getAnimateStatus,
};
