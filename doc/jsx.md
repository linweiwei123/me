1、JSX 语法转换后
h("div", null,
    h("h1", null, state.count),
    h("button", { onClick: () => actions.down(1) }, " -"),
    h("button", { onClick: () => actions.up(1) }, " +")
)

2、通过h函数运行后
{
  "nodeName": "div",
  "attributes": {},
  "children": [
    {
      "nodeName": "h1",
      "attributes": {},
      "children": [
        5
      ]
    },
    {
      "nodeName": "button",
      "attributes": {},
      "children": [
        " - "
      ]
    },
    {
      "nodeName": "button",
      "attributes": {},
      "children": [
        " + "
      ]
    }
  ]
}