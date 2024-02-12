import React from 'react';
import ReactDOM from 'react-dom';
import { Steps,Card, Button, message,Upload, Icon,Form, Input,  Select, DatePicker,Col ,Row,Tooltip,Layout,Alert,Result  } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { formatMessage } from 'umi-plugin-react/locale';
const InputGroup = Input.Group;
const { Step } = Steps;
const { TextArea } = Input;
const {  Content, Sider } = Layout;
const steps = [
  {
    title: 'Dados Pessoais',
    content: <div>ss</div>,
  },
  {
    title: 'Filiação',
    content: '2',
  },
  {
    title: 'Encaregado',
    content: '2',
  },
  {
    title: 'Inscrição',
    content: '2',
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



class Student extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      loading: false,
      confirmDirty: false,
      autoCompleteResult: [],
      name:'',
      birthDate:'',
      gender:'',
      docType:'',
      docNumber:'',
      motherName:'',
      carierContact:'',
      carierName:'',
      jobLocation:'',
      address:'',
      kinshipDegree:'',
      studentNumber:1,
      fatherName:'',
      motherContact:'',
      fatherContact:'',
      registrationvalue:0,
      address:'',
      contact:'',
      workplace:'',
      frequency:'',
      discount:'',
      paymentMethod:''
    };

    this.handleChangeInput = this.handleChangeInput.bind(this); 
    this.handleSelectbirthDate = this.handleSelectbirthDate.bind(this); 
    this.handleSelectGender = this.handleSelectGender.bind(this); 
    this.handleSelectDocType = this.handleSelectDocType.bind(this); 
    this.handleSelectKinShip = this.handleSelectKinShip.bind(this); 
    this.handleSelectDiscount = this.handleSelectDiscount.bind(this); 
    this.handleSelectPaymentType = this.handleSelectPaymentType.bind(this); 
    this.handleSelectClass = this.handleSelectClass.bind(this); 
  }

  handleChangeInput(evt) {
    this.setState({ [evt.target.name]: evt.target.value });
  }

  handleSelectbirthDate(date) {
    this.setState({ birthDate: date});
  }

  handleSelectGender(gender) {
    this.setState({gender});
  }

  handleSelectDocType(docType) {
    this.setState({docType});
  }

  handleSelectClass(frequency) {
    this.setState({frequency});
  }

  handleSelectPaymentType(paymentMethod) {
    this.setState({paymentMethod});
  }

  handleSelectDiscount(discount) {
    this.setState({discount});
  }

  handleSelectKinShip(kinshipDegree) {

    if(kinshipDegree=='PAI'){
      this.setState({carierName:this.state.fatherName,carierContact:this.state.fatherContact});
    }

    else if(kinshipDegree=='MAE'){
      this.setState({carierName:this.state.motherName,carierContact:this.state.motherContact});
    }

    
    else{
      this.setState({carierName:'',carierContact:''});  
    }

    this.setState({kinshipDegree});
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

  next1() {
    if(this.state.name && this.state.birthDate   && this.state.gender && this.state.docType){   
    const current = this.state.current + 1; 
    this.setState({ current });
  }
  }

  next2() {
    this.props.form.validateFieldsAndScroll((err, values) => {
      
    });
    if(this.state.motherName && this.state.fatherName){   
    const current = this.state.current + 1;
    this.setState({ current });
  }
  }


  next3() {
    this.props.form.validateFieldsAndScroll((err, values) => { 
    });
    if(this.state.kinshipDegree && this.state.carierName && this.state.carierContact && this.state.address){   
    const current = this.state.current + 1;
    this.setState({ current });
  }
  }

  next4() {
    this.props.form.validateFieldsAndScroll((err, values) => { 
    });
    if(this.state.frequency && this.state.paymentMethod ){   
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
          birthDate:'',
          gender:'',
          docType:'',
          docNumber:'',
          motherName:'',
          carierContact:'',
          carierName:'',
          jobLocation:'',
          address:'',
          kinshipDegree:'',
          studentNumber:1,
          fatherName:'',
          motherContact:'',
          fatherContact:'',
          registrationvalue:0,
          address:'',
          contact:'',
          workplace:'',
          frequency:'',
          discount:'',
          paymentMethod:''
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
    
      const prefixSelector = getFieldDecorator('prefix', {
        initialValue: 'BI',
      })(
        <Select style={{ width: 200 }}>
          <Option value="BI">{formatMessage({id:'document.type.id'})}</Option>
          <Option value="cedula">{formatMessage({id:'document.type.personal.id.card'})}</Option>
          <Option value="Nenhum">{formatMessage({id:'document.type.personal.nodoc'})}</Option>
       
                 </Select>,
      );


    return (
        <PageHeaderWrapper>
        <Card>
        <Steps current={current} size='default'>
          {steps.map(item => (
            <Step key={item.title} title={item.title} />
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
          })(<Input name='name'  onChange={this.handleChangeInput} />)}
        </Form.Item>  
        <Form.Item label="Data de Nascimento">
          {getFieldDecorator('date-picker',  {
            rules: [{type: 'object', required: true, message: 'Por favor informe a data de Nascimento!', whitespace: true }],
          })(<DatePicker    style={{ width: '100%'}}  onChange={this.handleSelectbirthDate}/>)}
        </Form.Item>
        <Form.Item label="Sexo">
          {getFieldDecorator('gender', {initialValue:`${this.state.gender}`,
            rules: [{ required: true, message: 'Por favor informe o Sexo!' }],
          })(
<Select
    showSearch
  
    placeholder="Seleccione.."
    optionFilterProp="children" 
    onChange={this.handleSelectGender}
    value={this.state.gender}
    filterOption={(input, option) =>
      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }
  >
    <Option value="M">Masculino</Option>
    <Option value="F">Femenino</Option>
   </Select>
          

          )}
        </Form.Item>

        <Form.Item label="Tipo de Documento">

        {getFieldDecorator('doctype', {initialValue:`${this.state.docType}`,
            rules: [{ required: true, message: 'Por favor informe o tipo de documento!' }],
          })(<Select
    showSearch
    style={{ width: 200 }}
    placeholder="Seleccione o tipo de Documento"
    optionFilterProp="children"
    onChange={this.handleSelectDocType}
    value={this.state.docType}
    filterOption={(input, option) =>
      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }
  >
 <Option value="BI">{formatMessage({id:'document.type.id'})}</Option>
          <Option value="cedula">{formatMessage({id:'document.type.personal.id.card'})}</Option>
          <Option value="Nenhum">{formatMessage({id:'document.type.personal.nodoc'})}</Option>
  </Select> )}
        </Form.Item>

        <Form.Item label="Nr. de Documento">
        <Input  style={{ width: '100%' }} value={this.state.docNumber}  placeholder='Nr. de Documento' name='docNumber' onChange={this.handleChangeInput}/>
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
<Form {...formItemLayout} style={{ padding: '50px 0' }}>

  
<Form.Item
          label={
            <span>
              Nome do Pai
            </span>
          }
        >
          {getFieldDecorator('fatherName', {initialValue:`${this.state.fatherName}`,
            rules: [{ required: true, message: 'Por favor informe o nome do Pai!', whitespace: true }],
          })(<Input  name='fatherName' onChange={this.handleChangeInput}/>)}
        </Form.Item> 

        <Form.Item
          label={
            <span>
               Nome da Mãe
            </span>
          }
        >
          {getFieldDecorator('motherName', {initialValue:`${this.state.motherName}`,
            rules: [{ required: true, message: 'Por favor informe o nome da Mãe!', whitespace: true }],
          })(<Input  name='motherName' onChange={this.handleChangeInput}/>)}
        </Form.Item> 

        <Form.Item
          label={
            <span>
              Contacto do Pai
            </span>
          }
        >
         <InputGroup >
          <Row gutter={8}>
            <Col span={3}>
              <Input defaultValue="+258"  disabled='true'  />
            </Col>
            <Col span={8} >
              <Input maxLength='9' name='fatherContact' value={this.state.fatherContact}  onChange={this.handleChangeInput} />
            </Col>
          </Row>
        </InputGroup>
        </Form.Item> 
        <Form.Item
          label={
            <span>
               Contacto da Mãe
            </span>
          }
        >
          <InputGroup >
          <Row gutter={8}>
            <Col span={3}>
              <Input defaultValue="+258"  disabled='true' />
            </Col>
            <Col span={8} >
              <Input  maxLength='9' value={this.state.motherContact}  name='motherContact' onChange={this.handleChangeInput} />
            </Col>
          </Row>
        </InputGroup>
        </Form.Item> 
<Form.Item >
<Button style={{ marginLeft: 180 }} onClick={() => this.prev()}>
              {formatMessage({id:'global.previous'})}
            </Button>
       
            <Button style={{ marginLeft: 8 }}  type="primary"  htmlType="submit" onClick={() => this.next2()}>
              {formatMessage({id:'global.next'})}
            </Button>
        
        
        </Form.Item>
      </Form>
:null}


{
current==2?
<Form {...formItemLayout} style={{ padding: '50px 0' }}>
<Form.Item label="Grau de Parentesco">
          {getFieldDecorator('kinshipDegree', {initialValue:`${this.state.kinshipDegree}`,
            rules: [{ required: true, message: 'Por favor informe o Grau de Parentesco!' }],
          })(
<Select
    showSearch
  
    placeholder="Seleccione o grau de Parentesco.."
    optionFilterProp="children"
    onChange={this.handleSelectKinShip}
    filterOption={(input, option) =>
      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }
  >
    <Option value="PAI">Pai</Option>
    <Option value="MAE">Mãe</Option>
    <Option value="TIO">Tio(a)</Option>
    <Option value="AVO">Avó</Option>
    <Option value="IRMAO">Irmão/Irmã</Option>
     </Select>
          

          )}
        </Form.Item>
  
<Form.Item
          label={
            <span>
              Nome do Encarregado
            </span>
          }
        >
          {getFieldDecorator('carierName', {initialValue:`${this.state.carierName}`,
            rules: [{ required: true, message: 'Por favor informe o nome do Encarregado!', whitespace: true }],
          })(<Input name='carierName' value={this.state.carierName}  onChange={this.handleChangeInput} />)}
        </Form.Item> 

        <Form.Item
          label={
            <span>
              Local de Trabalho
            </span>
          }
        >
         <Input value={this.state.jobLocation} name='jobLocation' onChange={this.handleChangeInput} />
        </Form.Item> 

        <Form.Item
          label={
            <span>
              Contacto
            </span>
          }
        >
         <InputGroup >
          <Row gutter={8}>
            <Col span={3}>
          <Input defaultValue="+258" disabled='true'  />
            </Col>
            <Col span={8}>
            {getFieldDecorator('carierContact', {initialValue:`${this.state.carierContact}`,
            rules: [{ required: true, message: 'Por favor informe o contacto do encarregado!', whitespace: true }],
          })(<Input name='carierContact'  maxLength='9' onChange={this.handleChangeInput}  />)}
            </Col>
          </Row>
        </InputGroup>
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
<Button style={{ marginLeft: 180 }} onClick={() => this.prev()}>
              {formatMessage({id:'global.previous'})}
            </Button>
       
            <Button style={{ marginLeft: 8 }}  type="primary" htmlType="submit" onClick={() => this.next3()}>
              {formatMessage({id:'global.next'})}
            </Button>
        
        
        </Form.Item>
      </Form>
:null}


{
current==3?
<Form {...formItemLayout} style={{ padding: '50px 0' }}>
<Form.Item label="Classe de Frequência">
          {getFieldDecorator('frequency', {initialValue:`${this.state.frequency}`,
            rules: [{ required: true, message: 'Por favor informe a Classe!' }],
          })(
<Select
    showSearch
  
    placeholder="Seleccione a Classe.."
    optionFilterProp="children"
    onChange={this.handleSelectClass}
    filterOption={(input, option) =>
      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }
  >
    <Option value="1">1a Classe</Option>
    <Option value="2">2a Classe</Option>
    <Option value="3">3a Classe</Option>
    <Option value="4">4a Classe</Option>
    <Option value="4">5a Classe</Option>
    <Option value="4">6a Classe</Option>
    <Option value="4">7a Classe</Option>
     </Select>
          

          )}
        </Form.Item>
  
<Form.Item
          label={
            <span>
             Valor da Iscrição
            </span>
          }
        >
          <Input  value={this.state.registrationvalue}/>
        </Form.Item> 
        <Form.Item label="Deconto">
         
<Select
    showSearch
  
    placeholder="Seleccione o desconto.."
    optionFilterProp="children"
    onChange={this.handleSelectDiscount}
    value={this.state.discount}
    filterOption={(input, option) =>
      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }
  >
    <Option value="0.05">5%</Option>
    <Option value="0.10">10%</Option>
    <Option value="0.15">15%</Option>
    <Option value="0.20">20%</Option>
    <Option value="0.25">25%</Option>
    <Option value="0.30">30%</Option>
    <Option value="0.35">35%</Option>
     </Select>        
       
        </Form.Item>
        <Form.Item label="Formas de Pagamento">
        {getFieldDecorator('paymentType', {initialValue:`${this.state.paymentMethod}`,
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
             <Option value="MONEY">Numerário</Option>
             <Option value="POS">POS</Option>
             <Option value="BANK_TRANSFER">Transferência Bancária</Option>
          </Select>)}        
                
                 </Form.Item>
        
<Form.Item >
<Button style={{ marginLeft: 180 }} onClick={() => this.prev()}>
              {formatMessage({id:'global.previous'})}
            </Button>
       
            <Button style={{ marginLeft: 8 }}  type="primary" htmlType="submit" onClick={() => this.next()}>
              {formatMessage({id:'global.next'})}
            </Button>
        
        
        </Form.Item>
      </Form>
:null}

{
current==4?
<Form {...formItemLayout} style={{ padding: '50px 0' }}>
<Alert message="Confirme os Dados abaixo e pressione em confirmar" type="info" showIcon />        
<Form.Item >
<Button style={{ marginLeft: 180 }} onClick={() => this.prev()}>
              {formatMessage({id:'global.previous'})}
            </Button>
       
            <Button style={{ marginLeft: 8 }}  type="primary" htmlType="submit" onClick={() => this.next()}>
              {formatMessage({id:'global.confirm'})}
            </Button>
        
        
        </Form.Item>
      </Form>
:null}

{current==5?

 <Result style={{ padding: '50px 0' }}
 status="success"
 title="Inscrição realizada com sucesso!"
 subTitle={`Uma nova Inscrição foi realizada com o seguinte Número de Estudante: ${this.state.studentNumber}`}
 extra={[
   <Button type="primary" key="listStudents">
    Listar Estudantes
   </Button>,
   <Button key="newTransaction" onClick={() => this.restart()}>Nova Inscrição</Button>,
 ]}
/>

:null}
        </div> 
      </Card></PageHeaderWrapper>
    );
  }
}
export default    Form.create({})(Student);