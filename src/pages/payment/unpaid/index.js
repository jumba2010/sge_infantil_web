import React from 'react';
import ReactDOM from 'react-dom';
import {Table,Card,Row ,Col,Badge,  DatePicker,
  Divider,Menu, Dropdown, Icon,Button,Modal,Form,Input,Select,Statistic,InputNumber, Descriptions,
  message,  } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { notification } from 'antd';
import api,{baseURL} from '../../../services/api';
import { USER_KEY,SUCURSAL } from "../../../services/auth";
import moment from 'moment';
import months from '../../../utils/months';
import styles from './index.less';
import axios from "axios";
import ReactToPrint from "react-to-print";


const { TextArea } = Input;
const apiRemote = axios.create({
  baseURL: "https://sistemadeensino.com/"
});

const FormItem = Form.Item;
const pageSize=6;



class ComponentToPrint extends React.Component {

  constructor(props) {
    super(props);
  
  }
  render() {

    const columns = [
      { title: 'Nome', dataIndex: 'name', key: 'name',render:text=><a>{text}</a> },
    { title: 'Nível', dataIndex: 'frequency', key: 'frequency' },
    { title: 'Ano', dataIndex: 'year', key: 'year' },
    { title: 'Mês', dataIndex: 'month', key: 'month' },
   
    { title: 'Valor Mensal', dataIndex: 'monthlyPayment', key: 'monthlyPayment' },
  
    { title: 'Total', dataIndex: 'total', key: 'total' }, 
       
      ];
    return (
      <div >
        <h2  style={ {'padding-top': '100px','padding-bottom': '100px','padding-left': '100px','padding-right': '100px'}}>CENTRO INFANTIL E EXTERNATO LUZ DO DIA</h2>
    <Descriptions style={ {'padding-left': '20px'}} title='Relatorio de Pagamentos atrazados' >
    <Descriptions.Item label="Data de Emissão">{moment(new Date()).format('DD-MM-YYYY')}</Descriptions.Item>
  <Descriptions.Item label="Emitido por">{JSON.parse(localStorage.getItem(USER_KEY)).name}</Descriptions.Item>
              
      </Descriptions>
  
      <Table
    title={()=>{return <h3>Lista de Pagamentos Atrazados</h3>}}
        className="components-table-demo-nested"
        columns={columns} 
        pagination={false}
        dataSource={this.props.data}
      style={ {'padding': '20px'}}
      />

</div>
    );
  }
}


class Paid extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    payment:{},
    year:2020,
    sucursal:1,
    student:{},
    message:'',
    studentIds:[],
    lastdata:[],
    payments:[],
    visible:false,
    data:[],
    frequencies:[],
    selectedRowKeys :[],
    pagination:{},
    expandForm:false,
    loadign:true
    };

    this.handleChangeInput = this.handleChangeInput.bind(this); 
    this.handleSelectClass = this.handleSelectClass.bind(this); 
    this.handleSelectMonth=this.handleSelectMonth.bind(this);
    this.handleChangeFererence=this.handleChangeFererence.bind(this);

  }
  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.searchFields();
     
  };
  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  onSelectAll = (allSelected) => {
    if (this.state.selectedRowKeys.length && allSelected) {
    
      this.setState({
        selectedRowKeys:allSelected
      })
    }
  }

  handleChangeInput(evt) {
         if(evt.target.name==='name'){
           let s=this.state.lastdata.filter(d=>d.name.toLowerCase().indexOf(evt.target.value.toLowerCase()) >-1);
      this.setState({data:s});
    }

    if(evt.target.name==='message'){
      this.setState({message:evt.target.value});
      
}

}

handleChangeFererence(ref) {
let s=this.state.lastdata.filter(d=>d.code.indexOf(ref) >-1);
this.setState({data:s});
}
    
  
  handleSelectClass(frequency) {
    let freq= JSON.parse(localStorage.getItem('FREQUENCIES')).filter(frq=>frq.level===frequency)[0];
    
    let s=this.state.lastdata.filter(d=>d.frequency===freq.description);
    this.setState({data:s});

  }

  payNow(payment){

    this.props.history.push('/payment/pay/confirm/'+payment.key)
  }

  handleSelectMonth(month) {
  
    let s=this.state.lastdata.filter(d=>d.month===month);
    this.setState({data:s});

  }


  payNow(payment){
    this.props.history.push('/payment/pay/confirm/'+payment.id)
  }

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  
  handleSearch = () => {
    e.preventDefault();}



    notify=()=>{
      this.setState({
        visible:true,
        all:false
      });
    }
  
    notifyAll=()=>{
      this.setState({
        visible: true,
        all:true
      });
    }
  
    handleOk =async() =>{
  
      if(this.state.message){
      this.setState({
        saving: true,
      });
  
      let all=this.state.all;
      let studentIds=this.state.all?this.state.studentIds:this.state.selectedRowKeys;
      apiRemote.post("/api/smsntification/carrier", {
        message:this.state.message,studentIds,sucursalId:JSON.parse(localStorage.getItem(SUCURSAL)).id
      }) 
     
      await notification.success({
        description:'Notificação enviada com sucesso',
        message: 'Notificação enviada com sucesso',
      }); 
  
      this.setState({
        saving: false,
        all:false,
        visible:false
      });
     
    } 
    }
  
    handleCancel(){
      this.setState({
        visible: false,
      });
    }
  

  renderAdvancedForm() {
    const { form } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="Nome">
            {getFieldDecorator('name', {initialValue:'',
            rules: [{ required: false }],
          })(  
             <Input name='name' autoComplete="off" onChange={this.handleChangeInput} placeholder="Pesquise pelo nome ..." />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="Nível">
            {getFieldDecorator('level', {initialValue:'',
            rules: [{ required: false }],
          })(
                <Select  onChange={this.handleSelectClass} placeholder="Pesquise pelo Nível ..." style={{ width: '100%' }}>
                { JSON.parse(localStorage.getItem('FREQUENCIES')).map(f=> <Option value={f.level}>{f.description}</Option>)}
                </Select>)}
            </FormItem>
          </Col> 

            <Col md={8} sm={24}>
            <FormItem label="Ano">   
            {getFieldDecorator('year', {initialValue:'2020',
            rules: [{ required: false }],
          })(  
            <Select placeholder="Ano.." style={{ width: '70%' }}>            
              <Option value="2020">2020</Option>           
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
                  {months.map((m)=> <Option value={m.desc}>{m.desc}</Option>)}
              
                </Select>)}
              
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ float: 'right', marginBottom: 24 }}>
           
            <Button style={{ marginLeft: 8 }}  onClick={this.handleFormReset}>
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

  handleChangeTable=(paginatio, filters,sorter)=>{
    const pager={...this.state.pagination};
    pager.current=paginatio.current;
      this.setState({paginatio:pager});
  }


  componentWillMount() {    
this.searchFields();
    
        } 

       searchFields(){
          api.get(`/api/payment/unpaid/${JSON.parse(localStorage.getItem(SUCURSAL)).id}`)
        .then(res => {  
          const pagination={...this.state.pagination};
          pagination.total=res.data.length
                  pagination.pageSize=pageSize;
                
           const data = [];  

    for (let i = 0; i < res.data.length; i++) {   
           let freq= JSON.parse(localStorage.getItem('FREQUENCIES')).filter(frq=>frq.level===res.data[i].student.level)[0]   
      let month=months.filter((m)=>m.code==res.data[i].month)[0].desc 
        data.push({
          key: res.data[i].student.studentNumber,  
          id:res.data[i].id,  
        name: res.data[i].student.name,
        year: res.data[i].year,
        month:month,
        total:res.data[i].total,
        fine:res.data[i].fine,
        monthlyPayment:res.data[i].student.currentMonthlyPayment,  
        frequency:freq.description,
       limitDate:moment(res.data[i].limitDate).format('YYYY-MM-DD'),     
      
      });
       } 
       let studentIds=res.data.map((s)=>s.student.studentNumber);
    
    this.setState({data,students:data,lastdata:data,loadign:false,pagination,studentIds});        
                    
        }) 
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
          { title: 'Nome', dataIndex: 'name', key: 'name',render:text=><a>{text}</a> },
        { title: 'Nível', dataIndex: 'frequency', key: 'frequency' },
        { title: 'Ano', dataIndex: 'year', key: 'year' },
        { title: 'Mês', dataIndex: 'month', key: 'month' },
        { title: 'Data Limite', dataIndex: 'limitDate', key: 'limitDate' },
        { title: 'Valor Mensal', dataIndex: 'monthlyPayment', key: 'monthlyPayment' },
        { title: 'Multa', dataIndex: 'fine', key: 'fine' },
        { title: 'Total', dataIndex: 'total', key: 'total' }, 
            { title: '', key: 'operation', render: (text,record) =><span><Button size='small' onClick={this.payNow.bind(this,record)}>Pagar Agora </Button>
             </span> },
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
          title={`Notificar (${this.state.all?this.state.studentIds.length:this.state.selectedRowKeys.length} ) Contactos`}
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
          {getFieldDecorator('message', {initialValue:`${this.state.message}`,
            rules: [{ required: true, message: 'Por favor informe a Mensagen!', whitespace: true }],
          })(<TextArea rows={5} maxLength='160' name='message'  onChange={this.handleChangeInput} />)}
        </Form.Item> 
        
        
        </Modal>
      
      </PageHeaderWrapper>
    );
  }};
export default    Form.create({})(Paid);;