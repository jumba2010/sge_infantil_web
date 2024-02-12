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
import { formatMessage } from 'umi-plugin-react/locale';
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
     level:'',
     month:'',
     loading:false,
     frequencies:[],
     paymentMethod:'',
     levelDescription:'',
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

      }
    });
  };

  confirmTransaction= async() =>{
    const {registrationId,payments,payment,student} =this.state;
    const indexToReplace = payments.findIndex((payment) => payment.id === payment.id);
  
    if (indexToReplace !== -1) {
      // If a matching payment was found, replace it
      payments[indexToReplace] = payment;
    }

  this.setState({loading:true});
  await api.put('/api/payment/anull/'+this.props.match.params.paymentId, {
    payments,registrationId,updatedBy:1,studentId:student.id })
  .catch( (error) => { 
    notification.error({
        description:'Erro ao Processar o o seu pedido',
        message: 'Erro ao processar o pedido',
      });  
     this.setState({success:false,loading:false})   
  }).then( data => {
    this.setState({success:true,loading:false})
  });
 
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
            const payment = !payments?{}:payments.find((p) => p.id === paymentId);
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
       <Alert message="Anular Pagamento" description="Para anular este Pagamento, clique em Anular" type="info" showIcon></Alert>
       <Row style={{ padding: '50px 20px' }}>
     <Descriptions title={this.state.student.name} >
    <Descriptions.Item label="Nível">{this.state.levelDescription}</Descriptions.Item>
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
                  <Form.Item >
<Button  type="danger" onClick={() => this.cancel()}>
              {formatMessage({id:'global.cancel'})}
            </Button>
       
            <Button style={{ marginLeft: 8 }}  loading={this.state.loading} type="primary" htmlType="submit" onClick={() => this.confirmTransaction()}>
              Anular
            </Button>        
        
        </Form.Item>
                 </Form>
  
  </Row></div>

  :
  <Form {...formItemLayout} style={{ padding: '50px 0' }}>
<Result
    status="success"
    title={formatMessage({id:'global.success.message'})}
    subTitle={`Pagamento anulado com Sucesso `}
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