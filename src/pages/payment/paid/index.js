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
import {getLastThreeYears} from './../../utils/DateTimeUtils'
import { connect } from 'dva';

const FormItem = Form.Item;
const pageSize = 6;
import styles from './index.less';

@connect(({ payment, student }) => ({
  paidPayments: payment.paidPayments,
  frequencies:student.frequencies
}))
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
    this.handleSelectYear = this.handleSelectYear.bind(this);
    this.handleSelectMonth = this.handleSelectMonth.bind(this);
  }
  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      filterName: '',
      filterYear: '',
      filterMonth: '',
      filterLevel: '',
      data:this.state.lastdata
    });
  };
  handleChangeInput(event) {
    this.setState({ filterName: event.target.value }, () => {
      this.filterData();
    });
  }
  
  handleSelectYear(year) {
    this.setState({ filterYear: year }, () => {
      this.filterData();
    });
  }
  
  handleSelectMonth(month) {
    this.setState({ filterMonth: month }, () => {
      this.filterData();
    });
  }
  
  handleSelectClass(level) {
    this.setState({ filterLevel: level }, () => {
      this.filterData();
    });
  }
  
  filterData() {
    let filteredData = this.state.lastdata;
    if (this.state.filterName) {
      filteredData = filteredData.filter(d => d.name.includes(this.state.filterName));
    }

    if (this.state.filterYear) {
      filteredData = filteredData.filter(d => d.year === this.state.filterYear);
    }
    if (this.state.filterMonth) {
      filteredData = filteredData.filter(d => d.month === this.state.filterMonth);
    }
    if (this.state.filterLevel) {
      let freq = JSON.parse(localStorage.getItem('FREQUENCIES')).filter(frq => frq.level === this.state.filterLevel)[0];
      filteredData = filteredData.filter(d => d.frequency === freq.description);
    }
    this.setState({ data: filteredData });
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
                initialValue: '',
                rules: [{ required: false }],
              })(
                <Select  onChange={this.handleSelectYear} placeholder="Ano.." style={{ width: '70%' }}>            
             {getLastThreeYears().map(year=><Option value={year}>{year}</Option>  )}          
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
    this.props.dispatch({
      type: 'payment/fetchPaidPayments',
    });
    this.searchFields();
  }

  searchFields() {
    const { paidPayments, frequencies } = this.props
    const pagination = { ...this.state.pagination };
    pagination.total = paidPayments.length;
    pagination.pageSize = pageSize;

    const data = [];

    for (let i = 0; i < paidPayments.length; i++) {
      let freq = frequencies.filter(
        frq => frq.level === paidPayments[i].student.level,
      )[0];
      let month = months.filter(m => m.code == paidPayments[i].month)[0].desc;
      data.push({
        key: paidPayments[i].id,
        name: paidPayments[i].student.name,
        year: paidPayments[i].year,
        month: month,
        discount: paidPayments[i].discount,
        fine: paidPayments[i].fine,
        total: paidPayments[i].total,
        currentMonthlyPayment: paidPayments[i].student.currentMonthlyPayment,
        code: paidPayments[i].code,
        frequency: freq.description,
        paymentDate: moment(paidPayments[i].paymentDate).format('YYYY-MM-DD'),
      });
    }

    this.setState({ data, students: data, lastdata: data, loadign: false, pagination });
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
