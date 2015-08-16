from flask_script import Manager,commands
from flask_alembic import Alembic
from flask_alembic.cli.script import manager as alembic_manager

from app import app

manager = Manager(app)
alembic = Alembic(app)

manager.add_command('db',alembic_manager)

manager.run()
