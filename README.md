# Brk Tag Manager

Genel amacı belirlenen html de belirtilen alanları kullanıcı davranışlarına göre google analytic gibi analiz araçlarına gönderebilmek.

Örneğin sayfadaki slider üzerindeki "bnr_code" ve "h2" alanlarını analytic yollayalım.

```HTML
<div class="homepage-slider swiper-container">
    <div class="swiper-inner">
        <ul class="swiper-wrapper">
            <li class="swiper-slide">
                <div class="bnr_code">125888</div>
                <div class="swiper-content-inner">
                    <h2>Hello</h2>
                </div>
            </li>
            <li class="swiper-slide">
                <div class="bnr_code">125999</div>
                <div class="swiper-content-inner">
                    <h2>World</h2>
                </div>
            </li>
        </ul>
    </div>
</div>
```

```JS
new TagManager({
    items: '.swiper-container.main-slider .swiper-slide:not(".swiper-slide-duplicate")', // belirlenen elementteki kapsayıcı item belirlenir.
    type: 'all-element', // all-element( ilk açılışta tetiklenir ), element-click( element tıklandığında tetiklenir ), scroll-element( belirtilen alan sahnede gözükür olduğunda tetiklenir ) 3 değer alır.
    props: [
        {
            key: 'id', // target ile bulunan elementin değeri key eşitlenir. Yani { id: '125888' }
            target: '.bnr_code', // kapsayıcı item içerisinde aranacak element
            type: 'inside'
        },
        {
            key: 'name', // { id: '125888', name: 'World' }
            target: '.swiper-content-inner h2',
            type: 'inside'
        },
        {
            key: 'position', // { id: '125888', name: 'World', position: 0 }
            customFunc: function (o) {
                var index = o['index'];
                return 'Homepage | Slider | ' + index;
            },
        },
    ]
}, function (o) {
    var arr = o['data'], // callback den dönen obje [{ id: '125888', name: 'Hello', position: 0 }, { id: '125999', name: 'World', position: 1 }]
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
});
```
