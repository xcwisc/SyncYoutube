import React, { Component } from 'react';
import YouTube from 'react-youtube';
import { withRouter } from 'react-router';
import { Redirect } from 'react-router-dom';
import io from 'socket.io-client';

import Modal from './Modal';
import Message from './Message';
import HistoryItem from './HistoryItem';

class Room extends Component {
  constructor(props) {
    super(props);

    this.state = {
      player: null,
      socket: null,
      progress: 0,
      currTime: '0:00',
      duration: '0:00',
      playState: 'play',
      userList: [],
      videoHistory: [],
      videoId: '2g811Eo7K8U',
      messages: [],
      emoji: '',
      unListen: null,
      elapsedTimeinterval: null,
    }
    this._onReady = this._onReady.bind(this);
    this._onPause = this._onPause.bind(this);
    this._onPlay = this._onPlay.bind(this);
    this.handleDeleteHistory = this.handleDeleteHistory.bind(this);
    this.handleClickHistory = this.handleClickHistory.bind(this);
  }

  componentDidMount() {
    if (this.props.isAuthenticated && this.props.roomName !== '') {
      // set up socket.io client
      this.makeSocketConnection();

      // listen to route change indicating that a user has left
      let unListen = this.props.history.listen((location, action) => {
        this.leaveRoom(location);
      });
      this.setState({ unListen: unListen });
    }
  }

  componentWillUnmount() {
    // clean up intervals
    this.state.unListen();
    clearInterval(this.state.elapsedTimeinterval);
  }

  // leave the room
  // 1. disconnect socket
  // 2. call the leaveRoom in App.jsx to clean up data in '/join'
  leaveRoom(nextLocation) {
    console.log('room route left');
    if (this.state.socket) {
      this.state.socket.disconnect();
      this.setState({
        player: null,
        socket: null,
        progress: 0,
        currTime: '0:00',
        duration: '0:00',
        playState: 'play',
        userList: [],
        videoHistory: [],
        videoId: '2g811Eo7K8U',
        messages: [],
        emoji: ''
      });
    }
    this.props.leaveRoom();
  }

  /**
   * helper method that add event listeners to buttons and progress bar
   */
  addEventListeners() {
    const controlBtn = document.querySelector('.control-btn');
    controlBtn.addEventListener('click', () => {
      if (controlBtn.id === 'play') {
        this.state.socket.emit('play_video', {
          time: this.state.player.getCurrentTime()
        });
        this.state.player.playVideo();
      }
      else if (controlBtn.id === 'pause') {
        this.state.socket.emit('pause_video', {
          time: this.state.player.getCurrentTime()
        });
        this.state.player.pauseVideo();
      }
    });

    const passwordBtn = document.querySelector('.password-btn');
    passwordBtn.addEventListener('click', () => {
      let password = window.prompt(`Set the password for ${this.props.roomName}`);
      if (password === null) {
        return;
      }
      this.props.handleChangePassword(password);
    })

    const progressBar = document.querySelector('.progress');
    progressBar.addEventListener('click', (e) => {
      const container = document.querySelector('.container');
      let containerMargin = window.getComputedStyle(container).marginLeft;
      containerMargin = Number(containerMargin.substr(0, containerMargin.length - 2));
      if (containerMargin === 0) {
        containerMargin = 24;
      }
      const bgleft = progressBar.offsetLeft;
      const left = e.pageX - bgleft - containerMargin;
      const bgWidth = progressBar.offsetWidth;
      const newTime = this.state.player.getDuration() * (left / bgWidth);
      this.state.socket.emit('change_time', {
        time: newTime
      })
      // Skip video to new time.
      this.state.player.seekTo(newTime);
    });

    const videoUrlForm = document.querySelector('#videoUrl-form');
    videoUrlForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const videoUrl = e.target.videoUrl.value;

      // parse out videoId
      let videoId;
      if (videoUrl.split('?').length === 1) {
        videoId = videoUrl;
      } else {
        videoId = videoUrl.split('?')[1].split('v=')[1].split('&')[0];
      }

      this.state.socket.emit('change_video', {
        videoId: videoId,
        displayName: this.props.displayName
      });
      this.changeVideo(videoId);
      e.target.videoUrl.value = '';
    });

    const sendMessageForm = document.querySelector('#sendMessage-form');
    sendMessageForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const message = e.target.message.value;
      const displayName = this.props.displayName;

      this.state.socket.emit('chat', {
        message: message,
        displayName: displayName,
        emoji: this.state.emoji,
        sendOrigin: 2
      });

      // push the message to the state store
      let messages = this.state.messages;
      if (messages.length > 20) {
        messages.splice(0, 1);
      }
      messages.push({
        message: message,
        displayName: displayName,
        emoji: this.state.emoji,
        sendOrigin: 1
      });
      this.setState({ messages: messages });

      // scroll chat room to the bottom
      let chatRoom = document.querySelector(".chat-room");
      chatRoom.scrollTop = chatRoom.scrollHeight;

      // clear out the input field
      e.target.message.value = '';
    });
  }

  /**
   * helper method that set up socket connection 
   */
  makeSocketConnection() {
    // const socket = io('http://localhost:8080');
    const socket = io();

    // register socket events
    socket.on('connect_failed', () => {
      console.log('Connection Failed');
    });

    // evokes when the client is connected to the sync server
    socket.on('connect', () => {
      console.log('Connected');
      socket.emit('join_room', {
        room: this.props.roomName,
        displayName: this.props.displayName
      });

      // randomly generate an emoji for this user
      const emojiList = ['heart', 'poop', 'money-bill-alt',
        'money-bill-alt', 'hat-wizard', 'graduation-cap', 'gamepad', 'award', 'bomb', 'bug', 'ad'];
      const emoji = emojiList[Math.floor(Math.random() * emojiList.length)];
      this.setState({ emoji: emoji });
    });

    // evokes when the client is disconnected from the sync server
    socket.on('disconnect', () => {
      console.log('Disconnected');
    });

    // evokes when some other user join the current room
    socket.on('update_nameList', (data) => {
      console.log('update_nameList');
      this.setState({ userList: data.userList });
    });

    // evokes when some other user join the current room
    // response the server with current play status
    socket.on('get_status', (data) => {
      socket.emit('set_status', {
        id: data.id, // id of the client that just joined
        playState: this.state.playState,
        currTime: this.state.player.getCurrentTime(),
        videoId: this.state.videoId
      });
    });

    // evokes when the server forward the current status in the room
    socket.on('set_status', (data) => {
      console.log(data);
      this.setState({ videoId: data.videoId });
      this.waitFor(_ => data.videoId === this.state.player.getVideoData().video_id && this.state.player.getDuration() !== 0)
        .then(_ => {
          this.state.player.seekTo(data.currTime);
          console.log(this.state.player.getDuration());
          this.setState({
            progress: data.currTime / this.state.player.getDuration() * 100,
            currTime: this.formatTime(data.currTime),
            duration: this.formatTime(this.state.player.getDuration())
          })
          if (data.playState === 'pause') {
            this.state.player.playVideo();
          } else if (data.playState === 'play') {
            this.state.player.pauseVideo();
          }
        })
        .catch(err => console.log(err));
    });

    // evokes when some other user pause the video
    socket.on('pause_video', (data) => {
      const currTime = data.time;
      this.state.player.seekTo(currTime);
      this.state.player.pauseVideo();
    });

    // evokes when some other user play the video
    socket.on('play_video', (data) => {
      const currTime = data.time;
      this.state.player.seekTo(currTime);
      this.state.player.playVideo();
    });

    // evokes when some other user click the progress bar
    socket.on('change_time', (data) => {
      const currTime = data.time;
      this.state.player.seekTo(currTime);
    });

    // evokes when some other user changes a video
    socket.on('change_video', (data) => {
      const videoId = data.videoId;
      this.changeVideo(videoId);
    })

    // evokes when some other user send a chat message
    socket.on('chat', (data) => {
      let messages = this.state.messages;
      if (messages.length > 20) {
        messages.splice(0, 1);
      }
      messages.push({
        message: data.message,
        displayName: data.displayName,
        emoji: data.emoji,
        sendOrigin: data.sendOrigin,
      });
      this.setState({ messages: messages });

      // scroll chat room to the bottom
      let chatRoom = document.querySelector(".chat-room");
      chatRoom.scrollTop = chatRoom.scrollHeight;
    })

    // save the socket to the state for future use
    this.setState({ socket: socket });
  }

  /**
   * helper method that updates current time text display.
   */
  updateTimerDisplay() {
    this.setState({
      currTime: this.formatTime(this.state.player.getCurrentTime()),
      duration: this.formatTime(this.state.player.getDuration())
    });
  }

  /**
   * helper method that updates the value of our progress bar accordingly.
   */
  updateProgressBar() {
    let progress = this.state.player.getCurrentTime() / this.state.player.getDuration() * 100;
    if (isNaN(progress)) {
      progress = 0;
    }
    this.setState({
      progress: progress
    })
  }

  /**
   * helper method that format time displayed at the progress bar.
   */
  formatTime(time) {
    time = Math.round(time);
    const minutes = Math.floor(time / 60);
    let seconds = time - minutes * 60;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    return minutes + ":" + seconds;
  }

  /**
   * helper method that changes the video and save the current video for history to the state.
   */
  changeVideo(videoId) {
    // get the current title for history purpose
    const videoInfo = this.state.player.getVideoData();
    const videoTitle = videoInfo.title;
    const videoAuthor = videoInfo.author;
    this.setState({
      videoHistory: [...this.state.videoHistory, {
        videoId: this.state.videoId,
        videoTitle: videoTitle,
        videoAuthor: videoAuthor
      }],
      videoId: videoId,
    });
  }

  /**
   * handler for clicking a history item
   */
  handleClickHistory(videoId) {
    this.state.socket.emit('change_video', {
      videoId: videoId,
      displayName: this.props.displayName
    });
    this.changeVideo(videoId);
    // close the modal
    const modal = document.querySelector(`.modal#history`);
    const rootEl = document.documentElement;
    rootEl.classList.remove('is-clipped');
    modal.classList.remove("is-active");
  }

  /**
   * handler for deleting a history item
   */
  handleDeleteHistory(e, historyIndex) {
    let videoHistory = this.state.videoHistory;
    videoHistory.splice(historyIndex, 1);
    this.setState({
      videoHistory: videoHistory
    });
  }

  _onReady(event) {
    // access to player in all event handlers via event.target
    this.setState({
      player: event.target
    })
    // Update the controls on load
    this.updateTimerDisplay();
    this.updateProgressBar();

    // // Clear any old interval.
    // clearInterval(time_update_interval);

    // Start interval to update elapsed time display and
    // the elapsed part of the progress bar every second.
    let elapsedTimeinterval = setInterval(() => {
      this.updateTimerDisplay();
      this.updateProgressBar();
    }, 1000);
    this.setState({ elapsedTimeinterval: elapsedTimeinterval });

    // register event listeners to buttons
    this.addEventListeners();

    // send the sync signal
    this.state.socket.emit('get_status', { id: this.state.socket.id });
  }

  _onPause(event) {
    this.setState({
      playState: 'play'
    })
  }

  _onPlay(event) {
    this.setState({
      playState: 'pause'
    })
  }

  waitFor(conditionFunction) {
    const poll = resolve => {
      if (conditionFunction()) resolve();
      else setTimeout(_ => poll(resolve), 400);
    }
    return new Promise(poll);
  }

  render() {
    const opts = {
      height: '480',
      width: '640',
      playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: 1,
        controls: 0,
      }
    };
    if (!this.props.isAuthenticated) {
      return <Redirect to='/login' />
    } else if (this.props.roomName === '') {
      return <Redirect to='/join' />
    }
    return (
      <div>
        <div className="columns">
          <div className="column is-9">
            <h2 className="title is-2">Room: {this.props.roomName}
              <button className="button is-link is-outlined password-btn"
                title="Set a password for this room">
                <span className="icon is-small">
                  <i className="fas fa-key"></i>
                </span>
              </button>
              <Modal modalTitle="People in the room" modalId="people">
                <table className="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
                  <thead>
                    <tr>
                      <th><abbr title="Position">Pos</abbr></th>
                      <th>Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      this.state.userList.map((user, index) => {
                        return (
                          <tr key={index}>
                            <th>{index + 1}</th>
                            <td>{user.displayName}</td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </table>
              </Modal>
            </h2>
            <hr></hr>
            <YouTube
              videoId={this.state.videoId}
              opts={opts}
              onReady={this._onReady}
              onPause={this._onPause}
              onPlay={this._onPlay}
            />
          </div>
          <div className="column is-3 is-grey-lighter">
            <br></br>
            <br></br>
            <br></br>
            <form id="videoUrl-form" style={{ display: "inline" }}>
              <div className="control" style={{ display: "inline" }}>
                <input className="input"
                  type="text"
                  placeholder="Video Url or Id"
                  name="videoUrl"
                  required
                  style={{ width: "46%" }} />
              </div>
              <div className="control" style={{ display: "inline" }}>
                <input
                  type="submit"
                  className="button is-link is-outlined"
                  value="Go"
                  style={{ width: "14%" }}
                />
              </div>
            </form>
            <div className="control" style={{ display: "inline", marginLeft: "10%" }}>
              <Modal modalId="history" modalTitle="Watch History">
                <div className="container" style={{ width: "100%" }}>
                  {this.state.videoHistory.map((videoItem, index) => {
                    return (<HistoryItem
                      videoId={videoItem.videoId}
                      videoTitle={videoItem.videoTitle}
                      videoAuthor={videoItem.videoAuthor}
                      handleDeleteHistory={this.handleDeleteHistory}
                      handleClickHistory={this.handleClickHistory}
                      historyIndex={index}
                      key={index}></HistoryItem>)
                  })}
                </div>
              </Modal>
            </div>
            <div className="control" style={{ display: "inline", marginLeft: "2%" }}>
              <a className="button is-link is-outlined"
                title="Find a video on YouTube"
                href="https://www.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ width: "14%" }}>
                <span className="icon is-small">
                  <i className="fas fa-search"></i>
                </span>
              </a>
            </div>
            <div className="chat-room" >
              {this.state.messages.map((message, index) => {
                return (
                  <Message
                    key={index}
                    message={message.message}
                    displayName={message.displayName}
                    emoji={message.emoji}
                    sendOrigin={message.sendOrigin}
                  />
                )
              })}
            </div>
            <br></br>
          </div>
        </div>
        <div className="columns">
          <div className="column is-1" style={{ paddingTop: "6px" }}>
            <span className="button control-btn is-small is-right" id={this.state.playState} >
              <span className="icon is-small" >
                <i className={`fas fa-${this.state.playState}`} ></i>
              </span>
            </span>
          </div>
          <div className="column is-7">
            <progress className="progress is-small" value={this.state.progress} max="100"></progress>
          </div>
          <div className="column is-1" style={{ padding: '6px' }}>
            <span>{this.state.currTime}/{this.state.duration}</span>
          </div>
          <div className="column is-3" style={{ paddingTop: "0px" }}>
            <form id="sendMessage-form">
              <div className="field">
                <div className="control" style={{ display: "inline" }}>
                  <input
                    className="input"
                    type="text"
                    placeholder="Say something"
                    name="message"
                    required
                    style={{ width: "76%" }}
                  />
                </div>
                <div className="control" style={{ display: "inline" }}>
                  <input
                    type="submit"
                    className="button is-link is-outlined"
                    value="Send"
                    style={{ width: "24%" }}
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div >
    )
  };
}

export default withRouter(Room);