import React from 'react';
import ReactDOM from 'react-dom';
import { Card, Button, message,Upload, Icon, Badge ,Input,Statistic,Descriptions,Select,Form, Col ,Divider,Row,Alert,Result  } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import moment from 'moment';
import { notification } from 'antd';
import api from '../../../../services/api';
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

  cancel(){

    this.props.history.push('/payment/pay')
  }


 handleChangeInput(evt) {
    this.setState({ [evt.target.name]: evt.target.value });
  }

  backToPayment(){
    this.props.history.push('/payment/pay')

  }

    componentDidMount() {

    api.get('/api/payment/unique/'+this.props.match.params.paymentId).then(payment => {
          api.get('/api/frequency/1')
      .then(res => {  
        
        api.get('/api/student/unique/'+payment.data.id).then(student => {     
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

    return(
    <PageHeaderWrapper>
     <Card>
            <Row style={{ padding: '70px 150px 50px 150px' }}>
     <Descriptions title={this.state.student.name}  column={2}>
    <Descriptions.Item label="Nível">{this.state.level}</Descriptions.Item>
    <Descriptions.Item label="Valor Mensal">
        <Statistic value= {this.state.student.currentMonthlyPayment} suffix="MZN" /> 
          </Descriptions.Item>
          <Descriptions.Item label="Ano">{this.state.payment.year}</Descriptions.Item>
    <Descriptions.Item label="Mês">{this.state.month}</Descriptions.Item>
    
    <Descriptions.Item label="Desconto">
        <Statistic value= {this.state.payment.discount} suffix="MZN" /> 
          </Descriptions.Item>
          <Descriptions.Item label="Multa">
        <Statistic value= {this.state.payment.fine} suffix="MZN"  /> 
          </Descriptions.Item>
          <Descriptions.Item label="Estado">  <span>
              {this.state.payment.status==0?
              <Badge count= {'Não Pago'}  />:
              <Badge count= {'Pago'} style={{ backgroundColor: '#52c41a' }} />}
             
            </span></Descriptions.Item>

      <Descriptions.Item label="Data de Pagamento">{moment(this.state.payment.paymentDate).format('YYYY-MM-DD')}</Descriptions.Item>
    
       
     

                   
      </Descriptions>
      <Divider style={{ marginBottom: 10}} />
<Row>
<Col span={12}></Col>

<Col span={12}>
<Descriptions >
<Descriptions.Item label="Total">
        <Statistic value= {this.state.payment.total} suffix="MZN" /> 
          </Descriptions.Item> </Descriptions> 
<Button   onClick={() => this.cancel()}>
              Voltar
            </Button>
       
            <Button style={{ marginLeft: 8 }}  loading={this.state.loading} type="primary"  >
              Imprimir
            </Button>  

</Col>


</Row>
                         
     </Row>
            </Card></PageHeaderWrapper>
    );
  }
  
}
export default    Form.create({})(Pay);