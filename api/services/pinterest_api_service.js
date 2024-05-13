const axios = require('axios');
const queryString = require('query-string');

class PinterestAPIService {
  constructor() {
    this.clientId = process.env.PINTEREST_CLIENT_ID;
    this.clientSecret = process.env.PINTEREST_CLIENT_SECRET;
    this.redirectUri = process.env.PINTEREST_REDIRECT_URI;
    this.baseURL = 'https://api.pinterest.com/v5/';
  }

  getClientCredentials() {
    return Buffer.from(
      `${this.clientId}:${this.clientSecret}`
    ).toString('base64');
  }

  async getAccessTokenData(code) {
    const credentials = this.getClientCredentials();
    try {
      const response = await axios.post(
        `${this.baseURL}oauth/token`,
        queryString.stringify({
          grant_type: 'authorization_code',
          client_id: this.clientId,
          code: code,
          redirect_uri: this.redirectUri
        }),
        {
          headers: {
            Authorization: `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      return response.data.access_token;
    } catch (error) {
      console.error('Error getting access token:', error);
      throw error;
    }
  }

  async refreshToken(refreshToken) {
    const credentials = this.getClientCredentials();
    try {
      const response = await axios.post(
        `${this.baseURL}oauth/token`,
        queryString.stringify({
          grant_type: 'refresh_token',
          refresh_token: refreshToken
        }),
        {
          headers: {
            Authorization: `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      return response.data.access_token;
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  }
}

module.exports = PinterestAPIService;
