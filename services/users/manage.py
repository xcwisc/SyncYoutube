import unittest
import sys

from flask.cli import FlaskGroup
import coverage

from project import create_app, db
from project.api.models import User

app = create_app()
cli = FlaskGroup(create_app=create_app)
COV = coverage.coverage(
    branch=True,
    include='project/*',
    omit=[
        'project/tests/*',
        'project/config.py',
    ]
)
COV.start()


@cli.command('recreate_db')
def recreate_db():
    db.drop_all()
    db.create_all()
    db.session.commit()


@cli.command()
def test():
    """Runs the tests without code coverage"""
    tests = unittest.TestLoader().discover('project/tests', pattern='test*.py')
    result = unittest.TextTestRunner(verbosity=2).run(tests)
    if result.wasSuccessful():
        return 0
    sys.exit(result)


@cli.command()
def cov():
    """Runs the unit tests with coverage."""
    tests = unittest.TestLoader().discover('project/tests')
    result = unittest.TextTestRunner(verbosity=2).run(tests)
    if result.wasSuccessful():
        COV.stop()
        COV.save()
        print('Coverage Summary:')
        COV.report()
        COV.html_report()
        COV.erase()
        return 0
    sys.exit(result)


@cli.command('seed_db')
def seed_db():
    """Seeds the database."""
    db.session.add(
        User(username='bot1',
             email='bot1@botland.com',
             password='greaterthaneight'))
    db.session.add(
        User(username='bot2',
             email='bot2@botland.com',
             password='greaterthaneight'))
    db.session.commit()


if __name__ == '__main__':
    cli()
