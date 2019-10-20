# SyncYoutube

[![Build Status](https://travis-ci.com/xcwisc/SyncYoutube.svg?branch=master)](https://travis-ci.com/xcwisc/SyncYoutube.svg?branch=master)

## To run locally
To run locally, you need docker version 18.06.0+ installed on your machine. Once you have it installed, run this command:
```bash
$ docker-compose build
$ docker-compose up -d
$ export SECRET_KEY = <YOUR_SECRET_KEY>
$ export REACT_APP_USERS_SERVICE_URL=http://localhost/
```
Navigate to http://localhost/

## To deploy on a server
You need docker version 18.06.0+ installed on your server. Once you have it installed, run this command:
```bash
$ docker-compose -f docker-compose-prod.yml build
$ docker-compose -f docker-compose-prod.yml up -d
$ export SECRET_KEY = <YOUR_SECRET_KEY>
$ export REACT_APP_USERS_SERVICE_URL = <SERVER_IP>
```

## TODOS 

### v1.1
- [x] Chat room input clear onSubmit
- [x] Randomize emoji besides each chat
- [x] Brighten buttons' color
- [x] Make it unable to send blanks strings to the chat
- [x] Fix chat room's scrollbar
- [x] Embed Video's title
- [x] Add link to youtube for finding videos
- [x] Some user may make new connections without disconnecting

### V1.2
- [x] Change video input clear onSubmit
- [x] Differentiate chats sent by a user himself and others
- [x] Bind emoji with users
- [x] Add watch history
- [x] Flash system messages
- [x] Add password when joining a room


### TODOS (future version)
- [ ] Fix the slow loading caused by fontawsome
- [ ] Fix authentication system
- [ ] Unable to play some video
- [ ] Add wechat link for joining the room
- [ ] Add support for Bilibili
- [ ] Add face chat
