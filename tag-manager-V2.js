function TagManager(obj, callback) {
    var _t = this;
    _t.settings = obj;
    _t.callback = callback;
    _t.init();
}
TagManager.prototype = {
    constructor: TagManager,
    cls: { active: 'gtm-push-active' },
    get: function (o) {
        o = o || {};
        var _t = this,
            ID = o['ID'],
            ind = o['index'],
            obj = {},
            prop = _t.settings['props'] || [];

        $.each(prop, function (key, item) {
            var type = item['type'] || '',
                target = item['target'] || '',
                customFunc = item['customFunc'] || '',
                value = '';

            if (type == 'inside')
                value = (ID.find(target).text() || '').trim();

            if (customFunc != '')
                value = customFunc({ ID: ID.find(target).length > 0 ? ID.find(target) : ID, index: ind });

            obj[item['key']] = value;
        });

        return obj;
    },
    set: function () {
        var _t = this,
            settings = _t.settings,
            items = $(settings['items'] || ''),
            type = settings['type'];

        if (type == 'all-element') {
            var arr = [];
            items.each(function () {
                var ID = $(this), index = ID.index();
                arr.push(_t.get({ ID: ID, index: index }));
            });
            _t.callback({ data: arr });
        } else if (type == 'element-click') {
            items
                .find(settings['clickedItem'] || '')
                .unbind('click')
                .bind('click', function (e) {
                    e.preventDefault();
                    var ID = $(this).parents(settings['parents'] || '').eq(0),
                        index = ID.index(),
                        hrf = $(this).attr('href') || '',
                        arr = [];
                    arr.push(_t.get({ ID: ID, index: index }));
                    _t.callback({ data: arr, uri: hrf });
                });
        } else if (type == 'scroll-element') {
            $(window)
                .unbind('resize scroll', _t.adjust.bind(this))
                .bind('resize scroll', _t.adjust.bind(this));
            _t.adjust();
        }
    },
    detectPosition: function (ID) {
        var _t = this, win = $(window), wt = parseFloat(win.width()), ht = parseFloat(win.height()), wst = parseFloat(win.scrollTop());

        var b = false,
            o1 = { x: 0, y: wst, width: wt, height: ht },
            o2 = { x: 0, y: ID.offset().top, width: wt, height: ID.height() };
        if (o1.x < o2.x + o2.width && o1.x + o1.width > o2.x && o1.y < o2.y + o2.height && o1.y + o1.height > o2.y) {
            b = true;
        }

        return b;
    },
    adjust: function () {
        var _t = this,
            settings = _t.settings,
            items = $(settings['items'] || ''),
            arr = [];
        items
            .each(function () {
                var ths = $(this), index = ths.index();
                if (_t.detectPosition(ths) && !ths.hasClass(_t.cls['active'])) {
                    ths.addClass(_t.cls['active']);
                    arr.push(_t.get({ ID: ths, index: index }));
                }
            });

        if (arr.length > 0)
            _t.callback({ data: arr });
    },
    init: function () {
        var _t = this;
        _t.set();
    }
};


/*
    ex: 
    new DetectElementPosition({ ID: $('[data-gtm]'), offset: 0, rate: 1 }, function( o ){
        console.log(o);
    });
*/

function DetectElementPosition(o, callback){
    o = o || {};
    var _t = this;
    _t.def = o;
    _t.callback = callback;
    _t.init();
}

DetectElementPosition.prototype = {
     constructor: DetectElementPosition,
     cls: { active: 'gtm-activeted' },
     detect: function (ID) {
            var _t = this,
            def = _t.def, 
                win = $(window), 
                wt = parseFloat(win.width()), 
                ht = parseFloat(win.height() - ( def['offset'] || 0 )), 
                wst = parseFloat(win.scrollTop() + (ht * ( def['rate'] || .5 )));
    
            var b = false,
                o1 = { x: 0, y: wst, width: wt, height: ht },
                o2 = { x: 0, y: ID.offset().top, width: wt, height: ID.height() };
            if (o1.x < o2.x + o2.width && o1.x + o1.width > o2.x && o1.y < o2.y + o2.height && o1.y + o1.height > o2.y) {
                b = true;
            }
    
            return b;
        },

        adjust: function () {
        var _t = this,
            ID = _t.def['ID'];
            arr = [];
        ID
            .each(function () {
                var ths = $(this), index = ths.index();
                if (_t.detect(ths) && !ths.hasClass(_t.cls['active'])) {
                    ths.addClass(_t.cls['active']);
                    arr.push({ ID: ths, index: index });
                }
            });

        if (arr.length > 0)
            _t.callback({ data: arr });
    },
     addEvent: function(){
         var _t = this;
         _t.adjust();
            $(window)
                .unbind('resize scroll', _t.adjust.bind(this))
                .bind('resize scroll', _t.adjust.bind(this));
     },
     init: function () {
        var _t = this;
        _t.addEvent();
    }
};