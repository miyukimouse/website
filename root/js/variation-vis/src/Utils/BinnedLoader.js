import { BinMachine } from './BinHelper';

export default function BinnedLoader(data, lower, upper, maxBinCount) {
  const binMinchine = new BinMachine(lower, upper, maxBinCount);
  console.log(binMinchine);
  const binWidth = binMinchine.binWidth;
  const binToData = {};

  // construct the binToData map
  data.forEach((dat) => {
    const binList = binMinchine.getBinListOf(dat);
    binList.forEach((bin) => {
      if (!binToData[bin]) {
        binToData[bin] = [];
      }
      binToData[bin].push(dat);
    });
  });

  const binnedData = Object.keys(binToData).map((binStr) => {
    const bin = Number(binStr);  // first convert string to number
    return {
      start: bin,
      end: bin + binWidth,
      data: binToData[bin]
    }
  });

  return binnedData;
}