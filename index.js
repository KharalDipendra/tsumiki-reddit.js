var WebSocketClient = require('websocket').client;
const wsclient = new WebSocketClient();
const EventEmitter = require("events");
const { post } = require('request');
const { server } = require('websocket');
const gateway = "https://dbl.v-server.io:34"
var loggedin = false
var con;
var bid;

class Client extends EventEmitter {
    login(APItoken, botID) {
        wsclient.connect(gateway, "echo-protocol")
        wsclient.on("connect", (connection) => {
            connection.send(JSON.stringify({
                type: "login",
                token: APItoken,
                bot: botID
            }))

            connection.on("message", req => {
                const msg = JSON.parse(req.utf8Data)

                if (msg.type == "error") return console.log(msg.message)
                if (msg.type == "vote") {
                    this.emit("vote", msg.vote)
                }
                if (msg.type == "updated") this.emit("update", JSON.parse(msg.data))
                if (msg.type == "login") {
                    loggedin = true
                    con = connection
                    bid = botID
                    this.emit("ready")
                }
            })
        })
    }
/**
 *  AutoPost to discord-botlist.eu API
 * @see {@link https://www.npmjs.com/package/Tsumiki-dbl.eu|NPM page} for help.
 * @param {Object} client The client that you initialize discord.js with. (e.g bot, client etc)
 * @param {String?} postTime [Optional] The Auto post interval (e.g 5min, 1h, 12h etc) between posts - See {@link https://www.npmjs.com/package/Tsumiki-dbl.eu|NPM page} for all supported formats! [Default: 60 minutes]
 * @param {Boolean?} log [Optional] Whether or not to log when it posts to the API every x. [Default: true]
 * @param {Boolean?} date [Optional] Whether or not to include the date in the console.log message if "log" is set to true. [Default: False]
 */

    autoPost(client, postTime="", log=Boolean, date=Boolean){
        let convertedDate = new Date().toLocaleString("en-GB", { timeZone: "Europe/Oslo" });
        
        if (!con) throw new Error(`Please login before you begin posting any Data!\nMake sure that you login to the API first! Then have this event below it.`)
        
        // Reverts to default: auto-post every 1 hour. (60 minutes)
        if(!postTime) autoPostTimer = 1000 * 60 * 60
        
        // Sets the autoPostTimer in minutes
        else if(postTime) {
            time0 = [`5` , `5min`, `5m`, `5minute`, `5minutes`, `05m`, `05min`, `05minutes`, `five`, `five minutes`, `five minute`]
            time1 = [`15` , `15min`, `15m`, `15minute`, `15minutes`, `fifteen` , `fifteen minutes`, `fifteen minute`]
            time2 = [`30` , `30min`, `30m`, `30minute`, `30minutes`, `thirty`, `thirty minutes`, `thirty minute`]
            time3 = [`1` , `1h`, `1hour`, `1hours`, `01h`, `one hour`, `one hours`]
            time4 = [`2` , `2h`, `2hour`, `2hours`, `02h`, `two hour`, `two hours`]
            time5 = [`3` , `3h`, `3hour`, `3hours`, `03h`, `three hour`, `three hours`]
            time6 = [`4` , `4h`, `4hour`, `4hours`, `04h`, `four hour`, `four hours`]
            time7 = [`5` , `5h`, `5hour`, `5hours`, `05h`, `five hour`, `five hours`]
            time8 = [`10` , `10h`, `10hour`, `10hours`, `10h`, `ten hour`, `ten hours`]
            time9 = [`12` , `12h`, `12hour`, `12hours`, `12h`, `halfday`, `half-day`, `twelve hour`, `twelve hours`]
            time10 = [`24` , `24h`, `24hour`, `24hours`, `24h`, `1day`, `1d`, `entireday`]

            // autoPostTimer argument to check against arrays with modification to the string. (RegEX expression to remove all whitespaces from string)
            let searchTime = postTime.toLowerCase().replace(/\s/g, "")
            if(searchTime === "") autoPostTimer = 1000 * 60 * 60
            // 5 minutes
            else if(time0.includes(searchTime)) autoPostTimer = 300000
            // 15 minutes
            else if(time1.includes(searchTime)) autoPostTimer = 1000 * 15 * 15
            // 30 minutes
            else if(time2.includes(searchTime)) autoPostTimer = 1000 * 30 * 30
            // 1 hour
            else if(time3.includes(searchTime)) autoPostTimer = 1000 * 60 * 60
            // 2 hours
            else if(time4.includes(searchTime)) autoPostTimer = 7200000
            // 3 hours
            else if(time5.includes(searchTime)) autoPostTimer = 10800000
            // 4 hours
            else if(time6.includes(searchTime)) autoPostTimer = 14400000
            // 5 hours
            else if(time7.includes(searchTime)) autoPostTimer = 18000000
            // 10 hours
            else if(time8.includes(searchTime)) autoPostTimer = 36000000
            // 12 hours
            else if(time9.includes(searchTime)) autoPostTimer = 43200000
            // 24 hours
            else if(time10.includes(searchTime)) autoPostTimer = 86400000
            // else default to 60 min
            else {
                // Reverts to default: 60 minutes interval.
                autoPostTimer = 1000 * 60 * 60
                console.log(`Invalid time set!\n${postTime} is not a supported time format. Reverting to default: 60 min\nSee npm/github page for supported time format!`)
            }
            
        }
        // Sets the date parameter, if its included
        if(!date || date && date === false) console_message = `Automatically posted stats to discord-botlist.eu!`
        if(date && date !== Boolean) console.warn(`"${date}" is not an accepted value.\nPlease use a bolean (true or false)`)
        if(date && date === true) console_message = `[${convertedDate}] Automatically posted stats to discord-botlist.eu!`

        setInterval(function(){
        con.send(JSON.stringify({
            type: "postData",
            data: JSON.stringify({
                server_count: client.guilds.cache.size || client.guilds.size,
                shard_count: 0,
                botid: bid
            })
        }))
        if(log && log === true){
            console.log(`${console_message}`)
        }
        }, autoPostTimer)
    }
    
    /**
    *  Manual post to discord-botlist.eu API
    * @see {@link https://www.npmjs.com/package/Tsumiki-dbl.eu|NPM page} for help.
    * @param {Object} serverCount on v12 you can use [client].guilds.cache.size. On v11 or below use [client].guilds.size
    * @param {Object?} shardCount on v12 you can use [client].shards.cache.size. On v11 or below use [client].shards.size
    */
    postData(serverCount, shardCount) {
        if (!con) throw new Error(`Please login before you begin posting any Data!\nMake sure that you login to the API first! Then have this event below it.`)
        
        // Check serverCount and checks if its a validated value or not.
        if (!serverCount) serverCount = 0 + console.log(`You're missing the property serverCount.\nPlease restart your application and try again with a valid serverCount property.`)
        else if(serverCount && isNaN(serverCount) == true) throw new Error(`The given value of "serverCount" is not a number!\nRemember that posting wrong stats to the API can result in an API ban.`)
        
        // Check shardCount and checks if its a validated value or not.
        if (!shardCount) shardCount = 0 // This feature is yet not supported, so it will automatically return 0. 
        else if(shardCount && isNaN(shardCount) == true) throw new Error(`The given value of "shardCount" is not a number!\nRemember that posting wrong stats to the API can result in an API ban.`)

        con.send(JSON.stringify({
            type: "postData",
            data: JSON.stringify({
                server_count: serverCount,
                shard_count: shardCount,
                botid: bid
            })
        }))
    }
}

module.exports = {
    Client
}