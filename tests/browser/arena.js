const Flagpole = require('../../dist/index.js').Flagpole;
const suite = Flagpole.suite('Basic Smoke Test of Site')
    .base('http://staging-arena.flowrestling.org/');

const opts = {
    width: 1280,
    height: 600,
    headless: false
}

const selectors = {
    sectionHeaders: '.section > div.events > h4'
}

suite.browser("Homepage Loads Stuff", opts)
    .open('/')
    .next(async context => {
        context.assert('HTTP Status equals 200', context.response.statusCode).equals(200);
        await context.waitForExists(selectors.sectionHeaders, 10000);
        const h4s = await context.findAll(selectors.sectionHeaders);
        context.assert(h4s).length.equals(3);
        context.assert(await h4s[0].getText()).like('Live Today');
        context.assert(await h4s[1].getText()).like('Upcoming');
        context.assert(await h4s[2].getText()).like('Results');
    })
    .next(async context => {
        const listItems = await context.findAll('.upcoming .events-group li');
        const firstItem = listItems[0];
        context.assert(listItems).length.greaterThan(0);
        context.assert(firstItem).exists();
        context.comment(await firstItem.getText());
        const secondItem = await firstItem.getNextSibling();
        context.comment(await secondItem.getText());
        context.assert(await secondItem.getText()).contains('Registration');
        const ul = await firstItem.getParent();
        context.assert(await ul.hasClassName('list')).equals(true);
    });