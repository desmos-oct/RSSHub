module.exports = (router) => {
    router.get('/ticket/all', require('./ticket'));
    router.get('/ticket/mobile',require('./mobile'));
};
