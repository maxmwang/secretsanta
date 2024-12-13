import React, { Component } from 'react';

import './Snow.css';

const layerBlurs = [0, 1, 2, 5];
const layerSizes = [30, 25, 20, 18];
const maxDelay = [1, 11];
const durationRange = [6, 16];
const centerRange = [0, 101];
const xRange = [-10, 10];

class Snowflake extends Component {
  constructor() {
    super();
    this.delay = Math.floor(Math.random() * (maxDelay[1] - maxDelay[0])) + maxDelay[0];
    this.duration = Math.floor(Math.random() * (durationRange[1] - durationRange[0])) + durationRange[0];
    this.x_center = Math.floor(Math.random() * (centerRange[1] - centerRange[0])) + centerRange[0];
    this.x_start = Math.floor(Math.random() * (xRange[1] - xRange[0])) + xRange[0];
    this.x_end = Math.floor(Math.random() * (xRange[1] - xRange[0])) + xRange[0];
  }

  render() {
    return (
      <div className="snow" style={{
        "--left-ini": `${this.x_start}vw`,
        "--left-end": `${this.x_end}vw`,
        left: `${this.x_center}vw`,
        animation: `snowfall ${this.duration}s linear infinite`,
        animationDelay: `-${this.delay}s`,
        // snowflake that is farther back
        // has more blue and smaller size
        filter: `blur(${layerBlurs[this.props.layer]}px)`,
        fontSize: `${layerSizes[this.props.layer]}px`,
      }}>&#10052;</div>
    );
  }
}

class Snow extends Component {
  render() {
    return (
      <div className="main select-none">
        <div className="initial-snow">
          {Array.from(Array(20)).map(_ => (
            <Snowflake layer={0}/>
          ))}
          {Array.from(Array(20)).map(_ => (
            <Snowflake layer={1}/>
          ))}
          {Array.from(Array(15)).map(_ => (
            <Snowflake layer={2}/>
          ))}
          {Array.from(Array(12)).map(_ => (
            <Snowflake layer={3}/>
          ))}
        </div>
      </div>
    );
  }
}

export default Snow;
