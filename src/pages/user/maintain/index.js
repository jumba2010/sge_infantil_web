import React from 'react';
import ReactDOM from 'react-dom';
import {Table,Card,Row ,Col,Badge,  DatePicker,
  Divider,Menu, Dropdown, Icon,Button,Form,Input,Select,InputNumber, 
  message,  } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { notification } from 'antd';
import api from '../../../services/api';
import moment from 'moment';
import styles from './index.less';
const FormItem = Form.Item;
const pageSize=6;
const menu = (
  <Menu>
    <Menu.Item>Action 1</Menu.Item>
    <Menu.Item>Action 2</Menu.Item>
  </Menu>
);

class ListStudent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    students:[],
    lastdata:[],
     data:[],
    profiles:[],
    pagination:{},
    expandForm:false,
    loadign:true
    };

    this.handleChangeInput = this.handleChangeInput.bind(this); 
    this.handleSelectClass = this.handleSelectClass.bind(this); 

  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.searchFields();
     
  };


  handleChangeInput(evt) {
         if(evt.target.name==='name'){
           let s=this.state.lastdata.filter(d=>d.name.toLowerCase().indexOf(evt.target.value.toLowerCase()) >-1);
      this.setState({data:s});
    } 
    
  }

  componentWillMount() {    
    api.get('/api/profile')
        .then(res => {         
          this.setState({profiles:res.data});           
        })
  
  
  }

    
  handleSelectClass(frequency) {
    let freq=this.state.frequencies.filter(frq=>frq.level===frequency)[0];
    
    let s=this.state.students.filter(d=>d.frequency===freq.description);
    this.setState({data:s,lastdata:s});

  }

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  
  handleSearch = () => {
    e.preventDefault();}
  
  renderSimpleForm() {
    const { form } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="Nome">
            {getFieldDecorator('name', {initialValue:'',
            rules: [{ required: false, message: 'Por favor informe o nome do Encarregado!', whitespace: true }],
          })(
            <Input placeholder="Nome.." autoComplete="off" name='name' onChange={this.handleChangeInput}/>)}
            </FormItem>
          </Col>

          <Col md={7} sm={24}>
            <FormItem label="Perfil">
            {getFieldDecorator('profile', {initialValue:'',
            rules: [{ required: false }],
          })(
                <Select  onChange={this.handleSelectClass} placeholder="Pesqise pelo Perfil ..." style={{ width: '100%' }}>

    {this.state.profiles.map(f=> <Option value={f.code}>{f.description}</Option>)}
                 
                </Select>)}
            </FormItem>
          </Col>
          
          <Col md={9} sm={24}>
            <span>
                         <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset.bind(this)}>
                Limpar Campos
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
               Mostrar Mais <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
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
            <FormItem label="Perfil">
            {getFieldDecorator('profile', {initialValue:'',
            rules: [{ required: false }],
          })(
                <Select  onChange={this.handleSelectClass} placeholder="Pesquise pelo Perfil ..." style={{ width: '100%' }}>
                {this.state.profiles.map(f=> <Option value={f.code}>{f.description}</Option>)}
                </Select>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="Contacto">
            <InputNumber style={{ width: '100%' }} />
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            
          <Col md={8} sm={24}>
            <FormItem label="Estado">
             
            {getFieldDecorator('createdAt', {initialValue:'',
            rules: [{ required: false }],
          })(  
                <Select placeholder="Estado.." style={{ width: '100%' }}>
                  <Option value="0">Activo</Option>
                  <Option value="1">Inactivo</Option>
                  <Option value="2">Novo Ingresso</Option>
                </Select>)}
              
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ float: 'right', marginBottom: 24 }}>
           
            <Button style={{ marginLeft: 8 }}  onClick={this.handleFormReset}>
              Limpar Campos
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              Mostrar Menos <Icon type="up" />
            </a>
          </div>
        </div>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  handleChangeTable=(paginatio, filters,sorter)=>{
    const pager={...this.state.pagination};
    pager.current=paginatio.current;
      this.setState({paginatio:pager});
  }

  componentDidMount() {    
this.searchFields();
    
        } 

       searchFields(){
          api.get('/api/user/all')
        .then(res => {  
          const pagination={...this.state.pagination};
          pagination.total=res.data.length
                  pagination.pageSize=pageSize;
                
          const data = [];          
    for (let i = 0; i < res.data.length; i++) {      
       
      data.push({
        key: res.data[i].id,
        name: res.data[i].name,
        email: res.data[i].email,
        contact: res.data[i].contact,
        profile: res.data[i].profile.description,
        address: res.data[i].address,
        active: res.data[i].active,
       createdAt:moment(res.data[i].createdAt).format('YYYY-MM-DD'),  
      
      });
   
   
    }   
    
    this.setState({data,students:data,lastdata:data,loadign:false,pagination});        
                    
        }) 
        }

  render() {    
    const columns = [
    { title: 'Nome', dataIndex: 'name', key: 'name',render:text=><a>{text}</a> },
      { title: 'Email', dataIndex: 'email', key: 'email' },
      { title: 'Contacto', dataIndex: 'contact', key: 'contact' },
      { title: 'Perfil', dataIndex: 'profile', key: 'profile' },
      { title: 'Endereço', dataIndex: 'address', key: 'address' },
      { title: 'Data de Cadastro', dataIndex: 'createdAt', key: 'createdAt' }, 
       
           { title: '', key: 'operation', render: (text,redord) =><span><a>Editar</a>
           <Divider type='vertical'></Divider>
           <a>Inativar</a>
           <Divider type='vertical'></Divider>
           <a>Reinicializar Senha</a>
            </span> },
           
         ];
       return (
      <PageHeaderWrapper>
      <Card bordered={false}>
      <div className={styles.tableList}>
      <div className={styles.tableListForm}>{this.renderForm()}</div>
        <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={()=>this.props.history.push('/account/create')} >
               Adicionar Novo Utilizador
              </Button>
                     </div>
      <Table
        className="components-table-demo-nested"
        columns={columns}
        loading={this.state.loadign}
        pagination={this.state.pagination}
        dataSource={this.state.data}
        onChange={this.handleChangeTable}
      /></div></Card></PageHeaderWrapper>
    );
  }};
export default    Form.create({})(ListStudent);;