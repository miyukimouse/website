const PALETTE = [
  'rgb(141,211,199)','rgb(255,255,179)','rgb(190,186,218)','rgb(251,128,114)',
  'rgb(128,177,211)','rgb(253,180,98)','rgb(179,222,105)','rgb(252,205,229)',
  'rgb(217,217,217)','rgb(188,128,189)','rgb(204,235,197)','rgb(255,237,111)'
]

function colorLoader(data=[], groupFunction, {...groupToColor}={}) {
  groupFunction = groupFunction || function(dat, index) { return index };

  return data.map((dat, index) => {
    const group = groupFunction(dat, index);
    let color = groupToColor[group];
    if (!(color || color === 0)){
      // find an available color to use
      color = _getNewColor(groupToColor);
      groupToColor[group] = color;
    }
    return {
      color: PALETTE[color % PALETTE.length],
      ...dat
    }
  })

}

function _getNewColor(groupToColor){
  let color = 0;
  const colorsUsed = _getUsedColors(groupToColor);
  while (colorsUsed.has(color)){
    color++;
  }
  return color;
}

function _getUsedColors(groupToColor){
  const colorsUsed = Object.keys(groupToColor).map((key) => {
    return groupToColor[key];
  });
  return new Set(colorsUsed);
}

export default colorLoader;