describe('Demo test 1', function(){
    it('my first test', async () => { // or we can say () => instead of function()
        browser.url('https://google.com/')
        await $('[name="q"]').setValue('WebdriverIo')
        //await $('[name="btnK"]').click()
        browser.keys('Enter')
        browser.pause(2000)
    })
})