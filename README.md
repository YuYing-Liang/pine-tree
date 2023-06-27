## Vention Coding Challenge: Fractal Tree

This repository creates a fractal-like pine tree structure with Three.js

### How to run code
This repository uses `vite` so have `npm` installed.In the root folder run `npm install` and then `npx vite`. This will open the application locally on http://127.0.0.1:5173/.

### Code Description
All Three.js related code is in the `scripts` folder.

`cylinder.ts` has the class that holds all functions related to rendering the 3D cylinder used as the "branches" in the tree structure.

`events.ts` holds all the event listener functions (mainly clicking/hovering on the 3D elements in the scene).

`tree.ts` has the recursive functions for creating the tree.

`main.ts` combines all of the above functions/files and is the typescript file used in `index.html`

### How to change code
After the application loads, you'll see a tree with 4 branches with a branching depth of 3. To change this initial tree structure see `line 57` in `main.ts`. Here, the function `generateTree(scene, depth, numBranches, angle)` is called where you can change the default depth, number of branches and angle parameters (note that the depth parameter starts at 0 so a branching depth of 3 would be 2 in the code).

You can click on a branch to add another child branch to the tree. If you click on a branch with the highest depth (e.g. a grandchild branch), the tree will grow to make room for more branches.

The `animate` button will start/stop branches from rotating about the axis defined by their parent branch. You can change the speed of rotation in `cylinder.ts line 5`.

The `reset` button puts the tree back to its original state.
