import { saveItem } from '../model/ItemModel.js';
import { getAllItems } from '../model/ItemModel.js';
import { deleteItem } from '../model/ItemModel.js';
import { updateItem } from '../model/ItemModel.js';

document.querySelector('#ItemManage #ItemForm').addEventListener('submit', function(event){
    event.preventDefault();
});

$(document).ready(function(){
    refresh();
});

var itemId;
var itemName;
var itemQty;
var itemPrice;

$('#ItemManage .saveBtn').click(function(){
    itemId = $('#ItemManage .itemId').val();
    itemName = $('#ItemManage .itemName').val();
    itemQty = $('#ItemManage .itemQty').val();
    itemPrice = $('#ItemManage .itemPrice').val();

    let item = {
        itemId: itemId,
        itemName: itemName,
        itemQty: itemQty,
        itemPrice: itemPrice
    }

    if (validate(item, false)) { // False to indicate it's not an update
        saveItem(item);
        refresh();
    }
});

function validate(item, isUpdate){
    let valid = true;

    if((/^I\d{2}-\d{3}$/).test(item.itemId)){
        $('#ItemManage .invalidCode').text('');
        valid = true;
    }
    else{
        $('#ItemManage .invalidCode').text('Invalid Item Id');
        valid = false;
    }

    if((/^(?:[A-Z][a-z]*)(?: [A-Z][a-z]*)*$/).test(item.itemName)){
        $('#ItemManage .invalidName').text('');
        if(valid){
            valid = true;
        }
    }
    else{
        $('#ItemManage .invalidName').text('Invalid Item Name');
        valid = false;
    }

    if(item.itemQty != null && item.itemQty > 0){
        $('#ItemManage .invalidQty').text('');
        if(valid){
            valid = true;
        }
    }
    else{
        $('#ItemManage .invalidQty').text('Invalid Item Quantity');
        valid = false;
    }

    if(item.itemPrice != null && item.itemPrice > 0){
        $('#ItemManage .invalidPrice').text('');
        if(valid){
            valid = true;
        }
    }
    else{
        $('#ItemManage .invalidPrice').text('Invalid Item Price');
        valid = false;
    }

    if (!isUpdate) {
        let items = getAllItems();
        for(let i = 0; i < items.length; i++){
            if(items[i].itemId === item.itemId){
                $('#ItemManage .invalidCode').text('Item Id already exists');
                valid = false;
                return valid;
            }
        }
    }

    return valid;
}

function extractNumber(id){
    var match = id.match(/I(\d{2})-(\d{3})/);
    if(match && match.length > 2){
        return [parseInt(match[1]), parseInt(match[2])];
    }
    return null;
}

function generateId(){
    let items = getAllItems();

    if(!items || items.length == 0){
        return 'I00-001';
    }
    else{
        let lastItem = items[items.length - 1];
        let numbers = extractNumber(lastItem.itemId);
        if (numbers) {
            let [prefix, number] = numbers;
            number++;
            if (number > 999) {
                prefix++;
                number = 1;
            }
            return 'I' + String(prefix).padStart(2, '0') + '-' + String(number).padStart(3, '0');
        }
    }
    return 'I00-001'; // Fallback in case of any issues
}

function refresh(){
    $('#ItemManage .itemId').val(generateId());
    $('#ItemManage .itemName').val('');
    $('#ItemManage .itemQty').val('');
    $('#ItemManage .itemPrice').val('');
    $('#ItemManage .invalidCode').text('');
    $('#ItemManage .invalidName').text('');
    $('#ItemManage .invalidQty').text('');
    $('#ItemManage .invalidPrice').text('');
    loadTable();
}

function loadTable(){
    let items = getAllItems();
    $('#ItemManage .tableRow').empty();
    for(let i = 0; i < items.length; i++){
        $('#ItemManage .tableRow').append(
            '<tr> ' +
                '<td>' + items[i].itemId + '</td>' +
                '<td>' + items[i].itemName + '</td>' +
                '<td>' + items[i].itemQty + '</td>' +
                '<td>' + items[i].itemPrice + '</td>' +
            '</tr>' 
        );
    }
}

$('#ItemManage .tableRow').on('click', 'tr', function(){
    let id = $(this).children('td:eq(0)').text();
    let name = $(this).children('td:eq(1)').text();
    let qty = $(this).children('td:eq(2)').text();
    let price = $(this).children('td:eq(3)').text();

    $('#ItemManage .itemId').val(id);
    $('#ItemManage .itemName').val(name);
    $('#ItemManage .itemQty').val(qty);
    $('#ItemManage .itemPrice').val(price);
});

$('#ItemManage .deleteBtn').click(function(){
    let id = $('#ItemManage .itemId').val();
    let items = getAllItems();
    let itemIndex = items.findIndex(item => item.itemId === id);
    if(itemIndex >= 0){
        deleteItem(itemIndex);
        refresh();
    }
    else{
        $('#ItemManage .invalidCode').text('Item Id does not exist');
    }
});

$('#ItemManage .updateBtn').click(function(){
    let item = {
        itemId: $('#ItemManage .itemId').val(),
        itemName: $('#ItemManage .itemName').val(),
        itemQty: $('#ItemManage .itemQty').val(),
        itemPrice: $('#ItemManage .itemPrice').val()
    }

    let valid = validate(item, true); // True to indicate it's an update

    if(valid){
        let items = getAllItems();
        let index = items.findIndex(i => i.itemId === item.itemId);
        if(index >= 0){
            updateItem(index, item);
            refresh();
        } else {
            alert('Item Not Found');
        }
    }
});

$('#ItemManage .clearBtn').click(function(){
    refresh();
});

$('#ItemManage .searchBtn').click(function(){
    let id = $('#ItemManage .itemId').val();
    let items = getAllItems();
    let item = items.find(item => item.itemId === id);
    if(item){
        $('#ItemManage .itemName').val(item.itemName);
        $('#ItemManage .itemQty').val(item.itemQty);
        $('#ItemManage .itemPrice').val(item.itemPrice);
    }
    else{
        $('#ItemManage .invalidCode').text('Item Id does not exist');
    }
});
