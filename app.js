let canvas = document.querySelector('canvas');
let context = canvas.getContext('2d');


let html = document.querySelector('html')
let body = document.querySelector('body')
canvas.width = 2000;
canvas.height = 2000;
let cnvWidth = canvas.width
let cnvHeight = canvas.height

let radius = 40;
let y = 50

class Node {
    element;
    x;
    y;
    children;
    parent;
    isActive;
    constructor(element, parent = null) {
        this.element = element;
        this.children = [];
        this.parent = parent;
        this.isActive = true;
    }
}

let arr = new Array()
let layer = 0;
let path
let bodyNode = new Node(document)


nodesToArr(bodyNode)
console.log(arr)

drawTree()



function nodesToArr(node) {
    if (arr.length < layer + 1) {
        arr[layer] = new Array();
    }
    for (let i = 0; i < node.element.childNodes.length; i++) {
        if (
            node.element.childNodes[i].nodeType === 3 &&
            node.element.childNodes[i].nodeValue.trim() === ""
        ) {
            continue;
        }
        if (
            node.element.childNodes[i].nodeType === 1 ||
            node.element.childNodes[i].nodeType === 3
        ) {
            const element = new Node(node.element.childNodes[i], node);
            if (element.element.childNodes.length > 0) {
                layer++;
                nodesToArr(element);
                layer--;
            }
            arr[layer].push(element);
        }
    }
}


function drawTree() {
    for (let i = 0; i < arr.length; i++) {
        y += 150;
        for (let j = 0; j < arr[i].length; j++) {
            let x = cnvWidth * (j + 1) / (arr[i].length + 1)
            const eleNode = arr[i][j];
            eleNode.x = x;
            eleNode.y = y
            context.beginPath();
            context.fillStyle = 'black';
            context.font = "14px Arial";
            if (eleNode.element.nodeType === 3) {
                context.fillRect(x - radius, y - radius / 2, radius * 3, radius);
                context.fillStyle = 'White';
                let text = (eleNode.element.textContent.length >= 10) ? eleNode.element.textContent.substring(0, 10) + "..." : eleNode.element.textContent;
                context.fillText(text, eleNode.x, eleNode.y);

            } else {
                context.arc(x, y, radius, radius, 0, 2 * Math.PI, false);
                context.fill();
                context.closePath();
                const nodeName = eleNode.element.tagName;
                context.fillStyle = 'White';
                context.textAlign = 'center';
                context.fillText(nodeName, eleNode.x, eleNode.y);
                context.fillStyle = (eleNode.isActive) ? 'green' : 'red';
                context.rect(x - radius * 1.35, y, 15, 15);
                context.fillText(eleNode.isActive ? "+" : "-", x - radius * 1.35 + 7, y + 10);
            }



            // Line Drawing
            context.moveTo(eleNode.parent.x, eleNode.parent.y);
            context.lineTo(eleNode.x, eleNode.y);
            context.stroke();



        }
    }


}