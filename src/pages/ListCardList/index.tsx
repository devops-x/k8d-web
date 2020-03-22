
import { Card, List } from 'antd';
import React, { Component } from 'react';
import dayjs from 'dayjs';

import { Dispatch } from 'redux';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { StateType } from './model';
import { CardListItemDataType } from './data.d';
import styles from './style.less';

dayjs.locale('zh');

const duration = function(end: any, start: any) {
  const daysDiff = end.diff(start, 'day'); // produces `0`, expected `1`
  const hoursDiff = end.diff(start, "hour"); // expected result
  const minutesDiff = end.diff(start, "minute") % 60; // expected result
  return `${daysDiff}天 ${hoursDiff}时 ${minutesDiff}分`;
}

interface ListCardListProps {
  listCardList: StateType;
  dispatch: Dispatch<any>;
  loading: boolean;
}
interface ListCardListState {
  visible: boolean;
  done: boolean;
  current?: Partial<CardListItemDataType>;
}

const CardInfo: React.FC<{
  status: React.ReactNode;
  metadata: React.ReactNode;
}> = ({ status, metadata}) => {
  const replicas = `${status.availableReplicas} / ${status.replicas}`;
  const age = duration(dayjs(), dayjs(metadata.creationTimestamp));
  return (
    <div className={styles.cardInfo}>
      <div>
        <p>副本</p>
        <p>{replicas}</p>
      </div>
      <div>
        <p>时长</p>
        <p>{age}</p>
      </div>
    </div>
  );
};

class ListCardList extends Component<ListCardListProps, ListCardListState> {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'listCardList/fetch',
      payload: {
        count: 8,
      },
    });
  }

  render() {
    const {
      listCardList: { list },
      loading,
    } = this.props;
    const content = (
      <div className={styles.pageHeaderContent}>
        <p>
          提供 Gtilab repo URL 自动部署服务。
        </p>
        <div className={styles.contentLink}>
          <a>
            <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/MjEImQtenlyueSmVEfUD.svg" />{' '}
            新增服务
          </a>
        </div>
      </div>
    );

    const extraContent = (
      <div className={styles.extraImg}>
        <img
          alt="这是一个标题"
          src="https://gw.alipayobjects.com/zos/rmsportal/RzwpdLnhmvDJToTdfDPe.png"
        />
      </div>
    );
    return (
      <PageHeaderWrapper content={content} extraContent={extraContent}>
        <div className={styles.cardList}>
          <List<Partial<CardListItemDataType>>
            rowKey="id"
            loading={loading}
            grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
            dataSource={[...list]}
            renderItem={(item) => {
              return (
                <List.Item key={item.id}>
                  <Card
                    hoverable
                    className={styles.card}
                    actions={[<a key="scale">伸缩</a>, <a key="edit">编辑</a>, <a key="delete">删除</a>]}
                  >
                    <Card.Meta
                      avatar={<img alt="" className={styles.cardAvatar} src={item.avatar} />}
                      title={<a>{item.metadata.name}</a>}
                    />
                    <div className={styles.cardItemContent}>
                      <CardInfo
                          status={item.status}
                          metadata={item.metadata}
                      />
                    </div>
                  </Card>
                </List.Item>
              );
            }}
          />
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default connect(
  ({
    listCardList,
    loading,
  }: {
    listCardList: StateType;
    loading: {
      models: { [key: string]: boolean };
    };
  }) => ({
    listCardList,
    loading: loading.models.listCardList,
  }),
)(ListCardList);
