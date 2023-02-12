import { Alert, Checkbox, Icon,notification } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React, { Component } from 'react';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import Link from 'umi/link';
import { connect } from 'dva';
import { StateType } from './model';
import LoginComponents from './components/Login';
import styles from './style.less';
import API from './../../../services/api'
import { login,USER_KEY } from "./../../../services/auth";
import { routerRedux } from 'dva/router';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      password:'',
      showError: false,
      userNameError:false,
      passwordError:false,
      loading: false,
      erroSms: '',
      errors: {},  }
    this.handleChange = this.handleChange.bind(this); 
}

handleSignIn = async e => {
    e.preventDefault();
    const { userName, password } = this.state; 
        this.setState({ loading: true });
        try {
            const response = await API.post("/api/auth", { userName, password });
            API.get(`/api/user/${userName}`)
                .then(res => {
                    const userDetails = res.data;
                    localStorage.setItem(USER_KEY, JSON.stringify(userDetails));
                    login(response.data, userDetails);
                    this.setState({
                        loading: false
                    });
                    routerRedux.replace(redirect || '/dashboard/analysis')
                });

        } catch (err) {
            notification.error({
                description:'Erro ao Processar o o seu pedido',
                message: 'Erro ao processar o pedido',
              });  
            this.setState({
                                loading: false
            });
        }
   
};


handleChange = e => this.setState({
  [e.target.name]: e.target.value
});

  render() {
    return (
        <div className={styles.main}>
        <LoginComponents
          defaultActiveKey={type}
                  onSubmit={this.handleSubmit}
          ref={(form: any) => {
            this.loginForm = form;
          }}
        >
          <div >
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
              onPressEnter={e => {
                e.preventDefault();
                this.loginForm.validateFields(this.handleSignIn);
              }}
            />
          </div>        
          <div>
            <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
              <FormattedMessage id="userandlogin.login.remember-me" />
            </Checkbox>
            <a style={{ float: 'right' }} href="">
              <FormattedMessage id="userandlogin.login.forgot-password" />
            </a>
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
        </LoginComponents>
      </div>
    );
  }
}

export default Login;
