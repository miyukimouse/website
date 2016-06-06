import React from 'react';
import { findDOMNode } from 'react-dom';
import Tooltip from '../Tooltip';
import SequenceComponent from '../components/SequenceComponent';
import DataSegment from '../components/DataSegment';
import $ from 'jquery';
import { TRACK_HEIGHT } from '../Utils'

export default class BasicTrack extends React.Component {

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
    coordinateMapping: React.PropTypes.shape({
      toSVGCoordinate: React.PropTypes.func,
      toSequenceCoordinate: React.PropTypes.func
    }),
    xMin: React.PropTypes.number,
    xMax: React.PropTypes.number,
//    viewWidth: React.PropTypes.number,
    tip: React.PropTypes.string,
    onTooltipShow: React.PropTypes.func,
    onTooltipHide: React.PropTypes.func,
    colorScheme: React.PropTypes.object,
    y: React.PropTypes.number,
    width: React.PropTypes.number,
    height: React.PropTypes.number
  }

  static contextTypes = {
    isZoomPanOccuring: React.PropTypes.bool,
    viewWidth: React.PropTypes.number,
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
    height: 25,
    data: []
  }

  getVerticalPosition = () => {
    return this.props.y;
  }

  getHorizontalPosition = (dat) => {
    return {
      start: this.props.coordinateMapping.toSVGCoordinate(dat.start),
      end: this.props.coordinateMapping.toSVGCoordinate(dat.end)
    }
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
            x={graphicPosition.start}
            y={this.getVerticalPosition()}
            width={graphicPosition.end - graphicPosition.start}
            height={this.props.height}
            tip={dat.tip}
            fill={dat.color || 'grey'}
            fillOpacity={(dat.fillOpacity || dat.fillOpacity === 0) ? dat.fillOpacity : 1}/>)
      })
    )
  }


  /* render sequence or label depending how zoomed in */
  renderContent = () => {
    let {xMin, xMax, sequence} = this.props;
    const rawSegmentLength = xMax - xMin;
    xMin = Math.max(0, xMin);
    xMax = Math.min(xMax, sequence.length);
    const sequenceSegment = sequence.slice(xMin, xMax);

    const {start, end} = this.getHorizontalPosition({
      start: xMin,
      end: xMax
    });

    return this.context.isZoomPanOccuring ? null :
      <SequenceComponent {...this.props}
        width={end - start}
        sequence={sequenceSegment}
        apparentWidth={this.context.viewWidth / rawSegmentLength * sequenceSegment.length}
        x={start}
        y={this.getVerticalPosition()}/>
  }


  render() {
    return (
      <g className="track">
        <g filter="url(#demo2)">
        {
          this.renderData()
        }
        </g>
        <g>
        {
          this.props.sequence ? this.renderContent() : null
        }
        {
          this.state.tooltip ? <Tooltip {...this.state.tooltip}/> : null
        }
        </g>
      </g>
    );
  }

}