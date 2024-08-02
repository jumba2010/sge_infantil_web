import React from 'react';
import ReactDOM from 'react-dom';
import {
  Steps,
  Card,
  Button,
  message,
  Upload,
  Icon,
  Form,
  Input,
  Statistic,
  Checkbox,
  Select,
  Descriptions,
  DatePicker,
  Col,
  Divider,
  Row,
  Tooltip,
  Layout,
  Alert,
  Result,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import moment from 'moment';
import { notification } from 'antd';
import api from './../../../services/api';
import { USER_KEY, SUCURSAL } from './../../../services/auth';
import { connect } from 'dva';
const { Step } = Steps;
const { TextArea } = Input;
const { Content, Sider } = Layout;

import { formatMessage } from 'umi-plugin-react/locale';

import styles from './index.less';

// const steps = [
//   {
//     title: formatMessage({ id: 'student.personal.details' }),
//     content: '1',
//   },
//   {
//     title: formatMessage({ id: 'student.parent.details' }),
//     content: '2',
//   },
//   {
//     title: formatMessage({ id: 'studet.sponsor.details' }),
//     content: '3',
//   },
//   {
//     title: formatMessage({ id: 'student.registration.details' }),
//     content: '3',
//   },
//   {
//     title: formatMessage({ id: 'global.confirm' }),
//     content: '4',
//   },
//   {
//     title: formatMessage({ id: 'global.success' }),
//     content: '5',
//   },
// ];

const steps = [
  {
    title: 'Dados Pessoais',
    content: '1',
  },
  {
    title: 'Filiação',
    content: '2',
  },
  {
    title: 'Encarregado',
    content: '3',
  },
  {
    title: 'Dados de Inscrição',
    content: '3',
  },
  {
    title: 'Confirmaçãao',
    content: '4',
  },
  {
    title: 'Sucesso',
    content: '5',
  },
];

function desabledBirthDate(current) {
  return current && current > moment().endOf('day');
}

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

@connect(({ student, loading }) => ({
  frequencies: student.frequencies,
}))
class Student extends React.Component {
  constructor(props) {
    super(props);
    let s = JSON.parse(localStorage.getItem('LAST_STUDENT'));
    if (s != null) {
      this.state = {
        current: 0,
        loading: false,
        confirmDirty: false,
        autoCompleteResult: [],
        name: s.name,
        birthDate: s.birthDate,
        gender: s.sex,
        docType: s.docType,
        docNumber: s.docNumber,
        motherName: s.motherName ? s.motherName : '',
        carierContact: s.carierContact ? s.carierContact : '',
        carierName: s.name ? s.name : '',
        oldMonthlyValue: 0,
        jobLocation: s.workPlace ? s.workPlace : '',
        address: s.address ? s.address : '',
        kinshipDegree: s.kinshipDegree ? s.kinshipDegree : '',
        studentAddress: s.studentAddress,
        isNew: s.isNew ? s.isNew : true,
        needSpecialHour: s.needSpecialHour ? s.needSpecialHour : false,
        isAlergicToMedicine: s.alergicToMedicine,
        isAlergicToFood: s.alergicToFood,
        alergicToFood: s.alergicToFood,
        alergicToMedicine: s.alergicToMedicine,
        studentNumber: 1,
        fatherName: s.fatherName ? s.fatherName : '',
        motherContact: s.motherContact,
        fatherContact: s.fatherContact,
        registrationValue: s.registrationValue,
        recurigRegistrationValue: 0,
        monthlyPayment: s.monthlyPayment,
        requireDocNumber: false,
        total: 0,
        workplace: s.workPlace ? s.workPlace : '',
        issaving: false,
        imageUrl: '',
        frequency: s.level,
        file: {},
        discount: 0.0,
        paymentMethod: s.paymentMethod ? s.paymentMethod : '',
      };
    } else {
      this.state = {
        current: 0,
        loading: false,
        confirmDirty: false,
        autoCompleteResult: [],
        name: '',
        birthDate: '',
        gender: '',
        docType: '',
        docNumber: '',
        motherName: '',
        carierContact: '',
        carierName: '',
        oldMonthlyValue: 0,
        jobLocation: '',
        address: '',
        kinshipDegree: '',
        studentAddress: '',
        isNew: true,
        needSpecialHour: false,
        isAlergicToMedicine: false,
        isAlergicToFood: false,
        alergicToFood: '',
        alergicToMedicine: '',
        studentNumber: 1,
        fatherName: '',
        motherContact: '',
        fatherContact: '',
        registrationValue: 0,
        recurigRegistrationValue: 0,
        monthlyPayment: 0,
        requireDocNumber: false,
        total: 0,
        address: '',
        contact: '',
        workplace: '',
        issaving: false,
        imageUrl: '',
        frequency: '',
        file: {},
        frequencies: [],
        discount: 0.0,
        paymentMethod: '',
      };
    }

    this.handleChangeInput = this.handleChangeInput.bind(this);
    this.handleSelectbirthDate = this.handleSelectbirthDate.bind(this);
    this.handleSelectGender = this.handleSelectGender.bind(this);
    this.handleSelectDocType = this.handleSelectDocType.bind(this);
    this.handleSelectKinShip = this.handleSelectKinShip.bind(this);
    this.handleSelectDiscount = this.handleSelectDiscount.bind(this);
    this.handleSelectPaymentType = this.handleSelectPaymentType.bind(this);
    this.handleSelectClass = this.handleSelectClass.bind(this);
    this.handleApiCallback = this.handleApiCallback.bind(this);
    this.handleStudentCreationCallBack = this.handleStudentCreationCallBack.bind(this);
  }

  beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }

    this.setState({ file });
    return isJpgOrPng && isLt2M;
  }

  handleChangeInput(evt) {
    this.setState({ [evt.target.name]: evt.target.value });
  }

  handleSelectbirthDate(date) {
    this.setState({ birthDate: date });
  }

  changeNewStudent(e) {
    this.setState({
      isNew: e.target.checked,
      registrationValue: !e.target.checked
        ? this.state.recurigRegistrationValue
        : this.state.registrationValue,
    });
  }

  changeIsAlergicToFood(e) {
    this.setState({ isAlergicToFood: e.target.checked });
  }

  changeNeedSpecialHour(e) {
    const { frequencies } = this.props.frequencies;
    let freq = frequencies.filter(f => f.level === this.state.frequency)[0];
    let paymentValue = freq.monthlyPayment;
    let extra = e.target.checked ? freq.specialHourMonthlyValue : 0;
    let monthlyPayment = paymentValue + extra;
    this.setState({ needSpecialHour: e.target.checked, monthlyPayment });
  }

  changeIsAlergicMedicine(e) {
    this.setState({ isAlergicToMedicine: e.target.checked });
  }

  handleSelectGender(gender) {
    this.setState({ gender });
  }

  handleSelectDocType(docType) {
    this.setState({ docType, requireDocNumber: docType !== 'Nenhum' });
  }

  handleSelectClass(frequency) {
    const { frequencies } = this.props;
    let freq = frequencies.filter(f => f.level === frequency)[0];
    let registrationValue = this.state.isNew
      ? freq.registrationValue
      : freq.recurigRegistrationValue;
    this.setState({
      frequency,
      registrationValue,
      monthlyPayment: freq.monthlyPayment,
      total: parseFloat(registrationValue) + parseFloat(freq.monthlyPayment),
      oldMonthlyValue: freq.monthlyPayment,
      recurigRegistrationValue: freq.recurigRegistrationValue,
    });
  }

  handleSelectPaymentType(paymentMethod) {
    this.setState({ paymentMethod });
  }

  handleSelectDiscount(discount) {
    let registrationvalue = this.state.registrationValue * (1 - parseFloat(discount));
    let monthlyPayment = this.state.oldMonthlyValue * (1 - parseFloat(discount));
    this.setState({ discount, registrationvalue, monthlyPayment });
  }

  handleSelectKinShip(kinshipDegree) {
    if (kinshipDegree == 'PAI') {
      this.setState({ carierName: this.state.fatherName, carierContact: this.state.fatherContact });
    } else if (kinshipDegree == 'MAE') {
      this.setState({ carierName: this.state.motherName, carierContact: this.state.motherContact });
    } else {
      this.setState({ carierName: '', carierContact: '' });
    }

    this.setState({ kinshipDegree });
  }

  handleChange = async info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          file: info.file,
          loading: false,
        }),
      );

      const data = new FormData();
      data.append(
        'file',
        this.state.file,
        'PIC_' + new Date().getTime() + '.' + this.state.file.name.split('.').pop(),
      );
      data.append(
        'filename',
        'PIC_' + new Date().getTime() + '.' + this.state.file.name.split('.').pop(),
      );

      const config = {
        headers: {
          'content-type': 'multipart/form-data',
        },
      };

      let resp = await api.post('/api/upload/pictures', data, config);

      this.setState({
        picture: resp.data.file,
      });
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Values:', values);
      }
    });
  };

  next() {
    const current = this.state.current + 1;
    this.setState({ current });
  }

  handleApiCallback(resp) {
    let registrationId = resp.data.id;
    const { dispatch } = this.props;
    const current = this.state.current + 1;
    this.setState({ current, issaving: false });
    localStorage.removeItem('LAST_STUDENT');
    window.scrollTo(0, 0);

    dispatch({
      type: 'student/fetchActiveStudents',
    });
  }

  async handleStudentCreationCallBack(res) {
    let createdStudent = res.data;
    let loggedUser = JSON.parse(localStorage.getItem(USER_KEY));
    let sucursal = JSON.parse(localStorage.getItem(SUCURSAL));
    let {
      isNew,
      monthlyPayment,
      registrationValue,
      discount,
      frequency,
      needSpecialHour,
    } = this.state;

    let re = await api
      .post('/api/registration', {
        monthlyPayment,
        totalPaid: registrationValue,
        discount,
        studentId: createdStudent.id,
        student: createdStudent,
        isNew,
        year: new Date().getFullYear(),
        sucursal: sucursal,
        classId: frequency,
        createdBy: loggedUser.id,
        activatedBy: loggedUser.id,
      })
      .then(this.handleApiCallback)
      .catch(function(error) {
        console.log(error);
        notification.error({
          description: 'Erro ao Processar o o seu pedido',
          message: 'Erro ao processar o pedido',
        });
      });
  }

  confirmTransaction = async () => {
    window.scrollTo(0, 0);
    this.setState({ issaving: true });
    let loggedUser = JSON.parse(localStorage.getItem(USER_KEY));
    let sucursal = JSON.parse(localStorage.getItem(SUCURSAL));
    let picture = this.state.imageUrl;

    let {
      name,
      address,
      gender,
      birthDate,
      docType,
      docNumber,
      motherName,
      carierContact,
      isNew,
      carierName,
      workplace,
      frequency,
      fatherContact,
      motherContact,
      fatherName,
      kinshipDegree,
      monthlyPayment,
      registrationValue,
      discount,
      studentAddress,
      needSpecialHour,
      alergicToFood,
      alergicToMedicine,
    } = this.state;

    let carier = {
      name: carierName,
      kinshipDegree,
      contact: carierContact,
      workPlace: workplace,
      createdBy: loggedUser.id,
      activatedBy: loggedUser.id,
    };

    let s = await api
      .post('/api/student', {
        name,
        address,
        sex: gender,
        sucursal,
        picture,
        birthDate,
        docType,
        currentMonthlyPayment: monthlyPayment,
        studentAddress,
        level: frequency,
        docNumber,
        alergicToFood,
        alergicToMedicine,
        motherContact,
        fatherContact,
        motherName,
        fatherName,
        picture,
        carier,
        sucursalId: sucursal.id,
        createdBy: loggedUser.id,
        activatedBy: loggedUser.id,
      })
      .then(this.handleStudentCreationCallBack)
      .catch(function(error) {
        notification.error({
          description: 'Erro ao Processar o seu pedido',
          message: 'Erro ao processar o pedido',
        });
      });
  };

  next1() {
    if (this.state.name && this.state.birthDate && this.state.gender && this.state.docType) {
      let s = {};
      s.name = this.state.name;
      s.sex = this.state.gender;
      s.docNumber = this.state.docNumber;
      s.docNumber = this.state.docNumber;
      s.docType = this.state.docType;
      s.alergicToFood = this.state.alergicToFood;
      s.alergicToMedicine = this.state.alergicToMedicine;
      s.studentAddress = this.state.studentAddress;
      localStorage.setItem('LAST_STUDENT', JSON.stringify(s));

      const current = this.state.current + 1;
      this.setState({ current, address: this.state.studentAddress });
    }
  }

  next2() {
    this.props.form.validateFieldsAndScroll((err, values) => {});
    if (this.state.motherName && this.state.fatherName) {
      let student = {};
      student.name = this.state.name;
      student.sex = this.state.gender;
      student.docNumber = this.state.docNumber;
      student.docType = this.state.docType;
      student.alergicToFood = this.state.alergicToFood;
      student.alergicToMedicine = this.state.alergicToMedicine;
      student.studentAddress = this.state.studentAddress;
      student.motherName = this.state.motherName;
      student.fatherName = this.state.fatherName;
      student.fatherContact = this.state.fatherContact;
      student.motherContact = this.state.motherContact;
      localStorage.setItem('LAST_STUDENT', JSON.stringify(student));
      const current = this.state.current + 1;
      this.setState({ current });
    }
  }

  next3() {
    this.props.form.validateFieldsAndScroll((err, values) => {});
    if (
      this.state.kinshipDegree &&
      this.state.carierName &&
      this.state.carierContact &&
      this.state.address &&
      this.state.carierContact.length === 9
    ) {
      let student = {};
      student.name = this.state.name;
      student.sex = this.state.gender;
      student.docNumber = this.state.docNumber;
      student.docType = this.state.docType;
      student.alergicToFood = this.state.alergicToFood;
      student.alergicToMedicine = this.state.alergicToMedicine;
      student.studentAddress = this.state.studentAddress;
      student.motherName = this.state.motherName;
      student.fatherName = this.state.fatherName;
      student.fatherContact = this.state.fatherContact;
      student.motherContact = this.state.motherContact;
      student.kinshipDegree = this.state.kinshipDegree;
      student.carierName = this.state.carierName;
      student.carierContact = this.state.carierContact;
      student.address = this.state.address;
      localStorage.setItem('LAST_STUDENT', JSON.stringify(student));

      const current = this.state.current + 1;
      this.setState({ current });
    }
  }

  next4() {
    this.props.form.validateFieldsAndScroll((err, values) => {});
    if (this.state.frequency && this.state.paymentMethod) {
      let student = {};
      student.name = this.state.name;
      student.sex = this.state.gender;
      student.docNumber = this.state.docNumber;
      student.docType = this.state.docType;
      student.alergicToFood = this.state.alergicToFood;
      student.alergicToMedicine = this.state.alergicToMedicine;
      student.studentAddress = this.state.studentAddress;
      student.motherName = this.state.motherName;
      student.fatherName = this.state.fatherName;
      student.fatherContact = this.state.fatherContact;
      student.motherContact = this.state.motherContact;
      student.kinshipDegree = this.state.kinshipDegree;
      student.carierName = this.state.carierName;
      student.carierContact = this.state.carierContact;
      student.address = this.state.address;
      student.level = this.state.frequency;
      student.paymentMethod = this.state.paymentMethod;
      student.monthlyPayment = this.state.monthlyPayment;
      student.registrationValue = this.state.registrationValue;
      student.discount = this.state.discount;
      localStorage.setItem('LAST_STUDENT', JSON.stringify(student));

      const current = this.state.current + 1;
      this.setState({ current });
    }
  }

  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }

  restart() {
    const { form, dispatch } = this.props;
    form.resetFields();
    localStorage.removeItem('LAST_STUDENT');

    this.setState({
      current: 0,
      loading: false,
      confirmDirty: false,
      autoCompleteResult: [],
      name: '',
      birthDate: '',
      gender: '',
      docType: '',
      docNumber: '',
      motherName: '',
      carierContact: '',
      carierName: '',
      oldMonthlyValue: 0,
      jobLocation: '',
      address: '',
      kinshipDegree: '',
      studentAddress: '',
      isNew: true,
      needSpecialHour: false,
      isAlergicToMedicine: false,
      isAlergicToFood: false,
      alergicToFood: '',
      alergicToMedicine: '',
      studentNumber: 1,
      fatherName: '',
      motherContact: '',
      fatherContact: '',
      registrationValue: 0,
      recurigRegistrationValue: 0,
      monthlyPayment: 0,
      requireDocNumber: false,
      total: 0,
      address: '',
      contact: '',
      workplace: '',
      issaving: false,
      imageUrl: '',
      frequency: '',
      file: {},
      frequencies: [],
      discount: 0.0,
      paymentMethod: '',
    });
  }

  render() {
    const { current } = this.state;
    const { frequencies } = this.props;
    const { getFieldDecorator } = this.props.form;
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Fotografia</div>
      </div>
    );

    const { imageUrl } = this.state;

    const { Option } = Select;
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 18,
          offset: 6,
        },
      },
    };

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: 'BI',
    })(
      <Select style={{ width: 200 }}>
        <Option value="BI">{formatMessage({ id: 'document.type.id' })}</Option>
        <Option value="cedula">{formatMessage({ id: 'document.type.personal.id.card' })}</Option>
        <Option value="Nenhum">{formatMessage({ id: 'document.type.personal.nodoc' })}</Option>
      </Select>,
    );

    const extra = (
      <>
        <Button type="primary" onClick={this.restart.bind(this)}>
          {formatMessage({ id: 'student.add' })}
        </Button>
        <Button onClick={() => this.props.history.push('/student/mantain')}>
          {formatMessage({ id: 'list.student' })}
        </Button>
      </>
    );

    return (
      <PageHeaderWrapper>
        <Card>
          <Steps current={current} size="default">
            {steps.map(item => (
              <Step
                key={item.title}
                title={item.title}
                icon={
                  item.title === formatMessage({ id: 'global.confirm' }) &&
                  current == 4 &&
                  this.state.issaving ? (
                    <Icon type="loading" />
                  ) : null
                }
              />
            ))}
          </Steps>
          <div className="steps-content">
            {current == 0 ? (
              <Row
                style={
                  localStorage.getItem('LAST_STUDENT') != null
                    ? { padding: '0px 0px' }
                    : { padding: '50px 20px' }
                }
              >
                {localStorage.getItem('LAST_STUDENT') != null ? (
                  <Alert
                    style={{ margin: '30px 10px' }}
                    description={formatMessage({ id: 'unsaved.student.warning' })}
                    type="warning"
                  ></Alert>
                ) : null}
                <Col span={3}>
                  <Upload
                    name="avatar"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    beforeUpload={this.beforeUpload.bind(this)}
                    onChange={this.handleChange}
                  >
                    {imageUrl ? (
                      <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
                    ) : (
                      uploadButton
                    )}
                  </Upload>
                </Col>
                <Col span={21}>
                  <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                    <Form.Item
                      label={
                        <span>
                          {formatMessage({ id: 'student.name' })}&nbsp;
                          <Tooltip title="O {formatMessage({id:'student.name'})} do Estudante?">
                            <Icon type="question-circle-o" />
                          </Tooltip>
                        </span>
                      }
                    >
                      {getFieldDecorator('name', {
                        initialValue: `${this.state.name}`,
                        rules: [
                          {
                            required: true,
                            message: 'Por favor informe o nome!',
                            whitespace: true,
                          },
                        ],
                      })(
                        <Input name="name" autoComplete="off" onChange={this.handleChangeInput} />,
                      )}
                    </Form.Item>
                    <Form.Item label={formatMessage({ id: 'student.birthdate' })}>
                      {getFieldDecorator('date-picker', {
                        rules: [
                          {
                            type: 'object',
                            required: true,
                            message: 'Por favor informe a data de Nascimento!',
                            whitespace: true,
                          },
                        ],
                      })(
                        <DatePicker
                          style={{ width: '100%' }}
                          onChange={this.handleSelectbirthDate}
                          disabledDate={desabledBirthDate}
                        />,
                      )}
                    </Form.Item>
                    <Form.Item label={formatMessage({ id: 'student.sex' })}>
                      {getFieldDecorator('gender', {
                        initialValue: `${this.state.gender}`,
                        rules: [{ required: true, message: 'Por favor informe o Sexo!' }],
                      })(
                        <Select
                          showSearch
                          placeholder="Seleccione.."
                          optionFilterProp="children"
                          onChange={this.handleSelectGender}
                          value={this.state.gender}
                          filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          <Option value="M">{formatMessage({ id: 'student.male' })}</Option>
                          <Option value="F">{formatMessage({ id: 'student.female' })}</Option>
                        </Select>,
                      )}
                    </Form.Item>

                    <Form.Item label={formatMessage({ id: 'student.document.type' })}>
                      {getFieldDecorator('doctype', {
                        initialValue: `${this.state.docType}`,
                        rules: [
                          { required: true, message: 'Por favor informe o tipo de documento!' },
                        ],
                      })(
                        <Select
                          showSearch
                          style={{ width: 200 }}
                          placeholder="Seleccione o tipo de Documento"
                          optionFilterProp="children"
                          onChange={this.handleSelectDocType}
                          value={this.state.docType}
                          filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          <Option value="BI">{formatMessage({ id: 'document.type.id' })}</Option>
                          <Option value="Passaporte">
                            {formatMessage({ id: 'document.type.passport' })}
                          </Option>
                          <Option value="Cedula">
                            {formatMessage({ id: 'document.type.personal.id.card' })}
                          </Option>
                          <Option value="Bolentim">
                            {formatMessage({ id: 'document.type.birth.bollentin' })}
                          </Option>
                          <Option value="Nenhum">
                            {formatMessage({ id: 'document.type.nodoc' })}
                          </Option>
                        </Select>,
                      )}
                    </Form.Item>

                    <Form.Item
                      label={formatMessage({ id: 'student.document.number' })}
                      required="false"
                    >
                      {getFieldDecorator('docNumber', {
                        initialValue: `${this.state.docNumber}`,
                        rules: [
                          {
                            required: this.state.requireDocNumber,
                            message: 'Por favor informe o tipo de documento!',
                          },
                        ],
                      })(
                        <Input
                          style={{ width: '100%' }}
                          autoComplete="off"
                          placeholder={formatMessage({ id: 'student.document.number' })}
                          name="docNumber"
                          onChange={this.handleChangeInput}
                        />,
                      )}{' '}
                    </Form.Item>
                    <Form.Item label={<span>{formatMessage({ id: 'student.address' })}</span>}>
                      {getFieldDecorator('studentAddress', {
                        initialValue: `${this.state.studentAddress}`,
                        rules: [
                          {
                            required: true,
                            message: 'Por favor informe a morada do Aluno!',
                            whitespace: true,
                          },
                        ],
                      })(
                        <TextArea
                          rows={4}
                          name="studentAddress"
                          onChange={this.handleChangeInput}
                        />,
                      )}
                    </Form.Item>
                    <Form.Item {...tailFormItemLayout}>
                      <Row>
                        <Col span={8}>
                          <Checkbox
                            name="isNew"
                            checked={this.state.isNew}
                            onChange={this.changeNewStudent.bind(this)}
                          >
                            {formatMessage({ id: 'student.newcommer' })}
                          </Checkbox>
                        </Col>
                        <Col span={8}>
                          <Checkbox
                            name="isAlergicToFood"
                            checked={this.state.isAlergicToFood}
                            onChange={this.changeIsAlergicToFood.bind(this)}
                          >
                            {formatMessage({ id: 'student.alergic.tofood' })}
                          </Checkbox>
                        </Col>
                        <Col span={8}>
                          <Checkbox
                            name="isAlergicToMedicine"
                            checked={this.state.isAlergicToMedicine}
                            onChange={this.changeIsAlergicMedicine.bind(this)}
                          >
                            {formatMessage({ id: 'student.alergic.tomedicine' })}
                          </Checkbox>
                        </Col>
                      </Row>

                      {this.state.isAlergicToFood ? (
                        <Form.Item
                          label={<span>{formatMessage({ id: 'student.food.list' })}</span>}
                        >
                          {getFieldDecorator('alergicToFood', {
                            initialValue: `${this.state.alergicToFood}`,
                            rules: [
                              {
                                required: false,
                                message: 'Por favor informe a morada do Aluno!',
                                whitespace: true,
                              },
                            ],
                          })(
                            <TextArea
                              rows={4}
                              name="alergicToFood"
                              onChange={this.handleChangeInput}
                            />,
                          )}
                        </Form.Item>
                      ) : null}

                      {this.state.isAlergicToMedicine ? (
                        <Form.Item
                          label={<span>{formatMessage({ id: 'student.medicine.list' })}</span>}
                        >
                          {getFieldDecorator('alergicToMedicine', {
                            initialValue: `${this.state.alergicToMedicine}`,
                            rules: [
                              {
                                required: false,
                                message: 'Por favor informe a morada do Aluno!',
                                whitespace: true,
                              },
                            ],
                          })(
                            <TextArea
                              rows={4}
                              name="alergicToMedicine"
                              onChange={this.handleChangeInput}
                            />,
                          )}
                        </Form.Item>
                      ) : null}
                    </Form.Item>

                    <Form.Item>
                      <Button
                        type="danger"
                        style={{ marginLeft: 180 }}
                        onClick={() => this.restart()}
                      >
                        {formatMessage({ id: 'global.cancel' })}
                      </Button>
                      <Button
                        style={{ marginLeft: 8 }}
                        type="primary"
                        htmlType="submit"
                        onClick={() => this.next1()}
                      >
                        {formatMessage({ id: 'global.next' })}
                      </Button>
                    </Form.Item>
                  </Form>
                </Col>
              </Row>
            ) : null}
            {current == 1 ? (
              <Form {...formItemLayout} style={{ padding: '50px 0' }}>
                <Form.Item label={<span>{formatMessage({ id: 'student.father.name' })}</span>}>
                  {getFieldDecorator('fatherName', {
                    initialValue: `${this.state.fatherName}`,
                    rules: [
                      {
                        required: true,
                        message: 'Por favor informe o nome do Pai!',
                        whitespace: true,
                      },
                    ],
                  })(
                    <Input
                      autoComplete="off"
                      name="fatherName"
                      onChange={this.handleChangeInput}
                    />,
                  )}
                </Form.Item>

                <Form.Item label={<span>{formatMessage({ id: 'student.mother.name' })}</span>}>
                  {getFieldDecorator('motherName', {
                    initialValue: `${this.state.motherName}`,
                    rules: [
                      {
                        required: true,
                        message: 'Por favor informe o nome da Mãe!',
                        whitespace: true,
                      },
                    ],
                  })(
                    <Input
                      autoComplete="off"
                      name="motherName"
                      onChange={this.handleChangeInput}
                    />,
                  )}
                </Form.Item>

                <Form.Item label={<span>{formatMessage({ id: 'student.father.contact' })}</span>}>
                  <Row gutter={8}>
                    <Col span={3}>
                      <Input defaultValue="+258" disabled="true" />
                    </Col>
                    <Col span={8}>
                      <Input
                        autoComplete="off"
                        maxLength="9"
                        minLength="9"
                        name="fatherContact"
                        value={this.state.fatherContact}
                        onChange={this.handleChangeInput}
                      />
                    </Col>
                  </Row>
                </Form.Item>
                <Form.Item label={<span>{formatMessage({ id: 'student.mother.contact' })}</span>}>
                  <Row gutter={8}>
                    <Col span={3}>
                      <Input defaultValue="+258" disabled="true" />
                    </Col>
                    <Col span={8}>
                      <Input
                        autoComplete="off"
                        maxLength="9"
                        value={this.state.motherContact}
                        name="motherContact"
                        onChange={this.handleChangeInput}
                      />
                    </Col>
                  </Row>
                </Form.Item>
                <Form.Item>
                  <Button type="danger" style={{ marginLeft: 180 }} onClick={() => this.restart()}>
                    {formatMessage({ id: 'global.cancel' })}
                  </Button>
                  <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                    {formatMessage({ id: 'global.previous' })}
                  </Button>

                  <Button
                    style={{ marginLeft: 8 }}
                    type="primary"
                    htmlType="submit"
                    onClick={() => this.next2()}
                  >
                    {formatMessage({ id: 'global.next' })}
                  </Button>
                </Form.Item>
              </Form>
            ) : null}

            {current == 2 ? (
              <Form {...formItemLayout} style={{ padding: '50px 0' }}>
                <Form.Item label="Grau de Parentesco">
                  {getFieldDecorator('kinshipDegree', {
                    initialValue: `${this.state.kinshipDegree}`,
                    rules: [{ required: true, message: 'Por favor informe o Grau de Parentesco!' }],
                  })(
                    <Select
                      showSearch
                      placeholder="Seleccione o grau de Parentesco.."
                      optionFilterProp="children"
                      onChange={this.handleSelectKinShip}
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      <Option value="PAI">{formatMessage({ id: 'kinship.father' })}</Option>
                      <Option value="MAE">{formatMessage({ id: 'kinship.mother' })}</Option>
                      <Option value="TIO">{formatMessage({ id: 'kinship.ancle' })}</Option>
                      <Option value="AVO">{formatMessage({ id: 'kinship.grandfather' })}</Option>
                      <Option value="IRMAO">{formatMessage({ id: 'kinship.brother' })}</Option>
                    </Select>,
                  )}
                </Form.Item>

                <Form.Item label={<span>{formatMessage({ id: 'student.sponsor.name' })}</span>}>
                  {getFieldDecorator('carierName', {
                    initialValue: `${this.state.carierName}`,
                    rules: [
                      {
                        required: true,
                        message: 'Por favor informe o nome do Encarregado!',
                        whitespace: true,
                      },
                    ],
                  })(
                    <Input
                      autoComplete="off"
                      name="carierName"
                      value={this.state.carierName}
                      onChange={this.handleChangeInput}
                    />,
                  )}
                </Form.Item>

                <Form.Item
                  label={<span>{formatMessage({ id: 'student.sponsor.workplace' })}</span>}
                >
                  <Input
                    value={this.state.jobLocation}
                    name="jobLocation"
                    onChange={this.handleChangeInput}
                  />
                </Form.Item>

                <Form.Item label={<span>{formatMessage({ id: 'student.sponsor.contact' })}</span>}>
                  <Row gutter={8}>
                    <Col span={3}>
                      <Input defaultValue="+258" disabled="true" />
                    </Col>
                    <Col span={8}>
                      {getFieldDecorator('carierContact', {
                        initialValue: `${this.state.carierContact}`,
                        rules: [
                          {
                            required: true,
                            message: 'Por favor informe um Número válido!',
                            whitespace: true,
                            len: 9,
                          },
                        ],
                      })(
                        <Input
                          autoComplete="off"
                          name="carierContact"
                          onChange={this.handleChangeInput}
                        />,
                      )}
                    </Col>
                  </Row>
                </Form.Item>
                <Form.Item label={<span>{formatMessage({ id: 'student.sponsor.address' })}</span>}>
                  {getFieldDecorator('address', {
                    initialValue: `${this.state.address}`,
                    rules: [
                      {
                        required: true,
                        message: 'Por favor informe o endereço!',
                        whitespace: true,
                      },
                    ],
                  })(<TextArea rows={4} name="address" onChange={this.handleChangeInput} />)}
                </Form.Item>
                <Form.Item>
                  <Button type="danger" style={{ marginLeft: 180 }} onClick={() => this.restart()}>
                    {formatMessage({ id: 'global.cancel' })}
                  </Button>
                  <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                    {formatMessage({ id: 'global.previous' })}
                  </Button>

                  <Button
                    style={{ marginLeft: 8 }}
                    type="primary"
                    htmlType="submit"
                    onClick={() => this.next3()}
                  >
                    {formatMessage({ id: 'global.next' })}
                  </Button>
                </Form.Item>
              </Form>
            ) : null}

            {current == 3 ? (
              <Form {...formItemLayout} style={{ padding: '50px 0' }}>
                <Form.Item label={formatMessage({ id: 'student.registration.level' })}>
                  {getFieldDecorator('frequency', {
                    initialValue: `${this.state.frequency}`,
                    rules: [{ required: true, message: 'Por favor informe o Nível!' }],
                  })(
                    <Select
                      showSearch
                      placeholder="Seleccione o Nível.."
                      optionFilterProp="children"
                      onChange={this.handleSelectClass}
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {frequencies.map(f => (
                        <Option value={f.level}>{f.description}</Option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
                <Form.Item label={formatMessage({ id: 'student.registration.discount' })}>
                  <Select
                    showSearch
                    placeholder="Seleccione o desconto.."
                    optionFilterProp="children"
                    onChange={this.handleSelectDiscount}
                    value={this.state.discount}
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    <Option value="0.0">0%</Option>
                    <Option value="0.05">5%</Option>
                    <Option value="0.10">10%</Option>
                    <Option value="0.15">15%</Option>
                    <Option value="0.20">20%</Option>
                    <Option value="0.25">25%</Option>
                    <Option value="0.30">30%</Option>
                    <Option value="0.35">35%</Option>
                  </Select>
                </Form.Item>
                <Form.Item label={formatMessage({ id: 'student.registration.payment.method' })}>
                  {getFieldDecorator('paymentMethod', {
                    initialValue: `${this.state.paymentMethod}`,
                    rules: [
                      { required: true, message: 'Por favor informe as formas de Pagamento!' },
                    ],
                  })(
                    <Select
                      showSearch
                      placeholder="Seleccione a forma de Pagamento..."
                      optionFilterProp="children"
                      onChange={this.handleSelectPaymentType}
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      <Option value="NUMERARIO">
                        {formatMessage({ id: 'payment.method.cash' })}
                      </Option>
                      <Option value="POS">{formatMessage({ id: 'payment.method.pos' })}</Option>
                      <Option value="TRANSFERENCIA">
                        {formatMessage({ id: 'payment.method.bank.transfer' })}
                      </Option>
                      <Option value="DEPOSITO">
                        {formatMessage({ id: 'payment.method.bank.deposit' })}
                      </Option>
                      <Option value="MPEZA">{formatMessage({ id: 'payment.method.mpesa' })}</Option>
                    </Select>,
                  )}
                </Form.Item>

                <Form.Item>
                  <div className={styles.information} style={{ marginLeft: 200 }}>
                    <Descriptions column={1}>
                      <Descriptions.Item
                        label={formatMessage({ id: 'student.registration.amount' })}
                      >
                        <Statistic value={this.state.registrationValue} suffix="MZN" />
                      </Descriptions.Item>
                      <Descriptions.Item
                        label={formatMessage({ id: 'student.registration.monthly.payment' })}
                      >
                        <Statistic value={this.state.monthlyPayment} suffix="MZN" />
                      </Descriptions.Item>

                      <Descriptions.Item
                        label={formatMessage({ id: 'student.registration.total.payment' })}
                      >
                        <Statistic value={this.state.total} suffix="MZN" />
                      </Descriptions.Item>
                    </Descriptions>
                  </div>
                  <Button type="danger" style={{ marginLeft: 180 }} onClick={() => this.restart()}>
                    {formatMessage({ id: 'global.cancel' })}
                  </Button>
                  <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                    {formatMessage({ id: 'global.previous' })}
                  </Button>

                  <Button
                    style={{ marginLeft: 8 }}
                    type="primary"
                    htmlType="submit"
                    onClick={() => this.next4()}
                  >
                    {formatMessage({ id: 'global.next' })}
                  </Button>
                </Form.Item>
              </Form>
            ) : null}

            {current == 4 ? (
              <Form {...formItemLayout} style={{ padding: '50px 0' }}>
                <Alert
                  message={formatMessage({ id: 'global.confirm.message' })}
                  type="info"
                  showIcon
                />

                <Descriptions
                  title="Dados Pessoais"
                  style={{ marginBottom: 10, marginTop: 32 }}
                  column={4}
                  className={styles.information}
                >
                  <Descriptions.Item label={formatMessage({ id: 'student.name' })}>
                    {this.state.name}
                  </Descriptions.Item>
                  <Descriptions.Item label={formatMessage({ id: 'student.birthdate' })}>
                    {this.state.birthDate.format('DD/MM/YYYY')}
                  </Descriptions.Item>
                  <Descriptions.Item label={formatMessage({ id: 'student.sex' })}>
                    {this.state.gender}
                  </Descriptions.Item>
                  <Descriptions.Item label={formatMessage({ id: 'student.document.type' })}>
                    {this.state.docType}
                  </Descriptions.Item>
                  <Descriptions.Item label={formatMessage({ id: 'student.document.number' })}>
                    {this.state.docNumber}
                  </Descriptions.Item>
                </Descriptions>
                <Divider style={{ marginBottom: 10 }} column={4} />
                <Descriptions
                  title={formatMessage({ id: 'student.parents' })}
                  style={{ marginBottom: 10 }}
                  className={styles.information}
                >
                  <Descriptions.Item label={formatMessage({ id: 'student.father.name' })}>
                    {this.state.fatherName}
                  </Descriptions.Item>
                  <Descriptions.Item label={formatMessage({ id: 'student.father.contact' })}>
                    {this.state.fatherContact}
                  </Descriptions.Item>
                  <Descriptions.Item label={formatMessage({ id: 'student.mother.name' })}>
                    {this.state.motherName}
                  </Descriptions.Item>
                  <Descriptions.Item label={formatMessage({ id: 'student.mother.contact' })}>
                    {this.state.motherContact}
                  </Descriptions.Item>
                </Descriptions>
                <Divider style={{ marginBottom: 10 }} />
                <Descriptions
                  title={formatMessage({ id: 'student.sponsor' })}
                  style={{ marginBottom: 10 }}
                  column={4}
                  className={styles.information}
                >
                  <Descriptions.Item label={formatMessage({ id: 'student.kuinship.degree' })}>
                    {this.state.kinshipDegree}
                  </Descriptions.Item>
                  <Descriptions.Item label={formatMessage({ id: 'student.sponsor.name' })}>
                    {this.state.carierName}
                  </Descriptions.Item>
                  <Descriptions.Item label={formatMessage({ id: 'student.sponsor.contact' })}>
                    {this.state.carierContact}
                  </Descriptions.Item>
                  <Descriptions.Item label={formatMessage({ id: 'student.sponsor.workplace' })}>
                    {this.state.jobLocation}
                  </Descriptions.Item>
                  <Descriptions.Item label={formatMessage({ id: 'student.sponsor.address' })}>
                    {this.state.address}
                  </Descriptions.Item>
                </Descriptions>
                <Divider style={{ marginBottom: 10 }} />
                <Descriptions
                  title={formatMessage({ id: 'student.registration.details' })}
                  style={{ marginBottom: 10 }}
                  column={4}
                  className={styles.information}
                >
                  <Descriptions.Item label={formatMessage({ id: 'student.registration.level' })}>
                    {frequencies.filter(f => f.level == this.state.frequency)[0].description}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={formatMessage({ id: 'student.registration.monthly.payment' })}
                  >
                    {this.state.monthlyPayment}
                  </Descriptions.Item>
                  <Descriptions.Item label={formatMessage({ id: 'student.registration.amount' })}>
                    {this.state.registrationValue}
                  </Descriptions.Item>
                  <Descriptions.Item label={formatMessage({ id: 'student.registration.amount' })}>
                    {this.state.paymentMethod}
                  </Descriptions.Item>
                </Descriptions>
                <Form.Item>
                  <Button style={{ marginLeft: 180 }} onClick={() => this.prev()}>
                    {formatMessage({ id: 'global.previous' })}
                  </Button>

                  <Button
                    style={{ marginLeft: 8 }}
                    loading={this.state.issaving}
                    type="primary"
                    htmlType="submit"
                    onClick={() => this.confirmTransaction()}
                  >
                    {formatMessage({ id: 'global.confirm' })}
                  </Button>
                </Form.Item>
              </Form>
            ) : null}
            {current == 5 ? (
              <Form {...formItemLayout} style={{ padding: '50px 0' }}>
                <Result
                  status="success"
                  title={formatMessage({ id: 'global.success.message' })}
                  subTitle={formatMessage({ id: 'global.gegistration.success' })}
                  extra={extra}
                />
                <Form.Item></Form.Item>
              </Form>
            ) : null}
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
export default Form.create({})(Student);
