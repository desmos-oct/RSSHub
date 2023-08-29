const cheerio = require("cheerio");
const got = require('@/utils/got');


module.exports = async (ctx) => {
    const results = [];

    const PCAllOrigin = 'https://www.chncpa.org/was5/web/search?channelid=242606&orderby= kssj&page=1'
    const PCActOrigin = 'https://www.chncpa.org/was5/web/search?channelid=204478&orderby= kcsj&page=1'

    //const origin =  'https://m.chncpa.org/search/type.html?type=all&datestr=all';
    const response1 = await got(PCAllOrigin);
    const $1 = cheerio.load(response1.data);
    const pageNum = $1('#pagenum_per').attr('value');
    const list = [];
    for (let i = 1;i <= pageNum;i++) {
        list.push(i);
    }


    const pages = await Promise.all(
        list.map(async (item) => {
            const url = `https://www.chncpa.org/was5/web/search?channelid=242606&orderby= kssj&page=${item}`;
            const pagedata = await got(url);
            return pagedata.data;
        })
    );


    for (let j = 0;j < pageNum;j++) {
        const page = pages[j];
        const $ = cheerio.load(page);

        const items = $('.con.clearfix');

        items.each((i, elem) => {
            const title = $(elem).find('.text > h3 > a');
            //const status = $(elem).find('.pic > .t > span');
            const price = $(elem).find('.text .date').eq(1);
            results.push({
                title: title.text() + ' ' + price.text(),
                link: title.attr('href'),
                guid: title.text() +' '+ price.text(),
            });
        });
    }

    ctx.state.data = {
        title: 'ncpa tickets',
        link: `https://m.chncpa.org/search/type.html?type=all&datestr=all`,
        description: 'ncpa 开票信息',
        item: results,
    };
};
