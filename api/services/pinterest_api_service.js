const axios = require('axios');
const queryString = require('query-string');

class PinterestAPIService {
  constructor() {
    this.accessTokenUrl = 'https://api.pinterest.com/v5/oauth/token';
    // this.apiUrl = 'https://api.pinterest.com/v5';
    this.apiUrl = 'https://api-sandbox.pinterest.com/v5';
    this.clientId = process.env.PINTEREST_CLIENT_ID;
    this.clientSecret = process.env.PINTEREST_CLIENT_SECRET;
    this.redirectUri = process.env.PINTEREST_REDIRECT_URI;

    this.basicAuth = Buffer.from(
      `${this.clientId}:${this.clientSecret}`
    ).toString('base64');
  }

  async getAccessToken(code) {
    const data = queryString.stringify({
      grant_type: 'authorization_code',
      code,
      redirect_uri: this.redirectUri
    });

    const headers = {
      Authorization: `Basic ${this.basicAuth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    };

    try {
      const response = await axios.post(this.accessTokenUrl, data, {
        headers
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async refreshToken(refreshToken) {
    const data = queryString.stringify({
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    });

    const headers = {
      Authorization: `Basic ${this.basicAuth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    };

    try {
      const response = await axios.post(this.accessTokenUrl, data, {
        headers
      });

      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getBoards(accessToken) {
    const headers = {
      Authorization: `Bearer ${accessToken}`
    };

    try {
      const response = await axios.get(`${this.apiUrl}/boards`, {
        headers
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getBoard(accessToken, boardId) {
    const headers = {
      Authorization: `Bearer ${accessToken}`
    };

    try {
      const response = await axios.get(
        `${this.apiUrl}/boards/${boardId}`,
        { headers }
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async createBoard(accessToken, board) {
    const { name, description } = board;
    const boardData = {
      name: name,
      description: description,
      privacy: 'PUBLIC'
    };

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    };

    try {
      const response = await axios.post(
        `${this.apiUrl}/boards`,
        boardData,
        { headers }
      );

      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getPin(accessToken, pinId) {
    const headers = {
      Authorization: `Bearer ${accessToken}`
    };

    try {
      const response = await axios.get(
        `${this.apiUrl}/pins/${pinId}`,
        { headers }
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async createPin(accessToken, pin, boardId) {
    const { title, description, link, image_url } = pin;
    const pinData = {
      link: link,
      description: description,
      alt_text: title,
      media_source: {
        source_type: 'image_url',
        url: image_url
      },
      board_id: boardId
    };
    console.log('pin JSON', { pinData });
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    };

    try {
      const response = await axios.post(
        `${this.apiUrl}/pins`,
        pinData,
        { headers }
      );

      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  handleError(error) {
    console.error(`Server Error: ${error.message}`);
    if (error.response && error.response.data) {
      const errorCode = error.response.data.code || 'Unknown Code';
      const errorMessage =
        error.response.data.message || 'Unknown Message';
      const customErrorMessage = `Response from Pinterest API: Code ${errorCode}, Message: ${errorMessage}`;
      console.error(customErrorMessage);
      throw new Error(customErrorMessage);
    } else {
      console.error('An unexpected error occurred:', error);
      throw error;
    }
  }
}

module.exports = PinterestAPIService;
