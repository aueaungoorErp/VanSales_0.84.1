import moment from 'moment';
import {
  toBuddhistYear
} from '../utils/Date';
import {
  decimal2digitWithCommas
} from '../utils/FormatUtil.js';

// export const printReceipt = (
//   header,
//   items,
//   summary,
//   vanConfig,
//   companyInfo,
//   customer,
//   printTime,
//   paymentType,
//   printTimes,
//   isDiscountBath,
// ) => {
//   let html =
//     '<div style="width: 100%;"><div style="width: 180px;margin: auto;">';
//   let headerPayment = '';
//   let printRepeat = '';

//   let vanConfigShowVatINV = vanConfig.VANCNF_INV_SHOWVAT;
//   let vanConfigShowVatCS = vanConfig.VANCNF_CASHSALES_SHOWVAT;
//   let vanConfigRound = vanConfig.VANCNF_ROUND;
//   let round = 1;
//   console.log('printReceipt header ', header);
//   console.log('printReceipt items ', items);
//   console.log('printReceipt vanConfig ', vanConfig);
//   console.log('printReceipt summary ', summary);
//   console.log('printReceipt companyInfo ', companyInfo);
//   console.log('printReceipt customer ', customer);
//   if (paymentType == 'credit') {
//     headerPayment = vanConfig.VANCNF_INV_HEAD;

//     if (printTimes == 1) printRepeat = vanConfig.VANCNF_REPRT_INV_MSG;

//     if (vanConfig.VANCNF_INV_COPY == 2) round = 2;
//   } else if (paymentType == 'cash') {
//     headerPayment = vanConfig.VANCNF_CASHSALES_HEAD;

//     if (printTimes == 1) printRepeat = vanConfig.VANCNF_REPRT_CASHSALES_MSG;
//   } else if (paymentType == 'reserv') {
//     headerPayment = vanConfig.VANCNF_BOOK_HEAD;
//   } else if (paymentType == 'return') {
//     headerPayment = vanConfig.VANCNF_RTN_HEAD;
//   } else if (paymentType == 'returnCash') {
//     headerPayment = vanConfig.VANCNF_CASHRTN_HEAD;
//   } else if (paymentType == 'transfer') {
//     headerPayment = vanConfig.VANCNF_TRANSFER_HEAD;
//   } else if (paymentType == 'quotation') {
//     headerPayment = vanConfig.VANCNF_QUOTE_HEAD;
//   }

//   for (var r = 1; r <= round; r++) {
//     let brachPrefix = 'สาขา ';
//     let companyNameArr = companyInfo.CMPNY_TCOMPANYNAME.split('สาขา', 2);
//     console.log('companyNameArr ', companyNameArr);
//     // if (companyNameArr.length <= 1) {
//     //   companyNameArr = companyInfo.CMPNY_TCOMPANYNAME.split('สำนักงานใหญ่', 2);

//     //   if (companyNameArr.length == 2) {
//     //     companyNameArr[1] = 'สำนักงานใหญ่';
//     //   }

//     //   brachPrefix = '';
//     // }
//     // let companyName = null;
//     // for (var k = 0; k < companyNameArr.length; k++) {
//     //   companyName = brachPrefix + companyName;
//     // }
//     // console.log('companyName ', companyName);
//     html += `<div style="font-size: 7px;text-align: center;" >${companyInfo.CMPNY_TCOMPANYNAME}</div>`;
//   }

//   if (paymentType != 'transfer') {
//     if (vanConfigShowVatCS == 1) {
//       if (
//         companyInfo.CMPNY_TADDRESS_1 != null &&
//         companyInfo.CMPNY_TADDRESS_1 != ''
//       ) {
//         html += `<div style="font-size: 7px;text-align: center;" >${companyInfo.CMPNY_TADDRESS_1}</div>`;
//       }

//       if (
//         companyInfo.CMPNY_TADDRESS_2 != null &&
//         companyInfo.CMPNY_TADDRESS_2 != ''
//       ) {
//         html += `<div style="font-size: 7px;text-align: center;" >${companyInfo.CMPNY_TADDRESS_2}</div>`;
//       }

//       if (
//         companyInfo.CMPNY_TADDRESS_3 != null &&
//         companyInfo.CMPNY_TADDRESS_3 != '' &&
//         companyInfo.CMPNY_POST != null &&
//         companyInfo.CMPNY_POST != ''
//       ) {
//         html += `<div style="font-size: 7px;text-align: center;" >${companyInfo.CMPNY_TADDRESS_3}</div>`;
//       }

//       if (
//         companyInfo.CMPNY_REG_NO != null &&
//         companyInfo.CMPNY_REG_NO.trim() != ''
//       ) {
//         html += `<div style="font-size: 7px;text-align: center;" >เลขผู้เสียภาษี: ${companyInfo.CMPNY_REG_NO}</div>`;
//       }
//     }
//   }

//   // if (r == 1) {
//   let text = '';

//   if (printRepeat != '') {
//     text = printRepeat;
//   } else {
//     text = headerPayment;
//   }

//   if (text != null)
//     html += `<div style="font-size: 7px;text-align: center;" >${text}</div>`;
//   //} else if (r == 2) {
//   // if (paymentType == 'credit') {
//   //   let text = '';

//   //   if (printRepeat != '') {
//   //     text = vanConfig.VANCNF_REPRT_PREPRCPT_MSG;
//   //   } else {
//   //     text = vanConfig.VANCNF_ATTACH_HEAD;
//   //   }

//   //   html += `<div style="font-size: 7px;text-align: center;" >${text}</div>`;
//   // }
//   //}

//   html += `<br>`;

//   html += `<div style="font-size: 7px;" >${customer.AR_NAME}</div>`;

//   const addbBranch =
//     typeof customer.ADDB_BRANCH != 'undefined' &&
//     customer.ADDB_BRANCH != null &&
//     customer.ADDB_BRANCH != ''
//       ? 'สาขา ' + customer.ADDB_BRANCH
//       : '';

//   if (addbBranch != '') {
//     html += `<div style="font-size: 7px;" >${addbBranch}</div>`;
//   }

//   if (paymentType != 'transfer') {
//     if (customer.ADDB_ADDB_1 != null && customer.ADDB_ADDB_1 != '') {
//       html += `<div style="font-size: 7px;" >${customer.ADDB_ADDB_1}</div>`;
//     }

//     if (customer.ADDB_ADDB_2 != null && customer.ADDB_ADDB_2 != '') {
//       html += `<div style="font-size: 7px;" >${customer.ADDB_ADDB_2}</div>`;
//     }

//     if (customer.ADDB_ADDB_3 != null && customer.ADDB_ADDB_3 != '') {
//       html += `<div style="font-size: 7px;" >${customer.ADDB_ADDB_3}</div>`;
//     }

//     let addressADDB4 = '';

//     addressADDB4 =
//       customer.ADDB_PROVINCE != null && customer.ADDB_PROVINCE != ''
//         ? customer.ADDB_PROVINCE
//         : '';

//     addressADDB4 =
//       customer.ADDB_POST != null && customer.ADDB_POST != ''
//         ? addressADDB4 + ' ' + customer.ADDB_POST
//         : addressADDB4;

//     if (addressADDB4 != '') {
//       html += `<div style="font-size: 7px;" >${addressADDB4}</div>`;
//     }
//     if (customer.ADDB_TAX_ID != null && customer.ADDB_TAX_ID.trim() != '') {
//       html += `<div style="font-size: 7px;" >เลขผู้เสียภาษี: ${customer.ADDB_TAX_ID}</div>`;
//     }
//   }

//   html +=
//     '<div style="font-size: 7px;text-align: center;width: 180px;white-space: nowrap;overflow: hidden;" >---------------------------------------------------------------------------------</div>';

//   //let dateStrArr = header.VDI_DATE.split('T');
//   // dateStrArr = dateStrArr[0].split(':');

//   // html += `<div style="font-size: 7px;display: flex;" >
//   //         <div style="width: 50%;">วันที่ ${toBuddhistYear(
//   //           dateStrArr[0],
//   //           '-',
//   //           2,
//   //         )}</div>
//   //         <div style="width: 50%;text-align: right;">เวลา ${printTime}</div>
//   //     </div>`;

//   let ignoreVateShape = paymentType != 'transfer' ? '# ยกเว้น' : '';

//   if (paymentType == 'transfer') {
//     ignoreVateShape = '';
//   }

//   // html += `<div style="font-size: 7px;display: flex;" >
//   //         <div style="width: 50%;">เลขที่ ${header.VDI_USER_REF}</div>

//   //     </div>`;
//   html +=
//     '<div style="font-size: 7px;text-align: center;width: 180px;white-space: nowrap;overflow: hidden;" >---------------------------------------------------------------------------------</div>';

//   let trailType = paymentType != 'transfer' ? 'ยอดเงิน' : 'จำนวน';
//   console.log('trailType ', trailType);
//   html += `<div style="font-size: 7px;display: flex;" >
//             <div style="width: 50%;">รายละเอียด</div>
//             <div style="width: 50%;text-align: right;">${trailType}</div>
//         </div>`;

//   // for (var i = 0; i < items.length; i++) {
//   // items[]

//   items.map((item, index) => {
//     let TRDPrtFreeAuto = item.TRD_PRT_FREE_AUTO;
//     if (paymentType != 'transfer') {
//       console.log('paymentType reserv ', paymentType);
//       if (!TRDPrtFreeAuto) {
//         html += `<div style="font-size: 7px;" >
//                         <div>${item.TRD_SH_NAME}</div>
//                     </div>`;

//         let ignoreVate = item.IGNORE_VAT;
//         let shape = ignoreVate ? '#' : '';

//         // html += `<div style="font-size: 7px;display: flex;" >
//         //               <div style="width: 33%;">${item.TRD_UTQNAME}</div>
//         //               <div style="width: 33%;">${
//         //                 item.TRD_AC_QTY
//         //               }@${item.TRD_U_PRC_AF_DSC.toFixed(2).replace(
//         //   /\B(?=(\d{3})+(?!\d))/g,
//         //   ',',
//         // )}</div>
//         //               <div style="width: 30%;text-align: right;">${item.TRD_VALUES_EX_BILL_DISC.toFixed(
//         //                 2,
//         //               ).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>

//         //           </div>`;
//       }
//     } else {
//       html += `<div style="font-size: 7px;">${item.TRD_SH_NAME}</div>`;

//       html += `<div style="font-size: 7px;display: flex;" >
//                     <div style="width: 96%;">${item.TRD_UTQNAME}</div>
//                     <div style="width: 4%;text-align: right;">${
//                       item.TRD_AC_QTY ? item.TRD_AC_QTY : ''
//                     }</div>
//                 </div>`;
//     }
//   });

//   if (paymentType != 'transfer') {
//     console.log('0 ');
//     items.map((item, index) => {
//       let TRDPrtFreeAuto = item.TRD_PRT_FREE_AUTO;

//       if (TRDPrtFreeAuto) {
//         console.log('-1 ');
//         html += `<div style="font-size: 7px;">${item.TRD_SH_NAME}</div>`;

//         html += `<div style="font-size: 7px;display: flex;" >
//                         <div style="width: 33%;">${item.TRD_UTQNAME}</div>
//                         <div style="width: 33%;text-align: right;">${parseFloat(
//                           item.TRD_AC_QTY,
//                         )
//                           .toFixed(2)
//                           .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
//                         <div style="width: 30%;text-align: right;">${parseFloat(
//                           item.TRD_B_VAT,
//                         )
//                           .toFixed(2)
//                           .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
//                     </div>`;
//       }
//     });
//   }

//   html +=
//     '<div style="font-size: 7px;text-align: center;width: 180px;white-space: nowrap;overflow: hidden;" >---------------------------------------------------------------------------------</div>';
//   console.log('1 ');
//   if (paymentType != 'transfer' && paymentType != 'quotation') {
//     console.log('2 ');
//     let VDI_DISC_1 = null;
//     let VDI_DISC_2 = null;
//     let arrDISC = null;
//     if (summary.AROE) {
//       arrDISC = summary.AROE.AROE_TDSC_KEYIN.split(',');
//       VDI_DISC_1 = parseFloat(arrDISC[0]);
//       VDI_DISC_2 = parseFloat(arrDISC[1]);
//     } else if (summary.ARDETAIL) {
//       arrDISC = summary.ARDETAIL.ARD_TDSC_KEYIN.split(',');
//       VDI_DISC_1 = parseFloat(arrDISC[0]);
//       VDI_DISC_2 = parseFloat(arrDISC[1]);
//     }
//     if (
//       (VDI_DISC_1 != null && VDI_DISC_1 != '' && VDI_DISC_1 != '0') ||
//       (VDI_DISC_2 != null && VDI_DISC_2 != '' && VDI_DISC_2 != '0')
//     ) {
//       console.log('3 ');
//       // html += `<div style="font-size: 7px;display: flex;" >
//       //             <div style="width: 50%;">รวม</div>
//       //             <div style="width: 46%;text-align: right;">${header.VDI_B4_DISC_EX_BILL_DISC.toFixed(
//       //               2,
//       //             ).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
//       //         </div>`;
//     }

//     if (VDI_DISC_1 != null && VDI_DISC_1 != '' && VDI_DISC_1 != '0') {
//       console.log('5 ', isDiscountBath);
//       if (isDiscountBath) {
//         console.log('5.1 ');
//         html += `<div style="font-size: 7px;display: flex;" >
//           <div style="width: 50%;">ลด ${VDI_DISC_1.toFixed(2).replace(
//             /\B(?=(\d{3})+(?!\d))/g,
//             ',',
//           )} บาท</div>
//           <div style="width: 46%;text-align: right;">${VDI_DISC_1.toFixed(
//             2,
//           ).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
//       </div>`;
//       } else {
//         console.log('5.2 ');
//         html += `<div style="font-size: 7px;display: flex;" >
//           <div style="width: 50%;">ลด ${VDI_DISC_1.toFixed(2).replace(
//             /\B(?=(\d{3})+(?!\d))/g,
//             ',',
//           )}%</div>
//           <div style="width: 46%;text-align: right;">${VDI_DISC_1.toFixed(
//             2,
//           ).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
//       </div>`;
//       }
//     }

//     if (VDI_DISC_2 != null && VDI_DISC_2 != '' && VDI_DISC_2 != '0') {
//       console.log('6 ');
//       if (isDiscountBath) {
//       } else {
//         html += `<div style="font-size: 7px;display: flex;" >
//           <div style="width: 50%;">ลด ${VDI_DISC_2.toFixed(2).replace(
//             /\B(?=(\d{3})+(?!\d))/g,
//             ',',
//           )}%</div>
//           <div style="width: 46%;text-align: right;">${VDI_DISC_2.toFixed(
//             2,
//           ).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
//       </div>`;
//       }
//     }

//     if (
//       (VDI_DISC_1 != null && VDI_DISC_1 != '' && VDI_DISC_1 != '0') ||
//       (VDI_DISC_2 != null && VDI_DISC_2 != '' && VDI_DISC_2 != '0')
//     ) {
//       console.log('7 ');
//       html +=
//         '<div style="font-size: 7px;text-align: right;" >-------------------</div>';
//     }
//   }

//   if (paymentType != 'transfer') {
//     console.log('8');
//     // html += `<div style="font-size: 7px;display: flex;" >
//     //           <div style="width: 50%;">รวมทั้งหมด</div>
//     //           <div style="width: 46%;text-align: right;">${summary.netPrice
//     //             .toFixed(2)
//     //             .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
//     //       </div>`;

//     if (vanConfigShowVatCS == 1) {
//       let afDiscVat = summary.AROE
//         ? parseFloat(summary.AROE.AROE_B_AMT)
//             .toFixed(2)
//             .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
//         : parseFloat(summary.ARDETAIL.ARD_B_AMT)
//             .toFixed(2)
//             .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
//       console.log('9 afDiscVat', afDiscVat);
//       if (afDiscVat > 0) {
//         html += `<div style="font-size: 7px;display: flex;" >
//                         <div style="width: 50%;">ยอดสินค้า</div>
//                         <div style="width: 46%;text-align: right;">${afDiscVat}</div>
//                     </div>`;
//       }

//       let afDiscExpVat = summary.AROE
//         ? parseFloat(summary.AROE.AROE_B_VAT)
//             .toFixed(2)
//             .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
//         : parseFloat(summary.ARDETAIL.ARD_B_VAT)
//             .toFixed(2)
//             .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
//       console.log('10 afDiscExpVat', afDiscExpVat);
//       if (afDiscExpVat > 0) {
//         html += `<div style="font-size: 7px;display: flex;" >
//                         <div style="width: 50%;">ยอด ภพ.</div>
//                         <div style="width: 46%;text-align: right;">${afDiscExpVat}</div>
//                     </div>`;
//       }

//       let afDiscNVat = summary.AROE
//         ? parseFloat(summary.AROE.AROE_B_SV)
//             .toFixed(2)
//             .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
//         : parseFloat(summary.ARDETAIL.ARD_B_SV)
//             .toFixed(2)
//             .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
//       console.log('11 afDiscNVat', afDiscNVat);
//       if (afDiscNVat > 0) {
//         html += `<div style="font-size: 7px;display: flex;" >
//                         <div style="width: 50%;">ยอดสินค้าไม่มีภพ.</div>
//                         <div style="width: 46%;text-align: right;">${afDiscNVat}</div>
//                     </div>`;
//       }
//     }

//     const afRound = header.VDI_AF_ROUND;
//     const netPrice = summary.netPrice;

//     if (
//       vanConfigRound != 0 &&
//       (paymentType == 'cash' || paymentType == 'returnCash')
//     ) {
//       html += `<div style="font-size: 7px;display: flex;" >
//                   <div style="width: 50%;">หลังปัดเศษ</div>
//                   <div style="width: 46%;text-align: right;">${header.VDI_AF_ROUND.toFixed(
//                     2,
//                   ).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
//               </div>`;
//     }

//     if (
//       paymentType == 'cash' &&
//       header.VDI_BANK_NAME != null &&
//       header.VDI_BANK_NAME != '' &&
//       header.VDI_BANK != null &&
//       header.VDI_BANK != '' &&
//       header.VDI_CHEQUE_DATE != null &&
//       header.VDI_CHEQUE_DATE != '' &&
//       header.VDI_CHEQUE_NO != null &&
//       header.VDI_CHEQUE_NO != ''
//     ) {
//       html += `<div style="font-size: 7px;display: flex;" >
//                   <div style="width: 40%;">รับชำระ (เช็ค) </div>
//                   <div style="width: 50%;text-align: right;">${header.VDI_BANK_NAME}</div>
//               </div>`;

//       let dateStrArr = header.VDI_CHEQUE_DATE.split('T');
//       dateStrArr = dateStrArr[0].split(':');

//       html += `<div style="font-size: 7px;display: flex;" >
//                   <div style="width: 18%;">เลขที่</div>
//                   <div style="width: 33%;">${header.VDI_CHEQUE_NO}</div>
//                   <div style="width: 10%;">วันที่</div>
//                   <div style="width: 39%;text-align: right;">วันที่ ${moment(
//                     dateStrArr[0],
//                     'YYYY-MM-DD',
//                   )
//                     .add(543, 'years')
//                     .format('DD/MM/YYYY')}</div>
//               </div>`;
//     } else if (paymentType == 'cash' && header.VDI_PMT == 2) {
//       html += `<div style="font-size: 7px;" >รับชำระ (โอน) </div>`;
//     } else if (paymentType == 'cash' && header.VDI_PMT == 7) {
//       html += `<div style="font-size: 7px;" >รับชำระ (QRCode) </div>`;
//     } else if (paymentType == 'cash') {
//       html += `<div style="font-size: 7px;display: flex;" >
//                   <div style="font-size: 7px;width: 15%;" >รับชำระ (เงินสด)</div>
//                   <div style="font-size: 7px;width: 85%;text-align: right;" >${
//                     vanConfigRound != 0
//                       ? header.VDI_AF_ROUND.toFixed(2).replace(
//                           /\B(?=(\d{3})+(?!\d))/g,
//                           ',',
//                         )
//                       : summary.totalPrice
//                           .toFixed(2)
//                           .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
//                   }</div>
//               </div>`;
//     }

//     if (paymentType == 'returnCash') {
//       html += `<div style="font-size: 7px;display: flex;" >
//                   <div style="font-size: 7px;width: 50%;" >คืนเงิน&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(เงินสด)</div>
//                   <div style="font-size: 7px;width: 85%;text-align: right;" >${
//                     vanConfigRound != 0
//                       ? header.VDI_AF_ROUND.toFixed(2).replace(
//                           /\B(?=(\d{3})+(?!\d))/g,
//                           ',',
//                         )
//                       : summary.totalPrice
//                           .toFixed(2)
//                           .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
//                   }</div>
//               </div>`;
//     }

//     html += `<div style="font-size: 7px;display: flex;" >
//               <div style="font-size: 7px;width: 18%;">รวม</div>
//               <div style="font-size: 7px;width: 15%;padding-top: 1px;" >${header.VDI_ITEMS_SH_COUNT.toFixed(
//                 2,
//               ).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
//               <div style="font-size: 7px;width: 20%;">รายการ</div>
//               <div style="font-size: 7px;width: 20%;">จำนวน</div>
//               <div style="font-size: 7px;width: 20%;text-align: right;padding-top: 1px;">${header.VDI_PCS.toFixed(
//                 2,
//               ).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
//               <div style="font-size: 7px;width: 7%;text-align: right;">ชิ้น</div>
//           </div>`;
//   }
//   //------------
//   if (paymentType == 'reserv') {
//     let vdiShipDateStrArr = header.VDI_SHIP_DATE;
//     console.log("paymentType == 'reserv' vdiShipDateStrArr", vdiShipDateStrArr);
//     // let vdiDate = moment(vdiShipDateStrArr[0], 'YYYY-MM-DD').add(543, 'years').format('DD/MM/YYYY')
//     // let vdiDate = toBuddhistYear(vdiShipDateStrArr, '-', 2);
//     // console.log("vdiShipDateStrArr ",vdiShipDateStrArr);
//     // console.log("vdiDate ",vdiDate);
//     html += `<div style="font-size: 7px;display: flex;">
//                 <div style="font-size: 7px;width: 50%;">วันที่ส่งของ</div>
//                 <div style="font-size: 7px;width: 50%;" >${vdiShipDateStrArr}</div>
//             </div>`;

//     html += `<div style="font-size: 7px;">${vanConfig.VANCNF_BOOK_TRAIL}</div>`;
//     html += `<div style="font-size: 7px;">${vanConfig.VANCNF_BOOK_ISSBY}</div>`;
//   }

//   if (paymentType == 'quotation') {
//     console.log("paymentType == 'quotation' ");
//     if (vanConfig.VANCNF_QUOTE_TRAIL) {
//       html += `<div style="font-size: 7px;display: flex;">
//                 <div style="font-size: 7px;" >${vanConfig.VANCNF_QUOTE_TRAIL}</div>
//             </div>`;
//     }
//     if (vanConfig.VANCNF_QUOTE_ISSBY) {
//       html += `<div style="font-size: 7px;display: flex;">
//                 <div style="font-size: 7px;" >${vanConfig.VANCNF_QUOTE_ISSBY}</div>
//             </div>`;
//     }
//   }

//   if (paymentType == 'cash') {
//     console.log("paymentType == 'cash' ");
//     // if (vanConfig.VANCNF_CASHSALES_TRAIL) {
//     //   html += `<div style="font-size: 7px;display: flex;">
//     //           <div style="font-size: 7px;" >${vanConfig.VANCNF_CASHSALES_TRAIL}</div>
//     //       </div>`;
//     // }

//     if (vanConfig.VANCNF_CASHSALES_ISSBY) {
//       html += `<div style="font-size: 7px;display: flex;">
//                 <div style="font-size: 7px;" >${vanConfig.VANCNF_CASHSALES_ISSBY}</div>
//             </div>`;
//     }
//   }

//   if (paymentType == 'credit') {
//     console.log("paymentType == 'credit' ");
//     if (vanConfig.VANCNF_INV_TRAIL) {
//       html += `<div style="font-size: 7px;display: flex;">
//                 <div style="font-size: 7px;" >${vanConfig.VANCNF_INV_TRAIL}</div>
//             </div>`;
//     }

//     if (paymentType == 'credit' && r == 2) {
//       console.log("1 paymentType == 'credit'  && r == 2");
//       if (vanConfig.VANCNF_INV_TRAIL) {
//         html += `<div style="font-size: 7px;display: flex;">
//                     <div style="font-size: 7px;" >${vanConfig.VANCNF_INV_TRAIL}</div>
//                 </div>`;
//       }
//     } else {
//       console.log("2 paymentType == 'credit'  && r == 2");
//       if (vanConfig.VANCNF_INV_ISSBY) {
//         html += `<div style="font-size: 7px;display: flex;">
//                     <div style="font-size: 7px;" >${vanConfig.VANCNF_INV_ISSBY}</div>
//                 </div>`;
//       }
//     }
//   }

//   if (paymentType == 'return') {
//     console.log("paymentType == 'return' ");
//     if (vanConfig.VANCNF_RTN_TRAIL) {
//       html += `<div style="font-size: 7px;display: flex;">
//                 <div style="font-size: 7px;" >${vanConfig.VANCNF_RTN_TRAIL}</div>
//             </div>`;
//     }
//     if (vanConfig.VANCNF_RTN_ISSBY) {
//       html += `<div style="font-size: 7px;display: flex;">
//                 <div style="font-size: 7px;" >${vanConfig.VANCNF_RTN_ISSBY}</div>
//             </div>`;
//     }
//   }

//   if (paymentType == 'returnCash') {
//     console.log("paymentType == 'returnCash' ");
//     if (vanConfig.VANCNF_CASHRTN_TRAIL) {
//       html += `<div style="font-size: 7px;display: flex;">
//                 <div style="font-size: 7px;" >${vanConfig.VANCNF_CASHRTN_TRAIL}</div>
//             </div>`;
//     }
//     if (vanConfig.VANCNF_CASHRTN_ISSBY) {
//       html += `<div style="font-size: 7px;display: flex;">
//                 <div style="font-size: 7px;" >${vanConfig.VANCNF_CASHRTN_ISSBY}</div>
//             </div>`;
//     }
//   }

//   if (paymentType == 'transfer') {
//     console.log("paymentType == 'transfer' ");
//     if (vanConfig.VANCNF_TRANSFER_TRAIL) {
//       html += `<div style="font-size: 7px;display: flex;">
//                     <div style="font-size: 7px;" >${vanConfig.VANCNF_TRANSFER_TRAIL}</div>
//                 </div>`;
//     }

//     if (vanConfig.VANCNF_TRANSFER_ISSBY) {
//       html += `<div style="font-size: 7px;display: flex;">
//                     <div style="font-size: 7px;" >${vanConfig.VANCNF_TRANSFER_ISSBY}</div>
//                 </div>`;
//     }
//   }

//   html += `<div style="font-size: 7px;">ลงชื่อ____________________________________________</div>`;

//   if (paymentType == 'return') {
//     html += `<div style="font-size: 7px;">ผู้คืนของ</div>`;
//     html += `<div style="font-size: 7px;">ลงชื่อ____________________________________________</div>`;
//   }

//   if (paymentType == 'returnCash') {
//     html += `<div style="font-size: 7px;">ผู้คืนของ/รับเงิน</div>`;
//     html += `<div style="font-size: 7px;">ลงชื่อ____________________________________________</div>`;
//   }

//   html += `<br>`;
//   html += `<br>`;
//   html += `<br>`;

//   html += '</div></div>';
//   console.log('999 ');
//   return html;
// };

export const printReceipt2 = (
  header,
  items,
  summary,
  vanConfig,
  companyInfo,
  customer,
  printTime,
  paymentType,
  printTimes,
  isDiscountBath,
) => {
  let html =
    '<div style="width: 100%;"><div style="width: 180px;margin: auto;">';
  let headerPayment = '';
  let printRepeat = '';

  let vanConfigShowVatINV = vanConfig.VANCNF_INV_SHOWVAT;
  let vanConfigShowVatCS = vanConfig.VANCNF_INV_SHOWVAT;
  // let vanConfigShowVatCS = vanConfig.VANCNF_CASHSALES_SHOWVAT;

  let vanConfigRound = vanConfig.VANCNF_ROUND;




  let round = 1;
  console.log('printReceipt header ', header);
  console.log('printReceipt items ', items);
  // console.log('printReceipt vanConfig ', vanConfig);
  console.log('printReceipt summary ', summary);
  // console.log('printReceipt companyInfo ', companyInfo);
  // console.log('printReceipt customer ', customer);
  // console.log('printReceipt printTime ', printTime);
  if (paymentType == 'credit') {
    headerPayment = vanConfig.VANCNF_INV_HEAD;

    if (printTimes == 1) printRepeat = vanConfig.VANCNF_REPRT_INV_MSG;

    if (vanConfig.VANCNF_INV_COPY == 2) round = 2;
  } else if (paymentType == 'cash') {
    headerPayment = vanConfig.VANCNF_CASHSALES_HEAD;

    if (printTimes == 1) printRepeat = vanConfig.VANCNF_REPRT_CASHSALES_MSG;
  } else if (paymentType == 'reserv') {
    headerPayment = vanConfig.VANCNF_BOOK_HEAD;
  } else if (paymentType == 'return') {
    headerPayment = vanConfig.VANCNF_RTN_HEAD;
  } else if (paymentType == 'returnCash') {
    headerPayment = vanConfig.VANCNF_CASHRTN_HEAD;
  } else if (paymentType == 'transfer') {
    headerPayment = vanConfig.VANCNF_TRANSFER_HEAD;
  } else if (paymentType == 'quotation') {
    headerPayment = vanConfig.VANCNF_QUOTE_HEAD;
  }


  let vanConfigprintADDB = 1;

  switch (paymentType) {
    case 'credit':
      //vanConfigprintADDB = vanConfig.VANCNF_INV_ADDB;
      vanConfigprintADDB = vanConfig.VANCNF_CASHSALES_ADDB;

      break;
    case 'cash':
      vanConfigprintADDB = vanConfig.VANCNF_CASHSALES_ADDB;
      break;
    // case '':
    //   vanConfigprintADDB = vanConfig.VANCNF_PREPRCPT_ADDB;
    //   break;
    default:
      vanConfigprintADDB = 1;
      break;
  }

  // console.log('vanConfigprintADDB >>' , vanConfigprintADDB)

  for (var r = 1; r <= round; r++) {
    let brachPrefix = 'สาขา ';
    let companyNameArr = companyInfo.CMPNY_TCOMPANYNAME.split('สาขา', 2);
    // console.log('companyNameArr ', companyNameArr);
    // if (companyNameArr.length <= 1) {
    //   companyNameArr = companyInfo.CMPNY_TCOMPANYNAME.split('สำนักงานใหญ่', 2);

    //   if (companyNameArr.length == 2) {
    //     companyNameArr[1] = 'สำนักงานใหญ่';
    //   }

    //   brachPrefix = '';
    // }
    // let companyName = null;
    // for (var k = 0; k < companyNameArr.length; k++) {
    //   companyName = brachPrefix + companyName;
    // }
    // console.log('companyName ', companyName);
    html += `<br>`;

    html += `<div style="font-size: 7px;text-align: center;" >${companyInfo.CMPNY_TCOMPANYNAME}</div>`;
    // }
    if (paymentType != 'transfer') {
      // console.log('paymentType ', paymentType);


      // console.log('vanConfigShowVatINV VANCNF_INV_SHOWVAT', vanConfigShowVatINV);
      // console.log('vanConfigShowVatCS VANCNF_CASHSALES_SHOWVAT', vanConfigShowVatCS);
      // console.log('vanConfigprintADDB 1', vanConfigprintADDB);
      // console.log('vanConfigprintADDB 2', vanConfig.VANCNF_INV_ADDB);
      // console.log('vanConfigprintADDB 3', vanConfig.VANCNF_CASHSALES_ADDB);


      if (vanConfigShowVatCS == 1) {

        if (vanConfigprintADDB == 1) {


          let province = companyInfo.CMPNY_TPROVINCE;
          let tambol = "";
          let amphur = "";
          let jangwad = "";

          if (province == "กรุงเทพมหานคร" || province == "กรุงเทพฯ") {
            tambol = "แขวง";
            amphur = "เขต";
            jangwad = "";
          } else {
            tambol = "ตำบล";
            amphur = "อำเภอ";
            jangwad = "จังหวัด";
          }


          if (companyInfo.CMPNY_TADDRESS_1 != null && companyInfo.CMPNY_TADDRESS_1 != '') {
            if (companyInfo.CMPNY_TADDRESS_2 != null && companyInfo.CMPNY_TADDRESS_2 != '') {
              html += `<div style="font-size: 7px;text-align: center;" >${companyInfo.CMPNY_TADDRESS_1} ซอย${companyInfo.CMPNY_TADDRESS_2}</div>`;
            }
            else {
              html += `<div style="font-size: 7px;text-align: center;" >${companyInfo.CMPNY_TADDRESS_1} </div>`;
            }
          } else {

            if (companyInfo.CMPNY_TADDRESS_2 != null && companyInfo.CMPNY_TADDRESS_2 != '') {
              html += `<div style="font-size: 7px;text-align: center;" > ซอย${companyInfo.CMPNY_TADDRESS_2}</div>`;
            }
            else {
              html += `<div style="font-size: 7px;text-align: center;" > </div>`;
            }
          }

          // if (
          //   companyInfo.CMPNY_TADDRESS_2 != null &&
          //   companyInfo.CMPNY_TADDRESS_2 != ''
          // ) {
          //   html += `<div style="font-size: 7px;text-align: center;" >ซ.${companyInfo.CMPNY_TADDRESS_2}</div>`;
          // }

          if (
            companyInfo.CMPNY_TADDRESS_3 != null &&
            companyInfo.CMPNY_TADDRESS_3 != ''
          ) {
            html += `<div style="font-size: 7px;text-align: center;" >ถนน${companyInfo.CMPNY_TADDRESS_3} ${tambol + companyInfo.CMPNY_TSUB_DISTRICT}</div>`;
          } else {
            html += `<div style="font-size: 7px;text-align: center;" > ${tambol + companyInfo.CMPNY_TSUB_DISTRICT}</div>`;
          }


          //  if (
          //   companyInfo.CMPNY_TSUB_DISTRICT != null &&
          //   companyInfo.CMPNY_TSUB_DISTRICT != '' 
          // ) {
          //   html += `<div style="font-size: 7px;text-align: center;" >แขวง${companyInfo.CMPNY_TSUB_DISTRICT}</div>`;
          // }


          //   if (
          //   companyInfo.CMPNY_TDISTRICT != null &&
          //   companyInfo.CMPNY_TDISTRICT != '' 
          // ) {
          //   html += `<div style="font-size: 7px;text-align: center;" >เขต${companyInfo.CMPNY_TDISTRICT}</div>`;
          // }


          if (
            companyInfo.CMPNY_TPROVINCE != null &&
            companyInfo.CMPNY_TPROVINCE != '' &&
            companyInfo.CMPNY_POST != null &&
            companyInfo.CMPNY_POST != ''
          ) {
            html += `<div style="font-size: 7px;text-align: center;" >${amphur + companyInfo.CMPNY_TDISTRICT} ${jangwad + companyInfo.CMPNY_TPROVINCE} ${companyInfo.CMPNY_POST}</div>`;
            // html += `<div style="font-size: 7px;text-align: center;" >${companyInfo.CMPNY_POST}</div>`;
          }



          if (
            companyInfo.CMPNY_REG_NO != null &&
            companyInfo.CMPNY_REG_NO.trim() != ''
          ) {
            html += `<div style="font-size: 7px;text-align: center;" >เลขผู้เสียภาษี: ${companyInfo.CMPNY_REG_NO}</div>`;
          }
        }
      }
    }
    let text = '';

    if (printRepeat != '') {
      text = printRepeat;
    } else {
      text = headerPayment;
    }

    if (text != null) {
      html += `<div style="font-size: 7px;text-align: center;" >${text}</div>`;
    }
    if (paymentType != 'transfer') {
      // if (r == 1) {

      html += `<br>`;

      html += `<div style="font-size: 7px;" >${customer.AR_NAME}</div>`;
      const addbBranch =
        typeof customer.ADDB_BRANCH != 'undefined' &&
          customer.ADDB_BRANCH != null &&
          customer.ADDB_BRANCH != '' ?
          'สาขา ' + customer.ADDB_BRANCH :
          '';
      console.log('addbBranch', addbBranch);
      if (addbBranch != '') {
        html += `<div style="font-size: 7px;" >${addbBranch}</div>`;
      }
    } else {
      html += `<div style="font-size: 7px;" >${'จาก ' + customer.FROM.WL_NAME
        }</div>`;
      html += `<div style="font-size: 7px;" >${'ถึง ' + customer.TO.WL_NAME
        }</div>`;
    }

    if (paymentType != 'transfer') {


      let custambol = "";
      let cusamphur = "";
      let cusjangwad = "";

      if (customer.ADDB_PROVINCE == "กรุงเทพมหานคร" || customer.ADDB_PROVINCE == "กรุงเทพฯ") {
        cusamphur = "เขต";
        custambol = "แขวง";
        cusjangwad = "";
      } else {
        cusamphur = "อำเภอ";
        custambol = "ตำบล";
        cusjangwad = "จังหวัด";
      }





      if (customer.ADDB_ADDB_1 != null && customer.ADDB_ADDB_1 != '') {
        html += `<div style="font-size: 7px;" >${customer.ADDB_ADDB_1}</div>`;
      }

      if (customer.ADDB_ADDB_2 != null && customer.ADDB_ADDB_2 != '') {
        html += `<div style="font-size: 7px;" >${customer.ADDB_ADDB_2}</div>`;
      }

      if (customer.ADDB_ADDB_3 != null && customer.ADDB_ADDB_3 != '') {
        html += `<div style="font-size: 7px;" >${customer.ADDB_ADDB_3}</div>`;
      }

      let addressADDB4 = '';
      addressADDB4 =
        customer.ADDB_SUB_DISTRICT != null && customer.ADDB_SUB_DISTRICT != '' ?
          (custambol + customer.ADDB_SUB_DISTRICT) :
          '';

      addressADDB4 =
        customer.ADDB_DISTRICT != null && customer.ADDB_DISTRICT != '' ?
          addressADDB4 + ' ' + (cusamphur + customer.ADDB_DISTRICT) :
          addressADDB4;

      addressADDB4 =
        customer.ADDB_PROVINCE != null && customer.ADDB_PROVINCE != '' ?
          addressADDB4 + ' ' + (cusjangwad + customer.ADDB_PROVINCE) :
          addressADDB4;

      addressADDB4 =
        customer.ADDB_POST != null && customer.ADDB_POST != '' ?
          addressADDB4 + ' ' + customer.ADDB_POST :
          addressADDB4;

      if (addressADDB4 != '') {
        html += `<div style="font-size: 7px;" >${addressADDB4}</div>`;
      }
      if (customer.ADDB_TAX_ID != null && customer.ADDB_TAX_ID.trim() != '') {
        html += `<div style="font-size: 7px;" >เลขผู้เสียภาษี: ${customer.ADDB_TAX_ID}</div>`;
      }
    }
    html +=
      '<div style="font-size: 7px;text-align: center;width: 180px;white-space: nowrap;overflow: hidden;" >---------------------------------------------------------------------------------</div>';
    let dateStrArr = header.header.VDI_DATE.split('T');
    dateStrArr = dateStrArr[0].split(':');

    html += `<div style="font-size: 7px;display: flex;" >
          <div style="width: 50%;">วันที่ ${toBuddhistYear(
      dateStrArr,
      '-',
      2,
    )}</div>
          <div style="width: 50%;text-align: right;">เวลา ${printTime[0]}:${printTime[1]
      }</div>
      </div>`;
    // console.log('printReceipt header.VDI_USER_REF ', header.header.VDI_USER_REF);

    let ignoreVateShape = paymentType != 'transfer' ? '# ยกเว้น' : '';

    if (paymentType == 'transfer') {
      ignoreVateShape = '';
    }

    html += `<div style="font-size: 7px;display: flex;" >
    <div style="width: 50%;">เลขที่ ${header.header.VDI_USER_REF}</div>
    <div style="width: 50%;text-align: right;">${ignoreVateShape}</div>
    </div>`;


    html +=
      '<div style="font-size: 7px;text-align: center;width: 180px;white-space: nowrap;overflow: hidden;" >---------------------------------------------------------------------------------</div>';
    let trailType = paymentType != 'transfer' ? 'ยอดเงิน' : 'จำนวน';
    console.log('trailType ', trailType);
    html += `<div style="font-size: 7px;display: flex;" >
            <div style="width: 50%;">รายละเอียด</div>
            <div style="width: 50%;text-align: right;">${trailType}</div>
        </div>`;
    items.map((item, index) => {
      let TRDPrtFreeAuto = item.VTRD_PRT_FREE_AUTO;


      //  console.log('paymentType >>> ', paymentType);
      //   console.log('paymentType item >>> ', item);
      if (paymentType != 'transfer') {

        if (!TRDPrtFreeAuto) {
          html += `
          <div style="width:100%;border-style: none;font-size: 7px;  ">${item.TRD_SH_NAME} (${item.TRD_UTQNAME})</div>
          <div style="font-size: 7px;display: flex;" >
          <div style="width:90px;border-style: none;font-size: 7px;  ">&nbsp;</div>
          <div style="min-width:50px;text-align: right;border-style: none;vertical-align: 0px; "> ${item.TRD_QTY}@${parseFloat(item.TRD_U_PRC,)
              .toFixed(2)
              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div><div style="text-align: right;border-style: none;min-width:45px">&nbsp;${parseFloat((item.TRD_U_PRC * item.TRD_QTY))
              .toFixed(2)
              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div></div>`;

          let ignoreVate = item.IGNORE_VAT;
          let shape = ignoreVate ? '#' : '';
          let disc = (item.TRD_DSC_KEYIN > 0 ? (item.TRD_DSC_KEYIN * item.TRD_QTY) : '');
          let disc_t = (item.TRD_DSC_KEYIN > 0 ? " ลด " : '');


          html += item.TRD_DSC_KEYIN > 0 ? `<div style="font-size: 7px;display: flex;" >
                      <div style="width:90px;border-style: none;text-align: right; ">${disc_t} </div>&nbsp;
                      <div style="min-width:50px;text-align: right;border-style: none;vertical-align: 0px; "> ${item.TRD_DSC_KEYIN > 0 ? parseFloat(disc,)
              .toFixed(2)
              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              : ''
            }</div>
                    <div style="text-align: right;border-style: none;min-width:45px">&nbsp;${parseFloat(
              (item.TRD_G_AMT * 1),
            )
              .toFixed(2)
              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div></div>` : '';
        } else {
          html += ` <div style="width:100%;border-style: none;font-size: 7px;  ">${item.TRD_SH_NAME} (${item.TRD_UTQNAME})</div>
                      <div style="font-size: 7px;display: flex;" >
                      <div style="width:90px;border-style: none;font-size: 7px;  ">&nbsp;</div>
                              
                              <div style="min-width:50px;text-align: right;border-style: none;vertical-align: 0px; "> ${item.TRD_QTY ? item.TRD_QTY : ''
            }</div>
                    <div style="text-align: right;border-style: none;min-width:45px">&nbsp;${parseFloat(
              item.TRD_Q_FREE,
            )
              .toFixed(2)
              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div></div>`;
        }
      } else {
        html += `<div style="font-size: 7px;"> 
                                        <div>${item.TRD_SH_NAME}</div>
                                    </div>`;

        html += `<div style="font-size: 7px;display: flex;" >
                                    <div style="width: 33%;">${item.TRD_UTQNAME}</div>
                                    <div style="width: 33%;text-align: left;"> </div>
                  <div style="width: 30%;text-align: right;">${item.TRD_QTY ? item.TRD_QTY : ''
          }</div></div>`;
      }
    });

    html +=
      '<div style="font-size: 7px;text-align: center;width: 180px;white-space: nowrap;overflow: hidden;" >---------------------------------------------------------------------------------</div>';
    console.log('summary ', summary);
    if (paymentType != 'transfer') {
      console.log('2 ');
      let VDI_DISC_1 = null;
      let VDI_DISC_2 = null;
      let VDI_DISC_KEYINV = null;
      let arrDISC = null;
      let G_KEYIN = null;

      if (summary.AROE) {
        arrDISC = summary.AROE.AROE_TDSC_KEYIN ?
          summary.AROE.AROE_TDSC_KEYIN.split(',') :
          summary.AROE.ARD_TDSC_KEYIN.split(',');
        VDI_DISC_1 = parseFloat(arrDISC[0]);
        VDI_DISC_2 = parseFloat(arrDISC[1]);
        VDI_DISC_KEYINV = summary.AROE.AROE_TDSC_KEYINV ?
          parseFloat(summary.AROE.AROE_TDSC_KEYINV) :
          parseFloat(summary.AROE.ARD_TDSC_KEYINV);
        G_KEYIN = summary.AROE.AROE_G_KEYIN ?
          parseFloat(summary.AROE.AROE_G_KEYIN) :
          parseFloat(summary.AROE.ARD_G_KEYIN);
      } else if (summary.ARDETAIL) {
        arrDISC = summary.ARDETAIL.ARD_TDSC_KEYIN.split(',');
        VDI_DISC_1 = parseFloat(arrDISC[0]);
        VDI_DISC_2 = parseFloat(arrDISC[1]);
        VDI_DISC_KEYINV = parseFloat(summary.ARDETAIL.ARD_TDSC_KEYINV);
        G_KEYIN = parseFloat(summary.ARDETAIL.ARD_G_KEYIN);
      }
      if (
        (arrDISC[0] != null && arrDISC[0] != '' && arrDISC[0] != '0') ||
        (arrDISC[1] != null && arrDISC[1] != '' && arrDISC[1] != '0')
      ) {
        console.log('3 ');
        html += `<div style="font-size: 7px;display: flex;" >
                  <div style="width: 50%;">รวม</div>
                  <div style="width: 50%;text-align: right;">${G_KEYIN.toFixed(
          2,
        ).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
              </div>`;
      }
      console.log('arrDISC ', arrDISC);
      console.log('VDI_DISC_1 ', VDI_DISC_1);
      console.log('VDI_DISC_2 ', VDI_DISC_2);
      if (arrDISC[0] != null && arrDISC[0] != '' && arrDISC[0] != '0') {
        console.log('5 ', isDiscountBath);
        if (isDiscountBath) {
          console.log('5.1 ');
          html += VDI_DISC_1 > 0 ? `<div style="font-size: 7px;display: flex;" >
          <div style="width: 50%;">ลด ${VDI_DISC_1.toFixed(2).replace(
            /\B(?=(\d{3})+(?!\d))/g,
            ',',
          )} บาท</div>
          <div style="width: 50%;text-align: right;">${VDI_DISC_KEYINV.toFixed(
            2,
          ).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
      </div>` : "";
        } else {
          console.log('5.2 ', VDI_DISC_KEYINV);
          const dis1AfterDis =
            header.orderProductSummary.DIS_BILL_1_AFTER_DISCOUNT;
          //const dis1AfterDis = VDI_DISC_KEYINV



          html += VDI_DISC_1 > 0 ? `<div style="font-size: 7px;display: flex;" >
          <div style="width: 50%;">ลด ${VDI_DISC_1.toFixed(2).replace(
            /\B(?=(\d{3})+(?!\d))/g,
            ',',
          )}%</div>
          <div style="width: 50%;text-align: right;">${dis1AfterDis
              .toFixed(2)
              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
      </div>` : "";
        }
      }

      if (arrDISC[1] != null && arrDISC[1] != '' && arrDISC[1] != '0') {
        console.log('6 ');
        if (isDiscountBath) { } else {
          const dis2AfterDis =
            header.orderProductSummary.DIS_BILL_2_AFTER_DISCOUNT;
          html += VDI_DISC_2 > 0 ? `<div style="font-size: 7px;display: flex;" >
          <div style="width: 50%;">ลด ${VDI_DISC_2.toFixed(2).replace(
            /\B(?=(\d{3})+(?!\d))/g,
            ',',
          )}%</div>
          <div style="width: 50%;text-align: right;">${dis2AfterDis
              .toFixed(2)
              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
      </div>` : "";
        }
      }

      if (
        (arrDISC[0] != null && arrDISC[0] != '' && arrDISC[0] != '0') ||
        (arrDISC[1] != null && arrDISC[1] != '' && arrDISC[1] != '0')
      ) {
        console.log('7 ');
        html +=
          '<div style="font-size: 7px;text-align: right;" >-------------------</div>';
      }
    }

    if (paymentType != 'transfer' && paymentType != 'quotation') {
      // console.log('summary999', summary);
      let B_AMT = null;
      if (summary.AROE) {
        B_AMT = summary.AROE.AROE_B_AMT ?
          parseFloat(summary.AROE.AROE_B_AMT) :
          parseFloat(summary.AROE.ARD_B_AMT);
      } else if (summary.ARDETAIL) {
        B_AMT = summary.ARDETAIL.AROE_B_AMT ?
          parseFloat(summary.ARDETAIL.AROE_B_AMT) :
          parseFloat(summary.ARDETAIL.ARD_B_AMT);
      }

      html += `<div style="font-size: 7px;display: flex;" >
              <div style="width: 50%;">รวมทั้งหมด</div>
              <div style="width: 50%;text-align: right;">${summary.AROE &&
        parseFloat(B_AMT)
          .toFixed(2)
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        }</div>
          </div>`;

      if (vanConfigShowVatCS == 1) {
        let afDiscVat = summary.ARDETAIL ?
          parseFloat(summary.ARDETAIL.ARD_B_SV).toFixed(2)
          :
          parseFloat(summary.AROE.AROE_B_SV).toFixed(2);

        console.log('9 afDiscVat', afDiscVat);

        let afDisc_Exp = summary.ARDETAIL ?
          parseFloat(summary.ARDETAIL.ARD_B_SNV).toFixed(2)
          :
          parseFloat(summary.AROE.AROE_B_SNV).toFixed(2);

        console.log('9.1 afDisc_Exp', afDisc_Exp);

        if (afDiscVat > 0) {
          html += `<div style="font-size: 7px;display: flex;" >
                        <div style="width: 50%;">ยอดสินค้า</div>
                        <div style="width: 50%;text-align: right;">${afDiscVat.replace(
            /\B(?=(\d{3})+(?!\d))/g,
            ',',
          )}</div>
                    </div>`;
        }
        if (afDisc_Exp > 0) {
          html += `<div style="font-size: 7px;display: flex;" >
                        <div style="width: 50%;">สินค้ายกเว้น</div>
                        <div style="width: 50%;text-align: right;">${afDisc_Exp.replace(
            /\B(?=(\d{3})+(?!\d))/g,
            ',',
          )}</div>
                    </div>`;
        }

        let afDiscExpVat = summary.ARDETAIL ?
          parseFloat(summary.ARDETAIL.ARD_A_VAT)
            .toFixed(2)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',') :
          parseFloat(summary.AROE.AROE_A_VAT)
            .toFixed(2)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        console.log('10 afDiscExpVat', parseFloat(afDiscExpVat));
        if (parseFloat(afDiscExpVat) > 0) {
          html += `<div style="font-size: 7px;display: flex;" >
                        <div style="width: 50%;">ยอด ภพ.</div>
                        <div style="width: 50%;text-align: right;">${afDiscExpVat}</div>
                    </div>`;
        }

      }

      let paymentMethod;
      if (header && Array.isArray(header.paymentMethod) && header.paymentMethod.length > 0) {
        paymentMethod = header.paymentMethod[0];

        {

          if (parseFloat(paymentMethod.CASHAC_AMT) > 0) {
            html += `<div style="font-size: 7px;display: flex;" >
  <div style="width: 50%;">รับชำระ (เงินสด)</div>
  <div style="width: 50%;text-align: right;">${parseFloat(paymentMethod.CASHAC_AMT).toFixed(2)
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
</div>`;
          }
          if (parseFloat(paymentMethod.BNKAC_AMT) > 0) {
            html += `<div style="font-size: 7px;display: flex;" >
            <div style="width: 50%;">รับชำระ (โอน)</div>
            <div style="width: 50%;text-align: right;">${parseFloat(paymentMethod.BNKAC_AMT).toFixed(2)
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
          </div>`;
          }
          if (parseFloat(paymentMethod.QRCT_AMT) > 0) {
            html += `<div style="font-size: 7px;display: flex;" >
  <div style="width: 50%;">รับชำระ (QrCode)</div>
  <div style="width: 50%;text-align: right;">${parseFloat(paymentMethod.QRCT_AMT).toFixed(2)
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
</div>`;
          }
          if (parseFloat(paymentMethod.CQIN_1_AMT) > 0) {
            html += `<div style="font-size: 7px;display: flex;" >
  <div style="width: 50%;">รับชำระ (เช็ค)</div>
  <div style="width: 50%;text-align: right;">${parseFloat(paymentMethod.CQIN_1_AMT).toFixed(2)
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
</div>`;
          }
          if (parseFloat(paymentMethod.PMT_1_AMT) > 0) {
            html += `<div style="font-size: 7px;display: flex;" >
  <div style="width: 50%;">รับชำระ (อื่นๆ)</div>
  <div style="width: 50%;text-align: right;">${parseFloat(paymentMethod.PMT_1_AMT).toFixed(2)
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
</div>`;
          }
        }
      }








      const afRound = header.VDI_AF_ROUND;
      const netPrice = summary.netPrice;


      let amount = 0;
      for (let i in items) {
        amount += parseFloat(items[i].TRD_QTY);
      }
      html += `<div style="font-size: 7px;display: flex;" >
              <div style="font-size: 7px;width: 18%;">รวม</div>
              <div style="font-size: 7px;width: 15%;padding-top: 1px;" >${parseFloat(
        summary.DOCINFO.DI_ITEMS,
      )
          .toFixed(0)
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
              <div style="font-size: 7px;width: 20%;">รายการ</div>
              <div style="font-size: 7px;width: 20%;">จำนวน </div>
              <div style="font-size: 7px;width: 15%;text-align: right;padding-top: 1px;">${amount
          .toFixed(0)
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
              <div style="font-size: 7px;width: 15%;text-align: right;">ชิ้น</div>
          </div>`;
    }
    console.log('paymentType >>> items', items[0]);


    if (paymentType == 'quotation') {
      console.log('8.8 ', items);
      let B_AMT = null;

      for (let i in items) {

        if (items[i]) {
          B_AMT += items[i].TRD_B_AMT ?
            parseFloat(items[i].TRD_B_AMT) :
            parseFloat(items[i].TRD_B_AMT);
        }
      }

      html += `<div style="font-size: 7px;display: flex;" >
              <div style="width: 50%;">รวมทั้งหมด</div>
              <div style="width: 50%;text-align: right;">${items[0] &&
        parseFloat(B_AMT)
          .toFixed(2)
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        }</div>
          </div>`;

      console.log('9 vanConfigShowVatCS', vanConfigShowVatCS);
      //    console.log('9 summary', summary);




      if (vanConfigShowVatCS == 1) {

        let afDiscVat = parseFloat(0);
        let afDiscExpVat = parseFloat(0);
        // let afDisc_Exp  = parseFloat(0);

        for (let i in items) {
          if (items[i]) {
            afDiscVat += items[i] ?
              parseFloat(items[i].TRD_B_SELL)
              :
              parseFloat(items[i].TRD_G_SELL);


            console.log('9 afDiscVat', afDiscVat);

            // afDisc_Exp += items[i] ?
            //           parseFloat(items[i].TRD_B_VAT)
            //           :
            //           parseFloat(items[i].TRD_G_VAT)
            // ;


            afDiscExpVat += items[i] ?
              parseFloat(items[i].TRD_B_VAT)
              :
              parseFloat(items[i].TRD_G_VAT)
              ;



          }
        }


        console.log('9 afDiscVat', afDiscVat);

        if (afDiscVat > 0) {
          html += `<div style="font-size: 7px;display: flex;" >
                        <div style="width: 50%;">ยอดสินค้า</div>
                        <div style="width: 50%;text-align: right;">${afDiscVat.toFixed(2).replace(
            /\B(?=(\d{3})+(?!\d))/g,
            ',',
          )}</div>
                    </div>`;
        }

        console.log('10 afDiscExpVat', afDiscExpVat);
        if (afDiscExpVat > 0) {
          html += `<div style="font-size: 7px;display: flex;" >
                        <div style="width: 50%;">ยอด ภพ.</div>
                        <div style="width: 50%;text-align: right;">${afDiscExpVat.toFixed(2).replace(
            /\B(?=(\d{3})+(?!\d))/g,
            ',',
          )}</div>
                    </div>`;
        }

      }




      let amount = 0;
      let piece = 0;
      console.log('items7574 ', items);
      for (let i in items) {
        amount += parseFloat(items[i].TRD_QTY);
        piece += parseFloat(1);
      }
      html += `<div style="font-size: 7px;display: flex;" >
              <div style="font-size: 7px;width: 18%;">รวม</div>
              <div style="font-size: 7px;width: 15%;padding-top: 1px;" >${parseFloat(
        header.orderProductSummary.totalItems
      )
          .toFixed(0)
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
              <div style="font-size: 7px;width: 20%;">รายการ</div>
              <div style="font-size: 7px;width: 20%;">จำนวน</div>
              <div style="font-size: 7px;width: 20%;text-align: right;padding-top: 1px;">${amount
          .toFixed(0)
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
              <div style="font-size: 7px;width: 7%;text-align: right;">ชิ้น</div>
          </div>`;
    }

    if (paymentType == 'reserv') {
      // let vdiShipDateStrArr = header.headerProcessed.VDI_SHIP_DATE.split(':');
      console.log(" header.headerProcessed.VDI_DATE", header.header.VDI_DATE);

      let vdiShipDateStrArr = header.header.VDI_SHIP_DATE.split('T');


      console.log("paymentType == 'reserv' ", vdiShipDateStrArr);
      // let vdiDate = moment(vdiShipDateStrArr[0], 'YYYY-MM-DD')
      //   .add(543, 'years')
      //   .format('DD/MM/YYYY');
      let vdiDate = toBuddhistYear(vdiShipDateStrArr, '-', 2);
      console.log("vdiShipDateStrArr ", vdiShipDateStrArr);
      console.log("vdiDate ", vdiDate);

      html += `<div style="font-size: 7px;display: flex;" >
            <div style="width: 50%;">วันที่ส่งของ</div>
            <div style="width: 70%;text-align: right;">${vdiDate}</div>
        </div>`;




      html += `<div style="font-size: 7px;">${vanConfig.VANCNF_BOOK_TRAIL}</div>`;
      html += `<div style="font-size: 7px;">${vanConfig.VANCNF_BOOK_ISSBY}</div>`;
    }

    if (paymentType == 'quotation') {
      console.log("paymentType == 'quotation' ");
      if (vanConfig.VANCNF_QUOTE_TRAIL) {
        html += `<div style="font-size: 7px;display: flex;">
                <div style="font-size: 7px;" >${vanConfig.VANCNF_QUOTE_TRAIL}</div>
            </div>`;
      }
      if (vanConfig.VANCNF_QUOTE_ISSBY) {
        html += `<div style="font-size: 7px;display: flex;">
                <div style="font-size: 7px;" >${vanConfig.VANCNF_QUOTE_ISSBY}</div>
            </div>`;
      }
    }

    if (paymentType == 'cash') {
      console.log("paymentType == 'cash' ");
      if (vanConfig.VANCNF_CASHSALES_TRAIL) {
        html += `<div style="font-size: 7px;display: flex;">
                <div style="font-size: 7px;" >${vanConfig.VANCNF_CASHSALES_TRAIL}</div>
            </div>`;
      }

      if (vanConfig.VANCNF_CASHSALES_ISSBY) {
        html += `<div style="font-size: 7px;display: flex;">
                <div style="font-size: 7px;" >${vanConfig.VANCNF_CASHSALES_ISSBY}</div>
            </div>`;
      }
    }

    if (paymentType == 'credit') {
      if (vanConfig.VANCNF_INV_TRAIL) {
        html += `<div style="font-size: 7px;display: flex;">
                    <div style="font-size: 7px;" >${vanConfig.VANCNF_INV_TRAIL}</div>
                </div>`;
      }
      if (vanConfig.VANCNF_INV_ISSBY) {
        html += `<div style="font-size: 7px;display: flex;">
                    <div style="font-size: 7px;" >${vanConfig.VANCNF_INV_ISSBY}</div>
                </div>`;
      }
    }

    if (paymentType == 'return') {
      console.log("paymentType == 'return' ");
      if (vanConfig.VANCNF_RTN_TRAIL) {
        html += `<div style="font-size: 7px;display: flex;">
                <div style="font-size: 7px;" >${vanConfig.VANCNF_RTN_TRAIL}</div>
            </div>`;
      }
      if (vanConfig.VANCNF_RTN_ISSBY) {
        html += `<div style="font-size: 7px;display: flex;">
                <div style="font-size: 7px;" >${vanConfig.VANCNF_RTN_ISSBY}</div>
            </div>`;
      }
    }

    if (paymentType == 'returnCash') {
      console.log("paymentType == 'returnCash' ");
      if (vanConfig.VANCNF_CASHRTN_TRAIL) {
        html += `<div style="font-size: 7px;display: flex;">
                <div style="font-size: 7px;" >${vanConfig.VANCNF_CASHRTN_TRAIL}</div>
            </div>`;
      }
      if (vanConfig.VANCNF_CASHRTN_ISSBY) {
        html += `<div style="font-size: 7px;display: flex;">
                <div style="font-size: 7px;" >${vanConfig.VANCNF_CASHRTN_ISSBY}</div>
            </div>`;
      }
    }

    if (paymentType == 'transfer') {
      console.log("paymentType == 'transfer' ");
      if (vanConfig.VANCNF_TRANSFER_TRAIL) {
        html += `<div style="font-size: 7px;display: flex;">
                    <div style="font-size: 7px;" >${vanConfig.VANCNF_TRANSFER_TRAIL}</div>
                </div>`;
      }

      if (vanConfig.VANCNF_TRANSFER_ISSBY) {
        html += `<div style="font-size: 7px;display: flex;">
                    <div style="font-size: 7px;" >${vanConfig.VANCNF_TRANSFER_ISSBY}</div>
                </div>`;
      }
    }

    html += `<div style="font-size: 7px;">ลงชื่อ____________________________________________</div>`;

    if (paymentType == 'return') {
      html += `<div style="font-size: 7px;">ผู้คืนของ</div>`;
      html += `<div style="font-size: 7px;">ลงชื่อ____________________________________________</div>`;
    }

    if (paymentType == 'returnCash') {
      html += `<div style="font-size: 7px;">ผู้คืนของ/รับเงิน</div>`;
      html += `<div style="font-size: 7px;">ลงชื่อ____________________________________________</div>`;
    }
  }
  html += `<br>`;
  html += `<br>`;
  html += `<br>`;

  html += '</div></div>';
  return html;
};
export const printReport = (
  title,
  type,
  data,
  items,
  vanConfig,
  companyInfo,
  salesMan,
  dateFrom,
  dateTo,
  printTime,
) => {
  if (type == 'SalesOrderByCategory') {
    console.log('items SalesOrderByCategory ', JSON.stringify(items));
    return printSalesOrderByCategory(
      title,
      data,
      items,
      vanConfig,
      companyInfo,
      salesMan,
      dateFrom,
      dateTo,
      printTime,
    );
  } else if (type == 'SalesOrderByProduct') {
    console.log('items SalesOrderByProduct ', JSON.stringify(items));
    return printSalesOrderByProduct(
      title,
      data,
      items,
      vanConfig,
      companyInfo,
      salesMan,
      dateFrom,
      dateTo,
      printTime,
    );
  } else if (type == 'SalesOrderByArline') {
    console.log('items SalesOrderByArline ', JSON.stringify(items));
    return printSalesOrderByArline(
      title,
      data,
      items,
      vanConfig,
      companyInfo,
      salesMan,
      dateFrom,
      dateTo,
      printTime,
    );
  } else if (type == 'SalesOrderByDocType') {
    console.log('items SalesOrderByDocType ', JSON.stringify(items));
    return printSalesOrderByDocType(
      title,
      data,
      items,
      vanConfig,
      companyInfo,
      salesMan,
      dateFrom,
      dateTo,
      printTime,
    );
  } else if (type == 'SalesOrderByPmt') {
    console.log('items SalesOrderByPmt ', JSON.stringify(items));
    return printSalesOrderByPmt(
      title,
      data,
      items,
      vanConfig,
      companyInfo,
      salesMan,
      dateFrom,
      dateTo,
      printTime,
    );
  } else if (type == 'DocumentItems') {
    console.log('items DocumentItems ', JSON.stringify(items));
    return printDocumentItems(
      title,
      data,
      items,
      vanConfig,
      companyInfo,
      salesMan,
      dateFrom,
      dateTo,
      printTime,
    );
  } else if (type == 'DocumentItemsDetails') {
    return printDocumentItemsDetails(
      title,
      data,
      items,
      vanConfig,
      companyInfo,
      salesMan,
      dateFrom,
      dateTo,
      printTime,
    );
  } else if (type == 'PerformanceByArlineItem') {
    return printPerformanceByArlineItem(
      title,
      data,
      items,
      vanConfig,
      companyInfo,
      salesMan,
      dateFrom,
      dateTo,
      printTime,
    );
  } else if (type == 'PeformanceByProductCategory') {
    return printPeformanceByProductCategoryItem(
      title,
      data,
      vanConfig,
      companyInfo,
      salesMan,
      dateFrom,
      dateTo,
      printTime,
    );
  } else if (type == 'SalesOrderBySaleman') {
    return printSalesOrderBySaleman(
      title,
      data,
      vanConfig,
      companyInfo,
      salesMan,
      dateFrom,
      printTime,
    );
  } else if (type == 'StockBalanceByWL') {
    return printStockBalanceByWL(
      title,
      data,
      items,
      vanConfig,
      companyInfo,
      salesMan,
      dateFrom,
      dateTo,
      printTime,
    );
  }
};

const printSalesOrderByCategory = (
  title,
  data,
  items,
  vanConfig,
  companyInfo,
  salesMan,
  dateFrom,
  dateTo,
  printTime,
) => {
  let html = `<br><div style="width: 100%;"><div style="width: 180px;margin: auto;">`;

  html += printHeaderReport(
    title,
    vanConfig.VANCNF_REG_NAME,
    salesMan.SLMN_NAME,
    dateFrom,
    dateTo,
    printTime,
  );
  html += `<div style="font-size: 7px;display: flex;">
                <div style="font-size: 7px;width: 85%;text-align: right;">จำนวน(ชิ้น)</div>
                <div style="font-size: 7px;width: 30%;text-align: right;">แถม</div>
                <div style="font-size: 7px;width: 45%;text-align: right;">ยอดขาย</div>
            </div>`;

  items.map((item, index) => {
    html += `<div style="font-size: 7px;" >วันที่: ${item.GROUP_NAME}</div>`;

    item.ITEMS.map((row, index) => {
      html += `<div style="font-size: 7px;display: flex;">
                <div style="font-size: 7px;width: 70%;" >${row.ICCAT_NAME}</div>
                <div style="font-size: 7px;width: 25%;text-align: right;" >${row.SKUQTY}</div>
                <div style="font-size: 7px;width: 30%;text-align: right;" >${row.SKUQFREE}</div>
                <div style="font-size: 7px;width: 45%;text-align: right;" >${decimal2digitWithCommas(row.SKUAMT)}</div>
            </div>`;
    });

    html += `<div style="font-size: 7px;display: flex;">
                <div style="font-size: 7px;width: 70%;" >รวม</div>
                <div style="font-size: 7px;width: 25%;text-align: right;" >${item.GROUP_SUM_QTY}</div>
                <div style="font-size: 7px;width: 30%;text-align: right;" >${item.GROUP_SUM_QFREE}</div>
                <div style="font-size: 7px;width: 45%;text-align: right;" >${decimal2digitWithCommas(item.GROUP_SUM_AMT)}</div>
            </div>`;

    html +=
      '<div style="font-size: 7px;text-align: center;width: 180px;white-space: nowrap;overflow: hidden;" >---------------------------------------------------------------------------------</div>';
  });

  if (items.length > 1) {
    html += `<div style="font-size: 7px;" >รวมทั้งสิ้น</div>`;

    const sumItems = data.SUMMARY_SECTION;

    sumItems.map((sumItem, index) => {
      html += `<div style="font-size: 7px;display: flex;">
                <div style="font-size: 7px;width: 70%;" >${sumItem.ITEM_NAME}</div>
                <div style="font-size: 7px;width: 25%;text-align: right;" >${sumItem.ITEM_QTY}</div>
                <div style="font-size: 7px;width: 30%;text-align: right;" >${sumItem.ITEM_QFREE}</div>
                <div style="font-size: 7px;width: 45%;text-align: right;" >${decimal2digitWithCommas(sumItem.ITEM_AMT)}</div>
            </div>`;
    });

    html += `<div style="font-size: 7px;display: flex;">
                <div style="font-size: 7px;width: 70%;" >รวม</div>
                <div style="font-size: 7px;width: 25%;text-align: right;" >${data.SUM_QTY}</div>
                <div style="font-size: 7px;width: 30%;text-align: right;" >${data.SUM_QFREE}</div>
                <div style="font-size: 7px;width: 45%;text-align: right;" >${decimal2digitWithCommas(data.SUM_AMT)}</div>
            </div>`;
  }

  html += `</div></div>`;
  return html;
};

const printSalesOrderByProduct = (
  title,
  data,
  items,
  vanConfig,
  companyInfo,
  salesMan,
  dateFrom,
  dateTo,
  printTime,
) => {
  let html = `<br><div style="width: 100%;"><div style="width: 180px;margin: auto;">`;

  html += printHeaderReport(
    title,
    vanConfig.VANCNF_REG_NAME,
    salesMan.SLMN_NAME,
    dateFrom,
    dateTo,
    printTime,
  );

  html += `<div style="font-size: 7px;display: flex;">
                <div style="font-size: 7px;width: 35%;text-align: right;">จำนวนขาย</div>
                <div style="font-size: 7px;width: 25%;text-align: right;" >แถม</div>
                <div style="font-size: 7px;width: 40%;text-align: right;" >ยอดขาย</div>
            </div>`;

  //html += `<div style="font-size: 7px;text-align: right;" >ยกเว้น #</div>`;

  items.map((item, index) => {
    html += `<div style="font-size: 7px;" >วันที่: ${item.GROUP_NAME}</div>`;

    item.ITEMS.map((row, index) => {
      let ignoreVate = row.VAT_EXE == 'Y' ? '#' : '';

      html += `<div style="font-size: 7px;text-align: left;" >${row.SKU_NAME}</div>`;

      html += `<div style="font-size: 7px;display: flex;">
                <div style="font-size: 7px;width: 35%;text-align: right;" >${row.SKUSELLQTY}</div>
                <div style="font-size: 7px;width: 25%;text-align: right;" >${row.SKUFREEQTY}</div>
                <div style="font-size: 7px;width: 40%;text-align: right;" >${decimal2digitWithCommas(row.SKUAMT)}</div>
            </div>`;
    });

    html += `<div style="font-size: 7px;display: flex;">
                <div style="font-size: 7px;width: 10%;" >รวม</div>
                <div style="font-size: 7px;width: 25%;text-align: right;" >${item.GROUP_SUM_QTY}</div>
                <div style="font-size: 7px;width: 25%;text-align: right;" >${item.GROUP_SUM_FREE_QTY}</div>
                <div style="font-size: 7px;width: 40%;text-align: right;" >${decimal2digitWithCommas(item.GROUP_SUM_AMT)}</div>
            </div>`;

    html +=
      '<div style="font-size: 7px;text-align: center;width: 180px;white-space: nowrap;overflow: hidden;" >---------------------------------------------------------------------------------</div>';
  });

  if (items.length > 1) {
    html += `<div style="font-size: 7px;" >รวมทั้งสิ้น</div>`;

    const sumItems = data.SUMMARY_SECTION;

    sumItems.map((sumItem, index) => {
      let ignoreVate = sumItem.ITEM_VAT_EXE == 'Y' ? '#' : '';

      html += `<div style="font-size: 7px;" >${sumItem.ITEM_NAME}</div>`;

      html += `<div style="font-size: 7px;display: flex;">
                <div style="font-size: 7px;width: 35%;text-align: right;" >${sumItem.ITEM_SELL_QTY}</div>
                <div style="font-size: 7px;width: 25%;text-align: right;" >${sumItem.ITEM_FREE_QTY}</div>
                <div style="font-size: 7px;width: 40%;text-align: right;" >${decimal2digitWithCommas(sumItem.ITEM_AMT)}</div>
            </div>`;
    });

    html += `<div style="font-size: 7px;display: flex;">
            <div style="font-size: 7px;width: 10%;" >รวม</div>
            <div style="font-size: 7px;width: 25%;text-align: right;" >${data.SUM_QTY}</div>
            <div style="font-size: 7px;width: 25%;text-align: right;" >${data.SUM_FREE_QTY}</div>
            <div style="font-size: 7px;width: 40%;text-align: right;" >${decimal2digitWithCommas(data.SUM_AMT)}</div>
        </div>`;
  }

  html += `</div></div>`;

  return html;
};

const printSalesOrderByArline = (
  title,
  data,
  items,
  vanConfig,
  companyInfo,
  salesMan,
  dateFrom,
  dateTo,
  printTime,
) => {
  let html = `<br><div style="width: 100%;"><div style="width: 180px;margin: auto;">`;

  html += printHeaderReport(
    title,
    vanConfig.VANCNF_REG_NAME,
    salesMan.SLMN_NAME,
    dateFrom,
    dateTo,
    printTime,
  );

  html += `<div style="font-size: 7px;display: flex;">
                <div style="font-size: 7px;width: 85%;text-align: right;">จำนวน(ชิ้น)</div>
                <div style="font-size: 7px;width: 30%;text-align: right;">แถม</div>
                <div style="font-size: 7px;width: 45%;text-align: right;">ยอดขาย</div>
            </div>`;

  items.map((item, index) => {
    html += `<div style="font-size: 7px;" >วันที่: ${item.GROUP_NAME}</div>`;

    item.ITEMS.map((row, index) => {
      html += `<div style="font-size: 7px;display: flex;">
                <div style="font-size: 7px;width: 70%;" >${row.ARL_NAME}</div>
                <div style="font-size: 7px;width: 25%;text-align: right;" >${row.SKUSELLQTY}</div>
                <div style="font-size: 7px;width: 30%;text-align: right;" >${row.SKUQFREE}</div>
                <div style="font-size: 7px;width: 45%;text-align: right;" >${decimal2digitWithCommas(row.SKUAMT)}</div>
            </div>`;
    });

    html += `<div style="font-size: 7px;display: flex;">
                <div style="font-size: 7px;width: 70%;" >รวม</div>
                <div style="font-size: 7px;width: 25%;text-align: right;" >${item.GROUP_SUM_QTY}</div>
                <div style="font-size: 7px;width: 30%;text-align: right;" >${item.GROUP_SUM_QFREE}</div>
                <div style="font-size: 7px;width: 45%;text-align: right;" >${decimal2digitWithCommas(item.GROUP_SUM_AMT)}</div>
            </div>`;

    html +=
      '<div style="font-size: 7px;text-align: center;width: 180px;white-space: nowrap;overflow: hidden;" >---------------------------------------------------------------------------------</div>';
  });

  if (items.length > 1) {
    html += `<div style="font-size: 7px;" >รวมทั้งสิ้น</div>`;

    const sumItems = data.SUMMARY_SECTION;

    sumItems.map((sumItem, index) => {
      html += `<div style="font-size: 7px;display: flex;">
                <div style="font-size: 7px;width: 70%;" >${sumItem.ITEM_NAME}</div>
                <div style="font-size: 7px;width: 25%;text-align: right;" >${sumItem.ITEM_QTY}</div>
                <div style="font-size: 7px;width: 30%;text-align: right;" >${sumItem.ITEM_QFREE}</div>
                <div style="font-size: 7px;width: 45%;text-align: right;" >${decimal2digitWithCommas(sumItem.ITEM_AMT)}</div>
            </div>`;
    });

    html += `<div style="font-size: 7px;display: flex;">
            <div style="font-size: 7px;width: 70%;" >รวม</div>
            <div style="font-size: 7px;width: 25%;text-align: right;" >${data.SUM_QTY}</div>
            <div style="font-size: 7px;width: 30%;text-align: right;" >${data.SUM_QFREE}</div>
            <div style="font-size: 7px;width: 45%;text-align: right;" >${decimal2digitWithCommas(data.SUM_AMT)}</div>
        </div>`;
  }

  html += `</div></div>`;

  return html;
};

const printSalesOrderByDocType = (
  title,
  data,
  items,
  vanConfig,
  companyInfo,
  salesMan,
  dateFrom,
  dateTo,
  printTime,
) => {
  let html = `<br><div style="width: 100%;"><div style="width: 180px;margin: auto;">`;

  html += printHeaderReport(
    title,
    vanConfig.VANCNF_REG_NAME,
    salesMan.SLMN_NAME,
    dateFrom,
    dateTo,
    printTime,
  );

  html += `<div style="font-size: 7px;display: flex;">
                <div style="font-size: 7px;width: 10%;">ประเภท</div>
                <div style="font-size: 7px;width: 47%;text-align: right;" >จำนวนบิล</div>
                <div style="font-size: 7px;width: 43%;text-align: right;" >ยอดขาย</div>
            </div>`;

  items.map((item, index) => {
    html += `<div style="font-size: 7px;" >วันที่: ${item.GROUP_NAME}</div>`;

    item.ITEMS.map((row, index) => {
      html += `<div style="font-size: 7px;display: flex;">
                <div style="font-size: 7px;width: 30%;" >${row.DOCGROUP}</div>
                <div style="font-size: 7px;width: 27%;text-align: right;" >${row.DOCOUNT}</div>
                <div style="font-size: 7px;width: 43%;text-align: right;" >${decimal2digitWithCommas(row.SKUAMT)}</div>
            </div>`;
    });

    html += `<div style="font-size: 7px;display: flex;">
                <div style="font-size: 7px;width: 30%;" >รวม</div>
                <div style="font-size: 7px;width: 27%;text-align: right;" >${item.GROUP_SUMDOCOUNT}</div>
                <div style="font-size: 7px;width: 43%;text-align: right;" >${decimal2digitWithCommas(item.GROUP_SUM_AMT)}</div>
            </div>`;

    html +=
      '<div style="font-size: 7px;text-align: center;width: 180px;white-space: nowrap;overflow: hidden;" >---------------------------------------------------------------------------------</div>';
  });

  if (items.length > 1) {
    html += `<div style="font-size: 7px;" >รวมทั้งสิ้น</div>`;

    const sumItems = data.SUMMARY_SECTION;

    sumItems.map((sumItem, index) => {
      html += `<div style="font-size: 7px;display: flex;">
                <div style="font-size: 7px;width: 30%;" >${sumItem.ITEM_NAME}</div>
                <div style="font-size: 7px;width: 27%;text-align: right;" >${sumItem.ITEM_DO_COUNT}</div>
                <div style="font-size: 7px;width: 43%;text-align: right;" >${decimal2digitWithCommas(sumItem.ITEM_AMT)}</div>
            </div>`;
    });

    html += `<div style="font-size: 7px;display: flex;">
                <div style="font-size: 7px;width: 30%;" >รวม</div>
                <div style="font-size: 7px;width: 27%;text-align: right;" >${data.SUM_DOCOUNT}</div>
                <div style="font-size: 7px;width: 43%;text-align: right;" >${decimal2digitWithCommas(data.SUM_AMT)}</div>
            </div>`;
  }

  html += `</div></div>`;

  return html;
};

const printSalesOrderByPmt = (
  title,
  data,
  items,
  vanConfig,
  companyInfo,
  salesMan,
  dateFrom,
  dateTo,
  printTime,
) => {
  let html = `<br><div style="width: 100%;"><div style="width: 180px;margin: auto;">`;

  html += printHeaderReport(
    title,
    vanConfig.VANCNF_REG_NAME,
    salesMan.SLMN_NAME,
    dateFrom,
    dateTo,
    printTime,
  );

  html += `<div style="font-size: 7px;display: flex;">
                <div style="font-size: 7px;width: 50%;">ประเภทชำระ</div>
                <div style="font-size: 7px;width: 50%;text-align: right;" >ยอดขาย</div>
            </div>`;

  items.map((item, index) => {
    html += `<div style="font-size: 7px;" >วันที่: ${item.GROUP_NAME}</div>`;

    item.ITEMS.map((row, index) => {
      html += `<div style="font-size: 7px;display: flex;">
                <div style="font-size: 7px;width: 50%;" >${row.PMT_NAME}</div>
                <div style="font-size: 7px;width: 50%;text-align: right;" >${decimal2digitWithCommas(row.PMTAMT)}</div>
            </div>`;
    });

    html += `<div style="font-size: 7px;display: flex;">
                <div style="font-size: 7px;width: 10%;" >รวม</div>
                <div style="font-size: 7px;width: 90%;text-align: right;" >${decimal2digitWithCommas(item.GROUP_AMT)}</div>
            </div>`;

    html +=
      '<div style="font-size: 7px;text-align: center;width: 180px;white-space: nowrap;overflow: hidden;" >---------------------------------------------------------------------------------</div>';
  });

  if (items.length > 1) {
    html += `<div style="font-size: 7px;" >รวมทั้งสิ้น</div>`;

    const sumItems = data.SUMMARY_SECTION;

    sumItems.map((sumItem, index) => {
      html += `<div style="font-size: 7px;display: flex;">
                <div style="font-size: 7px;width: 50%;" >${sumItem.ITEM_NAME}</div>
                <div style="font-size: 7px;width: 50%;text-align: right;" >${decimal2digitWithCommas(sumItem.ITEM_AMT)}</div>
            </div>`;
    });

    html += `<div style="font-size: 7px;display: flex;">
                <div style="font-size: 7px;width: 50%;">รวม</div>
                <div style="font-size: 7px;width: 50%;text-align: right;" >${decimal2digitWithCommas(data.SUM_AMT)}</div>
            </div>`;
  }

  html += `</div></div>`;

  return html;
};

const printDocumentItems = (
  title,
  data,
  items,
  vanConfig,
  companyInfo,
  salesMan,
  dateFrom,
  dateTo,
  printTime,
) => {
  let html = `<br><div style="width: 100%;"><div style="width: 180px;margin: auto;">`;
  console.log('data ', JSON.stringify(data));
  html += printHeaderReport(
    title,
    vanConfig.VANCNF_REG_NAME,
    salesMan.SLMN_NAME,
    dateFrom,
    dateTo,
    printTime,
  );

  html += `<div style="font-size: 7px;display: flex;">
                <div style="font-size: 7px;width: 44%;">เลขที่</div>
                <div style="font-size: 7px;width: 20%;" >เอกสาร</div>
                <div style="font-size: 7px;width: 36%;">ชำระ</div>
            </div>`;

  html += `<div style="font-size: 7px;display: flex;">
            <div style="font-size: 7px;width: 7%;"></div>
            <div style="font-size: 7px;width: 40%;">ชื่อลูกค้า</div>
            <div style="font-size: 7px;width: 53%;text-align: right;">ยอดเงิน</div>
        </div>`;

  html +=
    '<div style="font-size: 7px;text-align: center;width: 180px;white-space: nowrap;overflow: hidden;" >---------------------------------------------------------------------------------</div>';

  items.map((item, index) => {
    html += `<div style="font-size: 7px;" >วันที่: ${item.GROUP_NAME}</div>`;

    item.ITEMS.map((row, index) => {
      html += `<div style="font-size: 7px;" >${row.DOCGROUP}</div>`;

      row.ITEMS.map((deepRowLevel1, index) => {
        html += `<div style="font-size: 7px;display: flex;">
                    <div style="font-size: 7px;width: 50%;">${deepRowLevel1.DI_REF}</div>
                    <div style="font-size: 7px;width: 50%;text-align: right;">${decimal2digitWithCommas(deepRowLevel1.ARD_A_AMT)}</div>
                </div>`;

        html += `<div style="font-size: 7px;" >${deepRowLevel1.AR_NAME}</div>`;
      });
    });

    html += `<div style="font-size: 7px;display: flex;">
                <div style="font-size: 7px;width: 30%;" >รวมทั้งสิ้น</div>
                <div style="font-size: 7px;width: 70%;text-align: right;" >${decimal2digitWithCommas(item.GROUP_AMT)}</div>
            </div>`;

    html +=
      '<div style="font-size: 7px;text-align: center;width: 180px;white-space: nowrap;overflow: hidden;" >---------------------------------------------------------------------------------</div>';
  });

  if (items.length > 1) {
    html += `<div style="font-size: 7px;" >รวม</div>`;

    const sumItems = data.SUMMARY_SECTION.GROUP;
    console.log(JSON.stringify(data));
    sumItems.map((sumItem, index) => {
      console.log('sumItem=>', sumItem);
      html += `<div style="font-size: 7px;display: flex;">
                <div style="font-size: 7px;width: 50%;" >${sumItem.GROUP_NAME}</div>
                <div style="font-size: 7px;width: 50%;text-align: right;" >${decimal2digitWithCommas(sumItem.GROUP_ITEM_AMT)}</div>
            </div>`;
    });

    html += `<div style="font-size: 7px;display: flex;">
                <div style="font-size: 7px;width: 50%;">รวมทั้งสิ้น</div>
                <div style="font-size: 7px;width: 50%;text-align: right;" >${decimal2digitWithCommas(data.SUMMARY_SECTION.SUM_AMT)}</div>
            </div>`;
  }

  html += `</div></div>`;

  return html;
};
const printDocumentItemsDetails = (
  title,
  data,
  items,
  vanConfig,
  companyInfo,
  salesMan,
  dateFrom,
  dateTo,
  printTime,
) => {
  let html = `<br><div style="width: 100%;"><div style="width: 180px;margin: auto;">`;

  html += printHeaderReport(
    title,
    vanConfig.VANCNF_REG_NAME,
    salesMan.SLMN_NAME,
    dateFrom,
    dateTo,
    printTime,
  );

  html += `<div style="font-size: 7px;display: flex;">
              <div style="font-size: 7px;width: 7%;"></div>
              <div style="font-size: 7px;width: 40%;">ชื่อลูกค้า</div>
              <div style="font-size: 7px;width: 53%;text-align: right;">ยอดเงิน</div>
          </div>`;

  html +=
    '<div style="font-size: 7px;text-align: center;width: 180px;white-space: nowrap;overflow: hidden;" >---------------------------------------------------------------------------------</div>';
  console.log('ITEM ', JSON.stringify(items));
  items.map((item, index) => {
    html += `<div style="font-size: 7px;" >วันที่: ${item.GROUP_NAME}</div>`;

    item.ITEMS.map((row, index) => {
      html += `<div style="font-size: 7px;" >${row.DOCGROUP}</div>`;

      row.ITEMS.map((deepRowLevel1, index) => {
        html += `<div style="font-size: 7px;display: flex;">
                      <div style="font-size: 7px;width: 50%;">${deepRowLevel1.DOCGROUP}</div>
                      
                  </div>`;

        html += `<div style="font-size: 7px;" >${deepRowLevel1.AR_NAME}</div>`;
        html += `<div style="font-size: 7px;display: flex;">
        <div style="font-size: 7px;width: 40%;" >รหัสลูกค้า</div>
        <div style="font-size: 7px;width: 60%;text-align: right;" >${deepRowLevel1.AR_CODE}</div>
        </div>`;

        deepRowLevel1.ITEMS.map((deepRowLevel2, index) => {
          html += `<div style="font-size: 7px;" >${deepRowLevel2.TRD_SH_NAME}</div>`;
          html += `<div style="font-size: 7px;display: flex;">
                      <div style="font-size: 7px;width: 25%;">จำนวน</div>
                      <div style="font-size: 7px;width: 25%;">${deepRowLevel2.TRD_SH_QTY}</div>
                      <div style="font-size: 7px;width: 25%;">แถม</div>
                      <div style="font-size: 7px;width: 25%; text-align: right;">${deepRowLevel2.TRD_Q_FREE}</div>
                  </div>`;
          html += `<div style="font-size: 7px;display: flex;">
        <div style="font-size: 7px;width: 40%;" >ราคาต่อหน่วย</div>
        <div style="font-size: 7px;width: 60%;text-align: right;" >${decimal2digitWithCommas(deepRowLevel2.TRD_SH_UPRC)}</div>
        </div>`;
        });

        html += `<div style="font-size: 7px;display: flex;">
        <div style="font-size: 7px;width: 40%;" >มูลค่ารวมก่อนลด</div>
        <div style="font-size: 7px;width: 60%;text-align: right;" >${decimal2digitWithCommas(deepRowLevel1.ARD_G_KEYIN)}</div>
        </div>`;
        html += `<div style="font-size: 7px;display: flex;">
        <div style="font-size: 7px;width: 40%;" >ส่วนลดท้ายบิล</div>
        <div style="font-size: 7px;width: 60%;text-align: right;" >${decimal2digitWithCommas(deepRowLevel1.ARD_TDSC_KEYINV)}</div>
        </div>`;
        html += `<div style="font-size: 7px;display: flex;">
        <div style="font-size: 7px;width: 40%;" >ยอดสินค้า</div>
        <div style="font-size: 7px;width: 60%;text-align: right;" >${decimal2digitWithCommas(deepRowLevel1.SUM_TRD_B_SELL)}</div>
        </div>`;
        html += `<div style="font-size: 7px;display: flex;">
        <div style="font-size: 7px;width: 40%;" >ยอด ภพ.</div>
        <div style="font-size: 7px;width: 60%;text-align: right;" >${decimal2digitWithCommas(deepRowLevel1.SUM_TRD_B_VAT)}</div>
        </div>`;
        html += `<div style="font-size: 7px;display: flex;">
        <div style="font-size: 7px;width: 40%;" >ยอด สุทธิ</div>
        <div style="font-size: 7px;width: 60%;text-align: right;" >${decimal2digitWithCommas(deepRowLevel1.ARD_A_AMT)}</div>
        </div>`;
      });
      // html += `<div style="font-size: 7px;display: flex;">
      // <div style="font-size: 7px;width: 40%;" >ยอดรวมทั้งหมด</div>
      // <div style="font-size: 7px;width: 60%;text-align: right;" >${row.SUM_ALL_ARD_A_AMT}</div>
      // </div>`;
      html +=
        '<div style="font-size: 7px;text-align: center;width: 180px;white-space: nowrap;overflow: hidden;" >---------------------------------------------------------------------------------</div>';
    });
  });

  // if (items.length > 1) {
  //   html += `<div style="font-size: 7px;" >รวม</div>`;

  //   const sumItems = data.SUMMARY_SECTION.ITEMS;

  //   sumItems.map((sumItem, index) => {
  //     html += `<div style="font-size: 7px;display: flex;">
  //                 <div style="font-size: 7px;width: 50%;" >${sumItem.ITEM_NAME}</div>
  //                 <div style="font-size: 7px;width: 50%;text-align: right;" >${sumItem.ITEM_AMT}</div>
  //             </div>`;
  //   });

  //   html += `<div style="font-size: 7px;display: flex;">
  //                 <div style="font-size: 7px;width: 50%;">รวมทั้งสิ้น</div>
  //                 <div style="font-size: 7px;width: 50%;text-align: right;" >${data.SUM_AMT}</div>
  //             </div>`;
  // }

  html += `</div></div>`;

  return html;
};

const printPerformanceByArlineItem = (
  title,
  data,
  items,
  vanConfig,
  companyInfo,
  salesMan,
  dateFrom,
  dateTo,
  printTime,
) => {
  let html = `<br><div style="width: 100%;"><div style="width: 180px;margin: auto;">`;

  html += printHeaderReport(
    title,
    vanConfig.VANCNF_REG_NAME,
    salesMan.SLMN_NAME,
    dateFrom,
    dateTo,
    printTime,
  );

  html += `<div style="font-size: 7px;display: flex;">
                <div style="font-size: 7px;width: 44%;text-align: center;">สายลูกค้า</div>
                <div style="font-size: 7px;width: 22%;text-align: center;" >จำนวน</div>
                <div style="font-size: 7px;width: 22%;text-align: center;">จำนวน</div>
                <div style="font-size: 7px;width: 12%;text-align: center;">จำนวน</div>
            </div>`;

  html += `<div style="font-size: 7px;display: flex;">
        <div style="font-size: 7px;width: 44%;"></div>
        <div style="font-size: 7px;width: 22%;text-align: center;" >ลูกค้า</div>
        <div style="font-size: 7px;width: 22%;text-align: center;">ขาย</div>
        <div style="font-size: 7px;width: 12%;text-align: center;">เยี่ยม</div>
    </div>`;

  html +=
    '<div style="font-size: 7px;text-align: center;width: 180px;white-space: nowrap;overflow: hidden;" >---------------------------------------------------------------------------------</div>';

  const deepRowLevel1 = data.RPT_DATA.RESULT;

  deepRowLevel1.map((rowLevel1, index) => {
    html += `<div style="font-size: 7px;" >วันที่: ${rowLevel1.GROUP_NAME}</div>`;

    rowLevel1.ITEMS.map((deepRowLevel2, index) => {
      deepRowLevel2.ITEMS.map((deepRowLevel3, index) => {
        html += `<div style="font-size: 7px;display: flex;">
                        <div style="font-size: 7px;width: 35%;">${deepRowLevel3.ARL_NAME
          }</div>
                        <div style="font-size: 7px;width: 20%;text-align: right;" >${parseInt(
            deepRowLevel3.COUNTAR,
          )
            .toFixed(2)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
                        <div style="font-size: 7px;width: 22%;text-align: right;">${parseInt(
              deepRowLevel3.COUNTSELLBOOK,
            )
            .toFixed(2)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
                        <div style="font-size: 7px;width: 23%;text-align: right;">${parseInt(
              deepRowLevel3.COUNTVISIT,
            )
            .toFixed(2)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
                    </div>`;
      });
    });

    html += `<div style="font-size: 7px;display: flex;">
                <div style="font-size: 7px;width: 35%;">รวม</div>
                <div style="font-size: 7px;width: 20%;text-align: right;" >${parseInt(
      rowLevel1.SUM_COUNTAR,
    )
        .toFixed(2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
                <div style="font-size: 7px;width: 22%;text-align: right;">${parseInt(
          rowLevel1.SUM_COUNTSELLBOOK,
        )
        .toFixed(2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
                <div style="font-size: 7px;width: 23%;text-align: right;">${parseInt(
          rowLevel1.SUM_COUNTVISIT,
        )
        .toFixed(2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
            </div>`;

    html += `<div style="font-size: 7px;" >แสดงในรูปแบบ: % **</div>`;

    rowLevel1.ITEMS.map((deepRowLevel2, index) => {
      deepRowLevel2.ITEMS_PERCENT.map((deepRowLevel3, index) => {
        html += `<div style="font-size: 7px;display: flex;">
                        <div style="font-size: 7px;width: 35%;">${deepRowLevel3.ARL_NAME}</div>
                        <div style="font-size: 7px;width: 42%;text-align: right;">${deepRowLevel3.COUNTSELLBOOK_PERCENT}%</div>
                        <div style="font-size: 7px;width: 23%;text-align: right;">${deepRowLevel3.COUNTVISIT_PERCENT}%</div>
                    </div>`;
      });
    });

    html += `<div style="font-size: 7px;display: flex;">
                <div style="font-size: 7px;width: 35%;">รวม</div>
                <div style="font-size: 7px;width: 42%;text-align: right;">${rowLevel1.SUM_COUNTSELLBOOK_PERCENT}%</div>
                <div style="font-size: 7px;width: 23%;text-align: right;">${rowLevel1.SUM_COUNTVISIT_PERCENT}%</div>
            </div>`;

    html +=
      '<div style="font-size: 7px;text-align: center;width: 180px;white-space: nowrap;overflow: hidden;" >---------------------------------------------------------------------------------</div>';
  });

  if (deepRowLevel1.length > 1) {
    html += `<div style="font-size: 7px;" >รวมทั้งสิ้น</div>`;

    const sumItems = data.SUMMARY_SECTION;

    sumItems.map((sumItem, index) => {
      html += `<div style="font-size: 7px;display: flex;">
                <div style="font-size: 7px;width: 35%;" >${sumItem.ITEM_NAME
        }</div>
                <div style="font-size: 7px;width: 20%;text-align: right;" >${parseInt(
          sumItem.ITEM_COUNTAR,
        )
          .toFixed(2)
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
                <div style="font-size: 7px;width: 22%;text-align: right;" >${parseInt(
            sumItem.ITEM_COUNTSELLBOOK,
          )
          .toFixed(2)
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
                <div style="font-size: 7px;width: 23%;text-align: right;" >${parseInt(
            sumItem.ITEM_COUNTVISIT,
          )
          .toFixed(2)
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
            </div>`;
    });

    html += `<div style="font-size: 7px;display: flex;">
                <div style="font-size: 7px;width: 35%;" >รวม</div>
                <div style="font-size: 7px;width: 20%;text-align: right;" >${parseInt(
      data.SUMMARY_SECTION.SUM_COUNTAR,
    )
        .toFixed(2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
                <div style="font-size: 7px;width: 22%;text-align: right;" >${parseInt(
          data.SUMMARY_SECTION.SUM_COUNTSELLBOOK,
        )
        .toFixed(2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
                <div style="font-size: 7px;width: 23%;text-align: right;" >${parseInt(
          data.SUMMARY_SECTION.SUM_COUNTVISIT,
        )
        .toFixed(2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
            </div>`;

    html += `<div style="font-size: 7px;" >แสดงในรูปแบบ: % **</div>`;

    sumItems.map((sumItem, index) => {
      html += `<div style="font-size: 7px;display: flex;">
                <div style="font-size: 7px;width: 55%;" >${sumItem.ITEM_NAME}</div>
                <div style="font-size: 7px;width: 22%;text-align: right;" >${sumItem.ITEM_COUNTSELLBOOK_PERCENT}%</div>
                <div style="font-size: 7px;width: 23%;text-align: right;" >${sumItem.ITEM_COUNTVISIT_PERCENT}%</div>
            </div>`;
    });

    html += `<div style="font-size: 7px;display: flex;">
                <div style="font-size: 7px;width: 55%;" >รวม</div>
                <div style="font-size: 7px;width: 22%;text-align: right;" >${data.SUMMARY_SECTION.SUM_COUNTSELLBOOK_PERCENT}%</div>
                <div style="font-size: 7px;width: 23%;text-align: right;" >${data.SUMMARY_SECTION.SUM_COUNTVISIT_PERCENT}%</div>
            </div>`;
  }

  html += `</div></div>`;

  return html;
};

const printPeformanceByProductCategoryItem = (
  title,
  data,
  vanConfig,
  companyInfo,
  salesMan,
  dateFrom,
  dateTo,
  printTime,
) => {
  let html = `<br><div style="width: 100%;"><div style="width: 180px;margin: auto;">`;
  console.log('vanConfig', vanConfig);

  html += printHeaderReport(
    title,
    vanConfig.VANCNF_REG_NAME,
    salesMan.SLMN_NAME,
    dateFrom,
    dateTo,
    printTime,
  );

  html += `<div style="font-size: 7px;display: flex;">
                <div style="font-size: 7px;width: 70%;">หมวดสินค้า</div>
                <div style="font-size: 7px;width: 15%;" >ทั้งหมด</div>
                <div style="font-size: 7px;width: 15%;text-align: right;">ชนิดขาย</div>
            </div>`;

  html +=
    '<div style="font-size: 7px;text-align: center;width: 180px;white-space: nowrap;overflow: hidden;" >---------------------------------------------------------------------------------</div>';

  const deepRowLevel1 = data.RPT_DATA.RESULT;

  deepRowLevel1.map((rowLevel1, index) => {
    html += `<div style="font-size: 7px;" >วันที่: ${rowLevel1.GROUP_NAME}</div>`;

    rowLevel1.ITEMS.map((deepRowLevel2, index) => {
      html += `<div style="font-size: 7px;display: flex;">
                    <div style="font-size: 7px;width: 70%;">${deepRowLevel2.ICDEPT_THAIDESC
        }</div>
                    <div style="font-size: 7px;width: 15%;text-align: right;" >${parseInt(
          deepRowLevel2.COUNTSKU,
        )
          .toFixed(2)
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
                    <div style="font-size: 7px;width: 15%;text-align: right;">${parseInt(
            deepRowLevel2.COUNTSKM,
          )
          .toFixed(2)
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
                </div>`;
    });

    html += `<div style="font-size: 7px;display: flex;">
            <div style="font-size: 7px;width: 70%;">รวม</div>
            <div style="font-size: 7px;width: 15%;text-align: right;" >${parseInt(
      rowLevel1.SUM_COUNTSKU,
    )
        .toFixed(2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
            <div style="font-size: 7px;width: 15%;text-align: right;">${parseInt(
          rowLevel1.SUM_COUNTSKM,
        )
        .toFixed(2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
        </div>`;

    html += `<div style="font-size: 7px;" >แสดงในรูปแบบ: % **</div>`;

    rowLevel1.ITEMS_PERCENT.map((deepRowLevel2, index) => {
      html += `<div style="font-size: 7px;display: flex;">
                    <div style="font-size: 7px;width: 70%;">${deepRowLevel2.ICDEPT_THAIDESC}</div>
                    <div style="font-size: 7px;width: 30%;text-align: right;">${deepRowLevel2.COUNTSKM_PERCENT}%</div>
                </div>`;
    });

    html += `<div style="font-size: 7px;display: flex;">
                <div style="font-size: 7px;width: 70%;">รวม</div>
                <div style="font-size: 7px;width: 30%;text-align: right;">${rowLevel1.SUM_COUNTSKM_PERCENT}%</div>
            </div>`;

    html +=
      '<div style="font-size: 7px;text-align: center;width: 180px;white-space: nowrap;overflow: hidden;" >---------------------------------------------------------------------------------</div>';
  });

  if (deepRowLevel1.length > 1) {
    html += `<div style="font-size: 7px;" >รวมทั้งสิ้น</div>`;

    const sumItems = data.SUMMARY_SECTION;

    sumItems.map((sumItem, index) => {
      html += `<div style="font-size: 7px;display: flex;">
                <div style="font-size: 7px;width: 70%;" >${sumItem.ITEM_NAME
        }</div>
                <div style="font-size: 7px;width: 15%;text-align: right;" >${parseInt(
          sumItem.ITEM_COUNTSKU,
        )
          .toFixed(2)
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
                <div style="font-size: 7px;width: 15%;text-align: right;" >${parseInt(
            sumItem.ITEM_COUNTSKM,
          )
          .toFixed(2)
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
            </div>`;
    });

    html += `<div style="font-size: 7px;display: flex;">
                <div style="font-size: 7px;width: 70%;" ></div>
                <div style="font-size: 7px;width: 15%;text-align: right;" >${parseInt(
      data.SUMMARY_SECTION.SUM_COUNTSKU,
    )
        .toFixed(2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
                <div style="font-size: 7px;width: 15%;text-align: right;" >${parseInt(
          data.SUMMARY_SECTION.SUM_COUNTSKM,
        )
        .toFixed(2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
            </div>`;

    html += `<div style="font-size: 7px;" >แสดงในรูปแบบ: % **</div>`;

    sumItems.map((sumItem, index) => {
      html += `<div style="font-size: 7px;display: flex;">
                <div style="font-size: 7px;width: 70%;" >${sumItem.ITEM_NAME}</div>
                <div style="font-size: 7px;width: 30%;text-align: right;" >${sumItem.ITEM_COUNTSKM_PERCENT}%</div>
            </div>`;
    });

    html += `<div style="font-size: 7px;display: flex;">
                <div style="font-size: 7px;width: 70%;" >รวม</div>
                <div style="font-size: 7px;width: 30%;text-align: right;" >${data.SUMMARY_SECTION.SUM_COUNTSKM_PERCENT}%</div>
            </div>`;
  }

  html += `</div></div>`;

  return html;
};

const printSalesOrderBySaleman = (
  title,
  data,
  vanConfig,
  companyInfo,
  salesMan,
  dateFrom,
  dateTo,
  printTime,
) => {
  let html = `<br><div style="width: 100%;"><div style="width: 180px;margin: auto;">`;

  html += printHeaderReportPatternC(
    title,
    vanConfig.VANCNF_REG_NAME,
    salesMan.SLMN_NAME,
    dateFrom,
    dateTo,
    printTime,
  );

  html += `<div style="font-size: 7px;display: flex;">
                <div style="font-size: 7px;width: 50%;" >บิลเริ่มต้น</div>
                <div style="font-size: 7px;width: 50%;text-align: right;" >${data.F_TIME}</div>
            </div>`;

  html += `<div style="font-size: 7px;display: flex;">
            <div style="font-size: 7px;width: 50%;" >บิลสุดท้าย</div>
            <div style="font-size: 7px;width: 50%;text-align: right;" >${data.E_TIME}</div>
        </div>`;

  html +=
    '<div style="font-size: 7px;text-align: center;width: 180px;white-space: nowrap;overflow: hidden;" >---------------------------------------------------------------------------------</div>';

  const book = data.BOOK;

  html += `<div style="font-size: 7px;display: flex;">
            <div style="font-size: 7px;width: 50%;" >ยอดจองรวม</div>
            <div style="font-size: 7px;width: 50%;text-align: right;" >${decimal2digitWithCommas(book.SUM_AMT)}</div>
        </div>`;

  html += `<div style="font-size: 7px;display: flex;">
            <div style="font-size: 7px;width: 50%;" >ลดต่อรายการรวม</div>
            <div style="font-size: 7px;width: 50%;text-align: right;" >${decimal2digitWithCommas(book.SUM_ITEM_DSC)}</div>
        </div>`;

  html += `<div style="font-size: 7px;display: flex;">
            <div style="font-size: 7px;width: 50%;" >จำนวนบิลรวม</div>
            <div style="font-size: 7px;width: 50%;text-align: right;" >${book.COUNT_DOC}</div>
        </div>`;

  html += `<div style="font-size: 7px;display: flex;">
            <div style="font-size: 7px;width: 50%;" >จำนวนรายการจอง</div>
            <div style="font-size: 7px;width: 50%;text-align: right;" >${book.SUM_PCS}</div>
        </div>`;

  html += `<div style="font-size: 7px;display: flex;">
            <div style="font-size: 7px;width: 50%;" >จำนวนชิ้นรวม</div>
            <div style="font-size: 7px;width: 50%;text-align: right;" >${book.SUM_QTY}</div>
        </div>`;

  html += `<div style="font-size: 7px;display: flex;">
            <div style="font-size: 7px;width: 50%;" >จำนวนชิ้น (แถม)</div>
            <div style="font-size: 7px;width: 50%;text-align: right;" >${book.SUM_FREE_ITEM_QTY}</div>
        </div>`;

  html +=
    '<div style="font-size: 7px;text-align: center;width: 180px;white-space: nowrap;overflow: hidden;" >---------------------------------------------------------------------------------</div>';

  const sell = data.SELL;

  html += `<div style="font-size: 7px;display: flex;">
            <div style="font-size: 7px;width: 50%;" >ยอดขายรวม</div>
            <div style="font-size: 7px;width: 50%;text-align: right;" >${decimal2digitWithCommas(sell.SUM_AMT)}</div>
        </div>`;

  html += `<div style="font-size: 7px;display: flex;">
            <div style="font-size: 7px;width: 50%;" >ลดต่อรายการรวม</div>
            <div style="font-size: 7px;width: 50%;text-align: right;" >${decimal2digitWithCommas(sell.SUM_ITEM_DSC)}</div>
        </div>`;

  html += `<div style="font-size: 7px;display: flex;">
            <div style="font-size: 7px;width: 50%;" >ลดท้ายบิลรวม</div>
            <div style="font-size: 7px;width: 50%;text-align: right;" >${decimal2digitWithCommas(sell.SUM_BILL_DSC)}%</div>
        </div>`;

  html += `<div style="font-size: 7px;display: flex;">
            <div style="font-size: 7px;width: 50%;" >จำนวนบิลรวม</div>
            <div style="font-size: 7px;width: 50%;text-align: right;" >${sell.COUNT_DOC}</div>
        </div>`;

  html += `<div style="font-size: 7px;display: flex;">
            <div style="font-size: 7px;width: 50%;" >จำนวนรายการขาย</div>
            <div style="font-size: 7px;width: 50%;text-align: right;" >${sell.SUM_PCS}</div>
        </div>`;

  html += `<div style="font-size: 7px;display: flex;">
            <div style="font-size: 7px;width: 50%;" >จำนวนชิ้นรวม</div>
            <div style="font-size: 7px;width: 50%;text-align: right;" >${sell.SUM_QTY}</div>
        </div>`;

  html += `<div style="font-size: 7px;display: flex;">
            <div style="font-size: 7px;width: 50%;" >จำนวนชิ้น (แถม)</div>
            <div style="font-size: 7px;width: 50%;text-align: right;" >${sell.SUM_FREE_ITEM_QTY}</div>
        </div>`;

  html +=
    '<div style="font-size: 7px;text-align: center;width: 180px;white-space: nowrap;overflow: hidden;" >---------------------------------------------------------------------------------</div>';

  const returnObj = data.RETURN;

  html += `<div style="font-size: 7px;display: flex;">
            <div style="font-size: 7px;width: 50%;" >ยอดคืนรวม</div>
            <div style="font-size: 7px;width: 50%;text-align: right;" >${decimal2digitWithCommas(returnObj.SUM_AMT)}</div>
        </div>`;

  html += `<div style="font-size: 7px;display: flex;">
            <div style="font-size: 7px;width: 50%;" >ลดต่อรายการรวม</div>
            <div style="font-size: 7px;width: 50%;text-align: right;" >${decimal2digitWithCommas(returnObj.SUM_ITEM_DSC)}</div>
        </div>`;

  html += `<div style="font-size: 7px;display: flex;">
            <div style="font-size: 7px;width: 50%;" >ส่วนลดท้ายบิลรวม</div>
            <div style="font-size: 7px;width: 50%;text-align: right;" >${decimal2digitWithCommas(returnObj.SUM_BILL_DSC)}</div>
        </div>`;

  html += `<div style="font-size: 7px;display: flex;">
            <div style="font-size: 7px;width: 50%;" >จำนวนบิลรวม</div>
            <div style="font-size: 7px;width: 50%;text-align: right;" >${returnObj.COUNT_DOC}</div>
        </div>`;

  html += `<div style="font-size: 7px;display: flex;">
            <div style="font-size: 7px;width: 50%;" >จำนวนรายการคืน</div>
            <div style="font-size: 7px;width: 50%;text-align: right;" >${returnObj.SUM_PCS}</div>
        </div>`;

  html += `<div style="font-size: 7px;display: flex;">
            <div style="font-size: 7px;width: 50%;" >จำนวนชิ้นรวม</div>
            <div style="font-size: 7px;width: 50%;text-align: right;" >${returnObj.SUM_QTY}</div>
        </div>`;

  html += `<div style="font-size: 7px;display: flex;">
            <div style="font-size: 7px;width: 50%;" >จำนวนชิ้น (แถม)</div>
            <div style="font-size: 7px;width: 50%;text-align: right;" >${returnObj.SUM_FREE_ITEM_QTY}</div>
        </div>`;

  html +=
    '<div style="font-size: 7px;text-align: center;width: 180px;white-space: nowrap;overflow: hidden;" >---------------------------------------------------------------------------------</div>';

  html += `<div style="font-size: 7px;display: flex;">
            <div style="font-size: 7px;width: 50%;" >โอนเข้าลูกหนี้</div>
            <div style="font-size: 7px;width: 50%;text-align: right;" >${decimal2digitWithCommas(data.TRANSFER_TO_AR)}</div>
        </div>`;

  html += `<div style="font-size: 7px;display: flex;">
            <div style="font-size: 7px;width: 50%;" >ชำระเช็ค</div>
            <div style="font-size: 7px;width: 50%;text-align: right;" >${decimal2digitWithCommas(data.PAID_BY_CHEQUE)}</div>
        </div>`;

  html += `<div style="font-size: 7px;display: flex;">
            <div style="font-size: 7px;width: 50%;" >ชำระเงินสด</div>
            <div style="font-size: 7px;width: 50%;text-align: right;" >${decimal2digitWithCommas(data.PAID_BY_CASH)}</div>
        </div>`;

  html += `<div style="font-size: 7px;display: flex;">
            <div style="font-size: 7px;width: 50%;" >คืนเงินสด</div>
            <div style="font-size: 7px;width: 50%;text-align: right;" >${decimal2digitWithCommas(data.SUM_CASH_RTN)}</div>
        </div>`;

  html += `<div style="font-size: 7px;display: flex;">
            <div style="font-size: 7px;width: 50%;" >เงินสดจากการขาย</div>
            <div style="font-size: 7px;width: 50%;text-align: right;" >${decimal2digitWithCommas(data.CASH_FROM_SELL)}</div>
        </div>`;

  html += `<div style="font-size: 7px;display: flex;">
            <div style="font-size: 7px;width: 50%;" >เศษทอนไม่ได้</div>
            <div style="font-size: 7px;width: 50%;text-align: right;" >${decimal2digitWithCommas(data.PGL)}</div>
        </div>`;

  html +=
    '<div style="font-size: 7px;text-align: center;width: 180px;white-space: nowrap;overflow: hidden;" >---------------------------------------------------------------------------------</div>';

  html += `<div style="font-size: 7px;display: flex;">
            <div style="font-size: 7px;width: 50%;" >เลขไมล์ เริ่มต้น</div>
            <div style="font-size: 7px;width: 50%;text-align: right;" >${parseInt(
    data.MILE_START,
  )
      .toFixed(2)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
        </div>`;

  html += `<div style="font-size: 7px;display: flex;">
            <div style="font-size: 7px;width: 50%;" >เลขไมล์ สิ้นสุด</div>
            <div style="font-size: 7px;width: 50%;text-align: right;" >${parseInt(
    data.MILE_END,
  )
      .toFixed(2)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
        </div>`;

  html += `<div style="font-size: 7px;display: flex;">
            <div style="font-size: 7px;width: 50%;" >รวมระยะทาง(วิ่ง)</div>
            <div style="font-size: 7px;width: 50%;text-align: right;" >${parseInt(
    data.DISTANCE,
  )
      .toFixed(2)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
        </div>`;

  html += `</div></div>`;

  return html;
};

const printStockBalanceByWL = (
  title,
  items,
  vanConfig,
  companyInfo,
  salesMan,
  dateFrom,
  dateTo,
  printTime,
) => {
  let html = `<br><div style="width: 100%;"><div style="width: 180px;margin: auto;">`;

  console.log('items ', JSON.stringify(items.RESULT));

  console.log('items ', JSON.stringify(items.RESULT));

  html += printHeaderReportPatternC(
    title,
    vanConfig.VANCNF_REG_NAME,
    salesMan.SLMN_NAME,
    dateFrom,
    dateTo,
    printTime,
  );

  html += `<div style="font-size: 7px;" >รหัส : ชื่อสินค้า</div>`;

  html += `<div style="font-size: 7px;display: flex;">
                <div style="font-size: 7px;width: 30%;text-align: right;" >จำนวน</div>
                <div style="font-size: 7px;width: 36%;text-align: right;" >จำนวน</div>
                <div style="font-size: 7px;width: 34%;text-align: right;" >จำนวน</div>
            </div>`;

  html += `<div style="font-size: 7px;display: flex;">
            <div style="font-size: 7px;width: 30%;text-align: right;" >หน่วย</div>
            <div style="font-size: 7px;width: 36%;text-align: right;" >หน่วย</div>
            <div style="font-size: 7px;width: 34%;text-align: right;" >หน่วย</div>
        </div>`;

  html +=
    '<div style="font-size: 7px;text-align: center;width: 180px;white-space: nowrap;overflow: hidden;" >---------------------------------------------------------------------------------</div>';

  items.RESULT.map((item, index) => {
    html += `<div style="font-size: 7px;" >ตน.เก็บ ${item.WL_CODE} : ${item.WL_NAME}</div>`;

    item.ITEMS.map((objChildren, index) => {
      html += `<div style="font-size: 7px;" >ตน.เก็บ ${objChildren.SKU_CODE} : ${objChildren.SKU_NAME}</div>`;

      let col1 =
        objChildren.WL_QTY_S != 0 &&
          objChildren.SKU_S_UTQ_NAME != objChildren.SKU_T_UTQ_NAME ?
          parseInt(objChildren.WL_QTY_S)
            .toFixed(0)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
          objChildren.SKU_S_UTQ_NAME :
          null;
      let col2 =
        objChildren.WL_QTY_T != 0 &&
          objChildren.SKU_T_UTQ_NAME != objChildren.SKU_K_UTQ_NAME ?
          parseInt(objChildren.WL_QTY_T)
            .toFixed(0)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
          objChildren.SKU_T_UTQ_NAME :
          null;
      let col3 =
        objChildren.WL_QTY_K != 0 ?
          parseInt(objChildren.WL_QTY_K)
            .toFixed(0)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
          objChildren.SKU_K_UTQ_NAME :
          null;

      if (col2 != null && col3 == null) {
        col3 = col2;
        col2 = null;
      }

      if (col1 != null && col2 == null && col3 == null) {
        col3 = col1;
        col1 = null;
      } else if (col1 != null && col2 == null && col3 != null) {
        col2 = col1;
        col1 = null;
      }

      let width = '30%';

      html += `<div style="font-size: 7px;display: flex;">
                <div style="font-size: 7px;width: 30%;text-align: right;" >${col1 != null ? col1 : ''
        }</div>
                <div style="font-size: 7px;width: 36%;text-align: right;" >${col2 != null ? col2 : ''
        }</div>
                <div style="font-size: 7px;width: 34%;text-align: right;" >${col3 != null ? col3 : ''
        }</div>
            </div>`;
    });

    html += `<br>`;
    html +=
      '<div style="font-size: 7px;text-align: center;width: 180px;white-space: nowrap;overflow: hidden;" >---------------------------------------------------------------------------------</div>';
  });

  html += `</div></div>`;

  return html;
};

const printHeaderReport = (
  title,
  regName,
  slmnName,
  dateFrom,
  dateTo,
  printTime,
) => {

  console.log("ณ.วันที่ dateFrom", dateFrom);
  console.log("ถึงวันที่ dateTo", dateTo);


  let html = `<br><div style="font-size: 7px;text-align: center;" >${title}</div>`;

  html += `<div style="font-size: 7px;" >ทะเบียนรถ: ${regName}</div>`;

  html += `<div style="font-size: 7px;" >ชื่อพนักงาน: ${slmnName}</div>`;

  html += `<div style="font-size: 7px;" >วันที่ ${dateFrom} ถึงวันที่ ${dateTo}</div>`;

  html += `<div style="font-size: 7px;" >เวลาที่พิมพ์: ${printTime} </div>`;

  return html;
};

const printHeaderReportPatternC = (
  title,
  regName,
  slmnName,
  dateFrom,
  printTime,
) => {
  console.log("ณ.วันที่", dateFrom);


  let html = `<br><div style="font-size: 7px;text-align: center;" >${title}</div>`;

  html += `<div style="font-size: 7px;" >ทะเบียนรถ: ${regName}</div>`;

  html += `<div style="font-size: 7px;" >ชื่อพนักงาน: ${slmnName}</div>`;

  html += `<div style="font-size: 7px;" >ณ.วันที่  ${dateFrom}</div>`;

  html += `<div style="font-size: 7px;" >เวลาที่พิมพ์: ${printTime} </div>`;

  return html;
};