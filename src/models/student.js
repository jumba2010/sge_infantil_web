import { Effect } from 'dva';
import { Reducer } from 'redux';
import { findActiveStudents,findUnrenewedStudents,findFrequencies,findActiveStudentById } from '@/services/student';

const SutudentModel = {
  namespace: 'student',

  state: {
    students: [],
    frequencies: [],
    unrenewdStudents: [],
  },

  effects: {
    *fetchActiveStudents(_, { call, put }) {
      const response = yield call(findActiveStudents);
      yield put({
        type: 'queryActiveStudents',
        payload: response.data,
      });
    },
 
    *fetchFrequencies(_, { call, put }) {
      const response = yield call(findFrequencies);
      yield put({
        type: 'queryFrequencies',
        payload: response.data,
      });
    },

  *fetchUnrenewedStudents(_, { call, put }) {
    const response = yield call(findUnrenewedStudents);
    yield put({
      type: 'queryUnrenewdStudents',
      payload: response.data,
    });
  },

  *addStudent({ payload }, { call,put }) {
    console.log('payload',payload)
    const response = yield call(findActiveStudentById,payload.registrationId);
    yield put({
      type: 'updateActiveStudents',
      payload: response,
    });
 },

},

  reducers: {
    queryActiveStudents(state, action) {
      console.log('Returning registrations:',action)
      return {
        ...state,
        students: action.payload || {},
      };
    },

    queryFrequencies(state, action) {
      return {
        ...state,
        frequencies: action.payload || {},
      };
    },

    queryUnrenewdStudents(state, action) {
      return {
        ...state,
        unrenewdStudents: action.payload || {},
      };
    },

    updateActiveStudents(state, action) {
      const { students } = state;
      const existingIndex = students.findIndex((student) => student.id === action.payload.id);
    
      if (existingIndex === -1) {
        // If the element is not found, add it to the list
        return {
          ...state,
          students: [...students, action.payload],
        };
      } else {
        // If the element is found, replace it with the new payload
        return {
          ...state,
          students: [
            ...students.slice(0, existingIndex),
            action.payload,
            ...students.slice(existingIndex + 1),
          ],
        };
      }
    }
    ,

      removeStudent(state, action) {
        return {
          ...state,
          students: state.students.filter(item => item.id !== action.payload.id),
        };
        },
  },
};


export default SutudentModel;
