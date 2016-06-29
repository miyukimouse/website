const COLOR_IDS  = {};
[
  'YELLOW',
  'RED',
  'BLUE',
  'ORANGE',
  'GREEN',
  'PINK',
  'GREY',
  'MAGENTA',
  'TEAL',
  'PURPLE',
  'LIGHT_TEAL',
  'LIGHT_YELLOW',
  'LIGTH_GREY',
  'BLACK',
  'WHITE',
].forEach((colorName, index) => COLOR_IDS[colorName] = index);
export {
  COLOR_IDS as COLORS
}

const PALETTE = new Map([
  [COLOR_IDS.TEAL, 'rgb(84,189,146)'],
  [COLOR_IDS.YELLOW, 'rgb(241,192,0)'],
  [COLOR_IDS.PURPLE, 'rgb(96,86,161)'],
  [COLOR_IDS.RED, 'rgb(251,128,114)'],
  [COLOR_IDS.BLUE, 'rgb(62,131,179)'],
  [COLOR_IDS.ORANGE, 'rgb(253,180,98)'],
  [COLOR_IDS.GREEN, 'rgb(179,222,105)'],
  [COLOR_IDS.PINK, 'rgb(252,205,229)'],
  [COLOR_IDS.GREY, 'rgb(90,90,90)'],
  [COLOR_IDS.MAGENTA, 'rgb(188,128,189)'],
  [COLOR_IDS.LIGHT_TEAL, 'rgb(204,235,197)'],
  [COLOR_IDS.LIGHT_YELLOW,'rgb(255,237,111)'],
  [COLOR_IDS.LIGTH_GREY, 'rgb(204,204,204)'],
  [COLOR_IDS.BLACK, 'rgb(0,0,0)'],
  [COLOR_IDS.WHITE, 'rgb(255,255,255)'],
]);

// Original color palette based on ColorBrewer,
//but seems too light when combined with lighting effect
// const PALETTE = new Map([
//   [COLOR_IDS.TEAL, 'rgb(141,211,199)'],
//   [COLOR_IDS.YELLOW, 'rgb(255,255,179)'],
//   [COLOR_IDS.PURPLE, 'rgb(190,186,218)'],
//   [COLOR_IDS.RED, 'rgb(251,128,114)'],
//   [COLOR_IDS.BLUE, 'rgb(128,177,211)'],
//   [COLOR_IDS.ORANGE, 'rgb(253,180,98)'],
//   [COLOR_IDS.GREEN, 'rgb(179,222,105)'],
//   [COLOR_IDS.PINK, 'rgb(252,205,229)'],
//   [COLOR_IDS.GREY, 'rgb(217,217,217)'],
//   [COLOR_IDS.MAGENTA, 'rgb(188,128,189)'],
//   [COLOR_IDS.LIGHT_TEAL, 'rgb(204,235,197)'],
//   [COLOR_IDS.LIGHT_YELLOW,'rgb(255,237,111)'],
//   [COLOR_IDS.LIGTH_GREY, 'rgb(204,204,204)'],
//   [COLOR_IDS.BLACK, 'rgb(0,0,0)'],
// ]);

export default class ColorScheme {

  constructor(groupFunction, {...groupToColor}={}, fallbackScheme) {
    const defaultGroupToColor = {
      'ColorScheme.default.background': {
        colorId: COLOR_IDS.GREY,
        description: 'Others'
      }
    };

    if (fallbackScheme) {
      const fallbackGroupFunction = fallbackScheme.getGroupFunction();
      const fallbackGroupToColor = fallbackScheme.getGroupToColorMap();
      this.groupFunction = this._composeGroupFunction(groupFunction, fallbackGroupFunction);
      this.groupToColor = {
        ...defaultGroupToColor,
        ...fallbackGroupToColor,
        ...groupToColor
      };
    } else {
      this.groupFunction = groupFunction || function(dat, index) { return index };
      this.groupToColor = {
        ...defaultGroupToColor,
        ...groupToColor
      };
    }
  }

  decorate(data=[]){
    return data.map((dat, index) => {
      const rawGroup = this.groupFunction(dat, index);
      return this.decorateWithGroup(dat, rawGroup);
    });
  }

  decorateWithGroup(dat, rawGroup) {
    const group = this._parseGroup(rawGroup);
    let {colorId} = this.groupToColor[group.key] || {};

    if (!this._isColorValid(colorId)){
      // find an available color to use
      colorId = this._newColor(group);
    }

    return {
      color: this.getColor(colorId),
      ...dat
    }
  }

  getGroupFunction() {
    return this.groupFunction;
  }

  getGroupToColorMap() {
    return {...this.groupToColor};
  }

  getColor(colorId) {
    return PALETTE.get(colorId % PALETTE.size);
  }

  getLegendData() {
    let groupKeys = Object.keys(this.groupToColor);
    return groupKeys.map((groupKey) => {
      const {colorId, description} = this.groupToColor[groupKey];
      return {
        group: groupKey,
        color: this.getColor(colorId),
        description: description
      }
    })
  }

  _parseGroup(rawGroup) {
    return typeof rawGroup === 'object' ? rawGroup : {
      key: rawGroup,
      description: rawGroup
    };
  }

  _newColor(group){
    const {key, description} = group;

    let colorCounter = 0;
    while (this._isColorTaken(colorCounter)){
      colorCounter++;
    }

    this.groupToColor[key] = {
      description,
      colorId: colorCounter
    };
    return colorCounter;
  }

  _isColorTaken(colorId){
    return Object.keys(this.groupToColor).some((key) => {
      const {colorId: existingColorId} = this.groupToColor[key] || {};
      return existingColorId === colorId;
    });
  }

  _isColorValid(color){
    return color || color === 0;
  }

  _composeGroupFunction(groupFunction, fallbackGroupFunction) {
    return function(dat, index) {
      const groupKey = groupFunction(dat, index);
      if (typeof groupKey !== 'undefined') {
        return groupKey;
      } else {
        return fallbackGroupFunction(dat, index);
      }
    }
  }

}