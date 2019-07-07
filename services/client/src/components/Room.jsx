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

  /**
   * helper method that add event listeners to buttons and progress bar
   */
  addEventListeners() {
    const btn = document.querySelector('.button');
    btn.addEventListener('click', () => {
      if (btn.id === 'play') {
        this.state.socket.emit('play_video', {
          time: this.state.player.getCurrentTime()
        });
        this.state.player.playVideo();
      }
      else if (btn.id === 'pause') {
        this.state.socket.emit('pause_video', {
          time: this.state.player.getCurrentTime()
        });
        this.state.player.pauseVideo();
      }
    });

    const progressBar = document.querySelector('.progress');
    progressBar.addEventListener('click', (e) => {
      const bgleft = progressBar.offsetLeft + 24;
      const left = e.pageX - bgleft;
      const bgWidth = progressBar.offsetWidth;
      const newTime = this.state.player.getDuration() * (left / bgWidth);
      this.state.socket.emit('change_time', {
        time: newTime
      })
      // Skip video to new time.
      this.state.player.seekTo(newTime);
    });

  }

  /**
   * helper method that set up socket connection 
   */
  makeSocketConnection() {
    const socket = io();

    // register socket events
    socket.on('connect_failed', () => {
      console.log('Connection Failed');
    });
    socket.on('connect', () => {
      console.log('Connected');
      // join the room
      socket.emit('join_room', { room: this.props.roomName });
    });
    socket.on('disconnect', () => {
      console.log('Disconnected');
    });
    socket.on('pause_video', (data) => {
      const currTime = data.time;
      this.state.player.seekTo(currTime);
      this.state.player.pauseVideo();
    });
    socket.on('play_video', (data) => {
      const currTime = data.time;
      this.state.player.seekTo(currTime);
      this.state.player.playVideo();
    });
    socket.on('change_time', (data) => {
      const currTime = data.time;
      this.state.player.seekTo(currTime);
    });
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
    this.setState({
      progress: ((this.state.player.getCurrentTime() / this.state.player.getDuration()) * 100)
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
    setInterval(() => {
      this.updateTimerDisplay();
      this.updateProgressBar();
    }, 1000);
    this.state.player.playVideo();
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
    // } else if (this.props.roomName === '') {
    //   return <Redirect to='/join'/>
    // }
    return (
      <div>
        <div className="columns">
          <h1>{this.props.roomName}</h1>
        </div>
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