import { h, app } from './hyperapp';

const state = {
    count: 5,
    times: 1,
    names: [
        '美柚',
        '柚宝宝',
        '返还购'
    ]
}

// 没做data-binding
// setInterval(() => {
//     state.times++;
// },1000)

const actions = {
    down: value => state => ({ count: state.count - value }),
    up: value => state => ({ count: state.count + value }),
    add: value => state => state.names.push(value)
}

const view = (state, actions) => (
    <div>
        <h1>{ state.count }</h1>
        <h2>{ state.times }</h2>
        <button onclick={ () => actions.down(1) }> - </button>
        <button onclick={ () => actions.up(1) }> + </button>
        <button onclick={ () => actions.add('新增')}> add </button>
        {
            state.names.map(item =>
                <div>{ item }</div>
            )
        }
    </div>
);

app(state, actions, view, document.querySelector('#app'));