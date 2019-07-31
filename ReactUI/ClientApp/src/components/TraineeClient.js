/* eslint-disable no-console */
/* eslint-disable no-undef */
var TraineeClient = (function () {
  function getTrainee(success) {
      return fetch('/api/Trainee', {
      headers: {
        Accept: 'application/json',
      },
    }).then(checkStatus)
      .then(parseJSON)
      .then(success);
  }

    function createTrainee(data,success) {
        return fetch('/api/Trainee', {
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

    function updateTrainee(data,success) {
        return fetch('/api/Trainee', {
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

    function deleteTrainee(id, success) {
        return fetch('/api/Trainee/'+id, {
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

export { Client };
