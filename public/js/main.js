// Custom Flash message using Materialize CSS Toast
let promise = setInterval(function() {
  // getting element with class name as alertItem
  let x = document.querySelectorAll(".alertItem");
  // if any alert found then
  if(x.length !== 0){
    // Each alert
    x.forEach(element => {
      // Adding Materialize CSS hide class to hide the element
      element.classList.add('hide');
      // Error or success type of message using alert-type attribute
      let alertType = (element.getAttribute('alert-type') === 'error') ? 'red' : 'green'; 
      // alert or toast trigger       
      M.toast({html: `<span class="card-title white-text">${element.innerText}</span>`, classes: alertType});
    });
    // stopping the loop
    clearInterval(promise);
  }
}, 1000);