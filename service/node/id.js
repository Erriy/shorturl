const redis = require('redis');

const obj = {
    /**
     * @type {redis.RedisClient}
     */
    rds: null,
    id_list: [],
};
const digit62 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

function init() {
    obj.rds = redis.createClient(
        process.env.REDIS_PORT || 6379,
        process.env.REDIS_HOST || 'localhost',
        {
            password: process.env.REDIS_PASSWORD || 'pernyi-awmous-leanly-crotin-shoop-cotula-embira'
        }
    )
}

/**
 *
 * @param {string} s
 * @param {number} width
 * @param {string} fillchar
 */
function str_rjust(s, width, fillchar) {
    const n = width - s.length;
    return fillchar.repeat(n > 0 ? n : 0) + s;
}


function int_to_str62(x) {
    let s = '';
    while(x > 0) {
        s = digit62[x%62] + s;
        x = parseInt(x/62);
    }
    return s;
}

/**
 * 获取id
 * @returns {Promise<number>}
 */
function get() {
    return new Promise((resolve)=>{
        let id = obj.id_list.shift();
        if(undefined !== id) {
            return resolve(id);
        }
        obj.rds.incr('id', (err, n)=>{
            return resolve(str_rjust(int_to_str62(n), 8, '0'));
        })
    })
}

function store(id) {
    if(obj.id_list.indexOf(id) === -1) {
        obj.id_list.push(id);
    }
}

module.exports = {
    init,
    get,
    store,
};
