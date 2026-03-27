export const phoneNumberFormat = (text) => {
    let newText = ''
    let numbers = '0123456789-,'

    for (var i = 0; i < text.length; i++) {
        if ( numbers.indexOf(text[i]) > -1 ) {
            newText = newText + text[i]
        }
    }   

    return newText
}

export const numberOnlyCanZeroFirst = (text) => {
    let newText = ''
    let numbers = '0123456789'

    for (var i = 0; i < text.length; i++) {
        if ( numbers.indexOf(text[i]) > -1 ) {
            newText = newText + text[i]
        }
    }   

    return newText
}

export const customCheckChar = (accept, text) => {
    let newText = ''

    for (var i = 0; i < text.length; i++) {
        if ( accept.indexOf(text[i]) > -1 ) {
            newText = newText + text[i]
        }
    }   

    return newText
}

export const decimal2digitWithCommas = (req) => {
    let res = ''
    if (typeof req !== 'undefined' && req !== undefined && req !== null && !isNaN(req)) {
        res = parseFloat(req).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }
    return res
}