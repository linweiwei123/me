import Mue from '../core/mue';

var template =
    '<div>' +
        '<div>' +
            '<h1>{{ title }}</h1>' +
        '</div>' +
        '<span m-if="loading">loading</span>' +
    '</div>';

new Mue({
    el: '#app',
    template,
    data: {
        title: '测试文字'
    }
});