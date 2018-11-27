import parse from '../parser/index';
import {isType} from "../utils/index";

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

Mue.prototype._init = function(options){
    const { el, template, data, methods } = options;
    this.data = data;

    // template 解析成nodeObject（非vdom的那个nodeObject）
    const parsedNodes = parse(template);

    // console.log(parsedNodes);

    let renderStr = 'return ' + buildRenderStr(parsedNodes);
    //console.log(renderStr);

    this.render = buildRender(renderStr);

    let vNodes = this.render();
    console.log('vNodes', vNodes);

};


function buildRenderStr(node){
    let tempStr = '';
    // 如果node是个dom节点
    if(node.type === 1){

        // 无子元素
        if(node.children.length === 0) {
            tempStr = `this._h('${node.tag}',${JSON.stringify(node.attrsMap)})`;
        }

        // 有一个子元素
        else if(node.children.length === 1){
            tempStr = `this._h('${node.tag}',${JSON.stringify(node.attrsMap)},${buildRenderStr(node.children[0])})`;
        }

        // 有多个子元素
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

function buildRender(str) {
    return new Function(str)
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

    // 只考虑m-if 的情况
    directives.forEach(item => {
        let propValue = new Function(`return this.data.${item.prop}`).call(this);
        isNeed = item.key === 'm-if'? (propValue ===  true ? true : false) : false;
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

    node = {
        nodeName: nodeName,
        attributes: attributes || {},
        children: children,
        key: attributes && attributes.key
    };
    return node;
}

Mue.prototype._s = function(expression){
    console.log(expression);
    return expression;
}