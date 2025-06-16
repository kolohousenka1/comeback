const axios = require('axios');

class WordValidator {
  constructor() {
    this.apiKey = process.env.WORDNIK_API_KEY || 'demo'; // You'll need to get a real API key
    this.baseUrl = 'https://api.wordnik.com/v4';
  }

  async validateWord(word) {
    try {
      // For demo purposes, we'll use a simple validation
      // In production, you should get a real Wordnik API key
      if (this.apiKey === 'demo') {
        return this.validateWordOffline(word);
      }

      const response = await axios.get(
        `${this.baseUrl}/word.json/${word}/definitions`,
        {
          params: {
            api_key: this.apiKey,
            limit: 1
          },
          timeout: 5000
        }
      );

      return response.data && response.data.length > 0;
    } catch (error) {
      console.error('Word validation error:', error.message);
      // Fallback to offline validation
      return this.validateWordOffline(word);
    }
  }

  validateWordOffline(word) {
    // Simple offline validation - just check if it's a reasonable word
    const commonWords = [
      'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'man', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use',
      'cat', 'dog', 'run', 'jump', 'play', 'work', 'home', 'time', 'year', 'back', 'good', 'make', 'most', 'over', 'such', 'take', 'than', 'them', 'well', 'were', 'here', 'life', 'call', 'came', 'each', 'even', 'find', 'give', 'hand', 'high', 'keep', 'last', 'left', 'live', 'look', 'made', 'move', 'much', 'must', 'name', 'need', 'next', 'open', 'part', 'play', 'right', 'said', 'same', 'seem', 'show', 'side', 'tell', 'turn', 'want', 'ways', 'week', 'went', 'what', 'when', 'will', 'word', 'work', 'year', 'your',
      'about', 'after', 'again', 'against', 'before', 'being', 'below', 'between', 'both', 'during', 'each', 'few', 'from', 'further', 'having', 'here', 'how', 'if', 'in', 'into', 'is', 'it', 'its', 'itself', 'more', 'most', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'she', 'should', 'so', 'some', 'such', 'than', 'that', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'these', 'they', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'we', 'were', 'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'will', 'with', 'would', 'you', 'your', 'yours', 'yourself', 'yourselves',
      'house', 'water', 'school', 'mother', 'father', 'sister', 'brother', 'friend', 'family', 'money', 'story', 'music', 'movie', 'book', 'paper', 'table', 'chair', 'window', 'door', 'floor', 'wall', 'room', 'kitchen', 'bedroom', 'bathroom', 'garden', 'street', 'city', 'country', 'world', 'earth', 'sun', 'moon', 'star', 'sky', 'cloud', 'rain', 'snow', 'wind', 'fire', 'tree', 'flower', 'grass', 'animal', 'bird', 'fish', 'horse', 'cow', 'sheep', 'chicken', 'food', 'bread', 'meat', 'fruit', 'apple', 'orange', 'banana', 'car', 'bus', 'train', 'plane', 'boat', 'computer', 'phone', 'television', 'radio', 'camera', 'watch', 'clock', 'game', 'sport', 'ball', 'team', 'player', 'winner', 'loser', 'happy', 'sad', 'angry', 'tired', 'hungry', 'thirsty', 'hot', 'cold', 'big', 'small', 'long', 'short', 'tall', 'wide', 'narrow', 'thick', 'thin', 'heavy', 'light', 'fast', 'slow', 'easy', 'hard', 'soft', 'loud', 'quiet', 'clean', 'dirty', 'new', 'old', 'young', 'beautiful', 'ugly', 'strong', 'weak', 'rich', 'poor', 'smart', 'stupid', 'funny', 'serious', 'kind', 'mean', 'brave', 'scared', 'love', 'hate', 'like', 'want', 'need', 'have', 'give', 'take', 'buy', 'sell', 'eat', 'drink', 'sleep', 'wake', 'walk', 'run', 'jump', 'sit', 'stand', 'lie', 'fall', 'fly', 'swim', 'drive', 'ride', 'write', 'read', 'speak', 'listen', 'watch', 'look', 'see', 'hear', 'feel', 'touch', 'smell', 'taste', 'think', 'know', 'learn', 'teach', 'study', 'work', 'play', 'sing', 'dance', 'laugh', 'cry', 'smile', 'help', 'hurt', 'kill', 'die', 'live', 'born', 'grow', 'change', 'move', 'stop', 'start', 'finish', 'begin', 'end', 'open', 'close', 'break', 'fix', 'build', 'destroy', 'create', 'make', 'do', 'go', 'come', 'arrive', 'leave', 'stay', 'visit', 'meet', 'find', 'lose', 'win', 'fail', 'try', 'hope', 'wish', 'dream', 'remember', 'forget', 'believe', 'doubt', 'trust', 'lie', 'truth', 'right', 'wrong', 'good', 'bad', 'best', 'worst', 'better', 'worse', 'same', 'different', 'similar', 'opposite', 'near', 'far', 'here', 'there', 'everywhere', 'nowhere', 'somewhere', 'anywhere', 'always', 'never', 'sometimes', 'often', 'rarely', 'usually', 'today', 'tomorrow', 'yesterday', 'now', 'then', 'soon', 'late', 'early', 'before', 'after', 'during', 'while', 'until', 'since', 'for', 'from', 'to', 'with', 'without', 'by', 'through', 'over', 'under', 'above', 'below', 'inside', 'outside', 'between', 'among', 'around', 'across', 'along', 'against', 'toward', 'away', 'up', 'down', 'left', 'right', 'forward', 'backward', 'north', 'south', 'east', 'west'
    ];
    
    const wordLower = word.toLowerCase();
    
    // Check if it's in our common words list
    if (commonWords.includes(wordLower)) {
      return true;
    }
    
    // Basic validation: must be at least 3 characters, only letters
    if (wordLower.length < 3 || !/^[a-z]+$/.test(wordLower)) {
      return false;
    }
    
    // For demo purposes, accept most reasonable-looking words
    return true;
  }
}

module.exports = WordValidator;