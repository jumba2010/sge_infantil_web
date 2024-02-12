import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'dva';
import {
  Table,
  Card,
  Row,
  Col,
  Badge,
  DatePicker,
  Divider,
  Menu,
  Dropdown,
  Icon,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Statistic,
  InputNumber,
  Descriptions,
  message,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { notification } from 'antd';
import api, { baseURL } from '../../../services/api';
import { USER_KEY, SUCURSAL } from '../../../services/auth';
import moment from 'moment';
import styles from './index.less';
import months from '../../../utils/months';
const FormItem = Form.Item;
const pageSize = 6;

@connect(({ student, loading }) => ({
  students: student.students,
  frequencies: student.frequencies,
}))
class ListStudent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      students: [],
      payment: {},
      student: {},
      lastdata: [],
      payments: [],
      data: [],
      frequencies: [],
      pagination: {},
      expandForm: false,
      loadign: true,
    };


    this.handleChangeInput = this.handleChangeInput.bind(this);
    this.handleSelectClass = this.handleSelectClass.bind(this);
  }

  handleCancel = () => {
    this.setState({ visible: false });
  };

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
  }
  handleSelectClass(frequency) {
    let freq = this.props.frequencies.filter(
      frq => frq.level === frequency,
    )[0];

    let s = this.state.lastdata.filter(d => d.frequency === freq.description);
    this.setState({ data: s, lastdata: s });
  }

  payNow = async payment => {
    let m = months.filter(m => m.desc == payment.month)[0];
    let month = months.indexOf(m) + 1;
    let studentId = payment.studentId;
  
    let student = this.state.students.filter(s => s.studentId == studentId)[0];
    let payments = student.payments;

    let previousMonth = payments.filter(p => p.month === month - 1)[0];

    if (previousMonth && previousMonth.status === 0) {
      let prevMonthDesc = months.filter(m => m.code == previousMonth.month)[0].desc;

      notification.error({
        description: ` Nao pode Pagar ${payment.month} antes de pagar ${prevMonthDesc} `,
        message: ` Mes de ${prevMonthDesc} nao Pago`,
      });
    } else {
      this.props.history.push('/payment/pay/confirm/' + payment.key);
    }
  };

  anull(payment) {
    this.props.history.push('/payment/pay/anull/' + payment.key);
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
              {getFieldDecorator('createdAt', { initialValue: '', rules: [{ required: false }] })(
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

  componentWillMount() {
    this.searchFields();
  }

  searchFields() {

    const { students, frequencies } = this.props;
    const pagination = { ...this.state.pagination };
    pagination.total = students.length;
    pagination.pageSize = pageSize;

    const data = [];
    for (let i = 0; i < students.length; i++) {
      let freq = frequencies.filter(
        f => f.level + "" == "" + students[i].student.level,
      )[0];

      data.push({
        key: students[i].student.id,
        name: students[i].student.name,
        currentMonthlyPayment: students[i].student.currentMonthlyPayment,
        birthDate: students[i].student.birthDate,
        frequency: freq.description,
        createdAt: moment(students[i].student.createdAt).format('YYYY-MM-DD'),
        payments: students[i].payments,
        studentId:students[i].student.id
      });
    }

    this.setState({ data, students: data, lastdata: data, loadign: false, pagination });
  }

  render() {
    const columns = [
      { title: 'Nome', dataIndex: 'name', key: 'name' },
      { title: 'Data de Nacimento', dataIndex: 'birthDate', key: 'birthDate' },
      { title: 'Nível', dataIndex: 'frequency', key: 'frequency' },
      { title: 'Data de Inscrição', dataIndex: 'createdAt', key: 'createdAt' },
      {
        title: '',
        key: 'operation',
        render: (text, redord) => (
          <span>
            <a href={`${baseURL}/listallpayments/${redord.key}`}>Ver Todos Pagamentos </a>
          </span>
        ),
      },
    ];

    const expandedPaymentRowRender = record => {

      console.log('Payment Record',record)
      const columns = [
        { title: 'Ano', dataIndex: 'year', key: 'year' },
        { title: 'Mês', dataIndex: 'month', key: 'month' },
        { title: 'Total', dataIndex: 'total', key: 'total' },
        {
          title: 'Estado',
          key: 'status',
          render: (text, record) => (
            <span>
              {record.status + "" == "1" ? (
                <Badge count={'Pago'} style={{ backgroundColor: '#52c41a' }} />
              ) : record.hasFine ? (
                <Badge count={'Pago'} style={{ backgroundColor: '#DAA520' }} />
              ) : (
                <Badge count={'Não Pago'}  />
              )}
            </span>
          ),
        },

        { title: 'Data Limite', dataIndex: 'limit', key: 'limit' },

        {
          title: '',
          dataIndex: 'operation',
          key: 'operation',
          render: (text, record) => (
            <span className="table-operation">
              {record.status == 1 ? (
                <Button size="small" type="danger" onClick={this.anull.bind(this, record)}>
                  Anular Pagamento{' '}
                </Button>
              ) : (
                <Button size="small" onClick={this.payNow.bind(this, record)}>
                  Pagar Agora{' '}
                </Button>
              )}{' '}
            </span>
          ),
        },
      ];

      var data = [];

      for (let index = 0; index < record.payments.length; index++) {
        let month = months.filter(m => m.code == record.payments[index].month)[0].desc;
        data.push({
          key: record.payments[index].id,
          year: record.payments[index].year,
          month: month,
          discount: record.payments[index].discount,
          fine: record.payments[index].fine?record.payments[index].fine:0,
          currentMonthlyPayment: record.currentMonthlyPayment,
          paymentDate: record.payments[index].paymentDate,
          hasFine: record.payments[index].hasFine,
          total: record.payments[index].total,
          status: record.payments[index].status,
          limit: record.payments[index].limitDate,
          studentId: record.studentId,
        });
     
      }

      return (
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          expandedRowRender={record => (
            <Descriptions column={2}>
              <Descriptions.Item label="Valor Mensal">
                {record.currentMonthlyPayment} MZN
              </Descriptions.Item>
              <Descriptions.Item label="Ano">{record.year}</Descriptions.Item>
              <Descriptions.Item label="Mês">{record.month}</Descriptions.Item>

              <Descriptions.Item label="Desconto">{record.discount * 100} % </Descriptions.Item>
              <Descriptions.Item label="Multa">{record.fine} MZN</Descriptions.Item>
              <Descriptions.Item label="Data de Pagamento">
                {record.paymentDate ? moment(record.paymentDate).format('YYYY-MM-DD') : ''}
              </Descriptions.Item>

              <Descriptions.Item label="Estado">
                {' '}
                <span>
                  {record.status + "" == "0" ? (
                    <Badge count={'Não Pago'} />
                  ) : (
                    <Badge count={'Pago'} style={{ backgroundColor: '#52c41a' }} />
                  )}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Total">
                <Statistic value={record.total} suffix="MZN" />
              </Descriptions.Item>
            </Descriptions>
          )}
        />
      );
    };

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <Table
              className="components-table-demo-nested"
              columns={columns}
              loading={this.state.loadign}
              expandedRowRender={expandedPaymentRowRender}
              pagination={this.state.pagination}
              dataSource={this.state.data}
              onChange={this.handleChangeTable}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
export default Form.create({})(ListStudent);
