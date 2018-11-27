import parse from '../libs/parser';
import { stringify } from '../libs/stringify'

var template = '<div><div data="123" v-if="loading">{{ name }}</div>' +
        '<div><h1>标题</h1></div></div>';

var result = parse(template);
console.log(result);
console.log(stringify(result));