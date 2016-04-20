class BinMachine {

  constructor(lower, upper, maxBinCount) {
    const binWidth = this._getBinWidth(lower, upper, maxBinCount);
    this.minBin = binWidth * Math.floor(lower / binWidth);
    this.maxBin = binWidth * Math.ceil(upper / binWidth);
    this.binWidth = binWidth;
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

  _getBinWidth = (lower, upper, maxBinCount) => {
    const delta = (upper - lower) / maxBinCount;
    return Math.ceil(delta);
  }
}

export {
  BinMachine
}
