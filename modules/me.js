import { isType } from './libs/utils'

function Me(app, data, template){

    var appEl = document.querySelector(app);
    appEl.insertAdjacentHTML('beforeend', template);

    this.data = data;
    var _this = this;
    this.controller = appEl;
    this.bindingElements = [];
    this.parse(appEl);
    render(this.bindingElements, data);

    Object.keys(data).forEach(prop => {
        defineProp(data, prop, data[prop])
    });

    function defineProp(data, prop, val){
        // 如果还是对象则，继续遍历
        if(isType(val, 'object')){
            Object.keys(val).forEach( key => {
                defineProp(val, key, val[key])
            })
        }
        else {
            Object.defineProperty(data, prop, {
                set: function (newVal) {
                    val = newVal;
                    bindPropChange(_this.bindingElements, prop, newVal);
                },
                get: function () {
                    console.log('get了值',val);
                    return val;
                }
            })
        }
    }

}

function bindPropChange(bindElements, prop, val){
    bindElements.forEach(item => {
        if(item.prop == prop){
            item.el.innerHTML = val;
        }
    })
}

function render(bindElements, data){
    bindElements.forEach(item => {

        Object.keys(data).forEach(prop => {
            if(item.prop == prop){
                item.el.innerHTML = data[prop];
            }
        })

    })
}


Me.prototype.parse = function(element) {

    let _this = this;

    if(element.children.length == 0){
        if(element.nodeType === 1){
            let nodeText = element.innerHTML;
            let bindingFlag = /{{(.+?)}}/;

            // 含有需要绑定的{{}}标志
            bindingFlag.test(nodeText) ? this.bindingElements.push({
                    el: element,
                    prop: nodeText.trim().replace(/{|}/g,'').trim()
                }): '';

            // 遍历属性，含有v-model的form元素加上事件
            let attributes = element.attributes;
            for(var i = 0;i < attributes.length; i++){
                let attrName = attributes[i].name;
                let attrVal = attributes[i].value;

                if(attrName === 'm-model' && element.tagName === 'INPUT'){
                    element.addEventListener('input', function (e) {
                        _this.data[attrVal] = e.target.value;
                    })
                }
            }
        }
    }
    else {
        for (var i = 0; i < element.children.length; i++) {
            this.parse(element.children[i])
        }
    }
};


export default Me;