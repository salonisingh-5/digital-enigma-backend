export const puzzles = [
  {
    id: 1, domain: 'cryptography',
    title: 'Caesar Cipher',
    question: 'Decode this Caesar Cipher: KHOOR ZRUOG',
    flag: 'HELLO WORLD', difficulty: 1, time_limit: 300,
    hints: [
      'Think about a famous Roman cipher.',
      'Every letter is shifted equally.',
      'Shift each character back by 3.',
    ],
  },
  {
    id: 2, domain: 'cryptography',
    title: 'Binary Message',
    question: 'Decode the binary message: 01001000 01001001',
    flag: 'HI', difficulty: 1, time_limit: 240,
    hints: [
      'Binary uses only two digits.',
      'Convert each 8-bit group into ASCII.',
      '01001000 = H and 01001001 = I.',
    ],
  },
  {
    id: 3, domain: 'cryptography',
    title: 'Reverse Text',
    question: 'A secret message is encrypted using reverse text: DLROW OLLEH',
    flag: 'HELLO WORLD', difficulty: 2, time_limit: 300,
    hints: [
      'Sometimes the simplest encryption is reversal.',
      'Try reading the message backwards.',
      'Reverse the entire string to get the answer.',
    ],
  },
  {
    id: 4, domain: 'web',
    title: 'View Source',
    question: 'Inspect the webpage source code to find the hidden flag inside an HTML comment.',
    flag: 'FLAG{VIEW_SOURCE}', difficulty: 1, time_limit: 300,
    hints: [
      'Browsers can reveal more than what is visible.',
      'Right click and inspect the page source.',
      'Look for <!-- hidden comments --> in the HTML.',
    ],
  },
  {
    id: 5, domain: 'web',
    title: 'Hidden Text',
    question: 'The flag is hidden using white text on a white background.',
    flag: 'FLAG{HIDDEN_TEXT}', difficulty: 2, time_limit: 300,
    hints: [
      'Not everything invisible is removed.',
      'Try selecting all the text on the page.',
      'Use Ctrl + A to reveal hidden white-colored text.',
    ],
  },
  {
    id: 6, domain: 'web',
    title: 'Cookie Monster',
    question: 'A JavaScript cookie contains the hidden flag.',
    flag: 'FLAG{COOKIE_MONSTER}', difficulty: 2, time_limit: 300,
    hints: [
      'Websites store small pieces of data locally.',
      'Open Developer Tools and inspect cookies.',
      'Check document.cookie in the browser console.',
    ],
  },
  {
    id: 7, domain: 'forensics',
    title: 'EXIF Metadata',
    question: 'An image file contains hidden metadata with the flag.',
    flag: 'FLAG{EXIF_FOUND}', difficulty: 2, time_limit: 300,
    hints: [
      'Images store extra information beyond pixels.',
      'Check the metadata of the image file.',
      'Use exiftool or inspect EXIF metadata.',
    ],
  },
  {
    id: 8, domain: 'forensics',
    title: 'Log Analysis',
    question: 'Analyze the server logs and identify the suspicious IP address.',
    flag: 'FLAG{192.168.1.66}', difficulty: 3, time_limit: 420,
    hints: [
      'Look for unusual repeated activity.',
      'Check failed login attempts carefully.',
      'The suspicious IP appears multiple times in failed requests.',
    ],
  },
  {
    id: 9, domain: 'forensics',
    title: 'Audio Spectrogram',
    question: 'A hidden message is embedded inside an audio spectrogram.',
    flag: 'FLAG{SPECTROGRAM_SECRET}', difficulty: 3, time_limit: 420,
    hints: [
      'Audio can hide visual information.',
      'Convert the audio into a spectrogram image.',
      'Use spectrogram analysis tools to reveal hidden text.',
    ],
  },
  {
    id: 10, domain: 'database',
    title: 'SQL Login Bypass',
    question: 'Login bypass using SQL injection.',
    flag: 'FLAG{SQLI_LOGIN}', difficulty: 2, time_limit: 300,
    hints: [
      'Inputs can sometimes break queries.',
      'Think about login conditions.',
      "Use ' OR 1=1 -- to bypass authentication.",
    ],
  },
  {
    id: 11, domain: 'database',
    title: 'Hidden Admin Row',
    question: 'Find the hidden admin record in the database.',
    flag: 'FLAG{HIDDEN_ROW}', difficulty: 2, time_limit: 300,
    hints: [
      'Not all data is shown by default.',
      'Use filtering in SQL.',
      "Try WHERE role = 'admin'.",
    ],
  },
  {
    id: 12, domain: 'database',
    title: 'Blind SQL Injection',
    question: 'Perform a blind SQL injection to extract data.',
    flag: 'FLAG{BLIND_SQLI}', difficulty: 3, time_limit: 300,
    hints: [
      "You won't see direct output.",
      'Think in terms of true or false.',
      'Use AND conditions like 1=1 and 1=2.',
    ],
  },
];

export const getPuzzlesByDomain = (domain) =>
  puzzles.filter((p) => p.domain === domain);

export const difficultyLabel = (d) =>
  d === 1 ? 'EASY' : d === 2 ? 'MEDIUM' : 'HARD';

export const difficultyColor = (d) =>
  d === 1 ? '#10b981' : d === 2 ? '#eab308' : '#ef4444';
