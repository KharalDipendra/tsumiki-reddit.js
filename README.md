# tsumiki-reddit.js
A simple wrapper NPM package for fetching information from reddit posts. Excellent for Discord Bots! \
Mainly recoded for [Tsumiki](https://github.com/Electrocute4u/Tsumiki), a Discord Bot written in Javascript. \
Perfect for Pagination, since you can adjust how many results you get back with `amount` property! \
It also supports discord friendly images for discord embeds that will guarantee a fetchable image URL. 


## Table of contents
<details>
<summary>"Click to expand"</summary>
 
- [Dependencies](#dependencies)
- [Options](#options)
- [Hint and Tips](#hint-and-tips)
- [Example on Pagination](#example-on-pagination)
- [Usage and Example](#usage-and-example)
- [Example for a Discord Bot](#example-for-a-discord-bot)
- [Convert reddit date](#convert-reddit-date-to-a-normal-date-format)
- [Example converting Epoch time with moment for a Discord Bot](#example-converting-epoch-time-with-moment-for-a-discord-bot)
- [Example output for "post"](#example-output-for-post)

</details>


## Dependencies
- `node-fetch` v2.6.1 ([LINK](https://www.npmjs.com/package/node-fetch))


## Options

| FIELD          | TYPE          | DESCRIPTION | DEFAULT |
| :------------- |:-------------:|:-----------:|:-------:|
| subreddit      | string | the reddit community name or reddit link (e.g https://reddit.com/r/discordjs) |
| type           | string?      |   a valid reddit type option (hot, top, new, rising)| 'top'
| sort           | string?      |   a valid reddit sorting option | 'all'
| allowNSFW      | boolean?     |    whether or not the returned post can be marked as NSFW | false
| allowModPost   | boolean?     |    whether or not the returned post can be distinguished as a mod post | false
| allowCrossPost | boolean?  | whether or not the returned post can be a crosspost | false |
| onlyImage | boolean?  |  whether or not the returned post is an image. | false |
| allowAllDomains | boolean?  |  whether or not the returned post can be from another domain than "i.redd.it" | false |
| amount | number?  | the amount of objects to fetch (max: 100) | 1 |

**Read more about the Reddit API documentation here:** \
[Reddit API Documentation](https://www.reddit.com/dev/api/)

## Hint and Tips
- If you just want supported images for a Discord Embed, set `onlyImage` to `true`. Its set to false by default.
- If you want Pagination for Discord bots, make sure to use `post[x].data` to access the data property of each object. (x = index number)
- Want to display all top posts in a subreddit? set `type` to `top` and `sort` to `all`.
- `subreddit` accepts both the subreddit name or the subreddit url \
**Examples:** https://reddit.com/r/discordjs or **r/discordjs** or even **reddit.com/discord.js** (which is just a simplified version) \
It has an advanced filter to find the community name in most scenarios. 

### All output types & domain types.
If you want all output types (videos, GIFs, external URLs etc) and allow it from all types of domains. \
Then set `onlyImage` to `false` and `allowAllDomains` to `true`.

## Usage and Example
```javascript
const redditFetch = require('tsumiki-reddit.js');
redditFetch({

    subreddit: 'Pokemon',
    type: `top`,
    sort: 'all',
    allowNSFW: false,
    allowModPost: true,
    allowCrossPost: true,
    onlyImage: true,
    allowAllDomains: false,
    amount: 1,

}).then(post => {

/* Checking if the subreddit exists and isn't banned / unavailable . */
if(post == null){
   return console.log(`The subreddit name might have been spelled incorrectly or it was banned.`)
}

/* Checking if there are any fetchable posts */
if(post == 0){
   return console.log(`Could not find any posts to fetch from that subreddit! Try another one!`)
}

/* Console logs the object */
console.log(post);

});
```
Returns a promise that resolves to a JSON object (`Promise<object>`).

## All output types & domain types example
```javascript
const redditFetch = require('tsumiki-reddit.js');
redditFetch({

    subreddit: 'Pokemon',
    type: `top`,
    sort: 'all',
    allowNSFW: false,
    allowModPost: true,
    allowCrossPost: true,
    onlyImage: false,
    allowAllDomains: true,
    amount: 1,

}).then(post => {

/* Checking if the subreddit exists and isn't banned / unavailable . */
if(post == null){
   return console.log(`The subreddit name might have been spelled incorrectly or it was banned.`)
}

/* Checking if there are any fetchable posts */
if(post == 0){
   return console.log(`Could not find any posts to fetch from that subreddit! Try another one!`)
}

/* Console logs the object */
console.log(post);

});
```
Returns a promise that resolves to a JSON object (`Promise<object>`).

## Example on Pagination / Return more then 1 object
```javascript
const redditFetch = require('tsumiki-reddit.js');
redditFetch({

    subreddit: 'Pokemon',
    type: `top`,
    sort: 'all',
    allowNSFW: false,
    allowModPost: true,
    allowCrossPost: true,
    onlyImage: true,
    allowAllDomains: false,
    amount: 3,

}).then(post => {
    console.log(post[0].data);
    console.log(post[1].data);
    console.log(post[2].data);
});
```
Returns a promise that resolves to a JSON object (`Promise<object>`).

### Return a image/GIF that is supported by Discord embeds
Be sure to set `onlyImage` to `true` and `allowAllDomains` to `false` for a 100% chance of recieving a discord supported image/GIF format. \
If you don't do this, you will ocassionally get GIFs from Imgur that is of GIFV format, or get External URLs to images that isn't fetchable.


## Example for a Discord bot
```javascript
const redditFetch = require('tsumiki-reddit.js');
redditFetch({

    /* Insert your options here, you can find all options on the NPM or Github repo */
    subreddit: 'Pokemon', // Subreddit name.
    type: `top`, // Valid reddit type sorting option can be used here 
    sort: 'all', // Valid reddit sorting option can be used here 
    allowNSFW: true, // If you're pretty ecchi, turn this on you degenerate uwu 
    allowModPost: true, // Whether or not the post can be a mod post 
    allowCrossPost: true, // Whether or not the post can be a crosspost 
    onlyImage: true, // whether or not to only return posts that is marked as "images" by API.
    allowAllDomains: false, // By default set to false and will only fetch from "i.redd.it" domain (best for images)
    amount: 1, // The amount of posts to return. Max is 100 and default is 1 

}).then(post => {
    
    /* post will be null if an option is invalid. */ 
    /* This can be because you entered a subreddit that wasn't correct/closed. */
    /* Or you messed up something in the options, check NPM page or Github for help. */
    /* This is where you can catch before the promise, if the subreddit entred is incorrect or closed */
    if(post == null) {
    return message.channel.send(`Check your options!\nAnd check if you spelled the subreddit correctly.`) // replace <message> with what you called the message property
    }
    
    
    /* Post will return "0" when the subreddit you searched for don't have a valid post to display. */
    /* This can be caused by having "allowNSFW" on false and searching in a subreddit which only has NSFW images... */
    /* It can also be caused by a subreddit only containing videos/external image links and you have "allowAllDomains" set to false. */
    /* This can easily be overwritten by setting "onlyImage" to true. */

    if(post == 0) {
    return message.channel.send(`There were no posts to be found in that subreddit!\nTry another one!`) // replace <message> with what you called the message property
    }
    
    
    /* Defines a embed to send in chat */
    let embed = new Discord.MessageEmbed() /* for discord.js V.11 or below, use let embed = new Discord.RichEmbed() */
     .setTitle(post.title)
     .setURL(`https://www.reddit.com${post.permalink}`)
     .setColor("RANDOM")
     .setDesciption(`Here is a random picture from **${post.subreddit_name_prefixed}**`)
     .setImage(`${post.url}`)
     
     /* Send the embed in chat */
     return message.channel.send(embed) // replace <message> with what you called the message property
     
     /* Console log the JSON object */
     console.log(post)
     
});
```
Returns a promise that resolves to a JSON object (`Promise<object>`).


## Convert reddit date to a normal date format
`<post>.created_utc` is displayed in Epoch time. You want to use `<post>.created_utc` over `<post>.created`. \
While you can still use `<post>.created`, it is preferred to use the one converted to UTC to get the correct time. \
I highly reccomend using [moment](https://www.npmjs.com/package/moment) NPM package to convert it. \
Replace `<post>` with whatever you named the output on `.then()` function.

## Example converting Epoch time with moment for a Discord Bot
```javascript 
const moment  = require("moment");
const redditFetch = require('tsumiki-reddit.js');
redditFetch({
    
    /* Insert your options here, you can find all options on the NPM or Github repo */
    subreddit: 'Pokemon',
    type: `top`,
    sort: 'all',
    allowNSFW: false,
    allowModPost: true,
    allowCrossPost: true,
    onlyImage: true,
    allowAllDomains: false,
    amount: 1,

}).then(post => {
    
    // Returns null if subreddit is banned / unavailable
    if(post == null) {
    return message.channel.send(`Check your options!\nAnd check if you spelled the subreddit correctly.`) // replace <message> with what you called the message property
    }
    
    // Returns 0 if there were no posts found, but the subreddit was not banned / unavailable
    if(post == 0) {
    return message.channel.send(`There were no posts to be found in that subreddit!\nTry another one!`) // replace <message> with what you called the message property
    }

// Define the Date variable to use later on
var Date = moment.unix(post.created_utc).format('DD.MM.YYYY')

/* Defines a embed to send in chat */
    let embed = new Discord.MessageEmbed() // for discord.js V.11 or below, use let embed = new Discord.RichEmbed()
     .setTitle(post.title)
     .setURL(`https://www.reddit.com${post.permalink}`)
     .setColor("RANDOM")
     .setDesciption(`Here is a random picture from **${post.subreddit_name_prefixed}**
     This was created on: ${Date}`)
     .setImage(`${post.url}`)
     
     /* Send the embed in chat */
     return message.channel.send(embed) // replace <message> with what you called the message property
     
});
```
Returns a promise that resolves to a JSON object (`Promise<object>`).

## Example JSON for the "post" object
**Example 1:** [pastebin](https://pastebin.com/zHGku0BK) - This is a example output for all possible posts, if `onlyImage` is set to `true`. \
This does not include the property `post_hint` property, which means its automaticly sorted out if `onlyImage` is set to `false` \
I personally just want images, so I usually have it set to false, since I want to be certain I get images that supports Discord embeds.

**Example 2:** [pastebin](https://pastebin.com/NYy7kbmW) - This is a example output if `onlyImage` is set to `true`. \
This is the prefered way, since it only fetches posts with images that is part of `i.redd.it` domain and is fetchable for Discord Embeds.