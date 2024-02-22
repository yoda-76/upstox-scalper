const axios = require('axios');

const inputValue = { email: 'test12@gmail.com', password: 'test12' };

axios.post(
  'http://localhost:4000/profile/login',
  { body:inputValue },
  {
    withCredentials: true,
    
  }
)
  .then((resp) => {
    console.log(resp);
  })
  .catch((error) => {
    console.error(error);
  });
