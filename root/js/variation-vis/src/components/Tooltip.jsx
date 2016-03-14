import React from 'react';
import ReactDOM from 'react-dom';
import { Button, Popover, Overlay } from 'react-bootstrap';

export default class Tooltip extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      left: 0,
      top: 0
    };
  }

  static propTypes = {
    target: React.PropTypes.shape({
      top: React.PropTypes.number,
      left: React.PropTypes.number,
      width: React.PropTypes.number,
      height: React.PropTypes.number,
    }),
    container: React.PropTypes.shape({
      top: React.PropTypes.number,
      left: React.PropTypes.number,
      width: React.PropTypes.number,
      height: React.PropTypes.number,
    }),
    content: React.PropTypes.string
  }


  showTooltip = ({content, event}) => {

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
    console.log('called');

    const containerBox = this.refs.myContainer.getBoundingClientRect();
    const targetBox = event.target.getBoundingClientRect();
    console.log('container box:');
    console.log(containerBox);
    console.log('target box');
    console.log(targetBox);
    const x = targetBox.left - containerBox.left;
    const y = targetBox.top - containerBox.top;

    event.stopPropagation();

    this.setState((prevState, currProps) => {
      return {
        tooltip: {
          x,
          y,
          width: targetBox.width,
          height: targetBox.height,
          content: content
        },
        tooltipEventID: prevState.tooltipEventID + 1,
      };
    });
  }


  componentDidMount() {
    this.setState({
      ...this._getOrigin()
    })
  }

  componentWillReceiveProps(nextProps) {
//  componentDidUpdate() {
    this.setState({
      ...this._getOrigin()
    })
  }

// point on target
  _getPointer = () => {
    // take the intersecting rectangle of target and container
    const newBox = this._getIntersectRect(this.props.target, this.props.container);
    const {left, top, width} = newBox;
    return {
      left: left + width/2,
      top: top
    }
  }

  _getIntersectRect = (rect1, rect2) => {
    const left = Math.max(rect1.left, rect2.left);
    const top = Math.max(rect1.top, rect2.top);

    const _getRight = (rect) => {
      return rect.left + rect.width;
    }
    const _getBottom = (rect) => {
      return rect.top + rect.height;
    }

    const right = Math.min(_getRight(rect1), _getRight(rect2));
    const bottom = Math.min(_getBottom(rect1), _getBottom(rect2));

    const intersect = {
      left,
      top,
      width: right - left,
      height: bottom - top
    };
    return intersect;
  }

  // tooltip origin
  _getOrigin = () => {
    if (!this.refs.tooltipContainer) return;

    const tooltipNode = ReactDOM.findDOMNode(this.refs.tooltipContainer);
    //this.refs.tooltipContainer.getDOMNode();
    const width = tooltipNode.clientWidth;
    const height = tooltipNode.clientHeight;

    const pointer = this._getPointer();
    return {
      left: pointer.left - width/2,
      top: pointer.top - height
    }
  }

  render() {
    const {left, top} = this.state;

    return this.props.content && this.props.target ?
        <Popover ref="tooltipContainer"
          title="Popover right"
          placement="top"
          positionLeft={left}
          positionTop={top}>
          {this.props.content}
        </Popover>
        : null;
  }

}
