import React, { Component } from 'react';

import {ReactComponent as ArrowRight} from '../../svgs/arrowRight.svg';
import {ReactComponent as X} from '../../svgs/x.svg';
import {ReactComponent as Remove} from '../../svgs/remove.svg';

import Name from '../Name';

class Restrictions extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <h6>Restrictions</h6>
        {Object.keys(this.props.restrictions).map(name => (
          <>
            {this.props.restrictions[name].map(target => (
              <>
                <Name participant={this.props.participants[name]}/>
                <ArrowRight/>
                <X/>
                <Name participant={this.props.participants[target]}/>
                <Remove style={{cursor: 'pointer'}} onClick={() => this.props.removeRestriction(name, target)}/>
              </>
            ))}
          </>
        ))}
        <br />
      </>
    );
  }
}

export default Restrictions;
