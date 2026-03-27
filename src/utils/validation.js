export const validateOutstandingBalancePayment = (obj, key, errorTitle) => {
    let pay = 0

    if (obj[key].checked) {
        if (key === 'transfer' && obj[key].bankAccountItem === null) {
            return createValidateObjectResult({ errorMessage: `กรุณาเลือกบัญชีธนาคาร ${errorTitle}` })
        } else if (obj[key].pay === null || obj[key].pay === '') {
            return createValidateObjectResult({ errorMessage: `กรุณากรอกยอดชำระด้วย ${errorTitle}` })
        } else if (parseFloat(obj[key].pay) <= 0) {
            return createValidateObjectResult({ errorMessage: `ยอด ${errorTitle} ต้องมากกว่า 0` })
        } else if (parseFloat(obj[key].pay) > 0) {
            pay = parseFloat(obj[key].pay)
        }
    }

    return createValidateObjectResult({ successResult: pay })
}

export const validateOutstandingBalancePaymentCheque = (listObj) => {
    let totalPay = 0
    for (var i = 0; i < listObj.length; i++) {
        if (listObj[i].checked) {
            let validate = validateOutstandingBalancePaymentChequeItems(listObj[i], i + 1)
            if (typeof validate.errorMessage !== 'undefined') return createValidateObjectResult({ errorMessage: validate.errorMessage })
            totalPay = totalPay + validate.successResult
        }
    }

    return createValidateObjectResult({ successResult: totalPay })
}

export const validateOutstandingBalancePaymentChequeItems = (obj, index) => {
    if (obj.bankFileItem === null) {
        return createValidateObjectResult({ errorMessage: `กรุณาเลือกธนาคาร เช็ค${index}` })
    }

    if (obj.chequeNo === null || obj.chequeNo === '' || obj.chequeNo.length !== 8) {
        return createValidateObjectResult({ errorMessage: `กรุณากรอกหมายเลขเช็ค${index} ให้ครบ 8 หลัก` })
    }

    if (obj.pay === null || obj.pay === '') {
        return createValidateObjectResult({ errorMessage: `กรุณากรอกยอดชำระด้วยเช็ค${index}` })
    }

    if (parseFloat(obj.pay) <= 0) {
        return createValidateObjectResult({ errorMessage: `ยอดเช็ค${index}ต้องมากกว่า 0` })
    }

    return createValidateObjectResult({ successResult: parseFloat(obj.pay) })
}

export const createValidateObjectResult = (obj) => {
    let res = {}

    Object.keys(obj).forEach(function(key) {
        Object.assign(res, {[key]: obj[key]})
    })

    return res
}