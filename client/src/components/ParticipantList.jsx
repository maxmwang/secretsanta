import React, { Component } from 'react';

import Name from 'components/Name';

class ParticipantList extends Component {
  render() {
    return (
      <div className="d-flex justify-content-center">
        {this.props.participants.map( p => <Name participant={p}/> )}
      </div>
    );
  }
}

export default ParticipantList;
