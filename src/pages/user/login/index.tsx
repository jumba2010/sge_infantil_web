import { Alert, Checkbox, Card, Icon, notification, Input, Form, Select, Button } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React, { Component } from 'react';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { setAuthority } from '@/utils/authority';
import { connect } from 'dva';
import { StateType } from './model';
import LoginComponents from './components/Login';
import styles from './style.less';
import API from './../../../services/api';
import { useDispatch } from 'react-redux';
import { login, USER_KEY, SUCURSAL } from './../../../services/auth';

const { UserName, Password, Submit } = LoginComponents;

interface LoginProps {
  dispatch: Dispatch<any>;
  fazerLogin: StateType;
  submitting: boolean;
}
interface LoginState {
  type: string;
  autoLogin: boolean;
  canselectDelegation: boolean;
  isLogged: boolean;
  sucursals: { id: number; description: string }[];
  sucursal: string;
  newPass: string;
  repeatPass: string;
  ipaddress: string;
  location: string;
  changePassword: boolean;
}
export interface FormDataType {
  userName: string;
  password: string;
  repeatepassword: string;
  captcha: string;
}

@connect(
  ({
    fazerLogin,
    loading,
  }: {
    fazerLogin: StateType;
    loading: {
      effects: {
        [key: string]: string;
      };
    };
  }) => ({
    fazerLogin,
    submitting: loading.effects['fazerLogin/autenticar'],
  }),
)
class Login extends Component<LoginProps, LoginState> {
  loginForm: FormComponentProps['form'] | undefined | null = undefined;

  state: LoginState = {
    type: 'account',
    autoLogin: true,
    canselectDelegation: false,
    isLogged: false,
    sucursal: '',
    ipaddress: '',
    location: '',
    newPass: '',
    repeatPass: '',
    changePassword: false,
    sucursals: [],
  };

  changeAutoLogin = (e: CheckboxChangeEvent) => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  gotoHomePage = async () => {
    if (this.state.sucursal) {
      let sucursal = this.state.sucursals.filter(s => s.code === this.state.sucursal)[0];
      localStorage.setItem(SUCURSAL, JSON.stringify(sucursal));

      const dispatch = this.props.dispatch;
      console.log(sucursal);
      if (dispatch) {
        dispatch({
          type: 'student/fetchFrequencies',
        });

        dispatch({
          type: 'student/fetchActiveStudents',
        });
        console.log('Student called');

        dispatch({
          type: 'payment/fetchUnpaidPayments',
        });
      }

      //let response = await API.get('/api/frequency/' + sucursal.id);
      // localStorage.setItem('FREQUENCIES', JSON.stringify(response.data));
      // let fr = JSON.parse(localStorage.getItem('FREQUENCIES'));
      this.props.history.push('/dashboard/analysis');
    }
  };

  handleChangeInput(evt) {
    this.setState({ [evt.target.name]: evt.target.value });
  }

  handleChangePassword = async () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Values:', values);
      }
    });
    const { newPass, repeatPass } = this.state;
    let user = JSON.parse(localStorage.getItem(USER_KEY));
    if (newPass && repeatPass && newPass === repeatPass) {
      await API.put('/api/user/password/' + user.id, { password: newPass, updatedBy: 1 });
      notification.success({
        description: 'Password alterada com sucesso!',
        message: 'Operação realizada com sucesso',
      });
      if (JSON.parse(localStorage.getItem(USER_KEY)).sucursals.length > 1) {
        this.setState({
          changePassword: false,
          sucursals: JSON.parse(localStorage.getItem(USER_KEY)).sucursals,
          canselectDelegation: true,
          isLogged: true,
          type: 'sucursal',
        });
      } else {
        localStorage.setItem(SUCURSAL, JSON.stringify(user.sucursals[0]));

        const dispatch = this.props.dispatch;
        dispatch({
          type: 'student/fetchFrequencies',
        });

        // let response = await API.get('/api/frequency/' + user.sucursals[0].id);
        // localStorage.setItem('FREQUENCIES', JSON.stringify(response.data));
        this.props.history.push('/dashboard/analysis');
      }
    }
  };

  handleSelectSucursals(sucursal: any) {
    this.setState({ sucursal });
  }

  handleValidate = (e: any) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err: any, values: any) => {
      if (!err) {
        console.log('Values:', values);
      }
    });
  };

  handleSubmit = async (err: any, values: FormDataType) => {
    const { userName, password } = values;
    this.setState({ submitting: true });
    try {
      const response = await API.post('/api/auth', { userName, password });
      login(response.data);
      const userDetails = await API.get(`/api/user/unique/${userName}`);
      localStorage.setItem(USER_KEY, JSON.stringify(userDetails.data));
      const { ipaddress, location } = this.state;
      let userAgent = window.navigator.userAgent;
      const logins = await API.get('/api/logininfo/' + userDetails.data.id);

      //Registando a informação de login
      await API.post('/api/logininfo', {
        ipaddress,
        userAgent,
        location,
        userId: userDetails.data.id,
      });
      this.setState({ submitting: false });

      if (userDetails.data.profile.code === '001') {
        setAuthority(['user']);
      } else if (userDetails.data.profile.code === '002') {
        setAuthority(['admin']);
      }

      if (!userDetails.data.passwordUpdated) {
        //Must Change Password because is the first login
        this.setState({ changePassword: true, isLogged: true });
      } else if (userDetails.data.sucursals.length > 1) {
        this.setState({
          sucursals: userDetails.data.sucursals,
          canselectDelegation: true,
          isLogged: true,
          type: 'sucursal',
        });
      } else {
        localStorage.setItem(SUCURSAL, JSON.stringify(userDetails.data.sucursals[0]));
        const dispatch = this.props.dispatch;
        if (dispatch) {
          dispatch({
            type: 'student/fetchFrequencies',
          });
        }
        this.props.history.push('/dashboard/analysis');
      }
    } catch (err) {
      console.log(err);
      notification.error({
        description: err.message,
        message: 'Username ou password invalidos',
      });
      this.setState({
        submitting: false,
      });
    }
  };

  renderMessage = (content: string) => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  componentDidMount() {
    API.get('https://ipapi.co/json/')
      .then(response => {
        let data = response.data;
        this.setState({
          ipaddress: data.ip,
          location:
            data.country_name +
            ',' +
            data.city +
            ', Latitude: ' +
            data.latitude +
            ', Longitude: ' +
            data.longitude,
        });
      })
      .catch(error => {});
  }

  render() {
    const { fazerLogin } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { submitting } = this.state;
    const { status } = fazerLogin;
    const { autoLogin } = this.state;
    return (
      <div className={styles.main}>
        <Card>
          <LoginComponents
            defaultActiveKey={this.state.type}
            onSubmit={this.handleSubmit}
            ref={(form: any) => {
              this.loginForm = form;
            }}
          >
            {!this.state.isLogged ? (
              <div>
                <div>
                  {status === 'error' &&
                    loginType === 'account' &&
                    !submitting &&
                    this.renderMessage(
                      formatMessage({ id: 'userandlogin.login.message-invalid-credentials' }),
                    )}

                  <UserName
                    name="userName"
                    placeholder={`${formatMessage({ id: 'userandlogin.login.userName' })}`}
                    rules={[
                      {
                        required: true,
                        message: formatMessage({ id: 'userandlogin.userName.required' }),
                      },
                    ]}
                  />
                  <Password
                    name="password"
                    placeholder={`${formatMessage({ id: 'userandlogin.login.password' })}`}
                    rules={[
                      {
                        required: true,
                        message: formatMessage({ id: 'userandlogin.password.required' }),
                      },
                    ]}
                  />
                </div>

                <div>
                  <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
                    <FormattedMessage id="userandlogin.login.remember-me" />
                  </Checkbox>
                </div>
                <Submit loading={submitting}>
                  <FormattedMessage id="userandlogin.login.login" />
                </Submit>

                <div className={styles.other}>
                  <FormattedMessage id="userandlogin.login.sign-in-with" />
                  <Icon type="alipay-circle" className={styles.icon} theme="outlined" />
                  <Icon type="taobao-circle" className={styles.icon} theme="outlined" />
                  <Icon type="weibo-circle" className={styles.icon} theme="outlined" />
                </div>
              </div>
            ) : null}
            {this.state.canselectDelegation ? (
              <div>
                <Form onSubmit={this.handleValidate}>
                  <Form.Item label="Sucursal">
                    {getFieldDecorator('sucursal', {
                      rules: [{ required: true, message: 'Por favor informe a sucursal!' }],
                    })(
                      <Select
                        placeholder="Seleccione a Sucursal.."
                        onChange={this.handleSelectSucursals.bind(this)}
                      >
                        {this.state.sucursals.map(s => (
                          <Option key={s.code}>{s.description}</Option>
                        ))}
                      </Select>,
                    )}
                  </Form.Item>
                </Form>
                <Button type="primary" onClick={() => this.gotoHomePage()}>
                  Entrar
                </Button>{' '}
              </div>
            ) : null}
            {this.state.changePassword ? (
              <div>
                <Form onSubmit={this.handleValidate}>
                  <Form.Item label="Nova Senha">
                    <Input.Password
                      name="newPass"
                      onChange={this.handleChangeInput.bind(this)}
                      placeholder="Introduza a nova senha"
                      rules={[
                        {
                          required: true,
                          message: 'Por favor informe a nova senha',
                        },
                      ]}
                    />
                  </Form.Item>
                  <Form.Item label="Repitir Senha">
                    <Input.Password
                      name="repeatPass"
                      onChange={this.handleChangeInput.bind(this)}
                      placeholder="Repita a nova senha"
                      rules={[
                        {
                          required: true,
                          message: 'Por favor repita a password',
                        },
                      ]}
                    />
                  </Form.Item>
                  <Button type="primary" onClick={() => this.handleChangePassword()}>
                    Alterar Senha
                  </Button>{' '}
                </Form>{' '}
              </div>
            ) : null}
          </LoginComponents>
        </Card>
      </div>
    );
  }
}

export default Form.create({})(Login);
