const { decodeJwt } = require("./helpers/jwt-helpers.js");
const { unbanUser } = require("./helpers/user-helpers.js");

exports.handler = async function (event, context) {
    if (event.httpMethod !== "GET") {
        return {
            statusCode: 405
        };
    }

    if (event.queryStringParameters.token !== undefined) {
        const unbanInfo = decodeJwt(event.queryStringParameters.token);
        if (unbanInfo.userId !== undefined) {
            try {
                await unbanUser(unbanInfo.userId, process.env.GUILD_ID, process.env.DISCORD_BOT_TOKEN);
                
                return {
                    statusCode: 303,
                    headers: {
                        "Location": `/success?msg=${encodeURIComponent("Der Benutzer wurde entbannt.\nBitte kontaktieren Sie Ihn und lassen Sie es Ihn wissen.")}`
                    }
                };
            } catch (e) {
                return {
                    statusCode: 303,
                    headers: {
                        "Location": `/error?msg=${encodeURIComponent("Ein unerwarteter Fehler ist aufgetreten!\nBitte entbanne diesen Benutzer manuell.")}`
                    }
                };
            }
        }
    }

    return {
        statusCode: 400
    };
}
