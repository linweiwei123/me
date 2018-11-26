const parser = require('../libs/parse2');

var template = '<div data="123" v-if="loading">12</div>';

var result = parser(template);
console.log(result);