import Me from './me';

var obj = {
    header: '双向绑定',
    name: '12',
    count: 1
};

var methods = {
    changeCount(val){
        this.data.name = val;
    }
}

const template =
    '<h1> {{ header }}</h1>' +
    '<div>{{ name }}</div>' +
    '<input type="text" m-model="name" />' +
    '<div>{{ count }}</div>';

new Me('#app', obj, template, methods);

// obj.name = 'p5';

setInterval(function () {
    obj.count++;
},1000);