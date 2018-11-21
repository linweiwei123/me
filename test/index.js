const state = {
    count: 5,
    names: [
        '美柚',
        '柚宝宝',
        '返还购'
    ]
}

const actions = {
    down: value => state => ({ count: state.count - value }),
    up: value => state => ({ count: state.count + value })
}

const view = (state, actions) => (
    <div>
        <h1>{state.count}</h1>
        <button onClick={() => actions.down(1)}> -</button>
        <button onClick={() => actions.up(1)}> +</button>
        {
            state.names.map(item =>
                <div>{ item }</div>
            )
        }
    </div>
);

export function h(name, attributes) {
    console.log('name', name);
    var rest = []
    var children = []
    var length = arguments.length

    while (length-- > 2) rest.push(arguments[length])

    while (rest.length) {
        var node = rest.pop()
        if (node && node.pop) {
            for (length = node.length; length--; ) {
                rest.push(node[length])
            }
        } else if (node != null && node !== true && node !== false) {
            children.push(node)
        }
    }

    return typeof name === "function"
        ? name(attributes || {}, children)
        : {
            nodeName: name,
            attributes: attributes || {},
            children: children,
            key: attributes && attributes.key
        }
}

console.log(view(state));