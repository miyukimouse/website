const getBinWidth = (lower, upper, maxBinCount) => {
  const delta = (upper - lower) / maxBinCount;
  const dCount = _countDigits(delta);
  const coefficent = delta / Math.pow(10, dCount - 1);  // the coefficient in scientific notation
  let l;
  if (coefficent <= 1){
    l =  1;
  }else if (coefficent<= 2){
    l = 2;
  }else if (coefficent<=5){
    l = 5;
  }else{
    l = 10;
  }
  return l * Math.pow(10, dCount - 1);
}

// console.log(getBinWidth(99, 1233, 10))


const getBins = (lower, upper, maxBinCount) => {
  const binWidth = getBinWidth(lower, upper, maxBinCount);
  const minBin = binWidth * Math.floor(lower / binWidth);
  const binList = [];
  for (let bin=minBin; bin < upper; bin=bin+binWidth){
    binList.push(bin);
  }
  return binList;
}

// console.log(getBins(99, 233, 10))
// console.log(getBins(99, 1233, 10))
// console.log(getBins(99, 4233, 10))
// console.log(getBins(99, 9233, 10))


const _countDigits = (n) => {
  if (n < 1) {
    return 0;
  }else{
    return Math.floor(Math.log10(n)) + 1;
  }
}
// console.log(_countDigits(1023))


class BinMachine {

  constructor(lower, upper, maxBinCount) {
    this.binWidth = getBinWidth(lower, upper, maxBinCount);
    this.minBin = binWidth * Math.floor(lower / binWidth);
    this.maxBin = binWidth * Math.ceil(upper / binWidth);
  }

  // the bin that the value belongs to
  getBinOf = (value) => {
    const {minBin, maxBin, binWidth} = this;
    if (value < minBin || value > maxBin) {
      return null;
    } else {
      const binIndex = Math.floor((value - minBin) / binWidth);
      return minBin + binIndex * binWidth;
    }
  }

  getBinListOf = (range) => {
    const {start, end} = range;
    const featureLength = end - start;
    const startBin = this.getBinOf(start);
    const endBin = featureLength > 1 ? this.getBinOf(end - 1) : startBin;  // end position is the position After a feature ends
    const binList = [];
    for (let bin=startBin; bin <= endBin; bin=bin+binWidth){
      binList.push(bin);
    }
    return binList;
  }
}

export {
  getBins,
  getBinWidth,
  BinMachine
}
