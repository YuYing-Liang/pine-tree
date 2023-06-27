import { degToRad } from "three/src/math/MathUtils";
import { Cylinder } from "./cylinder";
import { Scene } from "three";

const RADIUS = 2.5;
const ANGLE_SPACING = degToRad(180); // degToRad(360) / numBranches;
const BSF = 2; // branch spacing factor

export const generateTree = (scene: Scene, depth: number, numBranches: number, angle: number) => {
    if (depth < 0) return;

    const base = new Cylinder(depth, numBranches, getBranchSpacing(depth) * numBranches, RADIUS);
    scene.add(base);

    for (let branchNum = 0; branchNum < numBranches; branchNum++) {
        generateBranch(base, depth - 1, numBranches, angle, branchNum);
    }

    return base;
};

export const generateBranch = (
    parent: Cylinder,
    depth: number,
    numBranches: number,
    angle: number,
    index: number,
    minDepth: number = 0
) => {
    if (depth < minDepth) return;

    const branch = new Cylinder(
        depth,
        depth === 0 ? 0 : numBranches,
        getBranchSpacing(depth) * numBranches,
        RADIUS
    );
    parent.add(branch);

    branch.rotateZ(parent.angleToParent);
    branch.rotateZGeom(angle);

    // transformations to disperse branches
    branch.rotateY(ANGLE_SPACING * index);
    branch.translateY(getBranchSpacing(depth + 1) * index);

    for (let branchNum = 0; branchNum < numBranches; branchNum++) {
        generateBranch(branch, depth - 1, numBranches, angle, branchNum, minDepth);
    }
};

export const getBranchSpacing = (depth: number) => {
    return RADIUS * (depth === 0 ? 1 : depth * Math.pow(BSF, depth));
};

export const animateTree = (branch: Cylinder, depthLevel: number | null = null) => {
    if (branch.depth === depthLevel || depthLevel === null) branch.animate();
    branch.children.forEach((child) => {
        animateTree(child, depthLevel);
    });
};

export const removeTree = (branch: Cylinder) => {
    branch.parent?.removeFromParent();
    branch.children.forEach((child) => {
        removeTree(child);
    });
};
