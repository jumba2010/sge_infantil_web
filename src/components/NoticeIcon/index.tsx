import { Badge, Icon, Spin,Tabs,Tag } from 'antd';
import React, { Component } from 'react';
import classNames from 'classnames';
import NoticeList, { NoticeIconTabProps } from './NoticeList';

import moment from 'moment';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
const months=['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
import { connect } from 'dva';
const { TabPane } = Tabs;

export interface NoticeIconData {
  avatar?: string | React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  datetime?: React.ReactNode;
  extra?: React.ReactNode;
  style?: React.CSSProperties;
  key?: string | number;
  read?: boolean;
}

export interface NoticeIconProps {
  count?: number;
  bell?: React.ReactNode;
  className?: string;
  loading?: boolean;
  onClear?: (tabName: string, tabKey: string) => void;
  onItemClick?: (item: NoticeIconData, tabProps: NoticeIconTabProps) => void;
  onViewMore?: (tabProps: NoticeIconTabProps, e: MouseEvent) => void;
  onTabChange?: (tabTile: string) => void;
  style?: React.CSSProperties;
  onPopupVisibleChange?: (visible: boolean) => void;
  popupVisible?: boolean;
  clearText?: string;
  viewMoreText?: string;
  clearClose?: boolean;
  children: React.ReactElement<NoticeIconTabProps>[];
}

@connect(({ payment, student }) => ({
  unpaidPayments: payment.unpaidPayments,
  frequencies:student.frequencies
}))
export default class NoticeIcon extends Component<NoticeIconProps> {
  public static Tab: typeof NoticeList = NoticeList;

  static defaultProps = {
    onItemClick: (): void => {},
    onPopupVisibleChange: (): void => {},
    onTabChange: (): void => {},
    onClear: (): void => {},
    onViewMore: (): void => {},
    loading: false,
    clearClose: false,
    emptyImage: 'https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg',
  };

  state = {
    visible: false,
    count:0,
    notifySync:false,
    percentage:0,
    list:[]
  };

  componentWillMount =async()=> { 

const {unpaidPayments} = this.props;
    const newNotices = unpaidPayments?unpaidPayments.map(payment => {
      const newNotice = { ...payment };
      newNotice.title=payment.student.name;
      newNotice.avatar='foto';
      newNotice.read=false;
      newNotice.status='urgent';
      newNotice.description='Pagamento atrasado referente ao Mês '+months[payment.month-1]+' de '+payment.year;
        newNotice.datetime =( <div style={{ color: 'red' }}>{moment(payment.limitDate).fromNow()}</div>);      
        newNotice.key = newNotice.id;
         const color = {
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        }[newNotice.status];
        newNotice.extra = (
          <Tag color={color} style={{ marginRight: 0 }}>
            {newNotice.extra}
          </Tag>
        );
      
      return newNotice;
    }):[];

this.setState({count:unpaidPayments.length,list:newNotices});
    
        } 

  onItemClick = (item: NoticeIconData, tabProps: NoticeIconTabProps): void => {
    const { onItemClick } = this.props;
    if (onItemClick) {
      onItemClick(item, tabProps);
    }
  };

  onClear = (name: string, key: string): void => {
    const { onClear } = this.props;
    if (onClear) {
      onClear(name, key);
    }
  };

  onTabChange = (tabType: string): void => {
    const { onTabChange } = this.props;
    if (onTabChange) {
      onTabChange(tabType);
    }
  };

  onViewMore = (tabProps: NoticeIconTabProps, event: MouseEvent): void => {
    const { onViewMore } = this.props;
    if (onViewMore) {
      onViewMore(tabProps, event);
    }
  };

  getNotificationBox(): React.ReactNode {
    const { children, loading, clearText, viewMoreText } = this.props;
    if (!children) {
      return null;
    }
    const panes = React.Children.map(
      children,
      (child: React.ReactElement<NoticeIconTabProps>): React.ReactNode => {
        if (!child) {
          return null;
        }
        const {  title,  tabKey, showClear, showViewMore } = child.props;
        const { count,list } = this.state;
        const len = list && list.length ? list.length : 0;
        const msgCount = count || count === 0 ? count : len;
        const tabTitle: string = msgCount > 0 ? `${title} (${msgCount})` : title;
        return (
          <TabPane tab={tabTitle} key='notification'>
            <NoticeList
              clearText={clearText}
              viewMoreText={viewMoreText}
              data={list}
              onClear={(): void => this.onClear(title, tabKey)}
              onClick={(item): void => this.onItemClick(item, child.props)}
              onViewMore={(event): void => this.onViewMore(child.props, event)}
              showClear={showClear}
              showViewMore={showViewMore}
              title={title}
              {...child.props}
            />
          </TabPane>
        );
      },
    );
    return (
      <>
        <Spin spinning={loading} delay={300}>
          <Tabs className={styles.tabs} onChange={this.onTabChange}>
            {panes}
          </Tabs>
        </Spin>
      </>
    );
  }

  handleVisibleChange = (visible: boolean): void => {
    const { onPopupVisibleChange } = this.props;
    this.setState({ visible });
    if (onPopupVisibleChange) {
      onPopupVisibleChange(visible);
    }
  };

  render(): React.ReactNode {
    const { className, popupVisible, bell } = this.props;
    const { visible,count } = this.state;
    const noticeButtonClass = classNames(className, styles.noticeButton);
    const notificationBox = this.getNotificationBox();
    const NoticeBellIcon = bell || <Icon type="bell" className={styles.icon} />;
    const trigger = (
      <span className={classNames(noticeButtonClass, { opened: visible })}>
        <Badge count={count} style={{ boxShadow: 'none' }} className={styles.badge}>
          {NoticeBellIcon}
        </Badge>
      </span>
    );
    if (!notificationBox) {
      return trigger;
    }
    const popoverProps: {
      visible?: boolean;
    } = {};
    if ('popupVisible' in this.props) {
      popoverProps.visible = popupVisible;
    }

    return (
      <HeaderDropdown
        placement="bottomRight"
        overlay={notificationBox}
        overlayClassName={styles.popover}
        trigger={['click']}
        visible={visible}
        onVisibleChange={this.handleVisibleChange}
        {...popoverProps}
      >
        {trigger}
      </HeaderDropdown>
    );
  }
}
