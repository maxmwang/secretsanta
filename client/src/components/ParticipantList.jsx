import React, { Component } from 'react';

import Name from 'components/Name';

class ParticipantList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="d-flex justify-content-center">
        {this.props.participants.map( p => 
          <Name
            participant={p}
            onClick={this.props.onClick}
          />
        )}
      </div>
    );
  }
}

export default ParticipantList;
