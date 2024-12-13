import React, { Component } from 'react';

import {ReactComponent as ArrowRight} from '../../svgs/arrowRight.svg';
import {ReactComponent as X} from '../../svgs/x.svg';
import {ReactComponent as Remove} from '../../svgs/remove.svg';

import Name from '../Name';

const santaOptions = [
  { value: 1, display: "1 santa"},
  { value: 2, display: "2 santas"},
  { value: 3, display: "3 santas"},
];

class Options extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <p className="text-lg font-semibold text-blue-400">
          Room Options
        </p>

        <p className="text-md font-semibold text-blue-400">
          Number of Santas
        </p>
        <select className="form-control" value={this.props.nSantas} onChange={ e => this.props.setSantas(e.target.value) }>
          {santaOptions.map(option => (
            <option key={option.value} value={option.value}>{option.display}</option>
          ))}
        </select>

        <p className="text-md font-semibold text-blue-400">
          Restrictions
        </p>
        {Object.keys(this.props.restrictions).map(name => (
          <div>
            {this.props.restrictions[name].map(target => (
              <>
                <Name participant={this.props.participants[name]}/>
                <ArrowRight/>
                <X/>
                <Name participant={this.props.participants[target]}/>
                <Remove style={{cursor: 'pointer'}} onClick={() => this.props.removeRestriction(name, target)}/>
              </>
            ))}
          </div>
        ))}
        <br />
      </>
    );
  }
}

export default Options;
