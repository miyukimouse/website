import { BinMachine } from './BinHelper';

export default function BinnedLoader(data, lower, upper, maxBinCount) {
  const binMinchine = new BinMachine(lower, upper, maxBinCount);
  const binWidth = binMinchine.binWidth;
  const binToData = {};

  // construct the binToData map
  data.forEach((dat) => {
    const binList = binMinchine.getBinListOf(dat);
    binList.forEach((bin) => {
      if (!binToData[bin]) {
        binToData[bin] = []
      }
      binToData[bin].push(dat);
    });
  });

  const binnedData = Object.keys(binToData).map((bin) => {
    return {
      start: bin,
      end: start + binWidth,
      data: binnedData[bin]
    }
  })

  return binnedData;
}