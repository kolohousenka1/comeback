const axios = require('axios');

class WordValidator {
  constructor() {}

  async validateWord(word) {
    try {
      // First try offline validation
      if (this.validateWordOffline(word)) {
        return true;
      }

      else return await this.validateWordOnline(word);
    } catch (error) {
      console.error('Word validation error:', error.message);
      return false;
    }
  }

  validateWordOffline(word) {
    const commonWords = [/* your current list here (same as before) */];

    const wordLower = word.toLowerCase();
    if (commonWords.includes(wordLower)) {
      return true;
    }

    if (wordLower.length < 3 || !/^[a-z]+$/.test(wordLower)) {
      return false;
    }

    return false;
  }

  async validateWordOnline(word) {
    const wordLower = word.toLowerCase();
    try {
      const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${wordLower}`);
      // If it returns definitions, it's a valid word
      return Array.isArray(response.data) && response.data.length > 0;
    } catch (error) {
      // 404 means word not found
      if (error.response && error.response.status === 404) {
        return false;
      }
      // Other errors like network issues
      console.error('Online validation failed:', error.message);
      return false;
    }
  }
}

module.exports = WordValidator;
