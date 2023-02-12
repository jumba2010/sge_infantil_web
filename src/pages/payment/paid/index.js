import React from 'react';
import ReactDOM from 'react-dom';
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
import months from '../../../utils/months';
const FormItem = Form.Item;
const pageSize = 6;
import styles from './index.less';
class Paid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      payment: {},
      year: new Date().getFullYear(),
      sucursal: 1,
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
    this.handleSelectMonth = this.handleSelectMonth.bind(this);
    this.handleChangeFererence = this.handleChangeFererence.bind(this);
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

  handleChangeFererence(ref) {
    let s = this.state.lastdata.filter(d => d.code.indexOf(ref) > -1);
    this.setState({ data: s });
  }
  cls;

  handleSelectClass(frequency) {
    let freq = JSON.parse(localStorage.getItem('FREQUENCIES')).filter(
      frq => frq.level === frequency,
    )[0];
    let s = this.state.lastdata.filter(d => d.frequency === freq.description);
    this.setState({ data: s });
  }

  handleSelectMonth(month) {
    let s = this.state.lastdata.filter(d => d.month === month);
    this.setState({ data: s });
  }

  payNow(payment) {
    this.props.history.push('/payment/pay/confirm/' + payment.key);
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
                  {JSON.parse(localStorage.getItem('FREQUENCIES')).map(f => (
                    <Option value={f.level}>{f.description}</Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="Referência/Nr.Recibo">
              <InputNumber
                name="ref"
                onChange={this.handleChangeFererence}
                style={{ width: '100%' }}
              />
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="Ano">
              {getFieldDecorator('year', {
                initialValue: new Date().getFullYear(),
                rules: [{ required: false }],
              })(
                <Select placeholder="Ano.." style={{ width: '100%' }}>
                  <Option value={new Date().getFullYear()}>{new Date().getFullYear()}</Option>
                </Select>,
              )}
            </FormItem>
          </Col>

          <Col md={8} sm={24}>
            <FormItem label="Mês">
              {getFieldDecorator('month', {
                rules: [{ required: false }],
              })(
                <Select
                  placeholder="Mês.."
                  style={{ width: '100%' }}
                  onChange={this.handleSelectMonth}
                >
                  {months.map(m => (
                    <Option value={m.desc}>{m.desc}</Option>
                  ))}
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
          </div>
        </div>
      </Form>
    );
  }

  renderForm() {
    return this.renderAdvancedForm();
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
    api
      .get(`/api/payment/paid/${JSON.parse(localStorage.getItem(SUCURSAL)).id}/${this.state.year}`)
      .then(res => {
        const pagination = { ...this.state.pagination };
        pagination.total = res.data.length;
        pagination.pageSize = pageSize;

        const data = [];

        for (let i = 0; i < res.data.length; i++) {
          let freq = JSON.parse(localStorage.getItem('FREQUENCIES')).filter(
            frq => frq.level === res.data[i].student.level,
          )[0];
          let month = months.filter(m => m.code == res.data[i].month)[0].desc;
          data.push({
            key: res.data[i].id,
            name: res.data[i].student.name,
            year: res.data[i].year,
            month: month,
            discount: res.data[i].discount,
            fine: res.data[i].fine,
            total: res.data[i].total,
            currentMonthlyPayment: res.data[i].student.currentMonthlyPayment,
            code: res.data[i].code,
            frequency: freq.description,
            paymentDate: moment(res.data[i].paymentDate).format('YYYY-MM-DD'),
          });
        }

        this.setState({ data, students: data, lastdata: data, loadign: false, pagination });
      });
  }

  render() {
    const columns = [
      { title: 'Ref#', dataIndex: 'code', key: 'code' },
      { title: 'Nome', dataIndex: 'name', key: 'name', render: text => <a>{text}</a> },
      { title: 'Nível', dataIndex: 'frequency', key: 'frequency' },
      { title: 'Ano', dataIndex: 'year', key: 'year' },
      { title: 'Mês', dataIndex: 'month', key: 'month' },
      { title: 'Total', dataIndex: 'total', key: 'total' },
      {
        title: '',
        key: 'operation',
        render: (text, redord) => (
          <span>
            <a href={`#`}>Imprimir Coprovativo </a>
          </span>
        ),
      },
    ];
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <Table
              className="components-table-demo-nested"
              columns={columns}
              loading={this.state.loadign}
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
                      {record.status == 0 ? (
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
export default Form.create({})(Paid);
