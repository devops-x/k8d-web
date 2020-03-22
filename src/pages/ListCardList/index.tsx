
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

  textToImg(canvas) {
    if (!canvas) {
      return;
    }
    const deploymentName = canvas.getAttribute('title');
    //名字
    var name = deploymentName ? deploymentName.substring(0, 1).toLocaleUpperCase() : '';
    //图像大小
    var size = 60;
    //背景颜色
    var colours = [
            "#1abc9c", "#2ecc71", "#3498db", "#9b59b6", "#34495e", "#16a085", "#27ae60", "#2980b9", "#8e44ad", "#2c3e50",
            "#f1c40f", "#e67e22", "#e74c3c", "#00bcd4", "#95a5a6", "#f39c12", "#d35400", "#c0392b", "#bdc3c7", "#7f8c8d"
        ],
        nameSplit = String(name).split(' '),
        initials, charIndex, colourIndex, context, dataURI;
    if (nameSplit.length == 1) {
        initials = nameSplit[0] ? nameSplit[0].charAt(0) : '?';
    } else {
        initials = nameSplit[0].charAt(0) + nameSplit[1].charAt(0);
    }
    //上面对名字进行一系列处理，下面找到绘图元素
    charIndex = (initials == '?' ? 72 : initials.charCodeAt(0)) - 64;
    colourIndex = charIndex % 20;
    //图像大小
    canvas.width = size;
    canvas.height = size;
    context = canvas.getContext("2d");
    //图像背景颜色
    context.fillStyle = colours[colourIndex - 1];
    context.fillRect(0, 0, canvas.width, canvas.height);
    //字体大小
    context.font = Math.round(canvas.width / 2) + "px 'Microsoft Yahei'";
    context.textAlign = "center";
    //字体颜色
    context.fillStyle = "#FFF";
    context.fillText(initials, size / 2, size / 1.5);
    return canvas.toDataURL("image/png");
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
                      avatar={<canvas ref={this.textToImg} className={styles.cardAvatar} title={item.metadata.name}/>}
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
