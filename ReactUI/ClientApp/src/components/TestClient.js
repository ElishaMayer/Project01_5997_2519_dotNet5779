/* eslint-disable no-console */
/* eslint-disable no-undef */
var TestClient = (function () {
  function getTests(success) {
    return fetch('/api/Test', {
      headers: {
        Accept: 'application/json',
      },
    }).then(checkStatus)
      .then(parseJSON)
      .then(success);
  }

  function createTests(data,success) {
      return fetch('/api/Test', {
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

  function updateTests(data,success) {
    return fetch('/api/Test', {
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

    function deleteTests(id, success) {
    return fetch('/api/Test/'+id, {
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
    getTests,
    createTests,
    updateTests,
    deleteTests
  };
}());

export { TestClient };
