let canvas = document.querySelector('canvas');
let context = canvas.getContext('2d');

let html = document.querySelector('html');
let body = document.querySelector('body');
canvas.width = 2000;
canvas.height = 2000;
let cnvWidth = canvas.width;
let cnvHeight = canvas.height;

let radius = 40;
let y = 50;

class Node {
    element;
    x;
    y;
    children;
    parent;
    isVisible;
    isCollapse;
    hasAttr;
    constructor(element, parent = null) {
        this.element = element;
        this.children = [];
        this.parent = parent;
        this.isVisible = true;
        this.isCollapse = false;
        this.hasAttr = false;
    }
}

let arr = new Array();
let layer = 0;
let path;
let bodyNode = new Node(document);

nodesToArr(bodyNode);

drawTree();

console.log(arr);

function nodesToArr(node) {
    if (arr.length < layer + 1) {
        arr[layer] = new Array();
    }
    for (let i = 0; i < node.element.childNodes.length; i++) {
        if (
            node.element.childNodes[i].nodeType === 3 &&
            node.element.childNodes[i].nodeValue.trim() === ''
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
            let x = (cnvWidth * (j + 1)) / (arr[i].length + 1);
            const eleNode = arr[i][j];
            arr[i][j].parent.children.push(arr[i][j]);
            eleNode.x = x;
            eleNode.y = y;
            if (!eleNode.parent.isVisible || eleNode.isCollapse) {
                continue;
            }

            context.beginPath();
            context.fillStyle = 'black';
            context.font = '14px Arial';
            if (eleNode.element.nodeType === 3) {
                context.fillRect(x - radius, y - radius / 2, radius * 3, radius);
                context.fillStyle = 'White';
                let text =
                    eleNode.element.textContent.length >= 10 ?
                    eleNode.element.textContent.substring(0, 10) + '...' :
                    eleNode.element.textContent;
                context.fillText(text, eleNode.x, eleNode.y);
            } else {
                context.arc(x, y, radius, radius, 0, 2 * Math.PI, false);
                context.fill();
                context.closePath();
                const nodeName = eleNode.element.tagName;
                context.fillStyle = 'White';
                context.textAlign = 'center';
                context.fillText(nodeName, eleNode.x, eleNode.y);
                // Draw show and hide children rect
                context.fillStyle = eleNode.isVisible ? 'green' : 'red';
                context.rect(x - radius * 1.35, y, 15, 15);
                context.fillText(
                    eleNode.isVisible ? '+' : '-',
                    x - radius * 1.35 + 7,
                    y + 10
                );

                //
                if (eleNode.element.attributes.length) {
                    eleNode.hasAttr = true;
                    context.fillStyle = 'black';
                    context.rect(x - 10, y + 40, 25, 15);
                    context.fillText('...', x, y + 50);
                    context.closePath();
                }
            }

            // Line Drawing
            context.moveTo(eleNode.parent.x, eleNode.parent.y);
            context.lineTo(eleNode.x, eleNode.y);
            context.stroke();
            // console.log(eleNode.parent.children)
        }
    }
}

canvas.addEventListener('click', (e) => {
    contains(e.offsetX, e.offsetY);
});

function contains(ClickX, ClickY) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
            const eleNode = arr[i][j];
            //for showing and hiding children
            let marginX = eleNode.x - radius * 1.35 + 15;
            let marginY = eleNode.y + 10;

            // for showing and hiding attributes
            let marginXAttr = eleNode.x - 10;
            let marginYAttr = eleNode.y + 40;
            // console.log(marginY)
            if (
                ClickX <= marginX &&
                ClickX >= marginX - 15 &&
                ClickY - 5 <= marginY &&
                ClickY >= marginY - 10
            ) {
                eleNode.isVisible = !eleNode.isVisible;
                if (!eleNode.isVisible) {
                    hide(eleNode);
                } else {
                    show(eleNode);
                }
                context.clearRect(0, 0, cnvWidth, cnvWidth);
                y = 50;
                drawTree();
            }

            if (
                ClickX <= marginXAttr + 30 &&
                ClickX >= marginXAttr &&
                ClickY - 15 <= marginYAttr &&
                ClickY >= marginYAttr &&
                eleNode.hasAttr
            ) {
                createAttrRect(eleNode);
            }
        }
    }
}

function hide(eleNode) {
    for (const child of eleNode.children) {
        child.isCollapse = true;
        hide(child);
    }
}

function show(eleNode) {
    if (!eleNode.isVisible) {
        return;
    }
    for (const child of eleNode.children) {
        child.isCollapse = false;
        show(child);
    }
}

function createAttrRect(eleNode) {
    context.clearRect(0, 0, cnvWidth, cnvWidth);
    y = 50;
    drawTree();
    let attrStr = '';
    let attr = eleNode.element.attributes;
    for (let i = 0; i < attr.length; i++) {
        attrStr += `${attr[i].name}: ${attr[i].value} \n`;
    }
    console.log(attrStr);

    context.beginPath();
    context.fillStyle = 'rgba(0,0,0,0.6)';
    context.fillRect(eleNode.x - 200 - radius, eleNode.y, 200, 200);

    context.fillStyle = 'red';

    context.fillText(attrStr, eleNode.x - 180, eleNode.y + 30);
    context.closePath();
}

canvas.addEventListener('mousemove', (e) => {
    onNode(e.offsetX, e.offsetY);
});

function onNode(mouseX, mouseY) {
    console.log("test")
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
            const eleNode = arr[i][j];

        }
    }
}