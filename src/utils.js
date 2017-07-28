var axios = require('axios')

async function loadAuth (ctx, next) {
    try {
        var whoami = await axios.get('/whoami').then(
            res => res.data
        ) // recuerda que axios trabaja resolviendo el request mediante una promesa 'then'
        if (whoami.username) {
            ctx.auth = whoami
        }
        else {
            ctx.auth = false
        }
        next()
    } catch (error) { console.log(error) }
}

exports.loadAuth = loadAuth