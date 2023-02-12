import React from 'react';
import ReactDOM from 'react-dom';
import { Card, Button, message,Upload, Icon, Badge ,Input,Statistic,Descriptions,Select,Form, Col ,Divider,Row,Alert,Result  } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import moment from 'moment';
import { notification } from 'antd';
import api from '../../../../services/api';
import { USER_KEY,SUCURSAL } from "../../../../services/auth";
import months from '../../../../utils/months';
import styles from './index.less';



class Pay extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
     payment:{},
     student:{},
     level:'',
     month:'',
     loading:false,
     frequencies:[],
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

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
       console.log('Values:',values)       

      }
    });
  };

  confirmTransaction= async() =>{
const {paymentMethod,receiptNumber}=this.state;
  
if(paymentMethod && receiptNumber){
  this.setState({loading:true});
  await api.put('/api/payment/pay/'+this.props.match.params.paymentId, {
    paymentMethod,receiptNumber,updatedBy:1,studentId:this.state.student.id })
  .catch(function (error) { 
    notification.error({
        description:'Erro ao Processar o o seu pedido',
        message: 'Erro ao processar o pedido',
      });  
     // this.setState({success:false,loading:false})   
  });
 
  this.setState({success:true,loading:false})
}

  }

  cancel(){
    this.props.history.push('/payment/pay')

  }

  backToPayment(){
    this.props.history.push('/payment/pay')

  }

    componentDidMount() {

    api.get('/api/payment/unique/'+this.props.match.params.paymentId).then(payment => {
          api.get('/api/frequency/'+JSON.parse(localStorage.getItem(SUCURSAL)).id)
      .then(res => {  
        
        api.get('/api/student/unique/'+payment.data.studentId).then(student => {     
          let level=res.data.filter(frq=>frq.level==student.data.level)[0]
          let month=months.filter(m=>m.code==payment.data.month)[0]
                 this.setState({payment:payment.data,student:student.data,frequencies:res.data,level:level?level.description:'',month:month?month.desc:''})
            
              })
                 
      })
     
     
      


       
              })
        }


  render() {

    const { current } = this.state;
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    const extra = (
      <>
        <Button type="primary" onClick={this.backToPayment.bind(this)} >
       Voltar aos Pagamentos
         
        </Button>
       
      </>
    );

    return(
    <PageHeaderWrapper>
     <Card>
     {!this.state.success?

     <div>
       <Alert message="Confirmação do Pagamento" description="Informe os campos abaixo e clique em confirmar" type="info" showIcon></Alert>
       <Row style={{ padding: '50px 20px' }}>
     <Descriptions title={this.state.student.name} >
    <Descriptions.Item label="Nível">{this.state.level}</Descriptions.Item>
    <Descriptions.Item label="Data de Inscrição">{moment(this.state.student.createdAt).format('YYYY-MM-DD')}</Descriptions.Item>
    <Descriptions.Item label="Data Limite de Pagamento">{moment(this.state.payment.limitDate).format('YYYY-MM-DD')}</Descriptions.Item>
    <Descriptions.Item label="Ano">{this.state.payment.year}</Descriptions.Item>
    <Descriptions.Item label="Mês">{this.state.month}</Descriptions.Item>
       <Descriptions.Item label="Valor Mensal">
       {this.state.student.currentMonthlyPayment} MZN
          </Descriptions.Item>

           <Descriptions.Item label="Multa">
           {this.state.payment.fine} MZN
          </Descriptions.Item>

          <Descriptions.Item label="Desconto">
          {this.state.payment.discount*100} %
          </Descriptions.Item>
          <Descriptions.Item label="Total">
        <Statistic value= {this.state.payment.total} suffix="MZN" /> 
          </Descriptions.Item>              
      </Descriptions>
      <Divider style={{ marginBottom: 10}} />
      <Form {...formItemLayout}  onSubmit={this.handleSubmit}>
  
        <Form.Item label="Formas de Pagamento">
        {getFieldDecorator('paymentMethod', {initialValue:`${this.state.paymentMethod}`,
            rules: [{ required: true, message: 'Por favor informe as formas de Pagamento!' }],
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
         <Option value="NUMERARIO">Numerário</Option>
             <Option value="POS">POS</Option>
             <Option value="TRANSFERENCIA">Transferência Bancária</Option>
             <Option value="DEPOSITO">Deposito Bancário</Option>
             <Option value="MPEZA">Mpeza</Option>
          </Select>)}        
                
                 </Form.Item>
                <Form.Item  label={
            <span>
             Número de Recibo
            </span>
          }>
                {getFieldDecorator('receiptNumber', {initialValue:`${this.state.receiptNumber}`,
            rules: [{ required: true, message: 'Por favor informe o número de recibo!', whitespace: true}],
          })(<Input autoComplete="off" name='receiptNumber'   onChange={this.handleChangeInput}  />)}
                  </Form.Item> 
                  <Form.Item >
<Button style={{ marginLeft: 180 }} type="danger" onClick={() => this.cancel()}>
              Cancelar
            </Button>
       
            <Button style={{ marginLeft: 8 }}  loading={this.state.loading} type="primary" htmlType="submit" onClick={() => this.confirmTransaction()}>
              Confirmar
            </Button>        
        
        </Form.Item>
                 </Form>
  
  </Row></div>

  :
  <Form {...formItemLayout} style={{ padding: '50px 0' }}>
<Result
    status="success"
    title="Operação Realizada com Sucesso!"
    subTitle={`Pagamento realizado com Sucesso com a referência ${this.state.receiptNumber}`}
    extra={extra}
    />
<Form.Item >

        
        </Form.Item>
      </Form>

}
            </Card></PageHeaderWrapper>
    );
  }
  
}
export default    Form.create({})(Pay);