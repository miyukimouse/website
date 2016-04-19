import React, { Component } from "react";
import ReactDOM from "react-dom";

const CharApparentWidth = 8;

export default class Ruler extends React.Component {

  // static propTypes = {
  //   x: React.PropTypes.number,
  //   y: React.PropTypes.number,
  // }

  static contextTypes = {
    getXMin: React.PropTypes.func,
    getXMax: React.PropTypes.func,
    toWidth: React.PropTypes.func,
  }

  getTickLabelWidth = (position) => {
    const apparentLabelWidth = position.toString().length * CharApparentWidth;
    return this.context.toWidth(apparentLabelWidth);
  }

  render() {
    const maxIntervalCount = 10;
    const tickPositions = getTicks(this.context.getXMin(),
      this.context.getXMax(), maxIntervalCount);
    const strokeWidth = this.context.toWidth(1);
    const yOffset = 100;
    console.log(tickPositions);

    return (
      <g>
        <g>
        {
          tickPositions.map((position, i) => {
            return <line key={`tick-${i}`}
              x1={position} y1={yOffset}
              x2={position} y2={yOffset + 3}
              stroke="black"
              strokeWidth={strokeWidth}/>
          })
        }
        </g>
        <g>
        {
          tickPositions.map((position, i) => {
            return <text key={`tick-${i}`}
              x={position} y={yOffset+6}
              fontSize={4}
              textAnchor="middle"
              fill="black"
              textLength={this.getTickLabelWidth(position)}
              lengthAdjust="spacingAndGlyphs">{position}</text>
          })
        }
        </g>
      </g>);
  }
};


const digitCount = (n) => {
  if (n < 1) {
    return 0;
  }else{
    return Math.floor(Math.log10(n)) + 1;
  }
}

// console.log(digitCount(1023))

const getIntervalLength = (lower, upper, maxIntervalCount) => {
  const delta = (upper - lower) / maxIntervalCount;
  const dCount = digitCount(delta);
  const coefficent = delta / Math.pow(10, dCount - 1);  // the coefficient in scientific notation
  let l;
  if (coefficent <= 1){
    l =  1;
  }else if (coefficent<= 2){
    l = 2;
  }else if (coefficent<=5){
    l = 5;
  }else{
    l = 10;
  }
  return l * Math.pow(10, dCount - 1);
}

// console.log(getIntervalLength(99, 1233, 10))

const getTicks = (lower, upper, maxIntervalCount) => {
  const intervalLength = getIntervalLength(lower, upper, maxIntervalCount);
  const minTick = intervalLength * Math.ceil(lower / intervalLength);
  const tickList = [];
  for (let tick=minTick; tick < upper; tick=tick+intervalLength){
    tickList.push(tick);
  }
  return tickList;
}

// console.log(getTicks(99, 233, 10))
// console.log(getTicks(99, 1233, 10))
// console.log(getTicks(99, 4233, 10))
// console.log(getTicks(99, 9233, 10))