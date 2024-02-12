import React from 'react';
import ReactDOM from 'react-dom';
import { Table, Input, InputNumber,Card, Popconfirm,Form, Button,notification } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import api from './../../../services/api';
import { USER_KEY,SUCURSAL } from "./../../../services/auth";
import './index.less';
import { Label } from 'bizcharts';
import { connect } from 'dva';

const EditableContext = React.createContext();


class EditableCell extends React.Component {
  getInput = () => {
    if (this.props.inputType === 'text') {
      return <Input disabled />; 
    }
  
    return <InputNumber />;
  };

  renderCell = ({ getFieldDecorator }) => {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: `Por favor informe o ${title}!`,
                },
              ],
              initialValue: record[dataIndex],
            })(this.getInput())}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  render() {
    return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
  }
}

@connect(({ student, loading }) => ({
  frequencies: student.frequencies,
}))
class EditableTable extends React.Component {

   constructor(props) {
    super(props);
    this.state = { editingKey: '',data:[],loading:false };
    this.columns = [
      {
        title: 'Nível',
        dataIndex: 'level',      
        editable: true,
      },
      {
        title: 'Valor de Inscrição',
        dataIndex: 'registrationValue',      
        editable: true,
      },

      {
        title: 'Valor da Renovação',
        dataIndex: 'recurigRegistrationValue',      
        editable: true,
      },

      {
        title: 'Valor Mensal',
        dataIndex: 'monthlyPayment',
      
        editable: true,
      },

      {
        title: 'Horario Especial',
        dataIndex: 'specialHourMonthlyValue',
      
        editable: true,
      },
     
      {
        title: 'Acção',
        dataIndex: 'operation',
        render: (text, record) => {
          const { editingKey } = this.state;
          const editable = this.isEditing(record);
          return editable ? (
            <span>
              <EditableContext.Consumer>
                {form => (
                  <Button loading={this.state.loading} type='primary'
                    onClick={() => this.save(form, record.key)}
                    style={{ marginRight: 8 }}
                  >
                    {formatMessage({id:'global.submit'})}
                  </Button>
                )}
              </EditableContext.Consumer>
              <Popconfirm title="Tem a certeza que dezeja cancelar ?" onConfirm={() => this.cancel(record.key)}>
                <Button  type='danger'>{formatMessage({id:'global.cancel'})}</Button>
              </Popconfirm>
            </span>
          ) : (
            <a disabled={editingKey !== ''} onClick={() => this.edit(record.key)}>
              Editar
            </a>
          );
        },
      },
    ];
  }

  isEditing = record => record.key === this.state.editingKey;

  cancel = () => {
    this.setState({ editingKey: '' });
  };

  save(form, key) {
    form.validateFields(async(error, row) => {
      if (error) {
        return;
      }
      const newData = [...this.state.data];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const item = newData[index];

        //Remove o elemento antigo(item) e substitui pelo novo (row)
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        this.setState({loading:true});
        await api.put("/api/frequency/"+item.key, {recurigRegistrationValue:row.recurigRegistrationValue,specialHourMonthlyValue:row.specialHourMonthlyValue,
          registrationValue:row.registrationValue,monthlyPayment:row.monthlyPayment,updatedBy:1
        })
        .then( data => {
          this.props.dispatch({
            type: 'student/fetchFrequencies'
          });
          
        this.setState({ data: newData, editingKey: '' ,loading:false});
        notification.open({message:'Taxa actualizada com sucesso!',type:'success', top:100})

        })
        .catch(function (error) { 
          notification.error({
              description:'Erro ao Processar o o seu pedido',
              message: 'Erro ao processar o pedido',
            });     
        });

      } else {
        newData.push(row);
        this.setState({ data: newData, editingKey: '' });
      }
    });
  }

  edit(key) {
    this.setState({ editingKey: key });
  }

  componentDidMount() {
    const {frequencies} = this.props;
    const data = [];
    for (let i = 0; i < frequencies.length; i++) {   
      data.push({
        key: frequencies[i].id,
        level: frequencies[i].description,
        registrationValue: frequencies[i].registrationValue,
        recurigRegistrationValue: frequencies[i].recurigRegistrationValue,
        monthlyPayment: frequencies[i].monthlyPayment,
        specialHourMonthlyValue: frequencies[i].specialHourMonthlyValue,
      });
    }  

    this.setState({data});  
 
        }

  render() {
    const components = {
      body: {
        cell: EditableCell,
      },
    };

    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataIndex === 'level' ? 'text' : 'number',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });

    return (
      <PageHeaderWrapper>
      <Card>
      <EditableContext.Provider value={this.props.form}>
        <Table
          components={components}
          bordered
          dataSource={this.state.data}
          columns={columns}
          rowClassName="editable-row"
          pagination={{
            onChange: this.cancel,
          }}
        />
      </EditableContext.Provider></Card></PageHeaderWrapper>
    );
  }
}

export default    Form.create()(EditableTable);
