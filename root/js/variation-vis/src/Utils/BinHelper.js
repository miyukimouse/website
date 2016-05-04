export default class BinHelper {

  static getBinWidth(lower, upper, maxBinCount) {
    const delta = (upper - lower) / maxBinCount;
    return Math.ceil(delta);
  }

  static getBinDescriptor(lower, upper, maxBinCount) {
    const binWidth = BinHelper.getBinWidth(lower, upper, maxBinCount);
    const minBin = binWidth * Math.floor(lower / binWidth);
    const maxBin = binWidth * Math.ceil(upper / binWidth);
    return {
      binWidth,
      minBin,
      maxBin
    }
  }

  static getBins(lower, upper, maxBinCount) {
    const {minBin, maxBin, binWidth} = BinHelper.getBinDescriptor(lower, upper, maxBinCount);
    const bins = [];
    for (let binStart=minBin; binStart <= maxBin; binStart+=binWidth) {
      bins.push(binStart);
    }
    return bins;
  }

  constructor(lower, upper, maxBinCount) {
    const {minBin, maxBin, binWidth} = BinHelper.getBinDescriptor(lower, upper, maxBinCount);
    this.binWidth = binWidth;
    this.minBin = minBin;
    this.maxBin =  maxBin;
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
    for (let bin=startBin; bin <= endBin; bin=bin+this.binWidth){
      binList.push(bin);
    }
    return binList;
  }
}

// export {
//   BinMachine
// }
