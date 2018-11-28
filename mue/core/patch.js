export function patchInit(Mue) {
    Mue.prototype.createElement = function(node, isSvg) {
        let _mue = this;
        var element =
            typeof node === "string" || typeof node === "number"
                ? document.createTextNode(node)
                : (isSvg = isSvg || node.nodeName === "svg")
                ? document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    node.nodeName
                )
                : document.createElement(node.nodeName)

        // 嵌套创建
        if(node.children instanceof Array){
            for (var i = 0; i < node.children.length; i++) {
                element.appendChild(
                    this.createElement(node.children[i])
                )
            }
        }

        // 如果是input标签
        if(node.nodeName === 'input'){
            element.value = node.value;
            element.addEventListener('input', function (e) {
                let expression = node.attributes["m-model"];
                let val = e.target.value;
                let str = `this.data.${expression}='${val}'`;
                (new Function(str)).call(_mue)
            })
        }

        return element
    }


    Mue.prototype.patch = function(parent, element, oldNode, node, isSvg) {

        // 同一个node树，什么也不处理
        if (node === oldNode) {
        }
        // 第一次patch，直接创建DOM树
        else if (oldNode == null || oldNode.nodeName !== node.nodeName) {
            var newElement = this.createElement(node, isSvg)
            parent.insertBefore(newElement, element)

            if (oldNode != null) {
                removeElement(parent, element, oldNode)
            }

            element = newElement
        }
        // 只有文字
        else if (oldNode.nodeName == null) {
            element.nodeValue = node
        }
        // 新旧DOM树有所不同，进行diff修改更新DOM
        else {
            var oldKeyed = {}
            var newKeyed = {}
            var oldElements = []
            var oldChildren = oldNode.children
            var children = node.children

            for (var i = 0; i < oldChildren.length; i++) {
                oldElements[i] = element.childNodes[i]

                var oldKey = getKey(oldChildren[i])
                if (oldKey != null) {
                    oldKeyed[oldKey] = [oldElements[i], oldChildren[i]]
                }
            }

            var i = 0
            var k = 0

            while (children && k < children.length) {
                var oldKey = getKey(oldChildren[i])
                var newKey = getKey((children[k]))

                // 新node树中还存在的旧节点保留
                if (newKeyed[oldKey]) {
                    i++
                    continue
                }

                if (newKey != null && newKey === getKey(oldChildren[i + 1])) {
                    if (oldKey == null) {
                        removeElement(element, oldElements[i], oldChildren[i])
                    }
                    i++
                    continue
                }

                if (newKey == null) {
                    if (oldKey == null) {
                        this.patch(element, oldElements[i], oldChildren[i], children[k], isSvg)
                        k++
                    }
                    i++
                } else {
                    var keyedNode = oldKeyed[newKey] || []

                    if (oldKey === newKey) {
                        this.patch(element, keyedNode[0], keyedNode[1], children[k], isSvg)
                        i++
                    } else if (keyedNode[0]) {
                        this.patch(
                            element,
                            element.insertBefore(keyedNode[0], oldElements[i]),
                            keyedNode[1],
                            children[k],
                            isSvg
                        )
                    } else {
                        this.patch(element, oldElements[i], null, children[k], isSvg)
                    }

                    newKeyed[newKey] = children[k]
                    k++
                }
            }

            while (i < oldChildren.length) {
                if (getKey(oldChildren[i]) == null) {
                    removeElement(element, oldElements[i], oldChildren[i])
                }
                i++
            }

            for (var i in oldKeyed) {
                if (!newKeyed[i]) {
                    removeElement(element, oldKeyed[i][0], oldKeyed[i][1])
                }
            }
        }
        return element
    }
}

function eventListener(event) {
    return event.currentTarget.events[event.type](event)
}

function getKey(node) {
    return node ? node.key : null
}

function removeChildren(element, node) {
    var attributes = node.attributes
    if (attributes) {
        for (var i = 0; i < node.children.length; i++) {
            removeChildren(element.childNodes[i], node.children[i])
        }

        if (attributes.ondestroy) {
            attributes.ondestroy(element)
        }
    }
    return element
}

function removeElement(parent, element, node) {
    function done() {
        parent.removeChild(removeChildren(element, node))
    }

    var cb = node.attributes && node.attributes.onremove
    if (cb) {
        cb(element, done)
    } else {
        done()
    }
}

