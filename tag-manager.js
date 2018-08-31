var gtmDefConfig = {
    category: {
        item: '.menuKategori',
        clickedItem: 'a',
    },
    filter: {
        item: '.kutuBodyOzellikFiltre .urunKiyaslamaOzellik_ozellik',
        clickedItem: '> a',
    },
    product: {
        paging: '.urunPaging_pageNavigation:eq(0) [id$="lblPaging"] span.paging',
        item: '.emosInfinite > li',

        id: '.ems-urn-code',
        name: '.ems-prd-name',
        category: '[id$="lblNavigation"]:eq(0) .olNavigasyon li a',
        price: '.urunListe_satisFiyat',
        clickedItem: '.ems-prd-image > a:eq(0), .ems-prd-name > a:eq(0), .ems-prd-name-cat > a:eq(0)',
    },
    promotion: {
        item: '.swiper-wrapper .swiper-slide',
        id: '.bnr-code',
        name: '.title-large',
        creative: '.title-large',
        clickedItem: 'a',
    },
    widget: {
        item: '.emosInfinite > li',
    }
};

function TagManager(obj) {
    var _self = this,
        type = obj['type'] || 'product', /* product || promotion || filter || category */
        elem = obj['elem'] || {},
        defElem = typeof gtmConfig !== 'undefined' ? (gtmConfig[type] || gtmDefConfig[type] || {}) : (gtmDefConfig[type] || {});

    _self.currentPage = obj['currentPage'] || 'Category';
    _self.type = type;
    _self.el = $.extend(defElem, elem);
}

TagManager.prototype = {
    constructor: TagManager,
    template: {
        filter: "dataLayer.push({'event':'FilterClick','filterName':'{{NAME}} – {{VALUE}}'});",
        category: "dataLayer.push({'event':'CategoryClick','filterName':'{{NAME}} – {{VALUE}}'});"
    },
    clearBr: function (k) { return k.replace(/<br\s*[\/]?>/gi, '').replace(/\\r\\n/g, ''); },
    removeTags: function (k) { return k.replace(/<([^>]+?)([^>]*?)>(.*?)<\/\1>/ig, '').replace(/(<([^>]+)>)/ig, ''); },
    trimText: function (k) { return k.trim(); },
    cleanText: function (k) { return k.replace(/\s+/g, ''); },
    detectEl: function (ID) { return ID.length > 0 ? true : false; },
    getPrc: function (ID) {
        var _t = this, k = ID.eq(0).text() || '0';
        return parseFloat(k.replace(/\./, '').replace(/\,/, '.'))
    },
    getCat: function (ID) {
        var k = $(ID
            .get()
            .reverse())
            .map(function () {
                return $(this).find('> a').text() || '';
            })
            .get()
            .join(' > ');

        return k || '';
    },
    getPageCat: function () {
        var _t = this,
            k = $(_t.el.category)
                .map(function () {
                    return ($(this).text() || '').trim();
                })
                .get()
                .join('/');

        return k;
    },
    getActivePaging: function () {
        var _t = this, k = parseFloat(_t.trimText($(_t.el.paging).text() || '1')) - 1, lng = 12;
        return k * lng
    },
    getObj: function (o) {
        var _t = this, ID = o['id'], typ = o['typ'] || 'list', obj = {};
        if (typ == 'list')
            obj = {
                id: _t.trimText(ID.find(_t.el.id).eq(0).text() || ''),
                name: _t.trimText(ID.find(_t.el.name).eq(0).text() || ''),
                price: _t.getPrc(ID.find(_t.el.price).eq(0)),
                category: _t.getPageCat() || '',
                position: (ID.index() + 1) + _t.getActivePaging(),
                list: _t.currentPage
            };
        else if (typ == 'promotion')
            obj = {
                id: _t.trimText(ID.find(_t.el.id).eq(0).text() || ''),
                name: _t.trimText(ID.find(_t.el.name).eq(0).text() || ''),
                creative: _t.trimText(ID.find(_t.el.creative).eq(0).text() || ''),
                position: _t.currentPage + (parseFloat(ID.attr('data-order') || ID.index()) + 1)
            };

        return obj;
    },
    sendGa: function (o) {
        var _t = this, ID = o['ID'] || '', typ = o['typ'] || '';


        if (typ == 'productClick') {

            var obj = _t.getObj({ id: ID }), uri = ID.find(_t.el.clickedItem).eq(0).attr('href') || '';
            dataLayer.push({
                'event': 'productClick',
                'ecommerce': {
                    'click': {
                        'actionField': { 'list': _t.currentPage },
                        'products': [obj]
                    }
                },
                'eventCallback': function () {
                    if (uri != '')
                        document.location = uri;
                }
            });

            _t.log({ title: 'productClick', value: obj });

        } else if (typ == 'productHover') {

            var obj = _t.getObj({ id: ID });
            dataLayer.push({
                'event': 'productHover',
                'ecommerce': {
                    'impressions': [obj]
                }
            });

            _t.log({ title: 'productHover', value: obj });


        } else if (typ == 'product') {

            var obj = $(_t.el.item).map(function () {
                return _t.getObj({ id: $(this) });
            }).get();

            dataLayer.push({
                'ecommerce': {
                    'currencyCode': 'TRY',
                    'impressions': obj
                }
            });

            _t.log({ title: 'all product', value: obj });

        } else if (typ == 'filter') {
            var lng = lang.split('-')[0], ID = $(_t.el.item);
            ID.each(function () {
                var ths = $(this),
                    e = ths.find(_t.el.clickedItem),
                    name = _t.trimText(_t.removeTags(ths.parents('.urunKiyaslamaOzellik_ozellik').find('.urunKiyaslamaOzellik_ozellikAd').html() || '')),
                    val = _t.trimText(_t.removeTags(e.text() || ''));
                e.attr('onclick', _t.template['filter'].replace(/{{LANG}}/g, lng).replace(/{{NAME}}/g, name).replace(/{{VALUE}}/g, val))
            });
        } else if (typ == 'category') {
            var lng = lang.split('-')[0], ID = $(_t.el.item);
            ID
                .find(_t.el.clickedItem)
                .each(function () {
                    var ths = $(this), name = _t.trimText(ths.text() || ''), val = _t.getCat(ths.parents('li'));
                    ths.attr('onclick', _t.template['category'].replace(/{{LANG}}/g, lng).replace(/{{NAME}}/g, name).replace(/{{VALUE}}/g, val))
                });
        } else if (typ == 'promotion') {

            obj = $(_t.el.item).map(function () {
                return _t.getObj({ id: $(this), typ: 'promotion' });
            }).get();

            _t.log({ title: 'all promotion', value: obj });

            dataLayer.push({
                'event': 'EEpromoImp',
                'ecommerce': {
                    'promoView': {
                        'promotions': obj
                    }
                }
            });
        } else if (typ == 'promotionClick') {

            var obj = _t.getObj({ id: ID, typ: 'promotion' }), uri = ID.find(_t.el.clickedItem).eq(0).attr('href') || '';
            dataLayer.push({
                'event': 'EepromoClick',
                'ecommerce': {
                    'promoClick': {
                        'promotions': obj
                    }
                },
                'eventCallback': function () {
                    if (uri != '')
                        document.location = uri;
                }
            });

            _t.log({ title: 'promotionClick', value: obj });
        }
    },
    addEvent: function () {
        var _t = this,
            e = $(_t.el.item),
            type = _t.type;

        if (_t.detectEl(e)) {
            if (type == 'product')
                e
                    .unbind('mouseenter click')
                    .bind('mouseenter', function () { _t.sendGa({ ID: $(this), typ: 'productHover' }); })
                    .find(_t.el.clickedItem)
                    .unbind('click')
                    .bind('click', function (e) {
                        e.preventDefault();
                        _t.sendGa({ ID: $(this).parents('li').eq(0), typ: 'productClick' });
                    });
            else if (type == 'promotion')
                e
                    .find(_t.el.clickedItem)
                    .unbind('click')
                    .bind('click', function (e) {
                        e.preventDefault();
                        _t.sendGa({ ID: $(this).parents('li').eq(0), typ: 'promotionClick' });
                    });
        }

    },
    add: function () {
        var _t = this;
        _t.sendGa({ typ: _t.type });
    },
    log: function ({ type, title = '', value }) {
        var loc = window.location.href;
        if (loc.indexOf('debug=2') != -1) {
            if (type == 'error')
                console.error(title, value);
            else
                console.log(title, value);
        }
    },
    init: function () {
        var _t = this;

        if (typeof dataLayer !== 'undefined' && $(_t.el.item).length > 0) {
            _t.add();
            _t.addEvent();
        } else
            _t.log({ type: 'error', value: 'dataLayer veya hedef nesne  bulunamadı.' })
    }
};

//////////////////////////// PRODUCTS WIDGET
function onWidgetLoaded(o) {
    var ID = $(o['ID']),
        tag = ID.attr('data-gtm') || '',
        item = ID.find(gtmConfig['widget']['item'] || '.emosInfinite > li'),
        cls = { active: 'gtm-active' };

    if (!ID.hasClass(cls['active']) && tag != '' && item.length > 0) {
        ID.addClass(cls['active']);
        var tm = new TagManager({
            type: 'product',
            currentPage: tag,
            elem: {
                item: item,
                category: ''
            }
        });
        tm.init();
    }
}

stage.addEventListener("CustomEvent", [{ type: "WIDGET_LOADED", handler: "onWidgetLoaded" }]);