function create_node(father, value, line = null) {
    return {
        value: value,
        father: father,
        children: [],
        line: line
    }
}

function add_child(father, value) {
    let new_node = create_node(father, value);
    father.children.push(new_node);
    return new_node;
}

function find_node(node, value) {
    if (node.value === value) return node;
    for (let i = 0; i < node.children.length; i++) {
        let found = find_node(node.children[i], value);
        if (found) return found;
    }
    return null;
}

//////
const default_node = `
            <div id="initial-state" data-node="true" data-children="" class="draggable">
                <div class="btn-group">
                    <button id="end" class="btn btn-sm btn-pill first-btn-pill" type="button" data-toggle="dropdown"
                        aria-haspopup="true" aria-expanded="false" style="pointer-events: none;">
                        Estado inicial
                    </button>
                    <button type="button" class="btn btn-sm dropdown-toggle dropdown-toggle-split first-btn-pill"
                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                        style="border-radius: 0px 25px 25px 0px;">
                        <i class="fa fa-plus-circle"></i>

                    </button>
                    <div class="dropdown-menu">
                        <!-- On click -->
                        <a class="dropdown-item add_action">Adicionar estado</a>

                    </div>
                </div>
            </div>
    `;
//////

// Global tree variable
let Tree = null;

$(document).ready(function () {
    // tranlsate initial-state to middle of the screen height
    const initial = document.getElementById('node-0');
    initial.style.transform = `translateY(${window.innerHeight / 2.5}px)`;

    // Add initial to tree
    Tree = create_node(null, "node-0");
    console.log(Tree);

    // On click add_action
    $(document).on('click', '.add_action', function (event) {
        // Get element of the event
        const element = event.target;
        add_action(element);
    });

});



function add_action(father_node) {
    // close dropdown one parent above
    father_node.parentNode.classList.remove('show');

    // Traverse father_node till find the data-node
    let node = father_node;
    while (node.getAttribute('data-node') !== 'true' || node === null) {
        node = node.parentNode;
    }

    // Get id of the node
    const id = node.getAttribute('id');

    // Search id in the tree
    const father = find_node(Tree, id);

    if (!father) {
        alert('Could not create new node, father not found');
        return;
    }

    // Create new node 
    var new_node = default_node;

    // Create new id
    const id_key = id + '-child-' + (parseInt(father.children.length) + 1);

    // Push id to tree
    add_child(father, id_key);

    // Change id of the new node
    new_node = new_node.replace('initial-state', id_key);

    // Find container
    const container = document.querySelector('.container-grid');

    // Append new node to container
    container.innerHTML += new_node;

    const new_node_element = document.getElementById(id_key);
    // translate new node to close to the father node

    // Get father node position
    const father_node_position = father_node.getBoundingClientRect();

    // Translate new node to close to the father node
    new_node_element.style.transform = `translate(${father_node_position.x + 100}px, ${father_node_position.y + 100}px)`;

    // remakeLines(Tree);
    // Create line for the new node
    let line = new LeaderLine(
        document.getElementById(id).querySelector(".btn-group"),
        document.getElementById(id_key).querySelector(".btn-group"),
    );

    // Add line to the tree
    find_node(Tree, id_key).line = line;

    // Add drag to new node
    updateDraggables();

}


// function remakeLines(tree) {
//     if (tree.children.length === 0) return;
//     // else remove line 
//     for (let i = 0; i < tree.children.length; i++) {
//         const child = tree.children[i];
//         if (child.line) {
//             child.line.remove();
//             child.line = null;
//         }
//         remakeLines(child);
//     }

// }

function updateLineRecursive(nodes) {
    if (nodes.line) {
        nodes.line.position();
    }


    if (nodes.children.length === 0) return;
    // else remove line 
    for (let i = 0; i < nodes.children.length; i++) {
        const child = nodes.children[i];
       
        updateLineRecursive(child);
    }
}


function updateLine() {
    // Run through the tree and update lines
    updateLineRecursive(Tree);
}

function updateDraggables() {
    // Add drag to new node
    Draggable.create(".draggable", {
        type: "x,y",
        bounds: window,
        // inertia: true,
        onDragEnd: function () {
            updateLineRecursive();
        },
        onDrag: function (card) {
            updateLineRecursive();
        }
    });
}


