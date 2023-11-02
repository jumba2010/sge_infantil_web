import React from 'react';
import ReactDOM from 'react-dom';
import {
  Table, Card, Row, Col, Badge, DatePicker,
  Divider, Menu, Dropdown, Icon, Button, Modal, Form, Input, Select, Statistic, InputNumber, Descriptions,
  message,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { notification } from 'antd';
import api, { baseURL } from '../../../services/api';
import { USER_KEY, SUCURSAL } from "../../../services/auth";
import moment from 'moment';
import months from '../../../utils/months';
import styles from './index.less';
import axios from "axios";
import ReactToPrint from "react-to-print";
import { getLastThreeYears } from './../../utils/DateTimeUtils'
import { connect } from 'dva';

const { TextArea } = Input;
const apiRemote = axios.create({
  baseURL: "https://sistemadeensino.com/"
});

const FormItem = Form.Item;
const pageSize = 6;



class ComponentToPrint extends React.Component {

  constructor(props) {
    super(props);

  }
  render() {

    const columns = [
      { title: 'Nome', dataIndex: 'name', key: 'name', render: text => <a>{text}</a> },
      { title: 'Nível', dataIndex: 'frequency', key: 'frequency' },
      { title: 'Ano', dataIndex: 'year', key: 'year' },
      { title: 'Mês', dataIndex: 'month', key: 'month' },

      { title: 'Valor Mensal', dataIndex: 'monthlyPayment', key: 'monthlyPayment' },

      { title: 'Total', dataIndex: 'total', key: 'total' },

    ];
    return (
      <div >
        <h2 style={{ 'padding-top': '100px', 'padding-bottom': '100px', 'padding-left': '100px', 'padding-right': '100px' }}>CENTRO INFANTIL E EXTERNATO LUZ DO DIA</h2>
        <Descriptions style={{ 'padding-left': '20px' }} title='Relatorio de Pagamentos atrazados' >
          <Descriptions.Item label="Data de Emissão">{moment(new Date()).format('DD-MM-YYYY')}</Descriptions.Item>
          <Descriptions.Item label="Emitido por">{JSON.parse(localStorage.getItem(USER_KEY)).name}</Descriptions.Item>

        </Descriptions>

        <Table
          title={() => { return <h3>Lista de Pagamentos Atrazados</h3> }}
          className="components-table-demo-nested"
          columns={columns}
          pagination={false}
          dataSource={this.props.data}
          style={{ 'padding': '20px' }}
        />

      </div>
    );
  }
}


@connect(({ payment, student }) => ({
  unpaidPayments: payment.unpaidPayments,
  frequencies: student.frequencies
}))
class Paid extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      payment: {},
      year: 2023,
      sucursal: 1,
      student: {},
      message: '',
      studentIds: [],
      lastdata: [],
      payments: [],
      visible: false,
      data: [],
      frequencies: [],
      selectedRowKeys: [],
      pagination: {},
      expandForm: false,
      filterName: '',
      filterYear: '',
      filterMonth: '',
      filterLevel: '',
      loadign: true
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
      data: this.state.lastdata
    });

  };
  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  onSelectAll = (allSelected) => {
    if (this.state.selectedRowKeys.length && allSelected) {

      this.setState({
        selectedRowKeys: allSelected
      })
    }
  }



  handleChangeInput(event) {
    if (event.target.name === 'message') {
      this.setState({ message: event.target.value });
    }
    else {
      this.setState({ filterName: event.target.value }, () => {
        this.filterData();
      });
    }

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
      let freq = this.props.frequencies.filter(frq => frq.level === this.state.filterLevel)[0];
      filteredData = filteredData.filter(d => d.frequency === freq.description);
    }
    this.setState({ data: filteredData });
  }


  payNow(payment) {
    this.props.history.push('/payment/pay/confirm/' + payment.id)
  }

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };


  handleSearch = () => {
    e.preventDefault();
  }



  notify = () => {
    this.setState({
      visible: true,
      all: false
    });
  }

  notifyAll = () => {
    this.setState({
      visible: true,
      all: true
    });
  }

  handleOk = async () => {
    if (this.state.message) {
      this.setState({
        saving: true,
      });

      let all = this.state.all;
      let paymentIds = this.state.all ? this.state.studentIds : this.state.selectedRowKeys;

      const filteredPayments = this.state.lastdata.filter(payment => paymentIds.includes(payment.id));
      const filteredStudentNumbers = [...new Set(filteredPayments.map(payment => payment.studentNumber))];

      apiRemote.post("/api/smsntification/carrier", {
        message: this.state.message, filteredStudentNumbers, sucursalId: JSON.parse(localStorage.getItem(SUCURSAL)).id
      })

      await notification.success({
        description: 'Notificação enviada com sucesso',
        message: 'Notificação enviada com sucesso',
      });

      this.setState({
        saving: false,
        all: false,
        visible: false
      });

    }
  }

  handleCancel() {
    this.setState({
      visible: false,
    });
  }


  renderAdvancedForm() {
    const { form, frequencies } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="Nome">
              {getFieldDecorator('name', {
                initialValue: '',
                rules: [{ required: false }],
              })(
                <Input name='name' autoComplete="off" onChange={this.handleChangeInput} placeholder="Pesquise pelo nome ..." />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="Nível">
              {getFieldDecorator('level', {
                initialValue: '',
                rules: [{ required: false }],
              })(
                <Select onChange={this.handleSelectClass} placeholder="Pesquise pelo Nível ..." style={{ width: '100%' }}>
                  {frequencies.map(f => <Option value={f.level}>{f.description}</Option>)}
                </Select>)}
            </FormItem>
          </Col>

          <Col md={8} sm={24}>
            <FormItem label="Ano">
              {getFieldDecorator('year', {
                initialValue: '',
                rules: [{ required: false }],
              })(
                <Select onChange={this.handleSelectYear} placeholder="Ano.." style={{ width: '70%' }}>
                  {getLastThreeYears().map(year => <Option value={year}>{year}</Option>)}
                </Select>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>


          <Col md={8} sm={24}>
            <FormItem label="Mês">

              {getFieldDecorator('month', {
                rules: [{ required: false }],

              })(
                <Select placeholder="Mês.." style={{ width: '100%' }} onChange={this.handleSelectMonth}>
                  {months.map((m) => <Option value={m.desc}>{m.desc}</Option>)}

                </Select>)}

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
  }


  componentDidMount() {
    this.searchFields();

  }

  searchFields() {
    const { unpaidPayments, frequencies } = this.props
    const pagination = { ...this.state.pagination };
    pagination.total = unpaidPayments.length
    pagination.pageSize = pageSize;

    const data = [];

    for (let i = 0; i < unpaidPayments.length; i++) {
      let freq = frequencies.filter(frq => frq.level === unpaidPayments[i].student.level)[0]
      let month = months.filter((m) => m.code == unpaidPayments[i].month)[0].desc
      data.push({
        key: unpaidPayments[i].id,
        id: unpaidPayments[i].id,
        name: unpaidPayments[i].student.name,
        year: unpaidPayments[i].year,
        month: month,
        total: unpaidPayments[i].total,
        fine: unpaidPayments[i].fine,
        studentNumber: unpaidPayments[i].student.studentNumber,
        monthlyPayment: unpaidPayments[i].student.currentMonthlyPayment,
        frequency: freq.description,
        limitDate: moment(unpaidPayments[i].limitDate).format('YYYY-MM-DD'),

      });
    }
    let studentIds = unpaidPayments.map((s) => s.student.studentNumber);

    this.setState({ data, students: data, lastdata: data, loadign: false, pagination, studentIds });


  }

  render() {
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    const hasSelected = this.state.selectedRowKeys.length > 0;
    const { getFieldDecorator } = this.props.form;
    const columns = [
      { title: 'Nome', dataIndex: 'name', key: 'name', render: text => <a>{text}</a> },
      { title: 'Nível', dataIndex: 'frequency', key: 'frequency' },
      { title: 'Ano', dataIndex: 'year', key: 'year' },
      { title: 'Mês', dataIndex: 'month', key: 'month' },
      { title: 'Data Limite', dataIndex: 'limitDate', key: 'limitDate' },
      { title: 'Valor Mensal', dataIndex: 'monthlyPayment', key: 'monthlyPayment' },
      { title: 'Multa', dataIndex: 'fine', key: 'fine' },
      { title: 'Total', dataIndex: 'total', key: 'total' },
      {
        title: '', key: 'operation', render: (text, record) => <span><Button size='small' onClick={this.payNow.bind(this, record)}>Pagar Agora </Button>
        </span>
      },
    ];
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button type="primary" onClick={this.notify} disabled={!hasSelected} >
                Notificar
              </Button>

              <Button type="primary" onClick={this.notifyAll} disabled={!this.state.data} >
                Notificar a todos
              </Button>

              <ReactToPrint
                trigger={() => <Button>Imprimir</Button>}
                content={() => this.componentRef}
              />

              <span style={{ marginLeft: 8 }}>
                {hasSelected ? `Notificar ${selectedRowKeys.length} Contactos Seleccionados` : `Total de Pagamentos Atrasados: ${this.state.data.length}`}
              </span></div>

            <div style={{ display: "none" }}> <ComponentToPrint ref={el => (this.componentRef = el)}
              columns={columns}
              rowSelection={rowSelection}
              data={this.state.data}
            /></div>
            <Table

              columns={columns}
              rowSelection={rowSelection}
              loading={this.state.loadign}
              pagination={this.state.pagination}
              dataSource={this.state.data}
              onChange={this.handleChangeTable}
            />

          </div>


        </Card>
        <Modal
          visible={this.state.visible}
          title={`Notificar (${this.state.all ? this.state.studentIds.length : this.state.selectedRowKeys.length} ) Contactos`}
          onOk={this.handleOk}
          width={800}
          onCancel={this.handleCancel.bind(this)}
          footer={[
            <Button key="back" onClick={this.handleCancel.bind(this)}>
              Cancelar
            </Button>,
            <Button key="submit" htmlType="submit" type="primary" onClick={this.handleOk.bind(this)} loadign={this.state.saving}>
              Confirmar
            </Button>,
          ]}
        >
          <Form.Item
            label={
              <span>
                Mensagem (Maximo 160 caracteres)
              </span>
            }
          >
            {getFieldDecorator('message', {
              initialValue: `${this.state.message}`,
              rules: [{ required: true, message: 'Por favor informe a Mensagen!', whitespace: true }],
            })(<TextArea rows={5} maxLength='160' name='message' onChange={this.handleChangeInput} />)}
          </Form.Item>


        </Modal>

      </PageHeaderWrapper>
    );
  }
};
export default Form.create({})(Paid);;