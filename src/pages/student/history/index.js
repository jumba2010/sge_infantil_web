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
import { connect } from 'dva';
const { TextArea } = Input;
const { Text } = Typography;
const { TabPane } = Tabs;

import styles from './index.less';
import paymenRowRender from './utils/paymentRowRender.js';
const FormItem = Form.Item;

const pageSize = 6;

@connect(({student }) => ({
  frequencies:student.frequencies
}))
class StudentHistory extends React.Component {
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
      message: '',
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

  handleChangeInput(evt) {
    if (evt.target.name === 'name') {
      let s = this.state.lastdata.filter(
        d => d.name.toLowerCase().indexOf(evt.target.value.toLowerCase()) > -1,
      );
      this.setState({ data: s });
    }

    if (evt.target.name === 'message') {
      this.setState({ message: evt.target.value });
    }
  }
  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  onSelectAll = allSelected => {
    if (this.state.selectedRowKeys.length && allSelected) {
      this.setState({
        selectedRowKeys: allSelected,
      });
    }
  };

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

  handleSearch = () => {
    e.preventDefault();
  };

  renderSimpleForm() {
    const { form } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="Nome">
              {getFieldDecorator('name', {
                initialValue: '',
                rules: [
                  {
                    required: false,
                    message: 'Por favor informe o nome do Encarregado!',
                    whitespace: true,
                  },
                ],
              })(
                <Input
                  placeholder="Nome.."
                  autoComplete="off"
                  name="name"
                  onChange={this.handleChangeInput}
                />,
              )}
            </FormItem>
          </Col>

          <Col md={7} sm={24}>
            <FormItem label="Nível">
              {getFieldDecorator('level', { initialValue: '', rules: [{ required: false }] })(
                <Select
                  onChange={this.handleSelectClass}
                  placeholder="Pesqise pelo Nível ..."
                  style={{ width: '100%' }}
                >
                  {this.props.frequencies.map(f => (
                    <Option value={f.level}>{f.description}</Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>

          <Col md={9} sm={24}>
            <span>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset.bind(this)}>
                Limpar Campos
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                Mostrar Mais <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const { form } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="Nome">
              {getFieldDecorator('name', { initialValue: '', rules: [{ required: false }] })(
                <Input
                  name="name"
                  autoComplete="off"
                  onChange={this.handleChangeInput}
                  placeholder="Pesquise pelo nome ..."
                />,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="Nível">
              {getFieldDecorator('level', { initialValue: '', rules: [{ required: false }] })(
                <Select
                  onChange={this.handleSelectClass}
                  placeholder="Pesquise pelo Nível ..."
                  style={{ width: '100%' }}
                >
                  {this.props.frequencies.map(f => (
                    <Option value={f.level}>{f.description}</Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="Idade">
              <InputNumber style={{ width: '100%' }} />
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="Data de Inscrição">
              {getFieldDecorator('createdAt', {
                initialValue: '',
                rules: [{ type: 'object', required: false }],
              })(
                <DatePicker
                  name="createdAt"
                  style={{ width: '100%' }}
                  placeholder="Data de Inscrição"
                />,
              )}
            </FormItem>
          </Col>

          <Col md={8} sm={24}>
            <FormItem label="Estado">
              {getFieldDecorator('createdAt', { initialValue: '', rules: [{ required: false }] })(
                <Select placeholder="Estado.." style={{ width: '100%' }}>
                  <Option value="0">Activo</Option>
                  <Option value="1">Inactivo</Option>
                  <Option value="2">Novo Ingresso</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ float: 'right', marginBottom: 24 }}>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              Limpar Campos
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              Mostrar Menos <Icon type="up" />
            </a>
          </div>
        </div>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
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
  }

  searchFields() {
    api
      .get('/api/student/history/sucursal/' + JSON.parse(localStorage.getItem(SUCURSAL)).id)
      .then(res => {
        const pagination = { ...this.state.pagination };
        pagination.total = res.data.length;
        pagination.pageSize = pageSize;

        this.setState({
          originaldata: res.data,
          data: res.data,
          students: res.data,
          lastdata: res.data,
          loadign: false,
          pagination,
        });
      });
  }

  render() {
    const columns = [
      { title: 'Nome', dataIndex: 'name', key: 'name', render: text => <a>{text}</a> },
      { title: 'Data de Nacimento', dataIndex: 'birthDate', key: 'birthDate' },
      {
        title: 'Nível',
        dataIndex: 'level',
        key: 'level',
        render: (_, record) => (
          <Text>{this.props.frequencies.filter(frq => frq.level === record.level)[0].description}</Text>
        ),
      },
      {
        title: 'Data de Inscrição',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (_, record) => <Text>{moment(record.createdAt).format('YYYY-MM-DD')}</Text>,
      },
      ,
    ];

    const registrationCollumns = [
      {
        title: 'Ano',
        dataIndex: 'year',
        key: 'year',
      },

      {
        title: 'Nível',
        dataIndex: 'level',
        key: 'level',
        render: (_, record) => (
          <Text>{this.props.frequencies.filter(frq => frq.id === record.classId)[0].description}</Text>
        ),
      },
      {
        title: 'Valor da Mensalidade',
        dataIndex: 'monthlyPayment',
        key: 'monthlyPayment',
      },

      {
        title: 'Desconto',
        dataIndex: 'discount',
        key: 'discount',
        render: text => <div>{parseFloat(text) * 100} %</div>,
      },

      {
        title: 'Data de Inscrição',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (_, record) => <Text>{moment(record.createdAt).format('YYYY-MM-DD')}</Text>,
      },
      ,
    ];

    const hasSelected = this.state.selectedRowKeys.length > 0;
    const { getFieldDecorator } = this.props.form;

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="Lista de Estudantes" key="1" style={{ marginButton: 20 }}>
              <div className={styles.tableList}>
                <div className={styles.tableListForm}>{this.renderForm()}</div>
                <div className={styles.tableListOperator}>
                  <span style={{ marginLeft: 8 }}>
                    {`Total de Estudantes: ${this.state.data.length}`}
                  </span>
                </div>
                <Table
                  className="components-table-demo-nested"
                  columns={columns}
                  onSelectChange={this.onSelectChange}
                  rowKey={record => record.studentNumber}
                  loading={this.state.loadign}
                  onSelectAll={this.onSelectAll}
                  expandedRowRender={record => (
                    <div style={{ marginBottom: 10, marginTop: 32 }}>
                      <Descriptions
                        title="Dados Pessoais"
                        column={2}
                        className={styles.information}
                      >
                        <Descriptions.Item label="{formatMessage({id:'student.name'})}">{record.name}</Descriptions.Item>
                        <Descriptions.Item label="Data de Nascimento">
                          {record.birthDate}
                        </Descriptions.Item>
                        <Descriptions.Item label="Sexo">{record.sex}</Descriptions.Item>
                        <Descriptions.Item label="Alérgico aos medicamentos">
                          {record.alergicToMedicine}
                        </Descriptions.Item>
                        <Descriptions.Item label="Alérgico a comida">
                          {record.alergicToFood}
                        </Descriptions.Item>
                        <Descriptions.Item label="Morada">{record.address}</Descriptions.Item>
                        <Descriptions.Item label="Tipo de Documento">
                          {record.docType}
                        </Descriptions.Item>
                        <Descriptions.Item label="Nr. de Documento">
                          {record.docNumber}
                        </Descriptions.Item>
                      </Descriptions>
                      <Divider style={{ marginBottom: 10 }} column={2} />
                      <Descriptions
                        title="Filiação"
                        style={{ marginBottom: 10 }}
                        className={styles.information}
                      >
                        <Descriptions.Item label="Nome do Pai">
                          {record.fatherName}
                        </Descriptions.Item>
                        <Descriptions.Item label="Contacto do Pai">
                          {record.fatherContact}
                        </Descriptions.Item>
                        <Descriptions.Item label="Nome da Mãe">
                          {record.motherName}
                        </Descriptions.Item>
                        <Descriptions.Item label="Contacto da Mãe">
                          {record.motherContact}
                        </Descriptions.Item>
                      </Descriptions>
                      <Divider style={{ marginBottom: 10 }} />
                      <Descriptions
                        title="Dados do Encarregado"
                        style={{ marginBottom: 10 }}
                        column={2}
                        className={styles.information}
                      >
                        <Descriptions.Item label="Grau de Parentesco">
                          {record.carier.kinshipDegree}
                        </Descriptions.Item>
                        <Descriptions.Item label="Nome">{record.carier.name}</Descriptions.Item>
                        <Descriptions.Item label="Contacto">
                          {record.carier.contact}
                        </Descriptions.Item>
                        <Descriptions.Item label="Local de Trabalho">
                          {record.carier.workPlace}
                        </Descriptions.Item>
                      </Descriptions>
                      <Divider style={{ marginBottom: 10 }} />
                      <h3>Historico de Inscrição</h3>
                      <Table
                        className="components-table-demo-nested"
                        columns={registrationCollumns}
                        rowKey={record => record.id}
                        dataSource={record.registrations}
                        expandedRowRender={paymenRowRender}
                      />
                    </div>
                  )}
                  pagination={this.state.pagination}
                  dataSource={this.state.data}
                />
              </div>
            </TabPane>
          </Tabs>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
export default Form.create({})(StudentHistory);
