import * as THREE from "three";
import { generateBranch, getBranchSpacing } from "./tree";

const ROTATION_AXIS = new THREE.Vector3(0, 1, 0); // local y-axis
const ANIMATION_SPEED = 0.025;
const DEFAULT_COLOR = 0x0095dd;
const HIGHLIGHT_COLOR = 0xff0000;

class Cylinder extends THREE.Mesh {
    geometry: THREE.CylinderGeometry;
    material: THREE.MeshStandardMaterial;
    children: Cylinder[] = [];
    active: boolean;
    color: number;
    depth: number;
    angleToParent: number;
    initNumChildren: number;
    rotationAngle: number;

    constructor(
        depth: number,
        initNumChildren: number,
        height = 1,
        radius = 0.1,
        color = DEFAULT_COLOR
    ) {
        super();
        this.color = color;
        this.initGeometry(radius, height);
        this.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(color).convertSRGBToLinear(),
        });
        this.depth = depth;
        this.angleToParent = 0;
        this.initNumChildren = initNumChildren;
        this.rotationAngle = 0;
    }

    rotateZGeom(angle: number) {
        this.geometry.rotateZ(angle);
        this.angleToParent = angle;
    }

    animate() {
        const randomness = Math.random() * 0.05
        this.rotateOnAxis(ROTATION_AXIS, (ANIMATION_SPEED + randomness)/(this.depth + 1));
    }

    onPointerOver(e: any) {
        this.material.color.set(HIGHLIGHT_COLOR);
        this.material.color.convertSRGBToLinear();
    }

    onPointerOut(e: any) {
        this.material.color.set(this.color);
        this.material.color.convertSRGBToLinear();
    }

    onClick() {
        if (this.children.length <= 0 && this.depth <= 0) {
            // increase tree size
            const root = this.getRoot();
            root.depth += 1;
            root.lengthen();
            this.lengthenAndTranslateChildren(root);
        }
        generateBranch(
            this,
            this.depth - 1,
            this.initNumChildren,
            (this.children.length ? this.children[0] : this).angleToParent,
            this.children.length,
            this.depth - 1
        );
        if (this.children.length >= this.initNumChildren) this.lengthen();
    }

    private initGeometry(radius: number, height: number) {
        this.geometry = new THREE.CylinderGeometry(radius, radius, height, 32);
        // translate origin to bottom of cylinder
        this.geometry.translate(0, this.geometry.parameters.height / 2, 0);
    }

    private lengthen(numChildren: number = this.children.length) {
        const radius = this.geometry.parameters.radiusTop;
        this.geometry.dispose();
        this.initGeometry(radius, getBranchSpacing(this.depth) * numChildren);
        this.geometry.rotateZ(this.angleToParent);
    }

    private getRoot() {
        if (this.parent instanceof Cylinder) return this.parent?.getRoot();
        else return this;
    }

    private lengthenAndTranslateChildren(parent: Cylinder) {
        if (parent.children.length <= 0) return;
        parent.children.forEach((child, index) => {
            const childrenAmt = child.children.length || parent.children.length;
            child.depth += 1;
            child.lengthen(childrenAmt);
            child.translateY(getBranchSpacing(child.depth + 1) * index - child.position.y);
            child.initNumChildren = childrenAmt;
            this.lengthenAndTranslateChildren(child);
        });
    }
}

export { Cylinder };
