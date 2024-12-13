import React, { Component } from 'react';

class Name extends Component {
  constructor(props) {
    super(props);
  }

  getBadgeClass() {
    if (!this.props.participant.active) {
      return "badge-light";
    } else {
      return "bg-blue-500 text-white";
    }
  }

  getStyle() {
    const style = {};
    if (this.props.participant.santa) {
      style['boxShadow'] = "0px 0px 4px 2px red";
    } else if (this.props.participant.self) {
      style['boxShadow'] = "0px 0px 4px 2px green";
    }

    if (this.props.onClick !== undefined) {
      style['cursor'] = 'pointer';
    }
    return style;
  }

  render() {
    return (
      <div
        className={`badge m-2 ${this.getBadgeClass()}`}
        style={this.getStyle()}
        onClick={() => this.props.onClick?.(this.props.participant)}
      >
        { this.props.participant.name }
      </div>
    );
  }
}

export default Name;
