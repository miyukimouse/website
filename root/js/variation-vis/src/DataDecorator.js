const PALETTE = [
  'rgb(141,211,199)','rgb(255,255,179)','rgb(190,186,218)','rgb(251,128,114)',
  'rgb(128,177,211)','rgb(253,180,98)','rgb(179,222,105)','rgb(252,205,229)',
  'rgb(217,217,217)','rgb(188,128,189)','rgb(204,235,197)','rgb(255,237,111)'
]

export default class ColorScheme {

  constructor(groupFunction, {...groupToColor}={}) {
    this.groupFunction = groupFunction || function(dat, index) { return index };
    this.groupToColor = groupToColor;
  }

  decorate(data=[]){
    return data.map((dat, index) => {
      const group = this.groupFunction(dat, index);
      let color = this.groupToColor[group];
      if (!this._isColorValid(color)){
        // find an available color to use
        color = this._newColor(group);
      }
      return {
        color: PALETTE[color % PALETTE.length],
        ...dat
      }
    });
  }


  _newColor(group){
    let color = 0;
    while (this._isColorTaken(color)){
      color++;
    }
    this.groupToColor[group] = color;
    return color;
  }

  _isColorTaken(color){
    return Object.keys(this.groupToColor).some((key) => {
      return this.groupToColor[key] === color;
    });
  }

  _isColorValid(color){
    return color || color === 0;
  }

}