const parser = require('../libs/parser2');

var template = '<div><div data="123" v-if="loading">{{ name }}</div>' +
    '<div><h1>标题</h1></div></div>';

var result = parser(template);
console.log(result);