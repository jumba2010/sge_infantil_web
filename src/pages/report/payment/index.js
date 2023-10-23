import React from 'react';
import ReactDOM from 'react-dom';
import { Card, Button, message,Upload,Table, Icon, Badge ,Input,Statistic,Descriptions,Select,Form, Col ,Divider,Row,Alert,Result  } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import moment from 'moment';
import { notification } from 'antd';
import api from '../../../services/api';
import {SUCURSAL} from '../../../services/auth';
import months from '../../../utils/months';
import styles from './index.less';

const FormItem = Form.Item;

function CurrencyFormatted(amount) {
  var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'MZN',
  });
  
	return formatter.format(amount);
}

class Pay extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
     loadign:false,
     month:'',
     data:[],
     paymentMethod:'',
     success:false,
     receiptNumber:''
    };

    this.handleSelectPaymentType = this.handleSelectPaymentType.bind(this); 
    this.handleChangeInput = this.handleChangeInput.bind(this); 
  } 

  handleSelectPaymentType(paymentMethod) {
    this.setState({paymentMethod});
  }

 handleChangeInput(evt) {
    this.setState({ [evt.target.name]: evt.target.value });
  }


  handleSearch = () => {
    e.preventDefault();}

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.searchFields();
     
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
       console.log('Values:',values)       

      }
    });
  };

  handleSelectMonth= (month)=>{
    this.setState({loadign:true,data:[]})
    api.get('/api/payment/count/'+JSON.parse(localStorage.getItem(SUCURSAL)).id+`/${new Date().getFullYear()}/`+month).then(res => {
      const data = []; 

   for (let index = 0; index < res.data.length; index++) {
    let month=months.filter((m)=>m.code==res.data[index].month)[0].desc 
    data.push({
      key: JSON.parse(localStorage.getItem(SUCURSAL)).id,
      totalStudents: (res.data[index].studentsPaid+res.data[index].studentsUnPaid),
      month: month,
      studentPaid: res.data[index].studentsPaid,
      totalPaid: res.data[index].paidValue,
      unpaidStudents: res.data[index].studentsUnPaid,
      totalUnpaid:res.data[index].unPaidValue,  
    });
     
   }
      this.setState({loadign:false,data})
      
    });

  }

  confirmTransaction= async() =>{

    const {paymentMethod,receiptNumber}=this.state;
  
    if(paymentMethod && receiptNumber){
 
   this.setState({success:true})
}

  }

  cancel(){


  }

  componentDidMount() {
  if(months.length<13){
  months.push({code:'0',desc:'Todos'},)
}
        }


  render() {

    const { current } = this.state;
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    const columns = [
      { title: 'Total de Estudantes', dataIndex: 'totalStudents', key: 'totalStudents',render:text=><a>{text} </a> },
      { title: 'Mes', dataIndex: 'month', key: 'month'},
      { title: 'Total de Pagamentos', dataIndex: 'studentPaid', key: 'studentPaid',render:text=><Badge text= {`${text} Estudantes`} color="green" />},
        { title: 'Montante Pago', dataIndex: 'totalPaid', key: 'totalPaid' ,render:text=><Badge color ='green' text= {`${text==null?0:CurrencyFormatted(text)}`}  />},
        { title: 'Estudents em Divida', dataIndex: 'unpaidStudents', key: 'unpaidStudents',render:text=><Badge text= {`${text} Estudantes`} color="red" /> }, 
        { title: 'Montante em Divida', dataIndex: 'totalUnpaid', key: 'totalUnpaid' ,render:text=><Badge  color ='red' text= {`${text==null?'MZN 0.00':CurrencyFormatted(text)}`}  />}]

    const extra = (
      <>
       <Form onSubmit={this.handleSearch} layout="inline">
       <Row >
          <FormItem label="Ano"> 
          {getFieldDecorator('year', {initialValue:new Date().getFullYear(),
            rules: [{ required: false }],
          })(
                <Select style={{ width: '200px' }} onChange={this.handleSelectClass} >

                <Option value={`${new Date().getFullYear()}`}>{new Date().getFullYear()}</Option>
                 
          </Select>)}</FormItem>
      
          <FormItem label="Mês">
          <Select placeholder="Mês.." style={{ width: '300px' }} onChange={this.handleSelectMonth}>
                  {months.map((m)=> <Option value={m.code}>{m.desc}</Option>)}
              
                </Select></FormItem>

       
        </Row></Form>
       
      </>
    );

    return(

      
    <PageHeaderWrapper>
       <Card
      style={{ marginTop: 16 }}
      type="inner"
      extra={<a href="#"><Button disabled={this.state.data.length===0} icon="printer" >
Imprimir
</Button></a>}
      title={extra}
    >
         <Table
         dataSource={this.state.data}
         loading={this.state.loadign}
         
        className="components-table-demo-nested"
        columns={columns}>
        </Table>
                   
    </Card></PageHeaderWrapper>
    );
  }
  
}
export default    Form.create({})(Pay);