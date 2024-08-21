const fopCombo = document.getElementById("fop-combo");
const storagesCombo = document.getElementById("storages-combo");
const supplier =document.getElementById("supplier");
const tableBody = document.querySelector("#product-results tbody");
const tableResults =document.getElementById('table-results');

let listStorages =[];
let listOperations =[];
let products =[];
let seekedProducts = [];
let row =null;

const operationsCombo = document.getElementById("operations-combo");


const barcodeInput = document.getElementById("bar-code");
const vendorcodeInput=document.getElementById("vendor-code");
const suppliercodeInput=document.getElementById("supplier-code");
const productnameInput=document.getElementById("product-name");
//const datefromInput=document.getElementById("date-from");
//const datetoInput=document.getElementById("date-to");
const searchParameters = document.querySelectorAll('.searchparameters'); // Get all elements with the class



const startOperationButton = document.getElementById("start-operation");
const clearSeekResultsButton = document.getElementById("clear-search");

// Call the function when the page loads
window.addEventListener('load', loadDefaults);
async function loadDefaults(){
  disablePage();

  await fetchData();
  await fetchLists();
  populateLists();
  setFopValue();
  
  enablePage();
 
  barcodeInput.focus();
  const bodyElement = document.body;
  // Set the background color
  bodyElement.style.backgroundColor = "lightblue"; // 

}
// Load previous operation on page load
const savedOperation = localStorage.getItem("selectedOperation");
    if (savedOperation) {
        operationsCombo.value = savedOperation;
    }

operationsCombo.addEventListener("focus", function() {
    var prevValue =this.value;
    this.value = ""
this.placeholder=prevValue;

});

storagesCombo.addEventListener("change", setFopValue );


operationsCombo.addEventListener("change", function() {
    barcodeInput.focus();
    
  });
  

startOperationButton.addEventListener("click", startOperation);

clearSeekResultsButton.addEventListener("click", clearSeekResults);

searchParameters.forEach(input => {
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent default form submission
      startOperation();
    }
  });
});

function clearSeekParameters() {
  
    searchParameters.forEach(input => {
      input.value = ""; // Clear each input field
    });
    //tableResults.style.display='none'
    barcodeInput.focus(); // Set focus back to the barcode input
  }

  function clearSeekResults() {
    clearSeekParameters();
    tableBody.innerHTML = ''; // Clear the table body

    tableResults.style.display='none'
   
  }


//******************* START ****///////
  async function startOperation() {
    const selectedOperation = operationsCombo.value;
    localStorage.setItem("selectedOperation", selectedOperation);
    
    const inputValue ={
      "barcode": document.getElementById("bar-code").value.trim(),
      "vendorCode" : document.getElementById("vendor-code").value.trim(),
      "supplierCode" : document.getElementById("supplier-code").value.trim(),
      "productName" : document.getElementById("product-name").value.trim(),
     // "dateFrom" : document.getElementById("date-from").value.trim(),
     // "dateTo" : document.getElementById("date-to").value.trim()
};

 //Validation Input Values:
    // check operation
    if (selectedOperation ===""){
      alert ("Виберіть операцію перед початком пошуку!");
      return
    };
    //check barcode is EAN-13


    seekedProducts= await seekProduct(inputValue);

    clearSeekParameters();

    if (!seekedProducts) {
      return
    } 
      // 4. Display Results or Message: 
      if  (seekedProducts.length === 1) {
        supplier.value =seekedProducts[0].primarySupplier;
      
        //alert("Operation starts! with: \n" + seekedProducts[0].nameFull +'-> ' + seekedProducts[0].salePriceCurrent+' грн'); // Display names of filtered products
        displayResult(seekedProducts);
        return seekedProducts;
      } else {
        
          alert(
            `Увага!!! Знайдено більше одного товару, всього: ${seekedProducts.length}  \n` +
              seekedProducts.map(p => `${p.nameFull} -> ${parseFloat(p.salePriceCurrent).toFixed(2)} грн`).join('\n')
          );
          
        
      }
     
     
  }

  function displayResult(filteredProducts) {
    tableResults.style.display = "block"; // Show the table 

    if (filteredProducts.length === 0) {
        // Handle case where no products match the search criteria
        tableBody.innerHTML = ''; // Clear the table body
        const row = tableBody.insertRow();
        

        const cell = row.insertCell();
        cell.textContent = "Не знайдено товарів, що відповідають критеріям пошуку.";
        cell.colSpan = 6; // Make this cell span all columns
        return; 
    }

    filteredProducts.forEach(product => {
        tableBody.innerHTML += `
            <tr>
                <td>| ${product.vendorBarcode}</td>
                <td>| ${product.vendorCode || ''}</td>
                <td>| ${product.primarySupplier || ''}</td>
                <td>| ${product.primarySupplierCodeLastStockIn || ''}</td>
                
                <td>| ${product.nameFull}</td>
                <td>| ${(parseFloat(product.salePriceCurrent) || 0).toFixed(2)} грн</td>

                

                <td>| ${product.storagesStock} ${product.stockInUnit}</td> 
            </tr>
        `;
      let emptyRow = tableBody.insertRow(); // Insert an empty row after each product row         
      emptyRow =tableBody.insertRow();
    });
}

  
  
async function seekProduct(inputValue){
   // 1. Get Input Values:
   disablePage();
    
    try {
  
      enablePage();
      // 2. Filter Products:
        const filteredProducts = products.filter(product => {
        const matchesBarcode = !inputValue.barcode || product.vendorBarcode.includes(inputValue.barcode); // not Exact match
        
        const matchesVendorCode = !inputValue.vendorCode || product.vendorCode.toString() === inputValue.vendorCode; // Exact match
        const matchesSupplierCode = !inputValue.supplierCode || product.primarySupplierCodeLastStockIn === inputValue.supplierCode; // Exact match

        const matchesProductName = !inputValue.productName || product.nameFull.toLowerCase().includes(inputValue.productName.toLowerCase());//  not Exact match
  
        return matchesBarcode && matchesVendorCode && matchesSupplierCode && matchesProductName;
      });

      if (filteredProducts.length > 0) {
        return filteredProducts
        //alert("Operation starts! with: \n" + filteredProducts.map(p => p.name).join('\n')); // Display names of filtered products
      } else {
        alert("Товар не знайдено! Змініть критерії пошуку або, можливо, це НОВИЙ ТОВАР.");
        return null
      }
    } catch (error) {
      console.error('Error fetching or filtering products:', error);
      alert("Виникла системна помилка підчас пошуку Товару в базі даних. Зверіться до адміністратора.");
      return null
    }
}

function disablePage() {
  const interactiveElements = document.querySelectorAll('button, input, textarea, select, a');
  const bodyElement = document.body;
// Set the background color
  bodyElement.style.backgroundColor = "lightgrey"; //
  
  interactiveElements.forEach(element => {
    element.disabled = true;
  });
}

function enablePage() {
  const interactiveElements = document.querySelectorAll('button, input, textarea, select, a');
  const bodyElement = document.body;
  // Set the background color
  bodyElement.style.backgroundColor = "lightblue"; // 

  interactiveElements.forEach(element => {
    element.disabled = false;
  });
  fopCombo.disabled =true;
  supplier.disabled=true;
}


async function fetchData() {
  try {
    let response = await fetch('http://localhost:3000/api/products');
    products = await response.json();
  
  } catch (error) {
    console.error('Error fetching Data:', error);
  }
  
}

async function fetchLists() {
  try {
    let response = await fetch('http://localhost:3000/api/listOperations'); //
    listOperations = await response.json();
    

    response = await fetch('http://localhost:3000/api/listStorages') // Fetch from your API
    listStorages = await response.json();
  
  } catch (error) {
    console.error('Error fetching Lists:', error);
  }
  
}


function populateLists() {
  try {
    
    let datalist = document.getElementById('operations-list');
    datalist.innerHTML = ''; // Clear existing options
    listOperations.forEach(operation => {
      const option = document.createElement('option');
      option.value = operation.name;
      datalist.appendChild(option);
    });

    datalist = document.getElementById('storages-list');
    datalist.innerHTML = ''; // Clear existing options
    listStorages.forEach(storage => {
      const option = document.createElement('option');
      option.value = storage.name;
      datalist.appendChild(option);
    });

  } catch (error) {
    console.error('Error Populating lists:', error);
  }
  
}

function setFopValue() {
  const selectedStorage = storagesCombo.value;

  // Find the storage object that matches the selected name
  const selectedStorageObj = listStorages.find(storage => storage.name === selectedStorage);

  if (selectedStorageObj) {
    fopCombo.value = selectedStorageObj.fop || ''; // Set the fop value or an empty string if not found
  } else {
    fopCombo.value = ''; // Clear the fop input if the storage isn't found
  }
}
 

  
