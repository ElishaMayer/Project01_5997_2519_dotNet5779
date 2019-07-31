/* eslint-disable no-console */
/* eslint-disable no-undef */
var TesterClient = (function () {
  function getTesters(success) {
    return fetch('/api/Tester', {
      headers: {
        Accept: 'application/json',
      },
    }).then(checkStatus)
      .then(parseJSON)
      .then(success);
  }

  function createTester(data,success) {
      return fetch('/api/Tester', {
          method: 'post',
          body: JSON.stringify(data),
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
          },
      }).then(checkStatus)
          .then(parseJSON)
          .then(success);

  }

  function updateTester(data,success) {
    return fetch('/api/Tester', {
      method: 'put',
      body: JSON.stringify(data),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(checkStatus)
        .then(parseJSON)
        .then(success);
  }

    function deleteTester(id, success) {
    return fetch('/api/Tester/'+id, {
      method: 'delete',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(checkStatus)
        .then(parseJSON)
        .then(success);
  }

  function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      const error = new Error(`HTTP Error ${response.statusText}`);
      error.status = response.statusText;
      error.response = response;
      console.log(error);
      throw error;
    }
  }

  function parseJSON(response) {
    return response.json();
  }

  return {
    getTesters,
    createTester,
    updateTester,
    deleteTester
  };
}());

export { TesterClient };
