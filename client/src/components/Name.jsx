import React, { Component } from 'react';

class Name extends Component {
  getBadgeClass() {
    if (!this.props.participant.active) {
      return "badge-light";
    } else {
      return "badge-dark";
    }
  }

  getStyle() {
    if (this.props.participant.santa) {
      return { boxShadow: "0px 0px 4px 2px red" };
    } else if (this.props.participant.self) {
      return { boxShadow: "0px 0px 4px 2px green" };
    }
    return {};
  }

  render() {
    return (
      <div
        className={`badge m-2 ${this.getBadgeClass()}`}
        style={this.getStyle()}>
        { this.props.participant.name }
      </div>
    );
  }
}

export default Name;
