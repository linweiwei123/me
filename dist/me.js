var hyper = (function (exports) {
    'use strict';

    const state = {
      count: 5,
      names: ['美柚', '柚宝宝', '返还购']
    };

    const view = (state, actions) => h("div", null, h("h1", null, state.count), h("button", {
      onClick: () => actions.down(1)
    }, " -"), h("button", {
      onClick: () => actions.up(1)
    }, " +"));

    function h(name, attributes) {
      console.log('name', name);
      var rest = [];
      var children = [];
      var length = arguments.length;

      while (length-- > 2) rest.push(arguments[length]);

      while (rest.length) {
        var node = rest.pop();

        if (node && node.pop) {
          for (length = node.length; length--;) {
            rest.push(node[length]);
          }
        } else if (node != null && node !== true && node !== false) {
          children.push(node);
        }
      }

      return typeof name === "function" ? name(attributes || {}, children) : {
        nodeName: name,
        attributes: attributes || {},
        children: children,
        key: attributes && attributes.key
      };
    }
    console.log(view(state));

    exports.h = h;

    return exports;

}({}));
