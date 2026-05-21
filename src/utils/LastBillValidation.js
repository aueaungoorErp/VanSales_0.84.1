import { BPAPUS_BPAPSV } from '../../appConfig';
import { lookupErpV3Api, parseResDataToJson, updateErpV3Api } from '../api/bPlusApi';
import { productSearchShowRepack } from '../api/product';
import {
  BPAPUS_FUNCTION_BK_CODE,
  BPAPUS_FUNCTION_V_CODE,
  GET_INVOICE_DOC_INFO,
  GET_SELL_ORDER_DOC_INFO,
} from '../constant/bPlusApi';

export const LAST_BILL_QUOTATION_WARNING_MESSAGE =
  'ไม่เคยขายสินค้าในใบเสนอราคา';

export const LAST_BOOK_QUOTATION_WARNING_MESSAGE =
  'ไม่เคยจองสินค้าในใบเสนอราคา';

const getLatestOrderGoodsCodes = async (v3GUID, vanConfig, arCode, orderType) => {
  const isBookOrder = orderType === 'จองสินค้า';
  const dataObj = {
    'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
    'BPAPUS-LOGIN-GUID': v3GUID,
    'BPAPUS-FUNCTION': isBookOrder ? BPAPUS_FUNCTION_BK_CODE : BPAPUS_FUNCTION_V_CODE,
    'BPAPUS-PARAM': '',
    'BPAPUS-FILTER': isBookOrder
      ? "and AR_CODE = '" + arCode + "' and  DT_KEY = '" + vanConfig.VANCNF_BOOK_DT + "'"
      : "and AR_CODE = '" +
        arCode +
        "' and  (DT_KEY = '" +
        vanConfig.VANCNF_INV_DT +
        "' OR DT_KEY = '" +
        vanConfig.VANCNF_CASHSALES_DT +
        "')",
    'BPAPUS-ORDERBY': 'order by DI_KEY desc',
    'BPAPUS-OFFSET': '0',
    'BPAPUS-FETCH': '1',
  };

  const latestOrderResponse = await lookupErpV3Api(dataObj);
  const { ResponseCode, ResponseData } = latestOrderResponse.data;

  if (ResponseCode != 200) {
    return [];
  }

  const responseData = JSON.parse(ResponseData);
  const latestOrder = isBookOrder
    ? responseData.Oe002304?.[0]
    : responseData.Oe000304?.[0];

  if (!latestOrder?.DI_KEY) {
    return [];
  }

  const latestOrderDoc = await updateErpV3Api({
    'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
    'BPAPUS-LOGIN-GUID': v3GUID,
    'BPAPUS-FUNCTION': isBookOrder ? GET_SELL_ORDER_DOC_INFO : GET_INVOICE_DOC_INFO,
    'BPAPUS-PARAM': '{"DI_KEY": "' + latestOrder.DI_KEY + '"}',
    'BPAPUS-FILTER': '',
    'BPAPUS-ORDERBY': '',
    'BPAPUS-OFFSET': '0',
    'BPAPUS-FETCH': '0',
  });

  const parsedLatestOrder = parseResDataToJson(latestOrderDoc.data);
  const latestOrderItems = Array.isArray(parsedLatestOrder.TRANSTKD)
    ? parsedLatestOrder.TRANSTKD
    : [];

  return [
    ...new Set(latestOrderItems.map((item) => item.GOODS_CODE).filter(Boolean)),
  ];
};

const getLatestQuotationAllowedGoodsCodes = async (
  v3GUID,
  vanConfig,
  arprbCode,
) => {
  const allowedGoodsCodes = new Set();
  const dataObj = {
    'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
    'BPAPUS-LOGIN-GUID': v3GUID,
    'BPAPUS-FUNCTION': BPAPUS_FUNCTION_BK_CODE,
    'BPAPUS-PARAM': '',
    'BPAPUS-FILTER':
      "and DT_KEY = '" +
      vanConfig.VANCNF_QUOTE_DT +
      "' AND AROE_SLMN ='" +
      vanConfig.VANCNF_SLMN +
      "'",
    'BPAPUS-ORDERBY': 'order by DI_DATE desc , DI_REF desc',
    'BPAPUS-OFFSET': '0',
    'BPAPUS-FETCH': '1',
  };

  const latestQuoteResponse = await lookupErpV3Api(dataObj);
  const parsedLatestQuoteList = parseResDataToJson(latestQuoteResponse.data);
  const latestQuote = parsedLatestQuoteList[BPAPUS_FUNCTION_BK_CODE]?.[0];

  if (!latestQuote?.DI_KEY) {
    return allowedGoodsCodes;
  }

  const latestQuoteDoc = await updateErpV3Api({
    'BPAPUS-BPAPSV': BPAPUS_BPAPSV,
    'BPAPUS-LOGIN-GUID': v3GUID,
    'BPAPUS-FUNCTION': GET_SELL_ORDER_DOC_INFO,
    'BPAPUS-PARAM': '{\r\n    "DI_KEY": "' + latestQuote.DI_KEY + '"\r\n}',
    'BPAPUS-FILTER': '',
    'BPAPUS-ORDERBY': '  Order by DI_DATE Desc , DI_REF ASC ',
    'BPAPUS-OFFSET': '0',
    'BPAPUS-FETCH': '0',
  });

  const parsedLatestQuote = parseResDataToJson(latestQuoteDoc.data);
  const quotationItems = Array.isArray(parsedLatestQuote.TRANSTKD)
    ? parsedLatestQuote.TRANSTKD
    : [];

  for (const item of quotationItems) {
    if (!item?.GOODS_CODE) {
      continue;
    }

    allowedGoodsCodes.add(item.GOODS_CODE);

    try {
      const repackResponse = await productSearchShowRepack(
        item.GOODS_CODE,
        arprbCode || '',
        { LIMIT: 0, OFFSET: 0, KEYWORD: null, ICDEPT_THAIDESC: null },
      );
      const repackData = JSON.parse(repackResponse.ResponseData);
      const repackItems = Array.isArray(repackData.Repack)
        ? repackData.Repack
        : [];

      repackItems.forEach((repackItem) => {
        if (repackItem?.GOODS_CODE) {
          allowedGoodsCodes.add(repackItem.GOODS_CODE);
        }
      });
    } catch (error) {
      console.log('latest quote repack check error', error);
    }
  }

  return allowedGoodsCodes;
};

export const getLatestSoldQuotationGoodsCodes = async ({
  v3GUID,
  vanConfig,
  arCode,
  arprbCode,
  orderType,
}) => {
  if (
    (orderType !== 'ขายสินค้า' && orderType !== 'จองสินค้า') ||
    parseInt(vanConfig?.VANCNF_SKU_LIMIT) !== 3
  ) {
    return { allowed: true, message: null, goodsCodes: null };
  }

  const latestOrderGoodsCodes = await getLatestOrderGoodsCodes(
    v3GUID,
    vanConfig,
    arCode,
    orderType,
  );
  const allowedGoodsCodes = await getLatestQuotationAllowedGoodsCodes(
    v3GUID,
    vanConfig,
    arprbCode,
  );
  const matchedGoodsCodes = latestOrderGoodsCodes.filter((goodsCode) =>
    allowedGoodsCodes.has(goodsCode),
  );
  const warningMessage =
    orderType === 'จองสินค้า'
      ? LAST_BOOK_QUOTATION_WARNING_MESSAGE
      : LAST_BILL_QUOTATION_WARNING_MESSAGE;

  return {
    allowed: matchedGoodsCodes.length > 0,
    message:
      matchedGoodsCodes.length > 0 ? null : warningMessage,
    goodsCodes: matchedGoodsCodes,
  };
};