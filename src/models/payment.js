import { Effect } from 'dva';
import { Reducer } from 'redux';
import { findPaidPayments,findUnpaidPayments} from '@/services/payment';

const PaymentModel = {
  namespace: 'payment',

  state: {
    paidPayments: [],
    unpaidPayments: [],
  },

  effects: {
    *fetchPaidPayments(_, { call, put }) {
      const response = yield call(findPaidPayments);
      yield put({
        type: 'queryPaidPayments',
        payload: response.data,
      });
    },
 
    *fetchUnpaidPayments(_, { call, put }) {
      const response = yield call(findUnpaidPayments);
      yield put({
        type: 'queryUnpaidPayments',
        payload: response.data,
      });
    },

},

  reducers: {
    queryPaidPayments(state, action) {
      return {
        ...state,
        paidPayments: action.payload || {},
      };
    },

    queryUnpaidPayments(state, action) {
      return {
        ...state,
        unpaidPayments: action.payload || {},
      };
    },

   
    updatePaidPayments(state, action) {   
      const found = state.paidPayments.find(element => element.id === action.payload.id);
      if(!found){
         let newList=[...state.paidPayments].concat(action.payload);
        return {
         ...state,
         paidPayments: newList,
      };
      }
      else {
        return {
          ...state
        };
      }
      
      },

      removeUnpaidPaiments(state, action) {
        return {
          ...state,
          unpaidPayments: state.unpaidPayments.filter(item => item.id !== action.payload.id),
        };
        },
  },
};


export default PaymentModel;
