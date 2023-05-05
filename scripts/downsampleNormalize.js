const downsampleNormalize = (tokenizedConversationArray, size) => {
  const N = tokenizedConversationArray.length;
  const downsampledArr = new Array(size).fill(0);

  for (let i = 0; i < size; i++) {
    const start = Math.floor((N / size) * i);
    const end = Math.floor((N / size) * (i + 1));
    let sum = 0;

    for (let j = start; j < end; j++) {
      sum += tokenizedConversationArray[j];
    }

    downsampledArr[i] = sum / (end - start);
  }

  return downsampledArr;
};

module.exports = downsampleNormalize;
