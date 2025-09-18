const got = require('@/utils/got');

module.exports = async (ctx) => {
    const results = [];
    const origin = `https://openapi.chncpa.org/info/product/search/list?pageNo=1&pageSize=150&search=&code=&timeStatus=`;
    const response = await got(origin);
    const data = response.data;

    const obj = JSON.parse(JSON.stringify(data));

    for (const item of obj.data.records) {
        results.push({
            title: item.productName + ' ' + item.priceStart,
            link: `https://m.chncpa.org/product.html?id=${item.productId}`,
            guid: item.productId + ' ' + item.priceStart,
            description: `手机：https://m.chncpa.org/product.html?id=${item.productId}<br>电脑：https://wticket.chncpa.org/product.html?id=${item.productId}`,
        });
    }

    ctx.state.data = {
        title: 'ncpa mobile',
        link: 'https://m.chncpa.org/search/type.html?type=all&datestr=all',
        description: 'ncpa 开票信息',
        item: results,
    };
};
