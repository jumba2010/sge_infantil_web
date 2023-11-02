import React from 'react';
import ReactDOM from 'react-dom';
import { Steps,Card, Button, message,Upload, Icon,Form, Input,Statistic, Checkbox, Select,Descriptions, DatePicker,Col ,Divider,Row,Tooltip,Layout,Alert,Result  } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import moment from 'moment';
import { notification } from 'antd';
import api from '../../../services/api';
import { USER_KEY,SUCURSAL } from "../../../services/auth";
const { Step } = Steps;
const { TextArea } = Input;
const {  Content, Sider } = Layout;
import { connect } from 'dva';

import styles from './index.less';

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
    title: 'Confirmar',
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
  



  @connect(({ student, loading }) => ({
    students: student.students,
    currentStudent:student.currentStudent,
    frequencies: student.frequencies,
  }))
class Student extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      current: 0,
      student:{},
      loading: false,
      confirmDirty: false,
      autoCompleteResult: [],
      name:'',
      birthDate: '',
      gender:'',
      docType:'',
      docNumber:'',
      motherName:'',
      carierContact:'',
      carierName:'',
      oldMonthlyValue:0,
      jobLocation:'',
      address:'',
      kinshipDegree:'',
      studentAddress:'',
      isNew:'',
      needSpecialHour:'',
      isAlergicToMedicine:'',
      isAlergicToFood:'',
      alergicToFood:'',
      alergicToMedicine:'',
      studentNumber:1,
      fatherName:'',
      motherContact:'',
      fatherContact:'',
      registrationValue:0,
      recurigRegistrationValue:0,
      monthlyPayment:0,
      initialMonthly:0,
      requireDocNumber:false,
      total:0,
       workplace:'',
      issaving:false,
      imageUrl:'',
      frequency:0,
      freqDescription:'',
      file:{},
      discount:0.0,
      paymentMethod:'POS'
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


  componentWillMount(){
    let s=this.props.currentStudent;
    let freq=this.props.frequencies.filter(frq=>frq.level==s.student.level)[0]
    let registrationValue=s.isNew?freq.registrationValue:freq.recurigRegistrationValue;
    let discount=s.needSpecialTime===1?0:1-s.monthlyPayment/freq.monthlyPayment;
    this.setState({ name:s.student.name,
    registrationId:s.id,
    birthDate: moment(s.student.birthDate,'YYYY-MM-DD'),
    gender:s.student.sex,
    student:s.student,
    docType:s.student.docType,
    docNumber:s.student.docNumber,
    motherName:s.student.motherName,
    carierContact:s.student.carier.contact,
    carierName:s.student.carier.name,
    jobLocation:s.student.carier.workPlace,
    address:s.student.address,
    kinshipDegree:s.student.carier.kinshipDegree,
    studentAddress:s.student.address,
    isNew:s.isNew,
    needSpecialHour:s.needSpecialTime===1,
    isAlergicToMedicine:s.student.alergicToMedicine,
    isAlergicToFood:s.student.alergicToFood,
    alergicToFood:s.student.alergicToFood,
    alergicToMedicine:s.student.alergicToMedicine,
    fatherName:s.student.fatherName,
    motherContact:s.student.motherContact,
    fatherContact:s.student.fatherContact,
    registrationValue:freq.registrationValue,
    monthlyPayment:s.monthlyPayment,
    initialMonthly:s.monthlyPayment,
    oldMonthlyValue:s.monthlyPayment,
    workplace:s.student.carier.workPlace,
    discount,
    issaving:false,
    freqDescription:freq.description,
    frequency:s.student.level});


  }

beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
if (!isJpgOrPng) {
  message.error('You can only upload JPG/PNG file!');
}
const isLt2M = file.size / 1024 / 1024 < 2;
if (!isLt2M) {
  message.error('Image must smaller than 2MB!');
}

this.setState({file})
return isJpgOrPng && isLt2M;
}


  handleChangeInput(evt) {
    this.setState({ [evt.target.name]: evt.target.value });
  }

  handleSelectbirthDate(date) {
    this.setState({ birthDate: date});
  }

  changeNewStudent(e){

    this.setState({isNew:e.target.checked,registrationValue:!e.target.checked?this.state.recurigRegistrationValue:this.state.registrationValue})
  }

  changeIsAlergicToFood(e){
    this.setState({isAlergicToFood:e.target.checked})
  }

  changeNeedSpecialHour(e){
    let freq= this.props.frequencies.filter((f)=>f.level===this.state.frequency)[0];
    let monthlyPayment=this.state.monthlyPayment;
    let extra=e.target.checked?freq.specialHourMonthlyValue:0;
    let newMontlyPayment=monthlyPayment + extra ;  
    this.setState({needSpecialHour:e.target.checked,monthlyPayment:e.target.checked?newMontlyPayment:freq.monthlyPayment})
  }

  changeIsAlergicMedicine(e){
    this.setState({isAlergicToMedicine:e.target.checked})
  }

  handleSelectGender(gender) {
    this.setState({gender});
  }

  handleSelectDocType(docType) {
    this.setState({docType,requireDocNumber:docType!=='Nenhum'});
  }

  handleSelectClass(frequency) {
let freq= this.props.frequencies.filter((f)=>f.level===frequency)[0];
let registrationValue=this.state.isNew?freq.registrationValue:freq.recurigRegistrationValue;
this.setState({frequency,registrationValue,monthlyPayment:freq.monthlyPayment,oldMonthlyValue:freq.monthlyPayment,recurigRegistrationValue:freq.recurigRegistrationValue});  
  }

  handleSelectPaymentType(paymentMethod) {
    this.setState({paymentMethod});
  }

  handleSelectDiscount(discount) {
    let registrationvalue =this.state.registrationValue*(1-parseFloat(discount));
    let monthlyPayment =this.state.oldMonthlyValue*(1-parseFloat(discount));    
    this.setState({discount,registrationvalue,monthlyPayment});
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

  handleChange =async info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          file:info.file,
          loading: false,
        }),
      );

      const data = new FormData();
      data.append('file', this.state.file,'PIC_'+(new Date()).getTime()+'.'+this.state.file.name.split('.').pop());
      data.append('filename', 'PIC_'+(new Date()).getTime()+'.'+this.state.file.name.split('.').pop());

      const config = {
            headers: {
                  "content-type": "multipart/form-data"
            }
      };

     let  resp=   await api.post(
            "/api/upload/pictures",
            data, config
      );

      this.setState({
        picture:resp.data.file,
              });
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

  confirmTransaction= async() =>{
    window.scrollTo(0, 0);
        this.setState({ issaving: true })
  let loggedUser = JSON.parse(localStorage.getItem(USER_KEY));
 let sucursal=JSON.parse(localStorage.getItem(SUCURSAL));
 let picture = this.state.imageUrl;

 let { name,address,gender,isNew,birthDate,docType,docNumber,motherName,jobLocation,
  carierContact,carierName,workplace,frequency,
  fatherContact,motherContact,fatherName,kinshipDegree,
  monthlyPayment,registrationValue,discount,studentAddress,
  needSpecialHour,alergicToFood,alergicToMedicine,registrationId} = this.state

api.put("/api/student/"+this.state.student.id, {
  name,alergicToFood,alergicToMedicine,
    registrationId,address,sex:gender,
    birthDate,docType,docNumber,
    motherName,fatherName,picture,
    motherContact,fatherContact,
    totalPaid:registrationValue,monthlyPayment,
    carierId:this.state.student.carier.id,
    payments:this.state.student.payments,
    carierName,kinshipDegree,contact:carierContact,workPlace:jobLocation,
    discount,isNew,needSpecialTime:needSpecialHour,classId:frequency,
    currentMonthlyPayment:monthlyPayment,level:frequency,updatedBy:loggedUser.id
})
.then( data =>{
  const current = this.state.current + 1;      
    this.setState({ current,issaving:false });
    window.scrollTo(0, 0);  
  this.props.dispatch({
    type: 'student/fetchActiveStudents'
  });

  this.props.dispatch({
    type: 'payment/fetchUnpaidPayments',
  });

  this.props.dispatch({
    type: 'payment/fetchPaidPayments',
  });
})
.catch(function (error) { 
  notification.error({
      description:'Erro ao Processar o o seu pedido',
      message: error.message,
    });     
});

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
    if(this.state.kinshipDegree && this.state.carierName && this.state.carierContact && this.state.address && this.state.carierContact.length===9){   
    const current = this.state.current + 1;
    this.setState({ current });
  }
  }

  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
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
            span: 18,
            offset: 6,
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
          <Option value="BI">BI</Option>
          <Option value="cedula">Cédula Pessoal</Option>
          <Option value="Nenhum">Sem Documento</Option>
       
                 </Select>,
      );

      const extra = (
        <>
                <Button onClick={()=>this.props.history.push('/student/mantain')}>
          Listar Estudante
          </Button>
        </>
      );


    return (
        <PageHeaderWrapper>
        <Card>
        <Steps current={current} size='default'>
          {steps.map(item => (
            <Step key={item.title} title={item.title} icon={item.title==='Confirmar' && current==4 && this.state.issaving?<Icon type="loading" />:null} />
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
        beforeUpload={this.beforeUpload.bind(this)}
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
              Nome Completo&nbsp;
              <Tooltip title="O Nome completo do Estudante?">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          }
        >
          {getFieldDecorator('name', {initialValue:`${this.state.name}`,
            rules: [{ required: true, message: 'Por favor informe o nome!', whitespace: true }],
          })(<Input name='name' autoComplete="off" onChange={this.handleChangeInput} />)}
        </Form.Item>  
        <Form.Item label="Data de Nascimento">
          <DatePicker  defaultValue={moment(this.state.birthDate, 'YYYY-MM-DD')}  style={{ width: '100%'}}  format='YYYY-MM-DD' onChange={this.handleSelectbirthDate} disabledDate={desabledBirthDate}/>
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
 <Option value="BI">BI</Option>
 <Option value="Passaporte">Passaporte</Option>
          <Option value="Cedula">Cédula Pessoal</Option>
          <Option value="Bolentim">Bolentim de Nascimento</Option>
          <Option value="Nenhum">Sem Documento</Option>
  </Select> )}
        </Form.Item>

        <Form.Item label="Nr. de Documento" required='false'>
        {getFieldDecorator('docNumber', {initialValue:`${this.state.docNumber}`,
            rules: [{ required:this.state.requireDocNumber, message: 'Por favor informe o tipo de documento!' }],
          })(<Input  style={{ width: '100%' }}  autoComplete="off" placeholder='Nr. de Documento' name='docNumber' onChange={this.handleChangeInput}/>
           )} </Form.Item> 
   <Form.Item
          label={
            <span>
              Morada
            </span>
          }
        >
          {getFieldDecorator('studentAddress', {initialValue:`${this.state.studentAddress}`,
            rules: [{ required: true, message: 'Por favor informe a morada do Aluno!', whitespace: true }],
          })(<TextArea rows={4} name='studentAddress'  onChange={this.handleChangeInput} />)}
        </Form.Item>  
        <Form.Item {...tailFormItemLayout}>
       <Row>
         <Col span={8}>
        <Checkbox name='isNew' checked={this.state.isNew} onChange={this.changeNewStudent.bind(this)} >É novo Ingresso</Checkbox>
        </Col>
        <Col span={8}>
        <Checkbox name='isAlergicToFood' checked={this.state.isAlergicToFood} onChange={this.changeIsAlergicToFood.bind(this)}>É alérgico a Comida?</Checkbox>
        </Col>
        <Col span={8}>
        <Checkbox  name='isAlergicToMedicine' checked={this.state.isAlergicToMedicine} onChange={this.changeIsAlergicMedicine.bind(this)}>É alérgico a Medicamento?</Checkbox>
        </Col>
        </Row>

{this.state.isAlergicToFood?
        <Form.Item
          label={
            <span>
              Lista de Alimentos 
            </span>
          }
        >
          {getFieldDecorator('alergicToFood', {initialValue:`${this.state.alergicToFood}`,
            rules: [{ required: false, message: 'Por favor informe a morada do Aluno!', whitespace: true }],
          })(<TextArea rows={4} name='alergicToFood'  onChange={this.handleChangeInput} />)}
        </Form.Item> :null}

        {this.state.isAlergicToMedicine?
        <Form.Item
          label={
            <span>
              Lista de Medicamentos 
            </span>
          }
        >
          {getFieldDecorator('alergicToMedicine', {initialValue:`${this.state.alergicToMedicine}`,
            rules: [{ required: false, message: 'Por favor informe a morada do Aluno!', whitespace: true }],
          })(<TextArea rows={4} name='alergicToMedicine'  onChange={this.handleChangeInput} />)}
        </Form.Item> :null}
        </Form.Item>

           <Form.Item >          
            <Button style={{ marginLeft: 180 }} type="primary" htmlType="submit" onClick={() => this.next1()}>
              Próximo
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
          })(<Input  autoComplete="off" name='fatherName' onChange={this.handleChangeInput}/>)}
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
          })(<Input autoComplete="off"  name='motherName' onChange={this.handleChangeInput}/>)}
        </Form.Item> 

        <Form.Item
          label={
            <span>
              Contacto do Pai
            </span>
          }
        >       
          <Row gutter={8}>
            <Col span={3}>
              <Input defaultValue="+258"  disabled='true'  />
            </Col>
            <Col span={8} >
              <Input autoComplete="off" maxLength='9' minLength='9' name='fatherContact' value={this.state.fatherContact}  onChange={this.handleChangeInput} />
            </Col>
          </Row>  
        </Form.Item> 
        <Form.Item
          label={
            <span>
               Contacto da Mãe
            </span>
          }
        >

          <Row gutter={8}>
            <Col span={3}>
              <Input defaultValue="+258"  disabled='true' />
            </Col>
            <Col span={8} >
              <Input autoComplete="off" maxLength='9' value={this.state.motherContact}  name='motherContact' onChange={this.handleChangeInput} />
            </Col>
          </Row>
            </Form.Item> 
<Form.Item >
<Button style={{ marginLeft: 180 }} onClick={() => this.prev()}>
              Anterior
            </Button>
       
            <Button style={{ marginLeft: 8 }}  type="primary"  htmlType="submit" onClick={() => this.next2()}>
              Próximo
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
          })(<Input autoComplete="off" name='carierName' value={this.state.carierName}  onChange={this.handleChangeInput} />)}
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
             <Row gutter={8}>
            <Col span={3}>
          <Input defaultValue="+258" disabled='true'  />
            </Col>
            <Col span={8}>
            {getFieldDecorator('carierContact', {initialValue:`${this.state.carierContact}`,
            rules: [{ required: true, message: 'Por favor informe um Número válido!', whitespace: true,len:9 }],
          })(<Input autoComplete="off" name='carierContact'   onChange={this.handleChangeInput}  />)}
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
<Button style={{ marginLeft: 180 }} onClick={() => this.prev()}>
              Anterior
            </Button>
       
            <Button style={{ marginLeft: 8 }}  type="primary" htmlType="submit" onClick={() => this.next3()}>
              Próximo
            </Button>
        
        
        </Form.Item>
      </Form>
:null}



{
current==3?
<Form {...formItemLayout} style={{ padding: '50px 0' }} >
<Alert message="Confirme os Dados abaixo e pressione em confirmar" type="info" showIcon /> 

<Descriptions title="Dados Pessoais" style={{ marginBottom: 10,marginTop:32 }} column={4} className={styles.information}>
<Descriptions.Item label="Nome Completo">{this.state.name}</Descriptions.Item>
            <Descriptions.Item label="Data de Nascimento">{this.state.birthDate.format("DD/MM/YYYY")}</Descriptions.Item>
            <Descriptions.Item label="Sexo">{this.state.gender}</Descriptions.Item>
            <Descriptions.Item label="Tipo de Documento">{this.state.docType}</Descriptions.Item>
            <Descriptions.Item label="Nr. de Documento">{this.state.docNumber}</Descriptions.Item>
          </Descriptions>
          <Divider style={{ marginBottom: 10 }} column={4} />
          <Descriptions title="Filiação" style={{ marginBottom: 10 }} className={styles.information}>
            <Descriptions.Item label="Nome do Pai">{this.state.fatherName}</Descriptions.Item>
            <Descriptions.Item label="Contacto do Pai">{this.state.fatherContact}</Descriptions.Item>
            <Descriptions.Item label="Nome da Mãe">{this.state.motherName}</Descriptions.Item>
            <Descriptions.Item label="Contacto da Mãe">{this.state.motherContact}</Descriptions.Item>
            </Descriptions>
            <Divider style={{ marginBottom: 10}} />
          <Descriptions title="Encarregado" style={{ marginBottom: 10 }} column={4} className={styles.information}>
            <Descriptions.Item label="Grau de Parentesco">{this.state.kinshipDegree}</Descriptions.Item>
            <Descriptions.Item label="Nome">{this.state.carierName}</Descriptions.Item>
            <Descriptions.Item label="Contacto">{this.state.carierContact}</Descriptions.Item>
            <Descriptions.Item label="Local de Trabalho">{this.state.jobLocation}</Descriptions.Item>
            <Descriptions.Item label="Morada">{this.state.address}</Descriptions.Item>
          </Descriptions>
          <Divider style={{ marginBottom: 10}} />
          <Descriptions title="Inscrição" style={{ marginBottom: 10 }} column={4} className={styles.information}>
            <Descriptions.Item label="Frequência">{JSON.parse(localStorage.getItem('FREQUENCIES')).filter((f)=>f.level==this.state.frequency)[0].description}</Descriptions.Item>
            <Descriptions.Item label="Valor Mensal">{this.state.monthlyPayment}</Descriptions.Item>
            <Descriptions.Item label="Valor da Inscrição">{this.state.registrationValue}</Descriptions.Item>
            <Descriptions.Item label="Formas de Pagamento">{this.state.paymentMethod}</Descriptions.Item>
           </Descriptions>
<Form.Item >
<Button style={{ marginLeft: 180 }} onClick={() => this.prev()}>
              Anterior
            </Button>
       
            <Button style={{ marginLeft: 8 }} loading={this.state.issaving} type="primary" htmlType="submit" onClick={() => this.confirmTransaction()}>
              Confirmar
            </Button>        
        
        </Form.Item>
      </Form>
:null}
{current==4?
  <Form {...formItemLayout} style={{ padding: '50px 0' }}>
<Result
    status="success"
    title="Operação Realizada com Sucesso!"
    subTitle="Cadastro realizado com Sucesso"
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
export default    Form.create({})(Student);