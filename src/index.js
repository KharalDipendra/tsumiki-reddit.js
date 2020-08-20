'use strict'
const FetchError = require('./errors/FetchError.js');
const nfetch = require('node-fetch');

/**
 *  Makes a HTTP GET request to retrieve JSON data from a post of the specified subreddit.
 *
 * @param {Object} options Function options.
 * @param {string} options.subreddit The target subreddit to retrieve the post from.
 * @param {string} options.type The sorting type to search for data.
 * @param {string} options.sort The sorting option to search for data.
 * @param {boolean?} [options.allowNSFW] Whether or not the returned post can be marked as NSFW.
 * @param {boolean?} [options.allowModPost] Whether or not the returned post can be distinguished as a moderator post.
 * @param {boolean?} [options.allowCrossPost] Whether or not the returned post can be a crosspost.
 * @param {boolean?} [options.allowPosts] Whether or not the returned post can be a Image and not a post without a Image output.
 * @param {number?} [options.amount] The amount of objects to fetch. [Default: 1].
 *
 * @returns {Promise<object>} Promise that resolves to a JSON object value.
 */

async function redditFetch({ subreddit, type = `top` , sort = 'all', allowNSFW, allowModPost, allowCrossPost, allowPosts, amount = 1 }) {
    return new Promise((resolve, reject) => {

    /* Check required argument */
    if (!subreddit)
    return reject(new Error('Missing required argument "subreddit"'));

    /* Validate options */
    if (typeof(subreddit) !== 'string')
    return reject(new TypeError(`Expected type "string" but got "${typeof(subreddit)}"`));
    
    if (type && typeof(type) !== 'string')
    return reject(new TypeError(`Expected type "string" but got "${typeof(type)}"`));

    if (sort && typeof(sort) !== 'string')
    return reject(new TypeError(`Expected type "string" but got "${typeof(sort)}"`));

    if (allowNSFW && typeof(allowNSFW) !== 'boolean')
    return reject(new TypeError(`Expected type "boolean" but got "${typeof(allowNSFW)}"`));

    if (allowModPost && typeof(allowModPost) !== 'boolean')
    return reject(new TypeError(`Expected type "boolean" but got "${typeof(allowModPost)}"`));

    if (allowCrossPost && typeof(allowCrossPost) !== 'boolean')
    return reject(new TypeError(`Expected type "boolean" but got "${typeof(allowCrossPost)}"`));
    
    if (allowPosts && typeof(allowPosts) !== 'boolean')
    return reject(new TypeError(`Expected type "boolean" but got "${typeof(allowPosts)}"`));

    if (amount && typeof(amount) !== 'number')
    return reject(new TypeError(`Expected type "number" but got "${typeof(type)}"`));
    
    
    /* Checking if amount is a number, if not, fallback to default value. */
    if(isNaN(amount)){
        amount = 1   
    } else {
        amount = amount
    }
    if(amount > 100){
        amount = 100
    }
    
    /* Configuration & target URL */
    sort = sort.toLowerCase();
    type = type.toLowerCase();
    const sub = subreddit.toLowerCase();
    const targetURL = `https://reddit.com/r/${sub}/${type}.json?sort=${sort}&t=all&limit=100`;
    

    // @ts-ignore
    nfetch(targetURL).then(res => res.json())
    .then(body => {
		
		let post
        /* If not found */
        if (!body.data){
        post = null;
        return resolve(post);
        }

        /* Array of found submissions */
        let found = body.data.children;
        
		/* Apply options */
		
		/* Allow NSFW posts [default: false] */
        if (!allowNSFW)
        found = found.filter(p => !p.data.over_18);

		/* Allow a MOD post [default: false] */
        if (!allowModPost)
        found = found.filter(p => !p.data.distinguished);

		/* Allow Crossposts [default: false] */
        if (!allowCrossPost)
        found = found.filter(p => !p.data.crosspost_parent_list);

		/* Allow all sort of posts (e.g videos, external links, no image posts etc) [default: false] */
        if (!allowPosts)
        found = found.filter(p => p.data.post_hint && p.data.post_hint !== "self" && p.data.post_hint !== "rich:video" && p.data.domain == "i.redd.it");

		/* If nothing is found, return post as 0, will allow for easier catching. */
        if (!found.length){
            post = 0
            return resolve(post);
        }
        
        if(amount == 1){
        
        /* Pick random post from array of found data */
        let randInt = Math.floor(Math.random() * found.length);
        post = found[randInt].data;
        return resolve(post);
        }
        
        /* Slice the JSON down to the correct amount */
        else {
        post = found.slice(0, amount)
        /* Returns the objects */
        return resolve(post);
        }

        });
    });
};
/* Exports it*/
module.exports = redditFetch;