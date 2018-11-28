import Mue from '../core/mue';

var template =
    '<div>' +
        '<div>' +
            '<h1>{{ title }}</h1>' +
            '<h2>{{ info.desc }}</h2>' +
        '</div>' +
        '<h2>{{count}}</h2>' +
        '<loading m-if="loading">loading</loading>' +
        '<p class="el_input">输入的内容是：{{inputText}}</p>' +
        '<input type="text" m-model="inputText" />' +
        // '<div m-for="item in users"><p>{{ item }}</p></div>' +
    '</div>';

new Mue({
    el: '#app',
    template,
    data: {
        title: '测试文字',
        info: {
            desc: '描述文字'
        },
        count: 1,
        loading: true,
        inputText: '',
        users: ['Jim','Norbert']
    },
    mounted(){
        setTimeout(()=>{
            this.data.title = 'title新值';
            this.data.info.desc = 'desc新值';
            this.data.loading = false;
        },1000)

        setInterval(()=>{
            this.data.count++
        },100)
    }
});