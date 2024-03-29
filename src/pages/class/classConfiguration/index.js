import React from 'react';
import ReactDOM from 'react-dom';
var querystring = require('querystring');
import {
  Table,
  Card,
  Row,
  Col,
  Badge,
  DatePicker,
  Descriptions,
  Modal,
  Popconfirm,
  Divider,
  Menu,
  Statistic,
  Dropdown,
  Tabs,
  Icon,
  Button,
  Form,
  Input,
  Select,
  InputNumber,
  message,
  Typography,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { notification } from 'antd';
import api, { baseURL } from '../../../services/api';
import { USER_KEY, SUCURSAL } from '../../../services/auth';
import moment from 'moment';
import axios from 'axios';
const { TextArea } = Input;
const { Text } = Typography;
const { TabPane } = Tabs;
const frequencies = JSON.parse(localStorage.getItem('FREQUENCIES'));
import styles from './index.less';
const FormItem = Form.Item;
const apiRemote = axios.create({
  baseURL: 'http://localhost:3333/',
});

const pageSize = 6;

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

class ListStudent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      studentIds: [],
      originaldata: [],
      sync: false,
      lastdata: [],
      students: [],
      notifications: [],
      lastNotificationdata: [],
      payments: [],
      selectedRowKeys: [],
      data: [],
      all: false,
      visible: false,
      saving: false,
      frequencies: [],
      teachers: [],
      message: '',
      className:'',
      pagination: {},
      pagination1: {},
      expandForm: false,
      loadign: true,
    };

    this.handleChangeInput = this.handleChangeInput.bind(this);
    this.handleSelectClass = this.handleSelectClass.bind(this);
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.searchFields();
  };

  editStudent(record) {
    let s = this.state.originaldata.filter(d => d.id === record.id)[0];
    this.props.history.push('/student/edit/' + s.id);
  }

  handleAnull(record) {
    let s = this.state.originaldata.filter(d => d.id === record.id)[0];
    this.props.history.push('/student/inativate/' + s.id);
  }

  handleChangeInput(evt) {
    if (evt.target.name === 'name') {
      let s = this.state.lastdata.filter(
        d => d.name.toLowerCase().indexOf(evt.target.value.toLowerCase()) > -1,
      );
      this.setState({ data: s });
    }
    if (evt.target.name === 'className') {
      this.setState({ className: evt.target.value });
    }

    if (evt.target.name === 'message') {
      this.setState({ message: evt.target.value });
    }
  }


  handleSelectClass(frequency) {
    let s = this.state.students.filter(d => d.level === frequency);
    this.setState({ data: s, lastdata: s });
  }

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  notify = () => {
    this.setState({
      visible: true,
      all: false,
    });
  };

  notifyAgain = record => {
    this.setState({
      visible: true,
      all: false,
      message: record.message,
    });
  };

  notifyAll = () => {
    this.setState({
      visible: true,
      all: true,
    });
  };

  handleOk = async () => {
    if (this.state.studentIds.length>0) {
      this.setState({
        saving: true,
      });

      let all = this.state.all;

      let studentIds = this.state.all ? this.state.studentIds : this.state.selectedRowKeys;

      apiRemote.post('/api/class', {
        message: this.state.message,
        studentIds,
        sucursalId: JSON.parse(localStorage.getItem(SUCURSAL)).id,
      }).then(function (data) {
        let classId = data.id;
        let { studentIds } = this.state;
        apiRemote.post('/api/class/' + classId + '/student', {
          studentIds,
        }).then(function (data) {
          notification.success({
            description: 'Turma cadastrada com sucesso',
            message: 'Turma cadastrada com sucesso',
          });
        })
          .catch(function (err) {
            notification.error({
              description: err,
              message: err.message,
            })
          }).catch(function (err) {
            notification.error({
              description: err,
              message: err.message,
            });
          });

        this.setState({
          saving: false,
          all: false,
          visible: false,
        });
      })
    }
  }

    handleCancel() {
      this.setState({
        visible: false,
      });
    }

    handleSelectNotificationStatus(status) {
      let s = this.state.lastNotificationdata.filter(n => n.status == status);
      this.setState({ notifications: s });
    }

    handleSearch = () => {
      e.preventDefault();
    };

    renderSimpleForm() {
      const { form } = this.props;
      const { getFieldDecorator } = this.props.form;
      return (
        <Form onSubmit={this.handleSearch} layout="inline">
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={9} sm={24}>
            <FormItem label="Nível">
                {getFieldDecorator('level', { initialValue: '', rules: [{ required: false }] })(
                  <Select
                    onChange={this.handleSelectClass}
                    placeholder="Pesqise pelo Nível ..."
                    style={{ width: 220 }}
                  >
                    {frequencies.map(f => (
                      <Option value={f.level}>{f.description}</Option>
                    ))}
                  </Select>,
                )}
              </FormItem>
            </Col>

            <Col md={10} sm={24} >
              <FormItem label="Professor">
                {getFieldDecorator('teacher', { initialValue: '', rules: [{ required: false }] })(
                  <Select
                    onChange={this.handleSelectClass}
                    placeholder="Pesqise pelo Professor ..."
                    style={{ width: 220 }}
                  >
                    {this.state.teachers.map(t => (
                      <Option value={t.name}>{t.name}</Option>
                    ))}
                  </Select>,
                )}
              </FormItem>
            </Col>

            <Col md={5} sm={24}>
              <span>
                <Button style={{ marginLeft: 2 }} onClick={this.handleFormReset.bind(this)}>
                  Limpar Campos
                </Button>
              </span>
            </Col>
          </Row>
        </Form>
      );
    }


    renderForm() {
      return  this.renderSimpleForm();
    }

    handleChangeTable = (paginatio, filters, sorter) => {
      const pager = { ...this.state.pagination };
      pager.current = paginatio.current;
      this.setState({ paginatio: pager });
    };

    handleChangeTable2 = (paginatio1, filters, sorter) => {
      const pager = { ...this.state.pagination1 };
      pager.current = paginatio1.current;
      this.setState({ paginatio1: pager });
    };

    componentDidMount() {
      this.searchFields();

      this.setState({ sync: true });
      this.searchNotifications();
    }

    searchNotifications() {
      this.setState({ sync: true });
      apiRemote
        .get('/api/smsntification/sucursal/' + JSON.parse(localStorage.getItem(SUCURSAL)).id)
        .then(res => {
          const pagination = { ...this.state.pagination };
          pagination.total = res.data.length;
          pagination.pageSize = pageSize;
          const data = [];

          this.setState({
            lastNotificationdata: res.data,
            notifications: res.data,
            pagination1: pagination,
            sync: false,
          });
        });
    }

    searchFields() {
      api
      .get('/api/teacher/' + JSON.parse(localStorage.getItem(SUCURSAL)).id)
      .then(res => {
        this.setState({
          teachers:res.data
        });
      });

      api
        .get('/api/class/sucursal/' + JSON.parse(localStorage.getItem(SUCURSAL)).id)
        .then(res => {
          const pagination = { ...this.state.pagination };
          pagination.total = res.data.length;
          pagination.pageSize = pageSize;

          let studentIds = res.data.map(s => s.studentNumber);
          this.setState({
            originaldata: res.data,
            data: res.data,
            lastdata: res.data,
            loadign: false,
            pagination,
          });
        });
    }

    render() {
      const columns = [
        { title: 'Turma', dataIndex: 'class', key: 'class', render: text => <a>{text}</a> },
        {
          title: 'Nível',
          dataIndex: 'level',
          key: 'level',
          render: (_, record) => (
            <Text>{!this.state.frequencies || this.state.frequencies.length == 0 ? '' : this.state.frequencies.filter(frq => frq.level === record.level)[0].description}</Text>
          ),
        }
        ,

        {
          title: 'Professor',
          dataIndex: 'teacher',
          key: 'teacher',
          render: (_, record) => (
            <Text>{!this.state.teachers || this.state.teachers.length == 0 ? '' : this.state.teachers.filter(t => t.id === record.teacherId)[0].name}</Text>
          ),
        },
        {
          title: 'Nr. de Estudantes',
          dataIndex: 'maxStudents',
          key: 'maxStudents',
          render: (_, record) => <Text>{record.maxStudents}</Text>,
        },
        {
          title: '',
          key: 'operation',
          render: (text, record) => (
            <span>
              <a onClick={this.editStudent.bind(this, record)}>Editar</a>
            </span>
          ),
        },
      ];


      const studentColumns = [
        {
          title: 'Nome',
          dataIndex: 'studentName'
        },
        {
          title: 'Nivel',
          dataIndex: 'frequencyDescription'
        },
        {
          title: 'Data de Nascimento',
          dataIndex: 'birthdate'
        }
      ];

      const { selectedRowKeys } = this.state;
      const rowSelection = {
        selectedRowKeys,
        onChange: this.onSelectChange,
      };

      const hasSelected = this.state.selectedRowKeys.length > 0;
      const { getFieldDecorator } = this.props.form;

      return (
        <PageHeaderWrapper>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>{this.renderForm()}</div>
              <div className={styles.tableListOperator}>
                <Button
                  icon="plus"
                  type="primary"
                  onClick={this.notify}
                >
                  Adicionar Turma
                </Button>
              </div>
              <Table
                className="components-table-demo-nested"
                columns={columns}
                onSelectChange={this.onSelectChange}
                columnTitle="Lista de Turmas"
                loading={this.state.loadign}
                pagination={this.state.pagination}
                dataSource={this.state.data}
                onChange={this.handleChangeTable}
              />
            </div>
          </Card>

          <Modal
            visible={this.state.visible}
            title='Alocar Estudantes a turma'
            onOk={this.handleOk}
            style={{ top:'10px' }}
            width={900}
            onCancel={this.handleCancel.bind(this)}
            footer={[
              <Button  type="danger" key="back" onClick={this.handleCancel.bind(this)}>
                {formatMessage({id:'global.cancel'})}
              </Button>,
              <Button
                key="submit"
                htmlType="submit"
                type="primary"
                onClick={this.handleOk.bind(this)}
                loadign={this.state.saving}
              >
                {formatMessage({id:'global.confirm'})}
              </Button>,
            ]}
          >
        <Form {...formItemLayout} >

          <FormItem label="Nome da Turma">
                {getFieldDecorator('className', { initialValue: '', rules: [{ required: true,message:"Por favor informe o nome da turma" }] })(
                  <Input autoComplete="off" onChange={this.handleChangeInput}
                    style={{ width: 300 }}
                 /> 
                )}
              </FormItem>
            <FormItem label="Nível">
                {getFieldDecorator('level', { initialValue: '', rules: [{ required: true,message:"Por favor seleccione o Nivel" }] })(
                  <Select
                    onChange={this.handleSelectClass}
                    placeholder="Pesqise pelo Nível ..."
                    style={{ width: 300 }}
                  >
                    {frequencies.map(f => (
                      <Option value={f.level}>{f.description}</Option>
                    ))}
                  </Select>,
                )}
              </FormItem>

              <FormItem label="Professor">
                {getFieldDecorator('teacher', { initialValue: '', rules: [{ required: true,message: 'Por favor informe o Nome do professor' }] })(
                  <Select showSearch
                    onChange={this.handleSelectClass}
                    placeholder="Pesqise pelo Professor ..."
                    style={{ width: 300 }}
                  >
                    {this.state.teachers.map(t => (
                      <Option value={t.name}>{t.name}</Option>
                    ))}
                  </Select>,
                )}
              </FormItem>
              </Form>
      <Table
        columns={studentColumns}
        dataSource={this.state.students}
        rowSelection={{
          type: 'checkbox'
        }}
      />
 
          </Modal>
        </PageHeaderWrapper>
      );
    }
  }
export default Form.create({ })(ListStudent);
