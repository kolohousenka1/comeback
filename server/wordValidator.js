const axios = require('axios');

class WordValidator {
  constructor() {
    this.apiKey = 'xpvkgwz51v5m3bfx5zdja60u1i6xoavntb19ev5p3n59knpxp';
    this.baseUrl = 'https://api.wordnik.com/v4';
  }

  async validateWord(word) {
    try {
      // First check basic validation rules
      // if (!this.basicValidation(word)) {
      //   return false;
      // }
      
      // Then check with Wordnik API
      return await this.validateWordWithAPI(word);
    } catch (error) {
      console.error('Word validation error:', error.message);
      // // Fall back to offline validation if API fails
      // return this.validateWordOffline(word);
    }
  }

  // basicValidation(word) {
  //   const wordLower = word.toLowerCase();
    
  //   // Basic validation: must be at least 3 characters, only letters
  //   if (wordLower.length < 3 || !/^[a-z]+$/.test(wordLower)) {
  //     return false;
  //   }
    
  //   return true;
  // }
  
  async validateWordWithAPI(word) {
    const wordLower = word.toLowerCase();
    try {
      // Use Wordnik API to check if the word exists
      const url = `${this.baseUrl}/word.json/${wordLower}/definitions?limit=1&includeRelated=false&useCanonical=true&includeTags=false&api_key=${this.apiKey}`;
      const response = await axios.get(url);
      
      // If we get a successful response with definitions, the word exists
      return response.status === 200 && response.data && response.data.length > 0;
    } catch (error) {
      // If we get a 404, the word doesn't exist
      if (error.response && error.response.status === 404) {
        return false;
      }
      // For other errors, throw to fall back to offline validation
      throw error;
    }
  }
  
  // validateWordOffline(word) {
  //   // Simple offline validation with a smaller list of common words as fallback
  //   const commonWords = [
  //     'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'man', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use',
  //     'cat', 'dog', 'run', 'jump', 'play', 'work', 'home', 'time', 'year', 'back', 'good', 'make', 'most', 'over', 'such', 'take', 'than', 'them', 'well', 'were', 'here', 'life', 'call', 'came', 'each', 'even', 'find', 'give', 'hand', 'high', 'keep', 'last', 'left', 'live', 'look', 'made', 'move', 'much', 'must', 'name', 'need', 'next', 'open', 'part', 'play', 'right', 'said', 'same', 'seem', 'show', 'side', 'tell', 'turn', 'want', 'ways', 'week', 'went', 'what', 'when', 'will', 'word', 'work', 'year', 'your'
  //   ];
    
  //   const wordLower = word.toLowerCase();
    
  //   // Check if it's in our common words list
  //   return commonWords.includes(wordLower);
  // }
}

module.exports = WordValidator;