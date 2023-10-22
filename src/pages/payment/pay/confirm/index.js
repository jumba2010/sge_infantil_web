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
import { connect } from 'dva';

@connect(({ student, loading }) => ({
  students: student.students,
  frequencies: student.frequencies,
}))
class Pay extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
     payment:{},
     student:{},
     payments:[],
     level:'',
     month:'',
     loading:false,
     registrationId:'',
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

  const {registrationId,payments,payment,student} =this.state;
  const indexToReplace = payments.findIndex((payment) => payment.id === payment.id);

  if (indexToReplace !== -1) {
    // If a matching payment was found, replace it
    payments[indexToReplace] = payment;
  }
  
  await api.put('/api/payment/pay/'+this.props.match.params.paymentId, {
    payments,registrationId,
    paymentMethod,receiptNumber,updatedBy:1,studentId:student.id })
    .then( res =>{
      this.props.dispatch({
        type: 'student/fetchActiveStudents'
      });

      this.props.dispatch({
        type: 'payment/fetchUnpaidPayments',
      });

      this.props.dispatch({
        type: 'payment/fetchPaidPayments',
      });

      // this.props.dispatch({
      //   type: 'student/addStudent',
      //   payload: { registrationId: registrationId },
      // });
      this.setState({success:true,loading:false})
    })
    .catch(function (error) { 
    notification.error({
        description:'Erro ao Processar o o seu pedido',
        message: 'Erro ao processar o pedido',
      });  
      
  });
}

}

  cancel(){
    this.props.history.push('/payment/pay')

  }

  backToPayment(){
    this.props.history.push('/payment/pay')

  }

  componentDidMount() {
    this.fetchData();
  }
  
  componentDidUpdate(prevProps) {
    if (this.props.match.params.paymentId !== prevProps.match.params.paymentId) {
      this.fetchData();
    }
  }
  
  async fetchData() {
    const { frequencies, students } = this.props;
    const { paymentId } = this.props.match.params;
  
    const registration = students.find((reg) => {
      const payments = reg.payments;
      const payment = payments.find((p) => p.id === paymentId);
      if (payment) {
        const month = months.find((m) => m.code === payment.month);
        const level = frequencies.find((frq) => frq.level === reg.student.level);
  
        this.setState({
          payment: payment,
          registrationId:reg.id,
          payments:payments,
          month: month?.desc,
          student: reg.student,
          levelDescription: level?.description,
        });
  
        return true;
      }
      return false;
    });
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
    <Descriptions.Item label="Nível">{this.state.levelDescription}</Descriptions.Item>
    <Descriptions.Item label="Data de Inscrição">{this.state.student.createdAt}</Descriptions.Item>
    <Descriptions.Item label="Data Limite de Pagamento">{this.state.payment.limitDate}</Descriptions.Item>
    <Descriptions.Item label="Ano">{this.state.payment.year}</Descriptions.Item>
    <Descriptions.Item label="Mês">{this.state.month}</Descriptions.Item>
       <Descriptions.Item label="Valor Mensal">
       {this.state.student.currentMonthlyPayment} MZN
          </Descriptions.Item>

           <Descriptions.Item label="Multa">
           {this.state.payment.fine?this.state.payment.fine:0} MZN
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
             <Option value="MPESA">Mpesa</Option>
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