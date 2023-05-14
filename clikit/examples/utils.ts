export const range = (n: number) => [...Array(n).keys()];

export function gaussianRandom(mean = 0, stdev = 1) {
  const u = 1 - Math.random();
  const v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return z * stdev + mean;
}

const words = 'abcdefghijklmnopqrstuvwxyz'.split('');
const wordLength = 6; // Average length of a word
const sentenceLength = 15; // Average number of words in a sentence
const paragraphLength = 5; // Average number of sentences in a paragraph

export function generateSentence(): string {
  let sentence = '';
  const randomLength = Math.floor(gaussianRandom(sentenceLength, 5)) + 1;
  for (let i = 0; i < randomLength; i++) {
    sentence += generateWord() + ' ';
  }
  return sentence.trim();
}

export function generateWord(): string {
  let word = '';
  const randomLength = Math.floor(gaussianRandom(wordLength, 5)) + 1;
  for (let i = 0; i < randomLength; i++) {
    word += words[Math.floor(Math.random() * words.length)];
  }
  return word;
}

export function generateParagraph(): string {
  let paragraph = '';
  const randomLength = Math.floor(gaussianRandom(paragraphLength, 5)) + 1;
  for (let i = 0; i < randomLength; i++) {
    paragraph += generateSentence() + '\n';
  }
  return paragraph;
}

export function generateText(): string {
  let text = '';
  for (let i = 0; i < 4; i++) {
    text += generateParagraph() + '\n';
  }
  return text.trim();
}
