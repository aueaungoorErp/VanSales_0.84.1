import Request from '../utils/Request';
import * as appConfig from '../../appConfig';
export const processOrderSaleApi = (data) => {
  return new Promise((resolve, reject) => {
    Request.instance
      .post(`/Order/Process`, data)
      .then((v) => {
        // console.log('processOrderSaleApi v ', v);
        resolve(v.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const createOrderSaleApi = (data) => {
  return new Promise((resolve, reject) => {
    Request.instance
      .post(`/Order/Create`, data)
      .then((v) => {
        resolve(v.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const updateOrderSaleApi = (data) => {
  return new Promise((resolve, reject) => {
    Request.instance
      .post(`/Order/Update`, data)
      .then((v) => {
        resolve(v.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const createOrderReservApi = (data) => {
  return new Promise((resolve, reject) => {
    Request.instance
      .post(`/Order/Create/Book`, data)
      .then((v) => {
        resolve(v.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};


export const updateOrderReservApi = (data) => {
  return new Promise((resolve, reject) => {
    Request.instance
      .post(`/Order/Update/Book`, data)
      .then((v) => {
        resolve(v.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const createOrderReturnApi = (data) => {
  return new Promise((resolve, reject) => {
    Request.instance
      .post(`/Order/Create/Return`, data)
      .then((v) => {
        resolve(v.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const createOrderReturnCashApi = (data) => {
  return new Promise((resolve, reject) => {
    Request.instance
      .post(`/Order/Create/Return/Cash`, data)
      .then((v) => {
        resolve(v.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const updateOrderReturnApi = (data) => {
  return new Promise((resolve, reject) => {
    Request.instance
      .post(`/Order/Update/Return`, data)
      .then((v) => {
        resolve(v.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const updateOrderReturnCashApi = (data) => {
  return new Promise((resolve, reject) => {
    Request.instance
      .post(`/Order/Update/Return/Cash`, data)
      .then((v) => {
        resolve(v.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getProductListItemsFromLastBillByArCodeApi = (code) => {
  return new Promise((resolve, reject) => {
    Request.instance
      .get(`/Customer/Bill/Last/${code}`)
      .then((v) => {
        console.log("v ",v.data);
        resolve(v.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getProductListItemsFromLastBillBookByArCodeApi = (code) => {
  return new Promise((resolve, reject) => {
    Request.instance
      .get(`/Customer/Bill/Book/Last/${code}`)
      .then((v) => {
        resolve(v.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const orderCreateCashApi = (data) => {
  return new Promise((resolve, reject) => {
    Request.instance
      .post(`/Order/Create/Cash`, data)
      .then((v) => {
        resolve(v.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const orderUpdateCashApi = (data) => {
  return new Promise((resolve, reject) => {
    Request.instance
      .post(`/Order/Update/Cash`, data)
      .then((v) => {
        resolve(v.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const orderUpdateQuotationApi = (data) => {
  return new Promise((resolve, reject) => {
    Request.instance
      .post(`/Order/Update/Quotation`, data)
      .then((v) => {
        resolve(v.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const createDocVisitApi = (data) => {
  return new Promise((resolve, reject) => {
    Request.instance
      .post(`/Customer/Create/Doc/Visit`, data)
      .then((v) => {
        resolve(v.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const createDocSurveyApi = (data) => {
  return new Promise((resolve, reject) => {
    Request.instance
      .post(`/Customer/Create/Doc/Survey`, data)
      .then((v) => {
        resolve(v.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const orderFileApi = (data,date) => {
  return new Promise((resolve, reject) => {
    Request.instance
      .post(`/Order/File?PRT_COUNTER=true&from=${date}`, data)
      .then((v) => {
        resolve(v.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const orderCancelApi = (data) => {
  return new Promise((resolve, reject) => {
    Request.instance
      .post(`/Order/Cancel`, data)
      .then((v) => {
        resolve(v.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const orderUpdateApi = (code, id) => {
  return new Promise((resolve, reject) => {
    Request.instance
      .get(`/Order/${code}/${id}`)
      .then((v) => {
        resolve(v.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const createOrderTransferApi = (data) => {
  return new Promise((resolve, reject) => {
    Request.instance
      .post(`/Order/Create/Tranfer`, data)
      .then((v) => {
        resolve(v.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const createQuotationApi = (data) => {
  return new Promise((resolve, reject) => {
    Request.instance
      .post(`/Order/Create/Quotation`, data)
      .then((v) => {
        resolve(v.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const orderAttachImageApi = (data) => {
  return new Promise((resolve, reject) => {
    Request.instance
      .post(`/Order/Attach/Image`, data)
      .then((v) => {
        resolve(v.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const orderAttachMultipleImagesApi = (data) => {
  return new Promise((resolve, reject) => {
    Request.instance
      .post(`/Order/Attach/Multiple/Image`, data)
      .then((v) => {
        resolve(v.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
