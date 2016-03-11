import React from 'react';
import { findDOMNode } from 'react-dom';
import Tooltip from './Tooltip.jsx';
import SequenceComponent from './SequenceComponent.jsx';
import $ from 'jquery';
import { TRACK_HEIGHT } from './Utils.js'

export default class Track extends React.Component {

  static propTypes = {
    index: React.PropTypes.number.isRequired,
    data: React.PropTypes.arrayOf(React.PropTypes.shape({
      start: React.PropTypes.number,
      end: React.PropTypes.number,
      tip: React.PropTypes.string,
      label: React.PropTypes.string
    })),
    sequenceLength: React.PropTypes.number,   // used when sequence isn't provided to map sequence coordinates to track graphic coordinates
    sequence: React.PropTypes.string,
    viewWidth: React.PropTypes.number,
    tip: React.PropTypes.string,
    width: React.PropTypes.number,
    height: React.PropTypes.number
  }

  constructor(props) {
    super(props);
    this.state = {
      tooltipTarget: null,
      tooltip: null,
      tooltipEventID: 0
    };
  }

  static defaultProps = {
    width: 100,
    height: 10,
    data: []
  }

  getVerticalPosition = () => {
    return this.props.index * TRACK_HEIGHT;
  }

  getHorizontalPosition = (dat) => {
    const sequenceLength = (this.props.sequenceLength || this.props.sequence.length);
    return {
      start: dat.start / sequenceLength * this.props.width,
      end: dat.end / sequenceLength * this.props.width
    }
  };


  generateTooltipHandler = (dataIndex) => {

    let x, tip;
    if (dataIndex === 0 || dataIndex) {
      const {start, end} = this.getHorizontalPosition(this.props.data[dataIndex]);
      x = start + Math.floor((end - start) /2);
      tip = this.props.data[dataIndex].tip;
    } else {
      x = this.props.width / 2;
      tip = this.props.tip;
    }

    const showTooltip = (event) => {
      event.stopPropagation();

      // // Get point in global SVG space
      // function cursorPoint(evt){
      //   // Create an SVGPoint for future math
      //   const svg = evt.target.ownerSVGElement;
      //   const pt = svg.createSVGPoint();
      //   pt.x = evt.clientX;
      //   pt.y = evt.clientY;
      //   // return pt.matrixTransform(svg.getScreenCTM().inverse());
      //   return {
      //     x: 0,
      //     y: 0
      //   }
      // }

      // const {x, y} = cursorPoint(event);

      this.setState((prevState, currProps) => {
        return {
          tooltipEventID: prevState.tooltipEventID + 1,
          tooltip: {
            // x,
            // y
            x: x,
            y: this.getVerticalPosition() + 10,
            tip: tip
          },
          tooltipTarget: event.target
        };
      });
    }

    return showTooltip;
  }

  hideTooltip = (event) => {
    const tooltipEventID = this.state.tooltipEventID;
    setTimeout(() => {
      this.setState((prevState, currProps) => {
        return prevState.tooltipEventID === tooltipEventID ? {
          tooltip: null
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



  /* data series within a track */
  renderData(){
    return (
      this.props.data.map((dat, index) => {
        const graphicPosition = this.getHorizontalPosition(dat);
        return (
          <rect
            key={`data-rect-${index}`}
            onMouseOver={this.generateTooltipHandler(index)}
            onMouseOut={this.hideTooltip}
            x={graphicPosition.start}
            y={this.getVerticalPosition()}
            width={graphicPosition.end - graphicPosition.start}
            height={this.props.height}
            tip={dat.tip}
            fill="grey"/>)
      })
    )
  }


  /* render sequence or label depending how zoomed in */
  renderContent = () => {
    return <SequenceComponent {...this.props}
        x="0"
        y={this.getVerticalPosition()}/>
  }


  render() {
//    console.log(this);
    return (
      <g className="track"
        onMouseOver={this.generateTooltipHandler()}
        onMouseOut={this.hideTooltip}>

        <rect
          x="0"
          y={this.getVerticalPosition()}
          width={this.props.width} height={this.props.height} fill="lightgrey" />

        {
          this.renderData()
        }
        {
          this.renderContent()
        }
        {
          this.state.tooltip ? <Tooltip {...this.state.tooltip}/> : null
        }
      </g>
    );
  }

}