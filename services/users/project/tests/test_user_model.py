import unittest

from project.tests.base import BaseTestCase
from project.api.models import User
from project import db
from project.tests.utils import add_user

from sqlalchemy.exc import IntegrityError


class TestUserModel(BaseTestCase):
    def test_add_user(self):
        user = add_user(username='justatest',
                        email='test@test.com')
        self.assertTrue(user.id)
        self.assertEqual(user.username, 'justatest')
        self.assertEqual(user.email, 'test@test.com')
        self.assertTrue(user.active)

    def test_add_duplicate_username(self):
        add_user(username='justatest',
                 email='test@test.com')
        duplicate_user = User(
            username='justatest',
            email='test1@test.com',
        )
        db.session.add(duplicate_user)
        self.assertRaises(IntegrityError, db.session.commit)

    def test_add_duplicate_email(self):
        add_user(username='justatest',
                 email='test@test.com')
        duplicate_user = User(
            username='justatest1',
            email='test@test.com',
        )
        db.session.add(duplicate_user)
        self.assertRaises(IntegrityError, db.session.commit)

    def test_to_json(self):
        user = add_user(username='justatest',
                        email='test@test.com')
        self.assertTrue(isinstance(user.to_json(), dict))


if __name__ == '__main__':
    unittest.main()
