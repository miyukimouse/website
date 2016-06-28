import React from 'react';
import ColorScheme, { COLORS } from '../Utils/ColorHelper';
import PrettyTrackSVGFilter from './PrettyTrackSVGFilter';

const LEGEND_ITEM_OUTER_HEIGHT = 32;
const LEGEND_ITEM_HEIGHT = 22;
const LEGEND_ITEM_WIDTH = 22;

export default class TrackLegend extends React.Component {
  static propTypes = {
    colorScheme: React.PropTypes.object,
  }

  _renderLegends() {
    const colorScheme = this.props.colorScheme;
    const legendData = colorScheme.getLegendData();
    const style = {
      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
      padding: 10
    };
    return (
      colorScheme ? <svg
        style={style}
        height={legendData.length * LEGEND_ITEM_OUTER_HEIGHT}>
        <defs>
          <PrettyTrackSVGFilter/>
        </defs>
        {
          legendData.map((dat, index) => {
            return this._renderLegendItem(dat, index)
          })
        }
      </svg>: null);
  }

  _renderLegendItem(dat, index) {
    return (<g>
      <rect
        filter={`url(#${PrettyTrackSVGFilter.ID})`}
        x={0}
        y={index * LEGEND_ITEM_OUTER_HEIGHT}
        width={LEGEND_ITEM_WIDTH}
        height={LEGEND_ITEM_HEIGHT}
        fill={dat.color}
        stroke="#000000"/>
      <text
         x={LEGEND_ITEM_WIDTH * 2}
         y={index * LEGEND_ITEM_OUTER_HEIGHT + 0.55 * LEGEND_ITEM_OUTER_HEIGHT}>
      {
        dat.group
      }
      </text>

    </g>)
  }

  render() {
    return this._renderLegends();
  }
}