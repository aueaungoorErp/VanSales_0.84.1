import Request from '../utils/Request';
import * as appConfig from '../../appConfig';
import { getLoginGuID} from '../utils/Token';

export const productCategorySearchListApi = (criteria) => {
  return new Promise(async (resolve, reject) => {
    //console.log('criteria ==>', criteria);
    const LoginGUID = await getLoginGuID();
    const bodyRequest = {
      'BPAPUS-BPAPSV': appConfig.BPAPUS_BPAPSV,
      'BPAPUS-LOGIN-GUID': LoginGUID,
      'BPAPUS-FUNCTION': 'Ic000303',
      'BPAPUS-PARAM': '',
      'BPAPUS-FILTER': '',
      'BPAPUS-ORDERBY': '',
      'BPAPUS-OFFSET': '0',
      'BPAPUS-FETCH': '0',
    };

    Request.instanceV3
      .post('/LookupErp', bodyRequest)
      .then((v) => {
        resolve(v.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
