import React, { Component } from 'react';

import ArrowForward from '@material-ui/icons/ArrowForward';
import X from '@material-ui/icons/Close';
import Check from '@material-ui/icons/Check';
import Remove from '@material-ui/icons/DeleteOutlined';

import Name from '../Name';

class GuessHistory extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <p className="text-lg font-semibold text-blue-400">
          Your Guesses
        </p>

        {Object.keys(this.props.guesses).length === 0 &&
          <p className="text-med font-italic text-blue-400">
            Make your first guess by clicking on a name above
          </p>
        }

        {Object.keys(this.props.guesses).map(name => (
          <div className="d-flex flex-col items-center">
            <div className="d-flex items-center">
              <Name participant={this.props.participants[name]}/>
              {this.props.guesses[name] ?
                <Check style={{ color: "green" }}/>
                :
                <X style={{ color: "red" }}/>
              }
            </div>
          </div>
        ))}
        <br />
      </>
    );
  }
}

export default GuessHistory;
