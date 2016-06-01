import "babel-polyfill";
import React from 'react';
import Tooltip from './Tooltip';
import Ruler from './Ruler';
import svgPanZoom from 'svg-pan-zoom';
import Hammer from 'hammerjs';

const DEFAULT_SVG_INTERNAL_WIDTH = 100;
const DEFAULT_SVG_HEIGHT = 600;  // use the same vertical coordinate system for internal vs apparent

export default class Viewer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      //lastMoveTime: Number.NEGATIVE_INFINITY,

      // zoomPan scale and position
      zoomPan: null,
      zoomFactor: 1,
      xMin: 0,  // visible region of svg by internal coordinate
      xMax: DEFAULT_SVG_INTERNAL_WIDTH,
      fullWidth: DEFAULT_SVG_INTERNAL_WIDTH,
      viewWidth: 500,

      // tooltips
      tooltip: null,
      tooltipEventID: 0,

      // zoomPan
      isZoomPanOccuring: false,
      zoomPanEventId: 0,
      zoomPanCallId: 0,  // avoid too many render by
      // zoomPanEvents: [],

     };
  }

  static childContextTypes = {
    zoomFactor: React.PropTypes.number,
    viewWidth: React.PropTypes.number,
    getXMin: React.PropTypes.func,
    getXMax: React.PropTypes.func,
    //toApparentWidth: React.PropTypes.func,
    toWidth: React.PropTypes.func,
    toReferenceUnit: React.PropTypes.func,
    isZoomPanOccuring: React.PropTypes.bool,
  }

  getChildContext() {
    return {
      zoomFactor: this.state.zoomFactor,
      viewWidth: this.state.viewWidth,
      getXMin: this._getXMin,
      getXMax: this._getXMax,
      toWidth: this._toWidth,
      toReferenceUnit: this._toReferenceUnit,
      isZoomPanOccuring: this.state.isZoomPanOccuring
    }
  }

  getZoomHandler = (multiple) => {
    return (event) => {
      if (this.state.zoomPan){
        this.state.zoomPan.zoomBy(multiple);
      }
    }

  }

  getPanHandler = (deltaRatio) => {
    return () => {
      if (this.state.zoomPan){
        const delta = this.state.fullWidth * deltaRatio;
        this.state.zoomPan.panBy({x: delta, y: 0});
      }
    }
  }

  handleZoomPanReset = () => {
    const zoomPan = this.state.zoomPan;
    if (zoomPan){
      const zoom = 0.95;  // add a padding to default view by zooming out
      const deltaWidth = this.state.fullWidth * (1 - zoom);
      zoomPan.zoom(zoom);
      zoomPan.pan({
        x: deltaWidth/2,  // re-center after zooming
        y: 0
      })
    }
  }

  getViewBox = () => {
    const {fullWidth} = this.state;
    return [0, 0, fullWidth, DEFAULT_SVG_HEIGHT].join(' ');
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

    const containerBox = this.refs.myContainer.getBoundingClientRect();
    const targetBox = event.target.getBoundingClientRect();

    // console.log('called');
    // const x = targetBox.left - containerBox.left;
    // const y = targetBox.top - containerBox.top;

    // function getRectCoords(rect) {
    //   const {left, top, height, width} = rect;
    //   return {
    //     left,
    //     top,
    //     height,
    //     width
    //   };
    // }

    // const target = getRectCoords(targetBox);
    // const container = getRectCoords(containerBox);

    //event.stopPropagation();

    this.setState((prevState, currProps) => {
      return {
        tooltip: {
          content: content,
          target: targetBox,
          container: containerBox
        },
        tooltipEventID: prevState.tooltipEventID + 1,
      };
    });

  }



  hideTooltip = (event) => {
    const tooltipEventID = this.state.tooltipEventID;

    if (event && (event.relatedTarget.getAttribute('class') === 'sequence-text'
      || event.relatedTarget.getAttribute('is') === 'svg-text')) {
      return;
    }

    setTimeout(() => {
      this.setState((prevState, currProps) => {
        return prevState.tooltipEventID === tooltipEventID ? {
          tooltip: null
        } : {}
      });
    }, 200);
  }


  shouldComponentUpdate(nextProps, nextState) {
    // triggers state change Only if the zoomPanCallId has stablized,
    // as zoomPanCallId changes when zoom pan is ongoing,
    // which would result in a lot unnecessary calls.
    // console.log(`${nextState.zoomPanCallId} ${this.state.zoomPanCallId}`);
    return nextState.zoomPanCallId === this.state.zoomPanCallId;
  }


  setup(configs) {
    let {fullWidth, unitLength} = configs;
    unitLength = unitLength || 10;
    this.setState({
      unitLength: unitLength,
      fullWidth: fullWidth * unitLength
    }, this._setupZoomPan);
  }


  _setupZoomPan = () => {

    const eventsHandler = {
      haltEventListeners: ['touchstart', 'touchend', 'touchmove', 'touchleave', 'touchcancel',
        'mousedown', 'mousemove', 'mouseup'],
      init: (options) => {
        var instance = options.instance
          , initialScale = 1
          , pannedX = 0
          , pannedY = 0;

        // Init Hammer
        this.hammer = new Hammer(options.eventsListenerElement)

        // Handle double tap
        this.hammer.on('doubletap', (ev) => {
          instance.zoomBy(2);
        })

        // Handle pan
        this.hammer.on('panstart panmove', (ev) => {
          // On pan start reset panned variables
          if (ev.type === 'panstart') {
            pannedX = 0
          }
          // Pan only the difference
          const factor = (this.state.fullWidth) / this.state.viewWidth;
          instance.panBy({x: (ev.deltaX - pannedX) * factor, y: false});
          pannedX = ev.deltaX;

        })

        // Prevent moving the page on some devices when panning over SVG
        options.svgElement.addEventListener('touchmove', function(e){ e.preventDefault(); });
      },
      destroy: () => {
        this.hammer.destroy()
      }
    };

    const svgElement = svgPanZoom('#svg-browser-svg', {
    //  viewportSelector: '.svg-pan-zoom_viewport'
    panEnabled: true,
    separateZoomsEnabled: true,
    beforeZoom: (zooms) => {
      if (this.state.zoomLockOn) {
        return false;
      }
      return {x: true, y: false};
    },
    beforePan: () => {
      return {x: true, y: false};
    },
    onZoom: () => {
      this.hideTooltip();
      this._updateZoomPanState();
      this._zoomPanTimeout();
    },
    onPan: () => {
      this.hideTooltip();
      this._updateZoomPanState();
      this._zoomPanTimeout()
    }
    // , controlIconsEnabled: true
    //, zoomEnabled: false
    // , dblClickZoomEnabled: true
    , mouseWheelZoomEnabled: true
    // , preventMouseEventsDefault: true
    , zoomScaleSensitivity: 0.5
    // , minZoom: 0.5
    , maxZoom: this.state.fullWidth / this.state.viewWidth
    , fit: false
    , contain: false
    , center: false,
    customEventsHandler: eventsHandler,
    // , refreshRate: 'auto'
    // , beforeZoom: function(){}
    // , onZoom: function(){}
    // , beforePan: function(){}
    // , onPan: function(){}
    eventsListenerElement: document.querySelector('#svg-browser')
    });
    $('#svg-browser-svg').css({
     width: '100%',
   // height:'100%'
    })
    //svgElement
    //svgElement.resize()
//svgElement.setAttribute('width', 500)

    this.setState({
      zoomPan: svgElement
    }, () => {
      this.handleZoomPanReset();
    });

    //this.svgElement = svgElement;

  }

  _updateZoomPanState = () => {

    const {x: zoomFactor} = this.state.zoomPan.getZooms();
    const {x: panOffset} = this.state.zoomPan.getPan();
    const xMin = panOffset * -1 / zoomFactor;
    const zoomPanCallId = this.state.zoomPanCallId + 1;
    // const newZoomPanEvents = this.state.zoomPanEvents.concat({
    //   zoomFactor,
    //   panOffset,
    //   zoomPanCallId,
    // });

    this.setState({
      zoomPanCallId
    });

    setTimeout(() => {
      if (this.state.zoomPanCallId === zoomPanCallId) {
        // if no new zoomPan events occur during the timeout
        this.setState((prevState) => {
          return {
            xMin: xMin,
            zoomFactor: zoomFactor
          };
        });
      }
    }, 400);
  }

  _getXMin = () => {
    return this.state.xMin;
  }

  _getXMax = () => {
    return this.state.xMin + this.state.fullWidth / this.state.zoomFactor;
  }

  // convert apparent width to with used by SVG internally
  _toWidth = (apparentWidth) => {
    const apparentFullWidth = this.state.viewWidth * this.state.zoomFactor;
    return apparentWidth * this.state.fullWidth / apparentFullWidth;
  }

  // convert svg internal coordinate to length in the domain logic (reference)
  _toReferenceUnit = (width) => {
    return width / this.state.unitLength;
  }

  _zoomPanTimeout = () => {
    let zoomPanEventId;
    this.setState((prevState) => {
      zoomPanEventId = prevState.zoomPanEventId + 1;
      return {
        isZoomPanOccuring: true,
        zoomPanEventId: zoomPanEventId
      };
    });
    setTimeout(()=> {
      this.setState((prevState) => {
        if (prevState.zoomPanEventId === zoomPanEventId){
          // only cancel isZoomPanOccuring if no zoompan request is made
          return {
            isZoomPanOccuring: false
          };
        }else{
          return {};
        }
      });
    }, 200);
  }


  render() {
    return (
      <div ref="myContainer"
        style={{
          position: 'relative',
          width: this.state.viewWidth,
          border:"1px solid #aaaaaa",
          ...this.props.style
        }}>
        <svg id="svg-browser"
          onWheel={this.handlePan}
          viewBox={this.getViewBox()}
          height="100%"
          width={this.state.viewWidth}
          preserveAspectRatio="none">
          <svg id="svg-browser-svg"
            x={0} y={0}
            style={{
              fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif'
            }}
            //preserveAspectRatio="meet xMinYMin"
            >
            <defs>
              <filter id="demo2">
                <feGaussianBlur stdDeviation={2 / (this.context.zoomFactor * this.context.zoomFactor || 1)} result="blur2" />
                  <feSpecularLighting result="spec2" in="blur2" specularConstant="1.4" specularExponent="13" lightingColor="#888888">
                  <feDistantLight azimuth="270" elevation="20" />
                </feSpecularLighting>
                <feComposite in="SourceGraphic" in2="spec2" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
              </filter>
              </defs>
              <Ruler/>
              <g>
              {
                React.Children.map(this.props.children, (child) => child ? React.cloneElement(child, {
                    width: this.state.fullWidth,
                    xMin: this._getXMin(),
                    xMax: this._getXMax(),
                    onTooltipShow: this.showTooltip,
                    onTooltipHide: this.hideTooltip,                    
                  }) : null)
              }
              </g>
            </svg>
          </svg>
          { this.state.tooltip
            ? <Tooltip {...this.state.tooltip}/>
            : null
          }
        </div>
    );
  }

}
