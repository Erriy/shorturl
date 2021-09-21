#!/usr/bin/env python3
# -*- coding=utf-8 -*-
from flask import Flask, request, abort, redirect
from pymongo import ReturnDocument
from db import db
import id as shortid

app = Flask(__name__)

@app.route('/', methods=['PUT'])
def route_create():
    link = str(request.args.get('link', ''))
    # todo 检查link是否合规
    if len(link) == 0:
        abort(400, '未指定link参数，拒绝执行')

    _id = shortid.get()

    d = db.links.find_one_and_update(
        dict(link=link),
        {
            '$setOnInsert': dict(link=link, id=_id),
        },
        upsert=True,
        return_document = ReturnDocument.AFTER
    )

    if d['id'] == _id:
        shortid.ack()

    return d['id']


@app.route('/<id>', methods=['GET'])
def route_redirect(id):
    d = db.links.find_one({'id': id})
    if d == None:
        abort(404)
    return redirect(d['link'], 301)


if __name__ == "__main__":
    app.run(host='localhost', port=8088, debug=True)