const baseUrl = 'http://localhost:6001/'; // TODO: This needs to be replaced
const form = document.getElementsByClassName('form-signin')[0];

const showAlert = (cssClass, message) => {
  const html = `
    <div class="alert alert-${cssClass} alert-dismissible" role="alert">
        <strong>${message}</strong>
        <button class="close" type="button" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">×</span>
        </button>
    </div>`;

  document.querySelector('#alert').innerHTML += html;
};

const formToJSON = (elements) => [].reduce.call(elements, (data, element) => {
  data[element.name] = element.value;
  return data;
}, {});

const getUrlParameter = (name) => {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  const regex = new RegExp(`[\\?&]${name}=([^&#]*)`);
  const results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

const handleFormSubmit = (event) => {
  event.preventDefault();

  const postUrl = `${baseUrl}store-token`;
  const token = getUrlParameter('x-amzn-marketplace-token');
  const form = document.querySelector('.form-signin');
  const registerButton = form.querySelector('button[type="submit"]');

  if (!token) {
    showAlert('danger',
      'Registration Token Missing. Please go to AWS Marketplace and follow the instructions to set up your account!');
  } else {
    const data = formToJSON(form.elements);
    data.token = token;


    const xhr = new XMLHttpRequest();

    registerButton.disabled = true; 

    xhr.open('POST', postUrl, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));

    xhr.onreadystatechange = () => {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        showAlert('primary', response.data);
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          console.log(JSON.stringify(response.data));
          window.location.href = response.data;
        } else {
          console.log(JSON.stringify(xhr.responseText));
        }
        registerButton.disabled = false;
      }
    };

    xhr.onerror = () => {
      showAlert('danger', 'Error: Failed to send the request.');
      registerButton.disabled = false;
    }
  }
};


form.addEventListener('submit', handleFormSubmit);

const token = getUrlParameter('x-amzn-marketplace-token');
if (!token) {
  showAlert('danger', 'Registration Token Missing. Please go to AWS Marketplace and follow the instructions to set up your account!');
}

if (!baseUrl) {
  showAlert('danger', 'Please update the baseUrl');
}
