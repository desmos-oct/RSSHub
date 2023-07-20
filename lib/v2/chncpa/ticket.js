const cheerio = require("cheerio");
const got = require('@/utils/got');


module.exports = async (ctx) => {
    const results = [];

    const origin =  'https://m.chncpa.org/search/type.html?type=all&datestr=all';
    const response1 = await got(origin);
    const $1 = cheerio.load(response1.data);
    const pageNum = $1('#pages').attr('value');
    const list = [];
    for (let i = 1;i <= pageNum;i++) {
        list.push(i);
    }


    const pages = await Promise.all(
        list.map(async (item) => {
            const url = `https://m.chncpa.org/search/sync.html?pagenum=${item}&type=all&datestr=all`;
            const pagedata = await got(url);
            return pagedata.data;
        })
    );


    for (let j = 0;j < pageNum;j++) {
        const page = pages[j];
        const $ = cheerio.load(page);

        const items = $('.item');

        items.each((i, elem) => {
            const title = $(elem).find('.right > .title > .result_link');
            const status = $(elem).find('.pic > .t > span');
            results.push({
                title: title.text() + ' ' + status.text(),
                link: title.attr('href'),
                guid: title.text() + ' ' + status.text(),
            });
        });
    }

    ctx.state.data = {
        title: `ncpa tickets`,
        link: `https://m.chncpa.org/search/type.html?type=all&datestr=all`,
        description: 'ncpa 开票信息',
        item: results,
    };
};
