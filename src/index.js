import { h, app } from './hyperapp';

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
        <button onclick={ () => actions.down(1) }> - </button>
        <button onclick={ () => actions.up(1) }> + </button>
        {
            state.names.map(item =>
                <div>{ item }</div>
            )
        }
    </div>
);

app(state, actions, view, document.querySelector('#app'));