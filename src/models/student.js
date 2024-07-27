import {
  findActiveStudents,
  findUnrenewedStudents,
  findFrequencies,
  findActiveStudentById,
} from '@/services/student';

const StudentModel = {
  namespace: 'student',
  state: {
    students: [],
    frequencies: [],
    unrenewedStudents: [],
    currentStudent: {},
  },

  effects: {
    *fetchActiveStudents(_, { call, put }) {
      const response = yield call(findActiveStudents);
      // Removed console.log statement
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
        type: 'queryUnrenewedStudents',
        payload: response.data,
      });
    },

    *addStudent({ payload }, { call, put }) {
      const response = yield call(findActiveStudentById, payload.registrationId);
      yield put({
        type: 'updateActiveStudents',
        payload: response,
      });
    },

    *setCurrentStudent({ payload }, { put }) {
      // Removed `call` since it's not used
      yield put({
        type: 'updateCurrentStudent',
        payload,
      });
    },
  },

  reducers: {
    queryActiveStudents(state, action) {
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

    queryUnrenewedStudents(state, action) {
      return {
        ...state,
        unrenewedStudents: action.payload || {},
      };
    },

    updateActiveStudents(state, action) {
      const { students } = state;
      const existingIndex = students.findIndex(student => student.id === action.payload.id);

      if (existingIndex === -1) {
        return {
          ...state,
          students: [...students, action.payload],
        };
      }
      // If the element is found, replace it with the new payload
      return {
        ...state,
        students: [
          ...students.slice(0, existingIndex),
          action.payload,
          ...students.slice(existingIndex + 1),
        ],
      };
    },

    removeStudent(state, action) {
      return {
        ...state,
        students: state.students.filter(item => item.id !== action.payload.id),
      };
    },

    updateCurrentStudent(state, action) {
      return {
        ...state,
        currentStudent: action.payload,
      };
    },
  },
};

export default StudentModel;
