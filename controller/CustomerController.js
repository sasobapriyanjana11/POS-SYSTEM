import { saveCustomer } from '../model/CustomerModel.js';
import { getAllCustomers } from '../model/CustomerModel.js';
import { updateCustomer } from '../model/CustomerModel.js';
import { deleteCustomer } from '../model/CustomerModel.js';

$(document).ready(function(){
    refresh();
});

document.querySelector('#CustomerManage #customerForm').addEventListener('submit', function(event){
    event.preventDefault();
});

var custId;
var custName;
var custAddress;
var custSalary;

$('#CustomerManage .saveBtn').click(function(){
    custId = $('#CustomerManage .custId').val();
    custName = $('#CustomerManage .custName').val();
    custAddress = $('#CustomerManage .custAddress').val();
    custSalary = $('#CustomerManage .custSalary').val();

    let customer = {
        custId: custId,
        custName: custName,
        custAddress: custAddress,
        custSalary: custSalary
    };

    let validResult = validate(customer, false); // False to indicate it's not an update

    if(validResult){
        saveCustomer(customer);
        refresh();
    }
});

// validate customer
function validate(customer, isUpdate){
    let valid = true;

    // Update the regex to match "C00-001" format
    if((/^C\d{2}-\d{3}$/).test(customer.custId)){
        $('#CustomerManage .invalidCustId').text('');
        valid = true;
    }
    else{
        $('#CustomerManage .invalidCustId').text('Invalid Customer Id');
        valid = false;
    }

    if((/^(?:[A-Z][a-z]*)(?: [A-Z][a-z]*)*$/).test(customer.custName)){
        $('#CustomerManage .invalidCustName').text('');
        if(valid){
            valid = true;
        }
    }
    else{
        $('#CustomerManage .invalidCustName').text('Invalid Customer Name');
        valid = false;
    }

    if((/^[A-Z][a-z, ]+$/).test(customer.custAddress)){
        $('#CustomerManage .invalidCustAddress').text('');
        if(valid){
            valid = true;
        }
    }
    else{
        $('#CustomerManage .invalidCustAddress').text('Invalid Customer Address');
        valid = false;
    }

    if(customer.custSalary != null && customer.custSalary > 0){
        $('#CustomerManage .invalidCustSalary').text('');
        if(valid){
            valid = true;
        }
    }
    else{
        $('#CustomerManage .invalidCustSalary').text('Invalid Customer Salary');
        valid = false;
    }

    if (!isUpdate) {
        let customers = getAllCustomers();
        for(let i = 0; i < customers.length; i++){
            if(customers[i].custId === customer.custId){
                $('#CustomerManage .invalidCustId').text('Customer Id Already Exists');
                valid = false;
            }
        }
    }

    return valid;
}

function loadTable(customer){
    $('#CustomerManage .tableRow').append(
        '<tr> ' +
            '<td>' + customer.custId + '</td>' +
            '<td>' + customer.custName + '</td>' +
            '<td>' + customer.custAddress + '</td>' +
            '<td>' + customer.custSalary + '</td>' +
        '</tr>' 
    );
}

function extractNumber(id) {
    var match = id.match(/C(\d{2})-(\d{3})/);
    if (match && match.length > 2) {
        return { prefix: parseInt(match[1]), suffix: parseInt(match[2]) };
    }
    return { prefix: 0, suffix: 0 };
}

function createCustomerId() {
    let customers = getAllCustomers();
    
    if (!customers || customers.length === 0) {
        return 'C00-001';
    } else {
        let lastCustomer = customers[customers.length - 1];
        let id = lastCustomer && lastCustomer.custId ? lastCustomer.custId : 'C00-000';
        
        let numbers = extractNumber(id);
        numbers.suffix++;
        if (numbers.suffix > 999) {
            numbers.prefix++;
            numbers.suffix = 1;
        }
        return 'C' + numbers.prefix.toString().padStart(2, '0') + '-' + numbers.suffix.toString().padStart(3, '0');
    }
}

function refresh(){
    $('#CustomerManage .custId').val(createCustomerId());
    $('#CustomerManage .custName').val('');
    $('#CustomerManage .custAddress').val('');
    $('#CustomerManage .custSalary').val('');
    $('#CustomerManage .invalidCustId').text('');
    $('#CustomerManage .invalidCustName').text('');
    $('#CustomerManage .invalidCustAddress').text('');

    reloadTable();
}

$('#CustomerManage .cleatBtn').click(function(){
    refresh();
});

$('#CustomerManage .searchBtn').click(function(){
    let customer = searchCustomer($('#CustomerManage .custId').val());
    if(customer){
        $('#CustomerManage .custName').val(customer.custName);
        $('#CustomerManage .custAddress').val(customer.custAddress);
        $('#CustomerManage .custSalary').val(customer.custSalary);
    }
    else{
        alert('Customer Not Found');
    }
});

function searchCustomer(id){
    let customers = getAllCustomers();
    let customer = customers.find(c => c.custId === id);
    return customer;
}

$('#CustomerManage .updateBtn').click(function(){
    let UpdateCustomer = {
        custId: $('#CustomerManage .custId').val(),
        custName: $('#CustomerManage .custName').val(),
        custAddress: $('#CustomerManage .custAddress').val(),
        custSalary: $('#CustomerManage .custSalary').val()
    };

    let validResult = validate(UpdateCustomer, true); // True to indicate it's an update
    
    if(validResult){
        let customers = getAllCustomers();
        let index = customers.findIndex(c => c.custId === UpdateCustomer.custId);
        if(index >= 0){
            updateCustomer(index, UpdateCustomer);
            refresh();
        } else {
            alert('Customer Not Found');
        }
    }
});

function reloadTable(){
    let customers = getAllCustomers();
    $('#CustomerManage .tableRow').empty();
    customers.forEach(c => {
        loadTable(c);
    });
}

$('#CustomerManage .removeBtn').click(function(){
    let customers = getAllCustomers();
    let id = $('#CustomerManage .custId').val();

    let index = customers.findIndex(c => c.custId === id);
    if(index >= 0){
        deleteCustomer(index);
        refresh();
    }
    else{
        alert('Customer Not Found');
    }
});

$('#CustomerManage .tableRow').on('click', 'tr', function(){
    let id = $(this).children('td:eq(0)').text();
    let name = $(this).children('td:eq(1)').text();
    let address = $(this).children('td:eq(2)').text();
    let salary = $(this).children('td:eq(3)').text();

    $('#CustomerManage .custId').val(id);
    $('#CustomerManage .custName').val(name);
    $('#CustomerManage .custAddress').val(address);
    $('#CustomerManage .custSalary').val(salary);
});
