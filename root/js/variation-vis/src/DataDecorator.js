const COLOR_IDS  = {};
[
  'TEAL',
  'YELLOW',
  'PURPLE',
  'RED',
  'BLUE',
  'ORANGE',
  'GREEN',
  'PINK',
  'GREY',
  'MAGENTA',
  'LIGHT_TEAL',
  'LIGHT_YELLOW'
].forEach((colorName, index) => COLOR_IDS[colorName] = index);
export {
  COLOR_IDS as COLORS
}

const PALETTE = new Map([
  [COLOR_IDS.TEAL, 'rgb(141,211,199)'],
  [COLOR_IDS.YELLOW, 'rgb(255,255,179)'],
  [COLOR_IDS.PURPLE, 'rgb(190,186,218)'],
  [COLOR_IDS.RED, 'rgb(251,128,114)'],
  [COLOR_IDS.BLUE, 'rgb(128,177,211)'],
  [COLOR_IDS.ORANGE, 'rgb(253,180,98)'],
  [COLOR_IDS.GREEN, 'rgb(179,222,105)'],
  [COLOR_IDS.PINK, 'rgb(252,205,229)'],
  [COLOR_IDS.GREY, 'rgb(217,217,217)'],
  [COLOR_IDS.MAGENTA, 'rgb(188,128,189)'],
  [COLOR_IDS.LIGHT_TEAL, 'rgb(204,235,197)'],
  [COLOR_IDS.LIGHT_YELLOW,'rgb(255,237,111)']
]);

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
        color: PALETTE.get(color % PALETTE.size),
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