const discreteCosineTransform = (tokenizedConversationArray) => {
  const N = tokenizedConversationArray.length;
  const transformedArr = new Array(N).fill(0);

  for (let k = 0; k < N; k++) {
    let sum = 0;
    const c = k === 0 ? Math.sqrt(0.5) : 1;

    for (let n = 0; n < N; n++) {
      sum +=
        tokenizedConversationArray[n] * Math.cos((Math.PI / N) * (n + 0.5) * k);
    }

    transformedArr[k] = c * sum * Math.sqrt(2 / N);
  }

  return transformedArr;
};

module.exports = discreteCosineTransform;
