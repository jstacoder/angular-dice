import flask
import json
import commands
import os
import sqlalchemy as sa
from sqlalchemy.ext.declarative import declarative_base

PHP_CMD = 'php -f index.php'


def get_users():
    return json.loads(open('users.json','r').read())

def set_users(users):
    with open('users.json','w') as jsonfile:
        jsonfile.write(json.dumps(users))

def set_php_env(value):
    os.environ['REQUEST_URI'] = value

app = flask.Flask(__name__)

@app.route('/score')
@app.route('/dice_choice')
def forward_to_php():
    request = flask.request
    set_php_env('{}?{}'.format(request.path,request.query_string))
    return flask.make_response(commands.getoutput(PHP_CMD))


@app.route('/api/users',methods=['GET','PUT','POST','DELETE'])
def users():
    request = flask.request
    if request.method.lower() == 'get':
        return flask.make_response(json.dumps(get_users()))
    if request.method.lower() == 'post':
        data = json.loads(request.data)
        users = get_users()
        data.update({'score':0})
        users.append(data)
        print users
        set_users(users)
        return flask.make_response(json.dumps(data))


@app.route('/templates/<path:name>')
def serve_template(name):
    return flask.send_file(os.path.join('templates',name))

@app.route('/')
@app.route('/play')
def index():
    return flask.render_template('index.html')

if __name__ == "__main__":
    app.run(host='0.0.0.0',port=4444,debug=True)
