import { Component } from 'react';

class Hoverable extends Component {
  constructor() {
    super();
    this.state = {
      isMouseInside: false
    };
  }

  mouseEnter = () => {
    this.setState({ isMouseInside: true });
  }

  mouseLeave = () => {
    this.setState({ isMouseInside: false });
  }

  render() {
    return this.props.children(
      this.state.isMouseInside,
      this.mouseEnter,
      this.mouseLeave
    )
  }
}

export default Hoverable;