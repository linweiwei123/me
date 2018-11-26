import { h, app } from './hyperapp';

const getData = ()=>{
    let data = [];
    for(var i=0;i<3000;i++){
        data.push('text_' + i)
    }
    return data
}

const state = {
    count: 5,
    times: 1,
    names: getData()
}

// 没做data-binding
// setInterval(() => {
//     state.times++;
// },1000)

const actions = {
    down: value => state => ({ count: state.count - value }),
    up: value => state => ({ count: state.count + value }),
    add: value => state => state.names.push(value),
    remove: value => state => state.names.pop(),
    nothing: value => state => ({ count: state.count }),
}

const view = (state, actions) => (
    <div>
        <div>
            <h1>{state.count}</h1>
            <h2>{state.times}</h2>
            <button onclick={() => actions.down(1)}> -</button>
            <button onclick={() => actions.up(1)}> +</button>
        </div>

        <button onclick={ () => actions.add('新增')}> add </button>
        <button onclick={ () => actions.remove()}> remove </button>
        <button onclick={ () => actions.nothing()}> nothing </button>
        {
            state.names.map(item =>
                <div>{ item }</div>
            )
        }
    </div>
);

app(state, actions, view, document.querySelector('#app'));