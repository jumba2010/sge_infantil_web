import { Table, Badge, Statistic, Descriptions } from 'antd';

import months from '../../../../utils/months';

const expandedPaymentRowRender = record => {
  const columns = [
    { title: 'Ano', dataIndex: 'year', key: 'year' },
    {
      title: 'Mês',
      dataIndex: 'month',
      key: 'month',
      render: (_, record) => <div>{months.filter(m => m.code == record.month)[0].desc};</div>,
    },
    { title: 'Total', dataIndex: 'total', key: 'total' },
    {
      title: 'Estado',
      key: 'status',
      render: (text, record) => (
        <span>
          {record.status == 0 ? (
            <Badge count={'Não Pago'} />
          ) : record.hasFine ? (
            <Badge count={'Pago'} style={{ backgroundColor: '#DAA520' }} />
          ) : (
            <Badge count={'Pago'} style={{ backgroundColor: '#52c41a' }} />
          )}
        </span>
      ),
    },

    { title: 'Data Limite', dataIndex: 'limitDate', key: 'limitDate' },
  ];

  return (
    <Table
      columns={columns}
      rowKey="id"
      dataSource={record.payments}
      pagination={false}
      expandedRowRender={record => (
        <Descriptions column={2}>
          <Descriptions.Item label="Valor Mensal">
            {record.currentMonthlyPayment} MZN
          </Descriptions.Item>
          <Descriptions.Item label="Ano">{record.year}</Descriptions.Item>
          <Descriptions.Item label="Mês">{record.month}</Descriptions.Item>

          <Descriptions.Item label="Desconto">{record.discount * 100} % </Descriptions.Item>
          <Descriptions.Item label="Multa">{record.fine} MZN</Descriptions.Item>
          <Descriptions.Item label="Data de Pagamento">
            {record.paymentDate ? moment(record.paymentDate).format('YYYY-MM-DD') : ''}
          </Descriptions.Item>

          <Descriptions.Item label="Estado">
            {' '}
            <span>
              {record.status == 0 ? (
                <Badge count={'Não Pago'} />
              ) : (
                <Badge count={'Pago'} style={{ backgroundColor: '#52c41a' }} />
              )}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="Total">
            <Statistic value={record.total} suffix="MZN" />
          </Descriptions.Item>
        </Descriptions>
      )}
    />
  );
};

export default expandedPaymentRowRender;
