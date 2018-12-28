class Server
{
	constructor()
	{
    this.port = 8081;
	};

  defaultOnSuccess(data){
    console.log('Request successful. Reply ' + data.target.response);
  };

  defaultOnError(data){
    console.log('Error waiting for response');
  };

  makeRequest(requestString, onSuccess, onError) {
    let request = new XMLHttpRequest();
    let url = 'http://localhost:' + this.port + '/' + requestString;
    console.log(url);
    request.open('GET', 'http://localhost:' + this.port + '/' + requestString, true);

    request.onload = onSuccess || this.defaultOnSuccess;
    request.onerror = onError || this.defaultOnError;

    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send();
  }

};
