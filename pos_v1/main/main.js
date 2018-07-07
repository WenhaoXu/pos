'use strict';

const {loadAllItems,loadPromotions}=require('../spec/fixtures');
'use strict';

function printReceipt(tags) {
  //计算数量
  let typeAndNumberOfItems = calculatingTypeAndNumber(tags.map(tag=>splitItem(tag)));
  let itemsDetails = getItemsDetails(typeAndNumberOfItems, loadAllItems());
  itemsDetails = addPromotionStatus(itemsDetails, loadPromotions());
  itemsDetails = countItem(itemsDetails);
  itemsDetails = countAllItems(itemsDetails);
   print(itemsDetails);

}
//计算数量
function calculatingTypeAndNumber(items) {
  let typeAndNumberOfItems = [];
  items.map(barcode=>{ 
    if (!containId(barcode, typeAndNumberOfItems)) {
      typeAndNumberOfItems.push({
        code: barcode.code,
        number: barcode.number
      });
    }})
  return typeAndNumberOfItems;
}

function getItemsDetails(typeAndNumberOfItems, allItems) {
  typeAndNumberOfItems.map(typeAndNumberOfItem=>{
    allItems.map(item=>{ 
      if (typeAndNumberOfItem.code === item.barcode) {
        typeAndNumberOfItem.name = item.name;
        typeAndNumberOfItem.unit = item.unit;
        typeAndNumberOfItem.price = item.price;
      }})
  })
 return typeAndNumberOfItems;
}

function addPromotionStatus(itemsDetails, Promotions) {
  let barcode = Promotions[0].barcodes;
  itemsDetails.map(tempitem=> {
    if(barcode.includes(tempitem.code)){
      tempitem.status = 'Promotion';
    }
  })
  return itemsDetails;
}

function countItem(itemsDetails) {
  itemsDetails.map(it=>{
    let mycount;
    if (it.hasOwnProperty('status')) {
      mycount = (parseInt(it.number / 3) * 2 + it.number % 3) * it.price;
      it.count = mycount;
    }
    else {
      mycount = it.number * it.price;
      it.count = mycount;
    }
  })
  return itemsDetails;
}

function countAllItems(itemsDetails) {
  let count = 0;
  let countWithoutPromotion = 0;
  itemsDetails.map(it=> {
    count = count + it.count;
    countWithoutPromotion = it.number * it.price + countWithoutPromotion;
  })
  itemsDetails.push({
    finalcount: count,
    saved: countWithoutPromotion - count
  })
  return itemsDetails;
}
function print(item) {
  let final = '***<没钱赚商店>收据***\n';
  for (let i = 0; i < item.length - 1; i++) {
    final = final + '名称：' + item[i].name + '，数量：' + item[i].number + '' + item[i].unit + '，单价：' + parseFloat(item[i].price).toFixed(2) + '(元)，小计：' + parseFloat(item[i].count).toFixed(2) + '(元)' + '\n';
  }
  final = final + '----------------------\n';
  final = final + '总计：' + parseFloat(item[item.length - 1].finalcount).toFixed(2) + '(元)' + '\n';
  final = final + '节省：' + item[item.length - 1].saved.toFixed(2) + '(元)' + '\n';
  final = final + '**********************';

  final = `${final}`;
  console.log(final);
}


function splitItem(barcode) {
  let tempId = {};
  if (barcode.indexOf('-') >= 0) {
    tempId = {
      code: barcode.split('-')[0],
      number: parseFloat(barcode.split('-')[1])
    }
  }
  else {
    tempId = {
      code: barcode,
      number: 1
    }
  }
  return tempId;
}

function containId(tempId, typeAndNumberOfItems) {
  let isContain=false;
  if (typeAndNumberOfItems.length !== 0) {
    for (let temp of typeAndNumberOfItems) {
      if (temp.code == tempId.code) {
        temp.number = temp.number + tempId.number;
        isContain=true;
      }
  }
  }
  return isContain;
}

module.exports = {
  printReceipt,
    calculatingTypeAndNumber,
    getItemsDetails,
    addPromotionStatus,
    countItem,
    countAllItems,
    print
}