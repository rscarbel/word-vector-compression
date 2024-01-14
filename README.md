### Heads up, the point of this repository is not to be a beautiful UI or clean code, it's to demonstrate that it is possible to compress the conceptual content of massive bodies of text. The practical use is that this can be fed into a GPT algorithm so that it can handle bodies of text that far exceed the context window they're used to. 

### There is a lot of nuance as to how I think it would best integrate with a GPT algorithm, but on a high level, you can train one GPT algorithm on how to predict topics that should come next, and another GPT algorithm specialized in filling in the actual words and sentences to "fill in" the next topic.
# Demo
https://github.com/rscarbel/word-vector-compression/assets/40727301/713873b4-32e7-4521-9046-1131d0067ac1

Fair warning, the code itself is not super clean on this. I just wanted to spit out a proof of concept that you could compress sentences into smaller units based off cluster in vector space. The 

![Screenshot 2023-05-05 at 9 39 56 AM](https://user-images.githubusercontent.com/40727301/236474598-3f4e6b63-7793-4f64-bfec-5365c6484c36.png)
