import parse from '../parser/index';
import {isType, deepCopy} from "../utils/index";
import {patchInit} from './patch';
import {watchData} from "./watch";
import { stringify } from '../../modules/libs/stringify'


/**
 * {
 *     el: '#app',      // app所在的element选择器
 *     template: '',    // 模板 （*后续改成 .mue文件的形式）
 *     data: {          // 双向绑定的对象
 *
 *     },
 *     methods: {       // 事件
 *
 *     }
 * }
 *
 * @constructor
 */
export default function Mue(options){
    this._init(options);
}

watchData(Mue);
patchInit(Mue);


Mue.prototype._init = function(options){
    const { el, template, data, mounted, methods } = options;
    this.el = el;
    this.data = data;

    // template 解析成nodeObject（非vdom的那个nodeObject）
    const parsedNodes = parse(template);

    console.log('parsedNodes',stringify(parsedNodes));

    // 解析生成的nodeObject生成函数字符串
    let compileStr = 'return ' + buildRenderStr(parsedNodes);

    // 用函数字符串生成render函数
    this.compiler = buildCompiler(compileStr);

    console.log('compiler fn',this.compiler);

    // 用compiler生成VDOM，并调用patch方法生成DOM
    this.render();

    // 挂载执行的回调函数
    mounted.call(this);

    // 监听data变化
    this.defineReactive();

};

function buildRenderStr(node){
    let tempStr = '';
    // 如果node是个dom节点
    if(node.type === 1){

        // 无子元素
        if(node.children.length === 0) {
            tempStr = `this._h('${node.tag}',${JSON.stringify(node.attrsMap)})`;
        }

        // 有子元素
        else {
            let children = node.children;
            let h_childs = [];
            for(let i = 0; i < children.length; i++){
                h_childs.push(buildRenderStr(children[i]));
            }
            h_childs = '[' + h_childs.join(',') + ']';
            tempStr = `this._h('${node.tag}',${JSON.stringify(node.attrsMap)},${h_childs})`;
        }
    }
    // 如果node是文字
    else if(node.type === 2){
        tempStr = node.expression ? node.expression : `'${node.text}'`;
    }
    return tempStr;
}

function buildCompiler(str) {
    return new Function(str)
}


function recycleElement(element) {
    return {
        nodeName: element.nodeName.toLowerCase(),
        attributes: {},
        children: Array.prototype.map.call(element.childNodes, function(element) {
            return element.nodeType === 3 // Node.TEXT_NODE
                ? element.nodeValue
                : recycleElement(element)
        })
    }
}

Mue.prototype.render = function(){
    // render函数生成VDOM
    let vNodes = this.compiler();

    // VDOM 生成real DOM
    let container = document.querySelector(this.el);
    let rootElement = (container && container.children[0]) || null;
    let oldNode = rootElement && recycleElement(rootElement);
    console.log(JSON.stringify(vNodes));
    this.patch(container, rootElement, oldNode, (oldNode = vNodes));
}

Mue.prototype._h = function(nodeName, attributes, children) {
    let node = {};
    let directives = [];
    let mDirect = /^m-/;
    let isNeed = true;

    for(let attr in attributes){
        if(mDirect.test(attr)){
            directives.push({
                key: attr,
                prop: attributes[attr]
            })
        }
    }

    // 只考虑m-if、m-for 的情况
    directives.forEach(item => {
        if(item.key === 'm-if'){
            let propValue = new Function(`return this.data.${item.prop}`).call(this);
            isNeed = propValue ===  true ? true : false;
        }
        else if(item.key === 'm-model'){
            let propValue = new Function(`return this.data.${item.prop}`).call(this);
            node.value = propValue;
        }

    });

    // 如果
    if(children && isType(children, 'array')){
        children = children.filter(child => {
            return child !== undefined
        })
    }

    // 不需要的设置为 undefined
    if(!isNeed){
        return undefined;
    }

    node = deepCopy({
        nodeName: nodeName,
        attributes: attributes || {},
        children: children,
        key: attributes && attributes.key
    }, node);
    return node;
}

Mue.prototype._s = function(expression){
    return expression;
}