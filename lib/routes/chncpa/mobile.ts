import { Route } from '@/types';
import ofetch from '@/utils/ofetch'; // 统一使用的请求库

export const route: Route = {
    path: '/mobile',
    name: 'ncpa即将开票',
    maintainers: ['desmos-oct'],
    example: '/chncpa/mobile',
    radar: [
        {
            source: ['m.chncpa.org/*'],
            target: '/chncpa/mobile',
        },
    ],
    handler: async () => {
        const results: { title: string; link: string | undefined; guid: string ; description: string}[] = [];
        const origin = `https://openapi.chncpa.org/info/product/search/list?pageNo=1&pageSize=150&search=&code=&timeStatus=`;
        const response = await ofetch(origin);
        const data = response;

        const obj = JSON.parse(JSON.stringify(data));


        obj.data.records.forEach((item) => {
            results.push({
                title: item.productName + ' ' + item.priceStart,
                link: `https://m.chncpa.org/product.html?id=${item.productId}`,
                guid: item.productId + ' ' + item.priceStart,
                description: `手机：https://m.chncpa.org/product.html?id=${item.productId}<br>电脑：https://wticket.chncpa.org/product.html?id=${item.productId}`
            });
        });

        return {
            // 源标题
            title: 'ncpa上架演出',
            // 源链接
            link: "https://m.chncpa.org/search/type.html?type=all&datestr=all",
            description: 'ncpa 售票信息',
            item: results,
        };
    },
};
