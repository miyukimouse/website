import React from 'react';
import { findDOMNode } from 'react-dom';
import Tooltip from './Tooltip.jsx';
import $ from 'jquery';

const TRACK_HEIGHT = 20;

export default class Track extends React.Component {

  static propTypes = {
    index: React.PropTypes.number.isRequired,
    tip: React.PropTypes.string,
    width: React.PropTypes.number,
    height: React.PropTypes.number
  }

  constructor(props) {
    super(props);
    this.state = {
      tooltipTarget: null,
      tooltipPosition: null,
      tooltipEventID: 0
    };
  }

  static defaultProps = {
    width: 100,
    height: 10
  }

  getVerticalPosition = () => {
    return this.props.index * TRACK_HEIGHT;
  }

  showTooltip = (event) => {
    this.setState((prevState, currProps) => {
      return {
        tooltipEventID: prevState.tooltipEventID + 1,
        tooltipPosition: {
          x: this.props.width/2,
          y: this.getVerticalPosition()
        },
        tooltipTarget: event.target
      };
    });
  }

  hideTooltip = (event) => {
    const tooltipEventID = this.state.tooltipEventID;
    setTimeout(() => {
      this.setState((prevState, currProps) => {
        return prevState.tooltipEventID === tooltipEventID ? {
          tooltipPosition: null
        } : {}
      });
    }, 200);
  }

  // componentDidMount() {
  //   $(findDOMNode(this)).find('.track').each((index, element) => { // Notice the .each() loop, discussed below
  //     $(element).qtip({
  //       content: {
  //           text: 'aaa'
  //       },
  //           position: {
  //       my: 'top center',
  //       at: 'bottom center'
  //   }
  //     });
  //   });

  // }

  render() {
    console.log(this.state);
    return (
      <g className="track"
        onMouseOver={this.showTooltip}
        onMouseOut={this.hideTooltip}>
      <rect
        x="0"
        y={this.getVerticalPosition()}
        width={this.props.width} height={this.props.height} fill="grey" />
        {
          this.state.tooltipPosition ? <Tooltip {...this.state.tooltipPosition} tip={this.props.tip}/> : null
        }
      </g>
    );
  }

}