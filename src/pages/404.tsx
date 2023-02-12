import { Button, Result } from 'antd';
import React from 'react';
import router from 'umi/router';

const NoFoundPage: React.FC<{}> = () => (
  <Result
    status="404"
    title="404"
    subTitle="Desculpa, a Pagina que requisitou não existe."
    extra={
      <Button type="primary" onClick={() => router.push('/')}>
        Ir a Página Inicial
      </Button>
    }
  ></Result>
);

export default NoFoundPage;
