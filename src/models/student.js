import { Effect } from 'dva';
import { Reducer } from 'redux';

import { findActiveStudents } from '@/services/student';

const SutudentModel = {
  namespace: 'student',

  state: {
    students: [],
  },

  effects: {
    *fetchActiveStudents(_, { call, put }) {
      console.log('Chamado');
      const response = yield call(findActiveStudents);
      yield put({
        type: 'save',
        payload: response,
      });
    },
  },

  reducers: {
    save(state, action) {
      console.log(action.payload);
      return {
        ...state,
        students: action.payload || {},
      };
    },
  },
};

export default SutudentModel;
