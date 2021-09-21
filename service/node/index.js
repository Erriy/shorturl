const express = require('express');
const mongodb = require('mongodb');
const id = require('./id');

const obj = {
    /**
     * @type {mongodb.Db}
     */
    db: null,
    /**
     * @type {mongodb.Collection}
     */
    links: null,
};


async function init_mongo() {
    const mclient = await mongodb.MongoClient.connect(
        'mongodb://'
        + (process.env.MONGO_USER||'root')
        + ':'
        + (process.env.MONGO_PASSWORD||'scenic-lob-walker-anima-sauld-bikini-repile')
        + '@'
        + (process.env.MONGO_HOST || 'localhost')
        + ':'
        + (process.env.MONGO_PORT || 27017)
    );

    obj.db = mclient.db('shortlink');
    obj.links = obj.db.collection('links');

    for(let k of ['id', 'link']) {
        await obj.links.createIndex({[k]: 1}, {unique: true});
    }
}


async function start() {
    id.init();
    await init_mongo();

    const app = express();

    app.put('/', async(req, res)=>{
        const link = req.query.link || '';
        if(link.length === 0) {
            return res.status(400).send('未指定link参数，拒绝执行');
        }
        const shortid = await id.get();

        const d = await obj.links.findOneAndUpdate(
            {link},
            {$setOnInsert: {link, id: shortid},},
            {upsert: true, returnDocument: 'after'},
        );
        if(d.value.id !== shortid) {
            id.store(shortid)
        }
        return res.status(200).send(d.value.id);

    });

    app.get('/:id', async(req, res)=>{
        const d = await obj.links.findOne({id: req.params.id});
        if(!d) {
            return res.status(404).send('not found');
        }
        return res.redirect(301, d.link)
    });

    app.listen(80);
}


start().then();
