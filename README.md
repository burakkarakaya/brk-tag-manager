# Brk Tag Manager

Genel amacı belirlenen htmlde belirtilen alanaları kullanıcı davranışlarına göre google analytic gibi analiz araçlarına gönderebilmek.

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
});
```
