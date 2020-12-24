fetch('/weather?address=Hamburg+Grandweg+154').then(response => {
  response.json().then(data => {
    if (data.error) {
      console.log(data.error);
    } else {
      console.log('weather Hamburg... ', data.location);
    }
  });
});