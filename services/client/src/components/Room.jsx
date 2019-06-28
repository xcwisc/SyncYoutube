import React, { Component } from 'react';
import YouTube from 'react-youtube';
import { Redirect } from 'react-router-dom';
import io from 'socket.io-client';

class Logout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      player: null,
      socket: null,
      progress: 0,
      currTime: '----',
      duration: '----',
      playState: 'play',
    }
    this._onReady = this._onReady.bind(this);
    this._onPause = this._onPause.bind(this);
    this._onPlay = this._onPlay.bind(this);
  }

  componentDidMount() {
    this.makeSocketConnection();
    this.waitFor(_ => this.state.player !== null)
      .then(this.addEventListeners());
  }

  waitFor(conditionFunction) {
    const poll = resolve => {
      if (conditionFunction()) resolve();
      else setTimeout(_ => poll(resolve), 400);
    }
    return new Promise(poll);
  }

  addEventListeners() {
    const btn = document.querySelector('.button');
    btn.addEventListener('click', () => {
      if (btn.id === 'play') {
        this.state.socket.emit('play_video', { time: this.state.player.getCurrentTime() });
        this.state.player.playVideo();
        this.setState({ playState: 'pause' });
      }
      else if (btn.id === 'pause') {
        this.state.socket.emit('pause_video', { time: this.state.player.getCurrentTime() });
        this.state.player.pauseVideo();
        this.setState({ playState: 'play' });
      }
    });

    const progressBar = document.querySelector('.progress');
    progressBar.addEventListener('click', (e) => {
      const bgleft = progressBar.offsetLeft + 24;
      // console.log(`bgleft:${bgleft}`);
      const left = e.pageX - bgleft;
      const bgWidth = progressBar.offsetWidth;
      // console.log(`bgWidth:${bgWidth}`);
      // console.log(left / bgWidth);
      const newTime = this.state.player.getDuration() * (left / bgWidth);
      this.state.socket.emit('change_time', { time: newTime })
      // Skip video to new time.
      this.state.player.seekTo(newTime);
    });

  }

  makeSocketConnection() {
    const socket = io();
    socket.on('connect_failed', () => {
      console.log('Connection Failed');
    });
    socket.on('connect', () => {
      console.log('Connected');
    });
    socket.on('disconnect', () => {
      console.log('Disconnected');
    });
    socket.on('pause_video', (data) => {
      const currTime = data.time;
      console.log(currTime);
      this.state.player.seekTo(currTime);
      this.state.player.pauseVideo();
      console.log('video paused');
    });
    socket.on('play_video', (data) => {
      const currTime = data.time;
      console.log(currTime);
      this.state.player.seekTo(currTime);
      this.state.player.playVideo();
      console.log('video played');
    });
    socket.on('change_time', (data) => {
      const currTime = data.time;
      this.state.player.seekTo(currTime);
    })
    // socket.emit('join room', this.props.roomName);
    this.setState({ socket: socket });
  }

  updateTimerDisplay() {
    // Update current time text display.
    this.setState({
      currTime: this.formatTime(this.state.player.getCurrentTime()),
      duration: this.formatTime(this.state.player.getDuration())
    });
  }

  updateProgressBar() {
    // Update the value of our progress bar accordingly.
    this.setState({
      progress: ((this.state.player.getCurrentTime() / this.state.player.getDuration()) * 100)
    })
  }

  formatTime(time) {
    time = Math.round(time);
    const minutes = Math.floor(time / 60);
    let seconds = time - minutes * 60;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    return minutes + ":" + seconds;
  }

  _onReady(event) {
    // access to player in all event handlers via event.target
    // console.log(this);
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
    setInterval(() => {
      this.updateTimerDisplay();
      this.updateProgressBar();
    }, 1000);
    this.state.player.playVideo();
  }

  _onPause(event) {
    this.setState({
      play: 'play'
    })
  }

  _onPlay(event) {
    this.setState({
      play: 'pause'
    })
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
    // if (!this.props.isAuthenticated) {
    //   return <Redirect to='/login' />
    // }
    return (
      <div>
        <div className="columns">
          <div className="column is-one-quarter"></div>
          <div className="column is-half">
            <YouTube
              videoId="2g811Eo7K8U"
              opts={opts}
              onReady={this._onReady}
              onPause={this._onPause}
              onPlay={this._onPlay}
            />
          </div>
          <div className="column is-one-quarter"></div>
        </div>
        <div className="columns">
          <div className="column is-1"></div>
          <div className="column is-1">
            <a className="button" id={this.state.playState} >
              <span className="icon is-small" >
                <i className={`fas fa-${this.state.playState}`} ></i>
              </span>
            </a>
          </div>
          <div className="column is-8">
            <progress className="progress is-small" value={this.state.progress} max="100"></progress>
          </div>
          <div className="column is-2" style={{ padding: '6px' }}>
            <span>{this.state.currTime}/{this.state.duration}</span>
          </div>
        </div>
      </div >
    )
  };
}

export default Logout;