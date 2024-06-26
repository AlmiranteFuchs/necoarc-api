function create_node (father, value){
    return {
        value: null,
        father: father,
        children: []
    }
}

function add_child (father, value){
    let new_node = create_node(father, value);
    father.children.push(new_node);
    return new_node;
}

