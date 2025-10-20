const LoginPage = require('../pages/login.page')

describe('Demo test 2', function(){

    it('login test', async () => {

        browser.url('https://the-internet.herokuapp.com/login')

        await LoginPage.login('tomsmith', 'SuperSecretPassword!')
        
        await LoginPage.checkMessage('You logged into a secure area!')

        // await $('#username').setValue('tomsmith')    

        // await $('#password').setValue('SuperSecretPassword!')

        // await $('button[type="submit"]').click()
        
        // // await $('#flash').getValue('SuperSecretPassword!')

        // await expect ($('#flash').toHaveTextContaining('You logged into a secure area!'))

        // browser.pause(2000)
    })
})