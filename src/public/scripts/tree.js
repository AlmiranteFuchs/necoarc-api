function create_node(father_node, id_value) {
    return {
        id_value: id_value,
        father: father_node,
        children: [],
    }
}

function add_child(this_node, id_value) {
    let new_node = create_node(this_node, id_value);
    this_node.children.push(new_node);
    return new_node;
}

function find_node(node, value) {
    if (node.id_value === value) { return node; }
    for (let i = 0; i < node.children.length; i++) {
        let found = find_node(node.children[i], value);
        if (found !== null) { return found; }
    }
    return null;
}

//////
const default_node = `
            <div id="initial-id" data-node="true" class="draggable">
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
    const initial = document.getElementById('n-0');
    initial.style.transform = `translateY(${window.innerHeight / 2.5}px)`;

    // Add on click
    $(".add_action").on("click", on_add_action);

    // Create the initial node
    Tree = create_node(null, "n-0");

});

function on_add_action(element) {
    // Get the id of the clicked element
    // Go back till data-node 
    let node = element.target;
    while (!node.getAttribute("data-node")) {node = node.parentNode;}

    // Get the id of the node
    let id = node.getAttribute("id");

    // Search id in the tree
    let found = find_node(Tree, id);

    if (found === null) {
        console.log("Node not found in the tree");
        return;
    }

    //  // Create a new node

    const new_id = `${id}/n-${found.children.length}`;

    // Add the new node to the tree
    let new_node = add_child(found, new_id);

    // Add the new node to the DOM
    let new_element = $(default_node);
    new_element.attr("id", new_id);
    new_element.appendTo(node.parentNode);

    // add on click
    new_element.find(".add_action").on("click", on_add_action);

    // Update the draggables
    updateDraggables();

    // Create temporary leader line
    let leader = new LeaderLine(
        document.getElementById(id).querySelector(".btn-group"),
        document.getElementById(new_id).querySelector(".btn-group"),
    );

    // Update the lines
    redoLeaderLines();
    
}


function updateDraggables() {
    // Add drag to new node
    Draggable.create(".draggable", {
        type: "x,y",
        bounds: window,
        // inertia: true,
        onDragEnd: function () {
            redoLeaderLines();
        },
        onDrag: function (card) {
            redoLeaderLines();
        }
    });
}

function redoLeaderLines() {
    // If element has lines, remove and create again
    let lines = document.querySelectorAll(".leader-line");
    lines.forEach(line => {
        line.remove();
    });

    // Create new lines
    // for each node in the tree
    let queue = [Tree];
    while (queue.length > 0) {
        let node = queue.shift();
        for (let i = 0; i < node.children.length; i++) {
            let child = node.children[i];
            let leader = new LeaderLine(
                document.getElementById(node.id_value).querySelector(".btn-group"),
                document.getElementById(child.id_value).querySelector(".btn-group"),
            );
            queue.push(child);
        }
    }



}



