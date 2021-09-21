#!/usr/bin/env python3
# -*- coding=utf-8 -*-
import os
import redis

rds = redis.Redis(
    host=str(os.environ.get('REDIS_HOST', 'localhost')),
    port=int(os.environ.get('REDIS_PORT', 6379)),
    db=0,
    password=os.environ.get('REDIS_PASSWORD', 'pernyi-awmous-leanly-crotin-shoop-cotula-embira'),
)

digit62 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

def int_to_str62(x):
    s = ''
    while x>0:
        s = digit62[x % 62]+s
        x = int(x/62)
    return s

def str62_to_int(s):
    x = 0
    s = str(s).strip()
    if s=="":
        return x
    for y in s:
        k = digit62.find(y)
        if k>=0:
            x=x*62+k
    return x

save_id = None

def get():
    global save_id
    if save_id is None:
        save_id = rds.incr('id')
    return int_to_str62(save_id).rjust(8, '0')

def ack():
    global save_id
    save_id = None




if __name__ == "__main__":
    print(get())
    print(get())
    ack()
    print(get())

    print(str62_to_int(int_to_str62(100000000000000).rjust(8, '0')))

