import React from 'react';
import ReactDOM from 'react-dom';
import { Table, Input, InputNumber,Icon,Card,Progress,Alert, Popconfirm,Form, Button,notification,Result } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Offline, Online } from "react-detect-offline";
import api ,{baseURL} from '../../../services/api';
import { USER_KEY,SUCURSAL } from "../../../services/auth";
import './index.less';
import { Label } from 'bizcharts';
class EditableTable extends React.Component {

   constructor(props) {
    super(props);

    this.state = { editingKey: '',data:[],loading:localStorage.getItem('SYNCTOCLOUD')!=null,success:false,percentage:0,nodata:false };
  
  }

  componentDidMount() {
    localStorage.removeItem('SYNCTOCLOUD');
        }

sincronize=async()=>{

let res=await  api.get('/api/sincronize/count/'+JSON.parse(localStorage.getItem(SUCURSAL)).id)
.then(async(res)=>{
  
this.setState({nodata:Math.abs(res.data.amount)==0});
if(Math.abs(res.data.amount)!=0){
  this.setState({loading:true});
  localStorage.setItem('SYNCTOCLOUD', JSON.stringify('54gf$erdfgrd%#dddd#120999KM'));
  await api.post("/api/sincronize",{sucursal:JSON.parse(localStorage.getItem(SUCURSAL))}).catch(function (error) { 
    notification.error({
        description:'Erro ao Processar o o seu pedido',
        message: 'Erro ao processar o pedido',
      });  
   
  });

}
   }).catch((err)=>{
    notification.error({
      description:'Erro ao Processar o o seu pedido',
      message: 'Erro ao processar o pedido',
    });  
    
    localStorage.removeItem('SYNCTOCLOUD');

   });

        }

  render() {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    const extra = (
      <>
        <Button type="primary"  >
       OK
         
        </Button>
       
      </>
    );

    return (
      <PageHeaderWrapper>
      <Card>
      <Offline>  <Result 
    status="500"
    title="Sem Internet"
    subTitle="Desculpa, mas nao esta connectado a Internet."
   
  /></Offline>
      <Form {...formItemLayout} style={{ padding: '50px 0' }}>


        {this.state.success?
<Result
    status="success"
    title="Dados Sincronizados com Sucesso"
    subTitle={`Todos os Dados foram Sincronizados com Sucesso`}
    extra={extra}
    />
:
<div > 
<Online>
  {this.state.nodata?
       <Alert
      message="Nao existem Dados por Sincronizar"
      description="Todos os Dados ja foram sincronizados"
      type="info"
      showIcon
    />:null}


 
<Progress   percent={this.state.percentage}  status="active" />

<Button  style={{  'margin-top':'20px'}} type="primary" loading={this.state.loading} onClick={this.sincronize.bind(this)} >
      {this.state.loading? 'A Sincronizar Dados...':'Sincronizar Dados'}
         
        </Button>
        </Online>

</div>
  }
<Form.Item >

        
        </Form.Item>
      </Form>
     </Card></PageHeaderWrapper>
    );
  }
}

export default    Form.create()(EditableTable);
