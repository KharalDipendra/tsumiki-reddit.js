# tsumiki-reddit.js
A simple wrapper for fetching information from reddit posts. Execelent for Discord bots.

Read more about the Reddit API documentation here:

[Reddit API Documentation](https://www.reddit.com/dev/api/)

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
    if(post == null) {
    return <message>.channel.send(`Check your options`)
    }
    
    /* Post will return "0" when the subreddit you searched for don't have a valid post to display. */
    /* This can be caused by having "AllowNSFW" on false and searching in a subreddit with only NSFW images... */
    /* It can also be caused by a subreddit only containing videos/external image links. */
    /* This can easily be overwritten by setting "allowPosts" to true. */
    if(post == 0) {
    return <message>.channel.send(`There was no posts to be found in that subreddit!\nTry another one!`)
    }
    
    /* Defines a embed to send in chat */
    let embed = new Discord.MessageEmbed()
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
### If you want to convert post.created_utc
`<post>.created_utc` is displayed in Epoch time. `<post>.created_utc` is the preffered to use.
While you can still use `<post>.created`, it is preffered to use the one converted to UTC to get the correct time.
I highly reccomend using [moment](https://www.npmjs.com/package/moment) NPM package to convert it.

### Example converting Epoch time in moment
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
    let embed = new Discord.MessageEmbed()
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

Returns a promise that resolves to a JSON object (`Promise<object>`).

## Options

| FIELD          | TYPE          | DESCRIPTION | DEFAULT |
| :------------- |:-------------:|:-----------:|:-------:|
| subreddit      | string | an existing reddit community |
| sort           | string?      |   a valid reddit sorting option | 'all'
| allowNSFW      | boolean?     |    whether or not the returned post can be marked as NSFW | false
| allowModPost   | boolean?     |    whether or not the returned post can be distinguished as a mod post | false
| allowCrossPost | boolean?  | whether or not the returned post can be a crosspost | false |

## Tips & Tricks
- Data returned has all sorts of conditionals you can check to specify further what kind of post you're looking for.
- See contribution guidelines at [CONTRIBUTING.md](https://github.com/LilyAsFlora/reddit-fetch/blob/master/CONTRIBUTING.md)

## Dependencies
- `node-fetch` v2.6.0 ([LINK](https://www.npmjs.com/package/node-fetch))

