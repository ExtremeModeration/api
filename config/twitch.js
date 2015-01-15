/**
 * Created by steve on 1/8/15.
 */
module.exports = {
    client: {
        id: process.env.TWITCH_CLIENT_ID || 'osz9c2zqlvf7am0q20ex81yeisxectq',
        secret: process.env.TWITCH_CLIENT_SECRET,
        redirect_url: (process.env.TWITCH_REDIRECT_URL || 'http://localhost:3000/twitch_login')
    }
};
