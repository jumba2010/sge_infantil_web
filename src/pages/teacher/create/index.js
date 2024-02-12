import React from 'react';
import ReactDOM from 'react-dom';
import { Steps,Card, Button, message,Upload, Icon,Form, Input,Statistic,  Select,Descriptions, DatePicker,Col ,Divider,Row,Tooltip,Layout,Alert,Result  } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import moment from 'moment';
import { notification } from 'antd';
import api from '../../../services/api';
import { USER_KEY,SUCURSAL } from "../../../services/auth";
import  allsucursals from './../../../utils/sucursal';
import { formatMessage } from 'umi-plugin-react/locale';
const { Step } = Steps;
const { TextArea } = Input;
const {  Content, Sider } = Layout;


import styles from './index.less';

const steps = [
  {
    title: 'Dados do Professor',
    content: <div>ss</div>,
  },

  {
    title: formatMessage({id:'global.confirm'}),
    content: '3',
  },
  {
    title: 'Sucesso',
    content: '4',
  },
];


function desabledBirthDate(current){

  return current && current > moment().endOf('day');
}

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }
  
  function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  }



class User extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      loading: false,
      confirmDirty: false,
      autoCompleteResult: [],
      username:'',
      name:'',
      email:'',
      profileId:'',    
      contact:'',
      address:'',
      issaving:false,
      selectedsucursals:'',
      profiles:[],
     
    };

    this.handleChangeInput = this.handleChangeInput.bind(this);  
    this.handleSelectProfile = this.handleSelectProfile.bind(this); 
    this.handleSelectSucursals = this.handleSelectSucursals.bind(this); 
   
  }

  handleChangeInput(evt) {
    this.setState({ [evt.target.name]: evt.target.value });
  }


  handleSelectProfile(profileId) {
    this.setState({profileId});
  }

  handleSelectSucursals(sucursals) {  
    this.setState({sucursals});
  }

  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          loading: false,
        }),
      );
    }
  };

  componentDidMount() {
    api.get('/api/profile')
        .then(res => {         
          this.setState({profiles:res.data});           
        })
 
        }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
       console.log('Values:',values)       

      }
    });
  };

  next() {
    const current = this.state.current + 1;
    this.setState({ current });
    
  }

  returnUserName(words) {
    let n = words.trim().split(" ");
    let lastname=n[n.length - 1];
    let firstlatter = words.substring(0,1);
    return  firstlatter.concat(lastname).toLowerCase();
  }

  confirmTransaction= async() =>{  
        this.setState({ loading: true })
 let activatedBy=1;
 let createdBy=1;
 let { name,address,email,contact} = this.state
 let sucursalId=localStorage.getItem(SUCURSAL).id?localStorage.getItem(SUCURSAL).id:1

let User= await api.post("/api/teacher", {
  name,email,contact,address,picture:'',activatedBy,createdBy,sucursalId
})
.then(response=>{
  const current = this.state.current + 1;      
  this.setState({ current,loading:false,name });
})
.catch((error)=> { 
  this.setState({loading:false });
  notification.error({
      description:'Erro ao Processar o o seu pedido',
      message: 'Erro ao processar o pedido',
    }); 
    
    
});



    
  }

  next1() {
    if(this.state.name && this.state.contact   && this.state.address){   
    const current = this.state.current + 1; 
    this.setState({ current });
  }
  }


  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }

  restart() {
       this.setState(
        {
          current: 0,
          loading: false,
          confirmDirty: false,
          autoCompleteResult: [],
          name:'',
          email:'',
          contact:'',
          address:'',
          issaving:false,
        }

       );
  }

  render() {
    const { current } = this.state;
    const { getFieldDecorator } = this.props.form;
    const uploadButton = (
        <div>
          <Icon type={this.state.loading ? 'loading' : 'plus'} />
          <div className="ant-upload-text">Fotografia</div>
        </div>
      );

      const { imageUrl } = this.state;

      const { Option } = Select;
      const tailFormItemLayout = {
        wrapperCol: {
          xs: {
            span: 24,
            offset: 0,
          },
          sm: {
            span: 16,
            offset: 8,
          },
        },
      };

      const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
      };
    
        const extra = (
        <>
          <Button type="primary" onClick={this.restart}>
          Cadastrar Novo Professor
           
          </Button>
          <Button onClick={() => this.props.history.push('/teacher/list')}>
          Listar Professores
          </Button>
        </>
      );


    return (
        <PageHeaderWrapper>
        <Card>
        <Steps current={current} size='default'>
          {steps.map(item => (
            <Step key={item.title} title={item.title} icon={item.title==='{formatMessage({id:'global.confirm'})}' && current==4 && this.state.issaving?<Icon type="loading" />:null} />
          ))}
        </Steps>
        <div className="steps-content">
            {
current==0?
<Row style={{ padding: '50px 20px' }}>
<Col span={3}>
        <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        beforeUpload={beforeUpload}
        onChange={this.handleChange}
      >
        {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
      </Upload>

        
      </Col>
<Col span={21}>


        <Form {...formItemLayout}  onSubmit={this.handleSubmit}>
     
        <Form.Item
          label={
            <span>
              {formatMessage({id:'student.name'})}&nbsp;
              <Tooltip title="O {formatMessage({id:'student.name'})} do Estudante?">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          }
        >
          {getFieldDecorator('name', {initialValue:`${this.state.name}`,
            rules: [{ required: true, message: 'Por favor informe o nome!', whitespace: true }],
          })(<Input name='name' autoComplete="off" onChange={this.handleChangeInput} />)}
        </Form.Item>  
        <Form.Item label="Email">
        <Input name='email' autoComplete="off" onChange={this.handleChangeInput} />
        </Form.Item>
        <Form.Item
          label={
            <span>
              Contacto
            </span>
          }
        > 
             <Row gutter={8}>
            <Col span={3}>
          <Input defaultValue="+258" disabled='true'  />
            </Col>
            <Col span={8}>
            {getFieldDecorator('contact', {initialValue:`${this.state.contact}`,
            rules: [{ required: true, message: 'Por favor informe um Número válido!', whitespace: true,len:9 }],
          })(<Input autoComplete="off" name='contact'   onChange={this.handleChangeInput}  />)}
            </Col>
          </Row>  
        </Form.Item> 
        <Form.Item
          label={
            <span>
              Morada
            </span>
          }
        >
          {getFieldDecorator('address', {initialValue:`${this.state.address}`,
            rules: [{ required: true, message: 'Por favor informe o endereço!', whitespace: true }],
          })(<TextArea rows={4} name='address'  onChange={this.handleChangeInput} />)}
        </Form.Item> 
           <Form.Item >          
            <Button style={{ marginLeft: 180 }} type="primary" htmlType="submit" onClick={() => this.next1()}>
              {formatMessage({id:'global.next'})}
            </Button>       
        
        </Form.Item>
      </Form>


       
</Col>
</Row>
        :null }  

{
current==1?
<Form {...formItemLayout} style={{ 'padding-left': '150px','padding-top': '50px','padding-right': '150px' }} >
<Alert message="Confirmação" description="Confirme os Dados abaixo e pressione em confirmar" type="info" showIcon /> 

<Descriptions title="Dados Pessoais" style={{ marginBottom: 10,marginTop:32 }} column={1}>
<Descriptions.Item label="{formatMessage({id:'student.name'})}">{this.state.name}</Descriptions.Item>
            <Descriptions.Item label="Email">{this.state.email}</Descriptions.Item>
            <Descriptions.Item label="Contacto">{this.state.contact}</Descriptions.Item>
            <Descriptions.Item label="Morada">{this.state.address}</Descriptions.Item>
          </Descriptions>
        
<Form.Item >
<Button  onClick={() => this.prev()}>
              {formatMessage({id:'global.previous'})}
            </Button>
       
            <Button style={{ marginLeft: 8 }}  type="primary" loading={this.state.loading} htmlType="submit" onClick={() => this.confirmTransaction()}>
              {formatMessage({id:'global.confirm'})}
            </Button>        
        
        </Form.Item>
      </Form>
:null}
{current==2?
  <Form {...formItemLayout} style={{ padding: '50px 0' }}>
<Result
    status="success"
    title={formatMessage({id:'global.success.message'})}
    subTitle={`Cadastro realizado com Sucesso. Nome: ${this.state.name}`}
    extra={extra}
    />
<Form.Item >

        
        </Form.Item>
      </Form>

:null}
        </div> 
      </Card></PageHeaderWrapper>
    );
  }
}
export default    Form.create({})(User);