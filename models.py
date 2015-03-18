import sqlalchemy as sa
from sqlalchemy.orm import relationship,backref,sessionmaker,scoped_session
from sqlalchemy.ext.declarative import declarative_base,declared_attr
from flask_xxl.basemodels import classproperty
import inflection

def make_base(url):
    engine = sa.create_engine(url,echo=True)
    session = scoped_session(sessionmaker(bind=engine))()
    base = declarative_base()
    base.metadata.bind = engine
    base._engine = engine
    base._session = session
    return base

Model = make_base('sqlite:///test.db')

class BaseModel(Model):
    __abstract__ = True

    @declared_attr
    def __tablename__(self):
        return inflection.underscore(inflection.pluralize(self.__name__))

    @declared_attr
    def id(self):
        return sa.Column(sa.Integer,primary_key=True)

    @classproperty
    def query(cls):
        return cls._session.query(cls)

    def save(self):
        self._session.add(self)
        self._session.commit()

class User(BaseModel):

    name = sa.Column(sa.String(255),unique=True)
    scores = relationship('Score',lazy='dynamic',cascade='all,delete')
    games = relationship('Game',secondary='users_games')


class Game(BaseModel):
    date_played = sa.Column(sa.DateTime,default=sa.func.now())
    users = relationship('User',secondary='users_games')
    scores = relationship('Score',cascade='all,delete-orphan')

    def __init__(self,users,scores):
        for user in users:
            s = Score()
            s.score = scores[user.name]
            s.user_id = user.id
            self.scores.append(s)
            s.save()




class Score(BaseModel):
    win = sa.Column(sa.Boolean,default=False)
    score = sa.Column(sa.String)
    user_id = sa.Column(sa.Integer,sa.ForeignKey('users.id'))
    user = relationship('User')
    game_id = sa.Column(sa.Integer,sa.ForeignKey('games.id'))
    game = relationship('Game')


users_games = sa.Table('users_games',BaseModel.metadata,
        sa.Column('users_id',sa.Integer,sa.ForeignKey('users.id')),
        sa.Column('games_id',sa.Integer,sa.ForeignKey('games.id')),
)


