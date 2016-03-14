/*
 a data loader is a function that takes some input,
 and convert it to data accepted by tracks.

 input is data for the whole track for now, will be the consuming from buffer ideally
*/

/* this package internally uses 0-base start coordinate and 1-based end coordinate */

// takes one or more lists of ranges and output another after merging the overlapping ones
function unionLoader(inputs=[]) {
  const allInputs = [].concat(...inputs);  // flatten the 1st level and put everything in a big array
  const occupancyArr = _createOccupancyMap(allInputs);
  return _occupancyMapToRanges(occupancyArr);
}


// takes some lists of ranges and output another after merging the overlapping ones
function intersectionLoader(inputs=[]) {
  if (inputs.length <= 1) {
    return inputs[0] || [];
  }
  const occupancyArrAll = inputs.map(_createOccupancyMap);
  return _occupancyMapToRanges(_vectorizedAnd(occupancyArrAll));

}

function _createOccupancyMap(input=[], mapLength){
  const occupancyArr = new Array();

  input.forEach((range) => {
    const {start, end} = data;
    const length = end - start;
    occupancyArr.splice(start, length, Array(length).fill(1));
    }
  });

  return occupancyArr.map((v) => v || 0);
}

function _occupancyMapToRanges(occupancyArr=[]){
  const ranges = [];
  let [newStart, newEnd] = [0, 0];
  let isOccupiedPrevious;

  occupancyArr.forEach((isOccupiedCurrent, index) => {
    if (isOccupiedCurrent && isOccupiedPrevious) {
      newEnd += 1; // extend current range
    } else if (isOccupiedCurrent) {
      // starting a new range base on current index
      newStart = index;
      newEnd = index + 1;
    } else if (isOccupiedPrevious) {
      // save the previous range
      ranges.push({
        start: newStart,
        end: newEnd
      })
    }
    isOccupiedPrevious = isOccupiedCurrent;  //update previous variable
  });

  return ranges;
}

function _vectorizedAnd([...inputs]=[]){
  if (inputs.length <= 1) {
    return inputs[0] || [];
  }

  const arrayLengths = inputs.map((input) => input.length);
  const minArrayLength = Math.min(lengthArray);  // only interested in Min, that's relavent to truthy elements
  const results = Array(minArrayLength);
  for (let index; index < minArrayLength; index++){
    const bools = inputs.map((value) => value ? 1 : 0);
    results[index] = Math.sum(...bools) === inputs.length;
  }
  return results;
}

export {
  unionLoader
};