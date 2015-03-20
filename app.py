import flask
import json
import commands
import os
from flask_script import Manager, commands
from flask_admin import Admin
from flask_admin.contrib.sqla.view import ModelView

PHP_CMD = 'php -f index.php'


def get_users():
    return json.loads(open('users.json','r').read())

def set_users(users):
    with open('users.json','w') as jsonfile:
        jsonfile.write(json.dumps(users))

def set_php_env(value):
    os.environ['REQUEST_URI'] = value

app = flask.Flask(__name__)
admin = Admin(app,template_mode="bootstrap3")

manager = Manager(app)
manager.add_command('urls',commands.ShowUrls())
manager.default_command = 'urls'


app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
os.environ['DATABASE_URL'] =  'sqlite:///test.db' if not os.environ.get('DATABASE_URL',False) else os.environ.get('DATABASE_URL')                                                            

from models import User,Score,Game

class UserAdminView(ModelView):

    inline_models = [Game,Score]

    def __init__(self,*args,**kwargs):
        super(UserAdminView,self).__init__(User,User._session,*args,**kwargs)

class ScoreAdminView(ModelView):

    inline_models = [Game,User]

    def __init__(self,*args,**kwargs):
        super(ScoreAdminView,self).__init__(Score,Score._session,*args,**kwargs)

class GameAdminView(ModelView):
    inline_models = [User,Score]

    def __init__(self,*args,**kwargs):
        super(GameAdminView,self).__init__(Game,Game._session,*args,**kwargs)

admin.add_view(UserAdminView())
admin.add_view(ModelView(Score,Score._session))
admin.add_view(ModelView(Game,Game._session))

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
    import os
    port = os.environ.get('PORT',None) or 4444
    port = int(port)
    manager.run()
    app.run(host='0.0.0.0',debug=True,port=port)
