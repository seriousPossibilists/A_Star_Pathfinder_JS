const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let openList = [];
let closedList = [];
let arrWalkables = [];
let width = 300;
let height = 300;

class Node {
    constructor(x, y, gCost, hCost) {
        this.x = x;
        this.y = y;
        this.gCost = gCost;
        this.hCost = hCost;
    }

    getfCost()
    {
        return this.gCost + this.hCost;
    }
}

//Grid generation
function main() {
    canvas.width = width;
    canvas.height = height;
    let start = new Node(0, 0, 0, 0) //Start node coordinates
    openList.push(start);
    for (let x = 0; x < width; x += 10) {
        for (let y = 0; y < height; y += 10) {
            //Start node
            if (x == 0 && y == 0) { ctx.fillStyle = "red"; ctx.fillRect(x, y, 10, 10); arrWalkables.push([x, y, true]) }
            // Ending node
            else if (x == (width - 10) && y == (height - 10)) { ctx.fillStyle = "red"; ctx.fillRect(x, y, 10, 10); arrWalkables.push([x, y, true]) }
            else { ctx.fillStyle = "black" }
            if (Math.floor(Math.random() * 7) > 4)
            {
                arrWalkables.push([x, y, false]);
                ctx.fillRect(x, y, 10, 10);
            }
            else{
                arrWalkables.push([x, y, true]);
            }   
        }
    }
    document.addEventListener("keydown", A_Star);
}

function findLowestfCost() {
    let lowestCostNode = openList[0];
    for (let i = 0; i < openList.length; i++) {
        if (openList[i].getfCost() < lowestCostNode.getfCost()) {
            lowestCostNode = openList[i];
        }
    }
    return lowestCostNode;
}

function drawChildren(arr) {
    for (let i = 0; i < arr.length; i++) {
        ctx.fillStyle = "blue";
        ctx.fillRect(arr[i].x, arr[i].y, 10, 10)
    }
}

function isInClosedList(node) {
    for (let i = 0; i < closedList.length; i++) {
        if (closedList[i].x === node.x && closedList[i].y === node.y) {
            return true;
        }
    }
    return false;
}

// Function to check if a node is in the open list
function isInOpenList(node) {
    for (let i = 0; i < openList.length; i++) {
        if (openList[i].x === node.x && openList[i].y === node.y) {
            return true;
        }
    }
    return false;
}

function isWalkable(x,y) {
    for(let i = 0; i < arrWalkables.length; i++)
    {
        if(arrWalkables[i][0] == x && arrWalkables[i][1] == y)
        {
            return arrWalkables[i][2]
        }
    }
    return false;
}

function A_Star() {
    while(openList.length > 0)
    {
        let currentNode = findLowestfCost();
        openList = openList.filter(node => !(node.x === currentNode.x && node.y === currentNode.y));
        closedList.push(currentNode);

        if (currentNode.x == 190 && currentNode.y == 190) {
            console.log("Goal found");
            return;
        }; //Backtrack here

        let children = [];
        // Pushing children, add checks
        let newChild;
        if (currentNode.x < (width - 10) && isWalkable(currentNode.x + 10, currentNode.y)) {
            newChild = new Node(currentNode.x + 10, currentNode.y);
            children.push(newChild);
        }
        if (currentNode.x > 0 && isWalkable(currentNode.x - 10, currentNode.y)) {
            newChild = new Node(currentNode.x - 10, currentNode.y);
            children.push(newChild);
        }
        if (currentNode.y > 0 && isWalkable(currentNode.x, currentNode.y - 10)) {
            newChild = new Node(currentNode.x, currentNode.y - 10);
            children.push(newChild);
        }
        if (currentNode.y < (height - 10) && isWalkable(currentNode.x, currentNode.y + 10)) {
            newChild = new Node(currentNode.x, currentNode.y + 10);
            children.push(newChild);
        }
        children.forEach(child => {
            // Skip if in closed list
            if (isInClosedList(child)) {
                return;
            }

            // Calculate gCost (cost from start)
            child.gCost = currentNode.gCost + 10; // Assuming uniform cost for each step (10 units)

            // Calculate hCost (heuristic cost to end)
            child.hCost = Math.abs(190 - child.x) + Math.abs(190 - child.y);

            // If already in open list with higher gCost, skip
            if (isInOpenList(child)) {
                let existingNode = openList.find(node => node.x === child.x && node.y === child.y);
                if (child.gCost >= existingNode.gCost) {
                    return;
                }
            }

            // Add to open list or update if already present with lower gCost
            drawChildren(children);
            openList.push(child);
        });
    }
    console.log("No path found");
}
