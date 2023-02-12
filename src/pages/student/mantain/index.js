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
const menu = (
  <Menu>
    <Menu.Item>Action 1</Menu.Item>
    <Menu.Item>Action 2</Menu.Item>
  </Menu>
);

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
    if (this.state.message) {
      this.setState({
        saving: true,
      });

      let all = this.state.all;

      let studentIds = this.state.all ? this.state.studentIds : this.state.selectedRowKeys;

      apiRemote.post('/api/smsntification/carrier', {
        message: this.state.message,
        studentIds,
        sucursalId: JSON.parse(localStorage.getItem(SUCURSAL)).id,
      });

      await notification.success({
        description: 'Notificação enviada com sucesso',
        message: 'Notificação enviada com sucesso',
      });

      this.setState({
        saving: false,
        all: false,
        visible: false,
      });
    }
  };

  handleCancel() {
    this.setState({
      visible: false,
    });
  }

  handleSelectNotificationStatus(status) {
    let s = this.state.lastNotificationdata.filter(n => n.status == status);
    console.log(status);
    console.log(this.state.lastNotificationdata);
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
                  {frequencies.map(f => (
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
                  {JSON.parse(frequencies).map(f => (
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

  renderNotificationFormForm() {
    const { form } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="Data de Envio">
              {getFieldDecorator('date-picker', {
                rules: [{ type: 'object', required: false }],
              })(<DatePicker style={{ width: '100%' }} placeholder="Data de Envio" />)}
            </FormItem>
          </Col>

          <Col md={7} sm={24}>
            <FormItem label="Estado">
              {getFieldDecorator('createdAt', { initialValue: '', rules: [{ required: false }] })(
                <Select
                  onChange={this.handleSelectNotificationStatus.bind(this)}
                  placeholder="Estado.."
                  style={{ width: '100%' }}
                >
                  <Option value="0">Nao confirmado</Option>
                  <Option value="1">Entregue</Option>
                  <Option value="2">Nao entregue</Option>
                </Select>,
              )}
            </FormItem>
          </Col>

          <Col md={9} sm={24}>
            <span>
              <Button style={{ marginLeft: 4 }} onClick={this.handleFormReset.bind(this)}>
                Limpar Campos
              </Button>

              <Button
                type="primary"
                icon="sync"
                style={{ marginLeft: 6 }}
                onClick={this.searchNotifications.bind(this)}
              >
                Refresh
              </Button>
            </span>
          </Col>
        </Row>
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
      .get('/api/registration/current/' + JSON.parse(localStorage.getItem(SUCURSAL)).id)
      .then(res => {
        const pagination = { ...this.state.pagination };
        pagination.total = res.data.length;
        pagination.pageSize = pageSize;

        let studentIds = res.data.map(s => s.studentNumber);
        this.setState({
          studentIds,
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
          <Text>{frequencies.filter(frq => frq.level === record.level)[0].description}</Text>
        ),
      },
      {
        title: 'Data de Inscrição',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (_, record) => <Text>{moment(record.createdAt).format('YYYY-MM-DD')}</Text>,
      },
      {
        title: '',
        key: 'operation',
        render: (text, record) => (
          <span>
            <a onClick={this.editStudent.bind(this, record)}>Editar</a>
            <Divider type="vertical"></Divider>
            <a onClick={this.handleAnull.bind(this, record)}>Anular Inscrição</a>
          </span>
        ),
      },
    ];

    const reportcolumns = [
      {
        title: 'Nome',
        dataIndex: 'name',
        key: 'name',
        render: (text, record) => <a>{record.name}</a>,
      },
      { title: 'Numero de Telefone', dataIndex: 'number', key: 'number' },
      { title: 'Data de Envio', dataIndex: 'createdAt', key: 'createdAt' },
      {
        title: 'Estado',
        dataIndex: 'status',
        key: 'status',
        render: (text, record) => (
          <span>
            {record.status == 0 ? (
              <Badge color="orange" text={'Não confirmado'} />
            ) : record.status == 1 ? (
              <Badge color="green" text={'Entregue'} />
            ) : (
              <Badge text={'Não entregue'} color="red" />
            )}
          </span>
        ),
      },
      { title: 'Mensagem', dataIndex: 'message', key: 'message' },
      {
        title: '',
        key: 'operation',
        render: (text, record) => (
          <span>
            <a href="#" onClick={this.notifyAgain.bind(this, record)}>
              Notificar Novamente
            </a>
          </span>
        ),
      },
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
          <Tabs defaultActiveKey="1">
            <TabPane tab="Lista de Estudantes" key="1" style={{ marginButton: 20 }}>
              <div className={styles.tableList}>
                <div className={styles.tableListForm}>{this.renderForm()}</div>
                <div className={styles.tableListOperator}>
                  <Button
                    icon="plus"
                    type="primary"
                    onClick={() => this.props.history.push('/student/create')}
                  >
                    Nova Inscrição
                  </Button>

                  <Button type="primary" onClick={this.notify} disabled={!hasSelected}>
                    Notificar
                  </Button>

                  <Button type="primary" onClick={this.notifyAll} disabled={!this.state.data}>
                    Notificar a todos
                  </Button>

                  <span style={{ marginLeft: 8 }}>
                    {hasSelected
                      ? `Notificar ${selectedRowKeys.length} Contactos Seleccionados`
                      : `Total de Estudantes: ${this.state.data.length}`}
                  </span>
                </div>
                <Table
                  className="components-table-demo-nested"
                  columns={columns}
                  onSelectChange={this.onSelectChange}
                  columnTitle="Seleccionar Todos"
                  rowSelection={rowSelection}
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
                        <Descriptions.Item label="Nome Completo">{record.name}</Descriptions.Item>
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
                      <Descriptions
                        title="Dados de Inscrição"
                        style={{ marginBottom: 10 }}
                        column={2}
                        className={styles.information}
                      >
                        <Descriptions.Item label="Frequência">
                          {frequencies.filter(frq => frq.level === record.level)[0].description}
                        </Descriptions.Item>
                        <Descriptions.Item label="Valor Mensal">
                          <Statistic value={record.currentMonthlyPayment} suffix="MZN" />
                        </Descriptions.Item>
                      </Descriptions>{' '}
                    </div>
                  )}
                  pagination={this.state.pagination}
                  dataSource={this.state.data}
                  onChange={this.handleChangeTable}
                />
              </div>
            </TabPane>
            <TabPane tab="Notificacoes" key="2">
              <div className={styles.tableList}>
                <div className={styles.tableListForm}>{this.renderNotificationFormForm()}</div>
                <Table
                  className="components-table-demo-nested"
                  columns={reportcolumns}
                  rowKey="id"
                  loading={this.state.sync}
                  pagination={this.state.pagination1}
                  dataSource={this.state.notifications}
                  onChange={this.handleChangeTable2}
                />
              </div>
            </TabPane>
          </Tabs>
        </Card>

        <Modal
          visible={this.state.visible}
          title={`Notificar (${
            this.state.all ? this.state.studentIds.length : this.state.selectedRowKeys.length
          } ) Contactos`}
          onOk={this.handleOk}
          width={800}
          onCancel={this.handleCancel.bind(this)}
          footer={[
            <Button key="back" onClick={this.handleCancel.bind(this)}>
              Cancelar
            </Button>,
            <Button
              key="submit"
              htmlType="submit"
              type="primary"
              onClick={this.handleOk.bind(this)}
              loadign={this.state.saving}
            >
              Confirmar
            </Button>,
          ]}
        >
          <Form.Item label={<span>Mensagem (Maximo 160 caracteres)</span>}>
            {getFieldDecorator('message', {
              initialValue: `${this.state.message}`,
              rules: [
                { required: true, message: 'Por favor informe a Mensagen!', whitespace: true },
              ],
            })(
              <TextArea
                rows={5}
                maxLength="160"
                name="message"
                onChange={this.handleChangeInput}
              />,
            )}
          </Form.Item>
        </Modal>
      </PageHeaderWrapper>
    );
  }
}
export default Form.create({})(ListStudent);
