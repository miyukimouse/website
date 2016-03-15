import React from 'react';
import { findDOMNode } from 'react-dom';
import Tooltip from './Tooltip.jsx';
import SequenceComponent from './SequenceComponent.jsx';
import DataSegment from './components/DataSegment.jsx';
import $ from 'jquery';
import { TRACK_HEIGHT } from './Utils.js'
import CustomEvents from './CustomEvents.js'

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
    onTooltipShow: React.PropTypes.func,
    onTooltipHide: React.PropTypes.func,
    colorScheme: React.PropTypes.object,
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
  }

  addSequenceVisibilityEventListener = (callback) => {
    CustomEvents.subscribe(this, function() {
      callback();
    });
  }

  removeSequenceVisibilityEventListener = () => {
    CustomEvents.unsubscribe(this);
  }

  triggerSequenceVisibilityEvent = (data) => {
    CustomEvents.notify(this, data);
  }

  /* data series within a track */
  renderData(){
    const data = this.props.colorScheme
      ? this.props.colorScheme.decorate(this.props.data) : this.props.data;
    return (
      data.map((dat, index) => {
        const graphicPosition = this.getHorizontalPosition(dat);
        return (
          <DataSegment
            key={`data-rect-${index}`}
            onMouseEnter={(event) => this.props.onTooltipShow ? this.props.onTooltipShow({content: dat.tip, event: event}) : null}
            onMouseLeave={this.props.onTooltipHide}
            addSequenceVisibilityEventListener=this.addSequenceVisibilityEventListener
            removeSequenceVisibilityEventListener=this.removeSequenceVisibilityEventListener
            x={graphicPosition.start}
            y={this.getVerticalPosition()}
            width={graphicPosition.end - graphicPosition.start}
            height={this.props.height}
            tip={dat.tip}
            fill={dat.color || 'grey'}/>)
      })
    )
  }


  /* render sequence or label depending how zoomed in */
  renderContent = () => {
    return <SequenceComponent {...this.props}
        x="0"
        y={this.getVerticalPosition()}
        onVisibilitySet={this.triggerSequenceVisibilityEvent}/>
  }


  render() {
//    console.log(this);
    return (
      <g className="track">
        <rect
          x="0"
          y={this.getVerticalPosition()}
          width={this.props.width} height={this.props.height} fillOpacity="0"/>

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