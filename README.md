# tsumiki-reddit.js
A simple wrapper for fetching information from reddit posts. Excellent for Discord Bots! \
Mainly coded for [Tsumiki](https://github.com/Electrocute4u/Tsumiki), a Discord Bot written in Javascript. \
Perfect for Pagination, since you can adjust how many results you get back with `amount` property!


## Table of contents
<details>
<summary>"Click to expand"</summary>
 
- [Dependencies](#dependencies)
- [Options](#options)
- [Hint and Tips](#hint-and-tips)
- [Usage and Example](#usage-and-example)
- [Example for a Discord Bot](#example-for-a-discord-bot)
- [Convert reddit date](#convert-reddit-date-to-a-normal-date-format)
- [Example converting Epoch time with moment for a Discord Bot](#example-converting-epoch-time-with-moment-for-a-discord-bot)
- [Example output for "post"](#example-output-for-post)

</details>


## Dependencies
- `node-fetch` v2.6.0 ([LINK](https://www.npmjs.com/package/node-fetch))


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
| amount | number?  | the amount of objects to fetch (for easy pagination!) | 1 |

**Read more about the Reddit API documentation here:** \
[Reddit API Documentation](https://www.reddit.com/dev/api/)

## Hint and Tips
- If you just want supported images for a Discord Embed, set `allowPosts` to `false`.
- For Pagination, make sure to use `post[x].data` to access the data property. (x = index number)
- Want to display all top posts in a subreddit? set `type` to `top` and `sort` to `all`.
- If you want to allow users to use links (e.g https://reddit.com/r/subreddit), make sure to remove the link. \
So only the subreddit name remains. Also make sure to not include r/ in subreddit name.


## Usage and Example
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
    amount: 1,

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
    amount: 1,

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

## Convert reddit date to a normal date format
`<post>.created_utc` is displayed in Epoch time. You want to use `<post>.created_utc` over `<post.created>`. \
While you can still use `<post>.created`, it is preferred to use the one converted to UTC to get the correct time. \
I highly reccomend using [moment](https://www.npmjs.com/package/moment) NPM package to convert it.


## Example converting Epoch time with moment for a Discord Bot
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
    amount: 1,

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

## Example output for "post"
**Example 1:** [pastebin](https://pastebin.com/zHGku0BK) - This is a example output for all possible posts, if `allowPosts` is set to `true`. \
This does not include the property `post_hint` property, which means its automaticly sorted out if `allowPosts` is set to `false` \
I personally just want images, so I usually have it set to false, since I want to be certain I get images that supports Discord embeds.

**Example 2:** [pastebin](https://pastebin.com/NYy7kbmW) - This is a example output if `allowPosts` is set to `true`. \
This is the prefered way, since it only fetches posts with images that is part of `i.redd.it` domain and is fetchable for Discord Embeds. \

