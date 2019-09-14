# Tag Manager

```JS
/* all promotion */
new TagManager({
    items: '.swiper-container.main-slider .swiper-slide:not(".swiper-slide-duplicate")',
    type: 'all-element',
    props: [
        {
            key: 'id',
            target: '.bnr_code',
            type: 'inside'
        },
        {
            key: 'name',
            target: '.swiper-content-inner h2',
            type: 'inside'
        },
        {
            key: 'position',
            customFunc: function (o) {
                var index = o['index'];
                return 'Homepage | Slider | ' + index;
            },
        },
    ]
}, function (o) {
    var arr = o['data'],
        data = {
            'ecommerce': {
                'promoView': {
                    'promotions': arr
                }
            },
            'Category': 'Enhanced Ecommerce',
            'Action': 'Promotion',
            'Label': 'Promotion Impression',
            'noninteraction': true,
            'Value': 0,
            'event': 'eeEvent'
        };
    dataLayer.push(data);
    console.log('all promotion', data);
});


/************ promotion click ************/
new TagManager({
    items: '.swiper-container.main-slider .swiper-slide:not(".swiper-slide-duplicate")',
    type: 'element-click',
    clickedItem: 'a',
    parents: 'li',// clickeditem ile tıklanan elementte root elemente çıkmak
    props: [
        {
            key: 'id',
            target: '.bnr_code',
            type: 'inside'
        },
        {
            key: 'name',
            target: '.swiper-content-inner h2',
            type: 'inside'
        },
        {
            key: 'position',
            customFunc: function (o) {
                var index = o['index'];
                return 'Homepage | Slider | ' + index;
            },
        },
    ]
}, function (o) {
    var arr = o['data'],
        uri = o['uri'],
        data = {
            'ecommerce': {
                'promoClick': {
                    'promotions': arr
                }
            },
            'Category': 'Enhanced Ecommerce',
            'Action': 'Promotion',
            'Label': 'Click',
            'noninteraction': false,
            'Value': 0,
            'event': 'eeEvent',
            'eventCallback': function () {
                /*if (uri != '')
                    document.location = uri;*/
            }
        };
    dataLayer.push(data);
    console.log('promotion click', data);
});


/* scroll ettikçe product impression */
new TagManager({
    items: '.emosInfinite > li',
    type: 'scroll-element',
    props: [
        {
            key: 'id',
            target: '.ems-urn-code',
            type: 'inside'
        },
        {
            key: 'name',
            target: '.ems-prd-name',
            type: 'inside'
        },
        {
            key: 'category',
            customFunc: function (o) {
                var ID = o['ID'];
                return $('.navigasyon.urunNavigasyon a:not(".homePageBtn")')
                    .map(function () {
                        return ($(this).text() || '').replace(/\>/g, '').trim();
                    })
                    .get()
                    .join('/');
            },
        },
        {
            key: 'price',
            target: '.urunListe_satisFiyat',
            customFunc: function (o) {
                var ID = o['ID'], k = ID.eq(0).text() || '0';
                return parseFloat(k.replace(/\./, '').replace(/\,/, '.')).toString();
            },
        },
        {
            key: 'position',
            customFunc: function (o) {
                var index = o['index'] || 0, activePage = parseFloat(($('.urunPaging_pageNavigation:eq(0) [id$="lblPaging"] span.paging').text() || '1').trim()) - 1, total = 20;
                return (index + 1) + (activePage * total);
            },
        },
        {
            key: 'brand',
            target: '.ems-prd-marka',
            type: 'inside'
        },
        {
            key: 'list',
            customFunc: function (o) {
                return 'Category'
            }
        }
    ]
}, function (o) {
    var arr = o['data'],
        data = {
            'Category': 'Enhanced Ecommerce',
            'Action': 'Browse',
            'Label': 'Product Impressions',
            'Value': 0,
            'noninteraction': true,
            'ecommerce': {
                'currencyCode': 'TRY',
                'impressions': arr
            },
            'event': 'eeEvent'
        };
    dataLayer.push(data);
    console.log('scroll-elements', data);
});


/* product click */
new TagManager({
    items: '.emosInfinite > li',
    type: 'element-click',
    clickedItem: '.ems-prd-image > a:eq(0), .ems-prd-name > a:eq(0), .ems-prd-name-cat > a:eq(0)',
    parents: 'li',// clickeditem ile tıklanan elementte root elemente çıkmak
    props: [
        {
            key: 'id',
            target: '.ems-urn-code',
            type: 'inside'
        },
        {
            key: 'name',
            target: '.ems-prd-name',
            type: 'inside'
        },
        {
            key: 'category',
            customFunc: function (o) {
                var ID = o['ID'];
                return $('.navigasyon.urunNavigasyon a:not(".homePageBtn")')
                    .map(function () {
                        return ($(this).text() || '').replace(/\>/g, '').trim();
                    })
                    .get()
                    .join('/');
            },
        },
        {
            key: 'price',
            target: '.urunListe_satisFiyat',
            customFunc: function (o) {
                var ID = o['ID'], k = ID.eq(0).text() || '0';
                return parseFloat(k.replace(/\./, '').replace(/\,/, '.')).toString();
            },
        },
        {
            key: 'position',
            customFunc: function (o) {
                var index = o['index'] || 0, activePage = parseFloat(($('.urunPaging_pageNavigation:eq(0) [id$="lblPaging"] span.paging').text() || '1').trim()) - 1, total = 20;
                return (index + 1) + (activePage * total);
            },
        },
        {
            key: 'brand',
            target: '.ems-prd-marka',
            type: 'inside'
        }
    ]
}, function (o) {
    var arr = o['data'],
        uri = o['uri'],
        data = {
            'Category': 'Enhanced Ecommerce',
            'Action': 'Browse',
            'Label': 'Product Click',
            'Value': 0,
            'noninteraction': false,
            'ecommerce': {
                'click': {
                    'actionField': { 'list': 'Category' },
                    'products': arr
                }
            },
            'event': 'eeEvent',
            'eventCallback': function () {
                /*if (uri != '')
                    document.location = uri;*/
            }
        };
    dataLayer.push(data);
    console.log('element-click', data);
});

/* all products */
new TagManager({
    items: '.emosInfinite > li',
    type: 'all-element',
    props: [
        {
            key: 'id',
            target: '.ems-urn-code',
            type: 'inside'
        },
        {
            key: 'name',
            target: '.ems-prd-name',
            type: 'inside'
        },
        {
            key: 'category',
            customFunc: function (o) {
                var ID = o['ID'];
                return $('.navigasyon.urunNavigasyon a:not(".homePageBtn")')
                    .map(function () {
                        return ($(this).text() || '').replace(/\>/g, '').trim();
                    })
                    .get()
                    .join('/');
            },
        },
        {
            key: 'price',
            target: '.urunListe_satisFiyat',
            customFunc: function (o) {
                var ID = o['ID'], k = ID.eq(0).text() || '0';
                return parseFloat(k.replace(/\./, '').replace(/\,/, '.')).toString();
            },
        },
        {
            key: 'position',
            customFunc: function (o) {
                var index = o['index'] || 0, activePage = parseFloat(($('.urunPaging_pageNavigation:eq(0) [id$="lblPaging"] span.paging').text() || '1').trim()) - 1, total = 20;
                return (index + 1) + (activePage * total);
            },
        },
        {
            key: 'brand',
            target: '.ems-prd-marka',
            type: 'inside'
        },
        {
            key: 'list',
            customFunc: function (o) {
                return 'Category'
            }
        }
    ]
}, function (o) {
    var arr = o['data'],
        data = {
            'Category': 'Enhanced Ecommerce',
            'Action': 'Browse',
            'Label': 'Product Impressions',
            'Value': 0,
            'noninteraction': true,
            'ecommerce': {
                'currencyCode': 'TRY',
                'impressions': arr
            },
            'event': 'eeEvent'
        };
    dataLayer.push(data);
    console.log('all-product', data);
});
```
