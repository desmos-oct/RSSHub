const cheerio = require("cheerio");
const got = require('@/utils/got');


module.exports = async (ctx) => {
    var d = new Date();
    let months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
    var date = `${d.getFullYear()}-${months[d.getMonth()]}-${d.getDate()}`;

    let getByChannelId = async (channelid, order, searchwd) => {
        let results = [];
        const origin = `https://www.chncpa.org/was5/web/search?channelid=${channelid}&orderby= ${order}&page=1&sw=&searchword=${searchwd}`;
        const response1 = await got(origin);
        const $1 = cheerio.load(response1.data);
        const pageNum = $1('#pagenum_per').attr('value') ? $1('#pagenum_per').attr('value') : $1('#pagenum_hd').attr('value');
        const list = [];
        for (let i = 1;i <= pageNum;i++) {
            list.push(i);
        }


        const pages = await Promise.all(
            list.map(async (item) => {
                const url = `https://www.chncpa.org/was5/web/search?channelid=${channelid}&orderby= ${order}&page=${item}&sw=&searchword=${searchwd}`;
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
                const price = $(elem).find('.text .date');
                const pricelen = price.length;
                results.push({
                    title: title.text() + ' ' + price.eq(pricelen-1).text(),
                    link: title.attr('href'),
                    guid: title.text() +' '+ price.eq(pricelen-1).text(),
                });
            });
        }
        return results;
    }

    // const PCAllOrigin = `https://www.chncpa.org/was5/web/search?channelid=242606&orderby= kssj&page=1&searchword=jssj>='${date}'`;
    // const PCActOrigin = 'https://www.chncpa.org/was5/web/search?channelid=204478&orderby= kcsj&page=1';

    //const origin =  'https://m.chncpa.org/search/type.html?type=all&datestr=all';

    let results = await getByChannelId(242606,'kssj',`jssj>='${date}'`);
    let results2 = await getByChannelId(204478,'kcsj',`(kcsj>='${date}' or kssj>='${date}')`);
    results = results.concat(results2);

    ctx.state.data = {
        title: 'ncpa tickets',
        link: "https://m.chncpa.org/search/type.html?type=all&datestr=all",
        description: 'ncpa 开票信息',
        item: results,
    };
};
