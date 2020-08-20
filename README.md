# tsumiki-reddit.js
A simple wrapper for fetching information from reddit posts. Excellent for Discord bots. \
Mainly coded for [Tsumiki](https://github.com/Electrocute4u/Tsumiki), a Discord Bot written in Javascript.

**Read more about the Reddit API documentation here:** \
[Reddit API Documentation](https://www.reddit.com/dev/api/)


## Options

| FIELD          | TYPE          | DESCRIPTION | DEFAULT |
| :------------- |:-------------:|:-----------:|:-------:|
| subreddit      | string | a reddit community |
| type           | string?      |   a valid reddit type option (hot, top, new, rising)| 'top'
| sort           | string?      |   a valid reddit sorting option | 'all'
| allowNSFW      | boolean?     |    whether or not the returned post can be marked as NSFW | false
| allowModPost   | boolean?     |    whether or not the returned post can be distinguished as a mod post | false
| allowCrossPost | boolean?  | whether or not the returned post can be a crosspost | false |
| allowPosts | boolean?  | allow posts with no fetchable images (e.g videos, external links, posts) | false |

## Dependencies
- `node-fetch` v2.6.0 ([LINK](https://www.npmjs.com/package/node-fetch))

## Usage & Example
```javascript
const redditFetch = require('tsumiki-reddit.js');

redditFetch({

    subreddit: 'Pokemon',
    type: `top`,
    sort: 'all',
    allowNSFW: true,
    allowModPost: true,
    allowCrossPost: true,
    allowPosts: false,

}).then(post => {
    console.log(post);
});
```
Returns a promise that resolves to a JSON object (`Promise<object>`).

## Example for a Discord bot
```javascript
const redditFetch = require('tsumiki-reddit.js');

redditFetch({
    
    /* Insert your options here, you can find all options on the NPM or Github repo */
    subreddit: 'Pokemon',
    type: `top`,
    sort: 'all',
    allowNSFW: true,
    allowModPost: true,
    allowCrossPost: true,
    allowPosts: false, /* This will allow video and external image posts to be pulled */

}).then(post => {
    
    /* post will be null if an option is invalid. */ 
    /* This can be because you entered a subreddit that wasn't correct/closed. */
    /* Or you messed up something in the options, check NPM page or Github for help. */
    /* This is where you can catch before the promise, if the subreddit entred is incorrect or closed */
    if(post == null) {
    return <message>.channel.send(`Check your options!\nAnd check if you spelled the subreddit correctly.`)
    }
    
    
    /* Post will return "0" when the subreddit you searched for don't have a valid post to display. */
    /* This can be caused by having "AllowNSFW" on false and searching in a subreddit with only NSFW images... */
    /* It can also be caused by a subreddit only containing videos/external image links. */
    /* This can easily be overwritten by setting "allowPosts" to true. */
    if(post == 0) {
    return <message>.channel.send(`There were no posts to be found in that subreddit!\nTry another one!`)
    }
    
    
    /* Defines a embed to send in chat */
    let embed = new Discord.MessageEmbed() /* for discord.js V.11 or below, use let embed = new Discord.RichEmbed() */
     .setTitle(post.title)
     .setURL(`https://www.reddit.com${post.permalink}`)
     .setColor("RANDOM")
     .setDesciption(`Here is a random picture from **${post.subreddit_name_prefixed}**`)
     .setImage(`${post.url}`)
     
     /* Send the embed in chat */
     return <message>.channel.send(embed)
     
     /* Console log the JSON object */
     console.log(post)
     
     /* <message> can be changed out for whatever you defined message as (e.g msg, m, message etc) */
});
```
### Convert post.created_utc to a normal date format:
`<post>.created_utc` is displayed in Epoch time. You want to use `<post>.created_utc` over `<post.created>`. \
While you can still use `<post>.created`, it is preferred to use the one converted to UTC to get the correct time. \
I highly reccomend using [moment](https://www.npmjs.com/package/moment) NPM package to convert it.

### Example converting Epoch time with moment for a Discord Bot
```javascript 
const moment  = require("moment");
const redditFetch = require('tsumiki-reddit.js');

redditFetch({
    
    /* Insert your options here, you can find all options on the NPM or Github repo */
    subreddit: 'Pokemon',
    type: `top`,
    sort: 'all',
    allowNSFW: true,
    allowModPost: true,
    allowCrossPost: true,
    allowPosts: false, /* This will allow video and external image posts to be pulled */

}).then(post => {

/* Define the Date variable to use later on /*
var Date = moment.unix(post.created_utc).format('DD.MM.YYYY')

/* Defines a embed to send in chat */
    let embed = new Discord.MessageEmbed() /* for discord.js V.11 or below, use let embed = new Discord.RichEmbed() */
     .setTitle(post.title)
     .setURL(`https://www.reddit.com${post.permalink}`)
     .setColor("RANDOM")
     .setDesciption(`Here is a random picture from **${post.subreddit_name_prefixed}**
     This was created on: ${Date}`)
     .setImage(`${post.url}`)
     
     /* Send the embed in chat */
     return <message>.channel.send(embed)
});
```
## Example output for <post>
**Example 1:** [pastebin](https://pastebin.com/zHGku0BK) - This is an example output of one of the available posts if `allowPosts` is set to `true`. \
This does not include the property `post_hint:` property, which means its automaticly sorted out if `allowPosts` is set to `false` \
I personally just want fetchable images, so I usually have it set to false, since I want to be certain I get loadable images in Discord embed. \
    
 **Example 2:** [pastebin](https://pastebin.com/NYy7kbmW) - This is an example output of one of the available posts if `allowPosts` is set to `true`. \
 This is the prefered way, since it only fetches posts with images that is part of `i.redd.it` domain and is fetchable for Discord Embeds. \

