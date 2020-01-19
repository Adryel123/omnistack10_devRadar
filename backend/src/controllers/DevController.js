const axios = require('axios')
const Dev = require('../models/Dev')

const ParseStringAsArray = require('../utils/ParseStringAsArray')
const { findConnections, sendMessage } = require('../websocket')

module.exports = {
    async index(request, response) {
        const devs = await Dev.find()
        return response.json(devs)
    },


    async store(request, response) {
        const { github_username, techs, latitude, longitude } = request.body

        let dev = await Dev.findOne({ github_username })

        if (!dev) {
            const api_response = await axios.get(`https://api.github.com/users/${github_username}`)

            let { name, avatar_url, bio } = api_response.data
            if (!name) {
                name = api_response.data.login
            }

            const techsArray = ParseStringAsArray(techs)

            const location = {
                type: 'Point',
                coordinates: [longitude, latitude]
            }

            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location
            })

            // Filtrar as conexões que estão a no máximo 10KM
            // e que o novo dev tenha pelo menos uma das tecnologias filtradas

            const sendSocketMessageTo = findConnections(
                { latitude, longitude },
                techsArray
            )

            sendMessage(sendSocketMessageTo, 'new-dev', dev)
        }

        return response.json(dev)
    },


    async destroy(request, response) {
        const { github_username } = request.query
        const dev = await Dev.deleteOne({ github_username: github_username })
        return response.json(dev)
    },
}