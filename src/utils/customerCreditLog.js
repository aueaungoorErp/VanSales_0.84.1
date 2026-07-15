const getCreditLimitPolicyLabel = vanCnfNovCreLim => {
  const value = Number(vanCnfNovCreLim);

  if (value === 1) {
    return 'ไม่สามารถขายเกินวงเงินเครดิต';
  }

  if (value === 2) {
    return 'สามารถขายเกินวงเงินเครดิต';
  }

  return `ไม่ทราบค่า (${vanCnfNovCreLim})`;
};

export const logCustomerCreditSelection = ({
  arKey,
  arSummary,
  vanConfig,
  source = 'findCustomerById',
}) => {
  const vanCnfNovCreLim = vanConfig?.VANCNF_NOV_CRE_LIM ?? null;
  const creditLimitPolicy = getCreditLimitPolicyLabel(vanCnfNovCreLim);

  console.log('[CustomerSelect][Credit]', {
    source,
    arKey,
    arCode: arSummary?.AR_CODE ?? null,
    arName: arSummary?.AR_NAME ?? null,
    creditLimit: arSummary?.ARS_CRE_LIM ?? null,
    creditRemain: arSummary?.ARS_CRE_REMAIN_NPDC ?? null,
    vanConfig: {
      VANCNF_NOV_CRE_LIM: vanCnfNovCreLim,
      creditLimitPolicy,
      canSellOverCreditLimit: Number(vanCnfNovCreLim) === 2,
      blockSellOverCreditLimit: Number(vanCnfNovCreLim) === 1,
    },
    arSummary,
  });
};
