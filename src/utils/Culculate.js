export const calculateOrderProductSummary = (items) => {
  // console.log(
  //   'หหหหหหหหหหหหหหหหหหหหหหหหหหหหหหหหหหหหหหหหหหหหหหหหหหหหหหหหหหcalculateOrderProductSummary items',
  //   items,
  // );
  let result = {
    totalItems: 0,
    totalQty: 0,
    totalPrice: 0,
    totalVat: 0,
    totalFree: 0,
    netPrice: 0,
    totalDiscount: 0,
    DIS_BILL_1: 0,
    DIS_BILL_2: 0,
    DIS_BILL_1_AFTER_DISCOUNT: 0,
    DIS_BILL_2_AFTER_DISCOUNT: 0,
    DIS_BILL_FINALIZE: 0,
    EXP_B4_VAT: 0,
    EXP_VAT: 0,
  };
  if (items != null && items.length > 0) {
    console.log('Bazzzz >>>> ,sitems' , items)
    items.map((item) => {
      result.totalItems = result.totalItems + 1 ;
      result.totalQty =
        Math.round(
          (parseFloat(result.totalQty) +
            parseFloat(item.VTRD_QTY ? item.VTRD_QTY : 0)) *
            100,
        ) / 100;
      result.totalPrice =
        Math.round(
          (parseFloat(result.totalPrice) +
            parseFloat(item.GOODS_TOTAL_PRC ? item.GOODS_TOTAL_PRC : 0)) *
            100,
        ) / 100;
      result.totalVat =
        Math.round(
          (parseFloat(result.totalVat) +
            parseFloat(item.GOODS_VAT_TY ? item.GOODS_VAT_TY : 0)) *
            100,
        ) / 100;
      result.totalDiscount =
        Math.round(
          (parseFloat(result.totalDiscount) +
            parseFloat(
              item.GOODS_TOTAL_DISCOUNT ? item.GOODS_TOTAL_DISCOUNT : 0,
            )) *
            100,
        ) / 100;
      result.totalFree =
        Math.round(
          (parseFloat(result.totalFree) +
            parseFloat(item.VTRD_Q_FREE ? item.VTRD_Q_FREE : 0)) *
            100,
        ) / 100;
      result.netPrice =
        Math.round(
          (parseFloat(result.netPrice) +
            parseFloat(item.GOODS_NET_PRC ? item.GOODS_NET_PRC : 0)) *
            100,
        ) / 100;
    });
  }
  // console.log(
  //   'หหหหหหหหหหหหหหหหหหหหหหหหหหหหหหหหหหหหหหหหหหหหหหหหหหหหหหหหหหcalculateOrderProductSummary result',
  //   result,
  // );

  return result;
};

export const calculateOrderProductProcessedSummary = (item, items) => {
  //console.log('calculateOrderProductProcessedSummary item', item);
  console.log('calculateOrderProductProcessedSummary items', items);
  let result = {
    totalPriceBeforeDiscount: 0,
    totalPriceAfterDiscount: 0,
    totalItems: 0,
    totalQty: 0,
    totalPrice: 0,
    totalVat: 0,
    totalFree: 0,
    netPrice: 0,
    totalDiscount: 0,
    DIS_BILL_1: 0,
    DIS_BILL_2: 0,
    DIS_BILL_1_AFTER_DISCOUNT: 0,
    DIS_BILL_2_AFTER_DISCOUNT: 0,
    DIS_BILL_FINALIZE: 0,
    EXP_B4_VAT: 0,
    EXP_VAT: 0,
    VDI_AF_ROUND: 0,
    VDI_AF_ROUND_V: 0,
  };

  if (items) {
    result.totalPriceBeforeDiscount = items.VDI_B4_BILL_DISC
      ? items.VDI_B4_BILL_DISC
      : 0;
    result.totalPriceAfterDiscount = items.VDI_AF_DISC ? items.VDI_AF_DISC : 0;
    result.totalItems = (item.VDI_ITEMS_SH_COUNT ? item.VDI_ITEMS_SH_COUNT : 0 ) ;
    // result.totalQty = item.VDI_PCS
    result.totalPrice =
      items.VDI_WL === null || items.VDI_WL === 0
        ? items.VDI_AF_DISC
        : items.VDI_AMOUNT; // VDI_B4_DISC_EX_BILL_DISC
    result.netPrice = items.VDI_AF_DISC ? items.VDI_AF_DISC : 0;
    result.DIS_BILL_1 = items.VDI_DISC_V1 ? items.VDI_DISC_V1 : 0;
    result.DIS_BILL_2 = items.VDI_DISC_2 ? items.VDI_DISC_2 : 0;
    result.DIS_BILL_1_AFTER_DISCOUNT = items.VDI_DISC_V1
      ? items.VDI_DISC_V1
      : 0;
    result.DIS_BILL_2_AFTER_DISCOUNT = items.VDI_DISC_V2
      ? items.VDI_DISC_V2
      : 0;
    result.DIS_BILL_FINALIZE = items.VDI_AF_DISC_B4_VAT
      ? items.VDI_AF_DISC_B4_VAT
      : 0;
    result.totalDiscount = items.VDI_DISC_T ? items.VDI_DISC_T : 0;
    result.EXP_B4_VAT = items.EXP_B4_VAT ? items.EXP_B4_VAT : 0;
    result.EXP_VAT = items.EXP_VAT ? items.EXP_VAT : 0;
    result.VDI_AF_ROUND = items.VDI_AF_ROUND ? items.VDI_AF_ROUND : 0;
    result.VDI_AF_ROUND_V = items.VDI_AF_ROUND_V ? items.VDI_AF_ROUND_V : 0;
    result.totalFree = items.EXP_Q_FREE ? items.EXP_Q_FREE : 0;
    result.totalVat = items.EXP_VAT ? items.EXP_VAT : 0;
    result.totalQty = items.VDI_PCS ? items.VDI_PCS : 0;
    result.VDI_DISC_CP = items.VDI_DISC_CP ? items.VDI_DISC_CP : 0;
  }
  console.log('calculateOrderProductProcessedSummary result', result);
  return result;
};

export const calculateOrderNetPriceAfterDiscount = (item) => {
  const {DIS_BILL_1, DIS_BILL_2, netPrice} = item;
  console.log("calculateOrderNetPriceAfterDiscount item", item);
  let DIS_BILL_1_AFTER_DISCOUNT = null;
  let DIS_BILL_2_AFTER_DISCOUNT = null;

  if (DIS_BILL_1 && netPrice && netPrice > 0) {
    DIS_BILL_1_AFTER_DISCOUNT = calculateDiscount(
      netPrice,
      DIS_BILL_1.split(/[,+]/),
    );
    item.DIS_BILL_1_AFTER_DISCOUNT =
      Math.round((netPrice - DIS_BILL_1_AFTER_DISCOUNT.result) * 100) / 100;
  } else {
    item.DIS_BILL_1_AFTER_DISCOUNT = 0;
  }

  if (DIS_BILL_2 && netPrice && netPrice > 0) {
    if (DIS_BILL_1_AFTER_DISCOUNT && DIS_BILL_1_AFTER_DISCOUNT.result > 0) {
      DIS_BILL_2_AFTER_DISCOUNT = calculateDiscount(
        item.DIS_BILL_1_AFTER_DISCOUNT,
        DIS_BILL_2.split(/[,+]/),
      );
      item.DIS_BILL_2_AFTER_DISCOUNT =
        Math.round(
          (item.DIS_BILL_1_AFTER_DISCOUNT - DIS_BILL_2_AFTER_DISCOUNT.result) *
            100,
        ) / 100;
    } else {
      DIS_BILL_2_AFTER_DISCOUNT = calculateDiscount(
        netPrice,
        DIS_BILL_2.split(/[,+]/),
      );
      item.DIS_BILL_2_AFTER_DISCOUNT =
        Math.round((netPrice - DIS_BILL_2_AFTER_DISCOUNT.result) * 100) / 100;
    }
  } else {
    item.DIS_BILL_2_AFTER_DISCOUNT = 0;
  }

  item.DIS_BILL_FINALIZE = DIS_BILL_2_AFTER_DISCOUNT
    ? item.DIS_BILL_2_AFTER_DISCOUNT
    : item.DIS_BILL_1_AFTER_DISCOUNT;

  return item;
};

export const calculateOrderDiscountAfterDiscount = (item) => {
  const {
    DIS_BILL_1,
    DIS_BILL_2,
    netPrice,
    totalPrice,
    DIS_COUNT_TYPE1,
    DIS_COUNT_TYPE2,
  } = item;

  let DIS_BILL_1_AFTER_DISCOUNT = null;
  let DIS_BILL_2_AFTER_DISCOUNT = null;
  console.log("calculateOrderDiscountAfterDiscount item", item);
  if (DIS_COUNT_TYPE1 && !DIS_COUNT_TYPE2) {
    if (DIS_BILL_1 && totalPrice && totalPrice > 0) {
      DIS_BILL_1_AFTER_DISCOUNT = (parseFloat(DIS_BILL_1) / 100) * totalPrice;
      item.DIS_BILL_1_AFTER_DISCOUNT = DIS_BILL_1_AFTER_DISCOUNT;
    } else {
      item.DIS_BILL_1_AFTER_DISCOUNT = 0;
    }
    if (DIS_BILL_2 && totalPrice && totalPrice > 0) {
      console.log("DIS_BILL_1_AFTER_DISCOUNT ",DIS_BILL_1_AFTER_DISCOUNT);
      if (DIS_BILL_1_AFTER_DISCOUNT && DIS_BILL_1_AFTER_DISCOUNT > 0) {
        DIS_BILL_2_AFTER_DISCOUNT =
          (parseFloat(DIS_BILL_2) / 100) *
          (totalPrice - (DIS_BILL_1 / 100) * totalPrice);
          console.log("calculateOrderDiscountAfterDiscount DIS_BILL_2_AFTER_DISCOUNT ",DIS_BILL_2_AFTER_DISCOUNT);
        item.DIS_BILL_2_AFTER_DISCOUNT = DIS_BILL_2_AFTER_DISCOUNT;
      }
    } else {
      item.DIS_BILL_2_AFTER_DISCOUNT = 0;
    }
  } else if (DIS_COUNT_TYPE2 && !DIS_COUNT_TYPE1) {
    if (DIS_BILL_1 && totalPrice && totalPrice > 0) {
      DIS_BILL_1_AFTER_DISCOUNT = totalPrice - parseFloat(DIS_BILL_1);
      item.DIS_BILL_1_AFTER_DISCOUNT = DIS_BILL_1_AFTER_DISCOUNT;
    }
  }

  item.DIS_BILL_FINALIZE = DIS_BILL_2_AFTER_DISCOUNT
    ? item.DIS_BILL_2_AFTER_DISCOUNT
    : item.DIS_BILL_1_AFTER_DISCOUNT;

  return item;
};

export const calculateDiscount = (uPrc, discountInput) => {
  let uPrcRemain = uPrc;
  let totalDiscount = 0;
  let errorMessage = null;

  for (var i = 0; i < discountInput.length; i++) {
    var discount = discountInput[i].trim();

    if (discount) {
      if (discount.slice(-1).match(/^(b|B|บ)$/)) {
        var iDiscount = discount.substring(
          0,
          discount.lastIndexOf(discount.slice(-1)),
        );

        if (!isNaN(iDiscount)) {
          totalDiscount = parseFloat(totalDiscount) + parseFloat(iDiscount);
          uPrcRemain = uPrcRemain - iDiscount;
        } else {
          errorMessage = 'รูปแบบไม่ถูกต้อง';
          break;
        }
      } else if (discount.slice(-3).match(/^(บาท)$/)) {
        var iDiscount = discount.substring(
          0,
          discount.lastIndexOf(discount.slice(-3)),
        );

        if (!isNaN(iDiscount)) {
          totalDiscount = parseFloat(totalDiscount) + parseFloat(iDiscount);
          uPrcRemain = uPrcRemain - iDiscount;
        } else {
          errorMessage = 'รูปแบบไม่ถูกต้อง';
          break;
        }
      } else if (discount.slice(-1) === '%' || !isNaN(discount)) {
        var iDiscount =
          discount.slice(-1) === '%'
            ? discount.substring(0, discount.lastIndexOf('%'))
            : discount;

        if (!isNaN(iDiscount)) {
          iDiscount = parseFloat(uPrcRemain) * (parseFloat(iDiscount) / 100);
          totalDiscount = parseFloat(totalDiscount) + parseFloat(iDiscount);
          uPrcRemain = uPrcRemain - iDiscount;
        } else {
          errorMessage = 'รูปแบบไม่ถูกต้อง';
          break;
        }
      } else {
        errorMessage = 'รูปแบบไม่ถูกต้อง';
        break;
      }
    }

    if (totalDiscount > parseFloat(uPrc)) {
      errorMessage = 'ไม่สามารถลดได้มากกว่าจำนวนราคาสินค้า';
      break;
    }
  }

  return {
    result: !errorMessage ? Math.round(totalDiscount * 100) / 100 : 0,
    errorMessage: errorMessage,
  };
};

export const calculateOrderProductTotalDiscount = (
  uPrc,
  discountInput,
  qty,
) => {
  const result = calculateDiscount(uPrc, discountInput);
  return {
    result: !result.errorMessage
      ? Math.round(qty * result.result * 100) / 100
      : 0,
    errorMessage: result.errorMessage,
  };
};

export const discountFormat = (text) => {
  let newText = '';
  // let numbers = '0123456789,+บาทbB%.'
  const numbers = '0123456789';
  const numbers2 = '0123456789.';
  const numbers3 = 'บbB';
  const numbers4 = '.';
  let hasDot = false;

  for (var i = 0; i < text.length; i++) {
    if (text.length === 1) {
      if (numbers.indexOf(text[i]) > -1) {
        newText = newText + text[i];
      }
    } else {
      if (numbers2.indexOf(text[i]) > -1) {
        if (numbers4.indexOf(text[i]) > -1) {
          if (hasDot) {
            break;
          }
        }
        newText = newText + text[i];
        if (numbers4.indexOf(text[i]) > -1) {
          hasDot = true;
        }
      } else if (numbers3.indexOf(text[i]) > -1) {
        if (numbers4.indexOf(text[i - 1]) > -1) {
          break;
        } else {
          newText = newText + text[i];
          break;
        }
      }
    }
  }

  newText = limit2Digit(newText);

  return newText;
};

export const limit2Digit = (text) => {
  let textArr = text.split('.');

  if (textArr.length === 2) {
    if (textArr[1].length > 2) {
      text = textArr[0] + '.' + textArr[1].substring(0, 2);
    }
  }

  return text;
};

export const removeLeaderZeros = (text) => {
  return text.replace(/^0+/, '');
};

export const numberOnly = (text) => {
  let newText = '';
  let numbers = '0123456789';

  for (var i = 0; i < text.length; i++) {
    if (numbers.indexOf(text[i]) > -1) {
      newText = newText + text[i];
    }
  }

  newText = removeLeaderZeros(newText);

  return newText;
};

export const numberOnlyCanZeroFirst = (text) => {
  let newText = '';
  let numbers = '0123456789';

  for (var i = 0; i < text.length; i++) {
    if (numbers.indexOf(text[i]) > -1) {
      newText = newText + text[i];
    }
  }

  return newText;
};
