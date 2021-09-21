#!/usr/bin/env python3
# -*- coding=utf-8 -*-
import os
import pymongo

client = pymongo.MongoClient(
    'mongodb://{user}:{passwd}@{host}:{port}'.format(
        user=os.environ.get('MONGO_USER', 'root'),
        passwd=os.environ.get('MONGO_PASSWORD', 'scenic-lob-walker-anima-sauld-bikini-repile'),
        host=os.environ.get('MONGO_HOST', 'localhost'),
        port=int(os.environ.get('MONGO_PORT', 27017))
    ))
db = client['shortlink']

def init():
    db.links.create_index([('id', pymongo.ASCENDING)], unique=True)
    db.links.create_index([('link', pymongo.ASCENDING)], unique=True)

if __name__ == "__main__":
    init()
