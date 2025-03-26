import axios from 'axios';

// Simple test to check if the proxy server is running
async function testServer() {
  try {
    console.log('Testing connection to proxy server...');
    const response = await axios.get('http://localhost:3333/');
    console.log('Response:', response.data);
    console.log('Connection successful!');
  } catch (error) {
    console.error('Connection failed:');
    console.error(error.message);
  }
}

testServer();