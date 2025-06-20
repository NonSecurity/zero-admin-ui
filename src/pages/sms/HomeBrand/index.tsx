import {ExclamationCircleOutlined, PlusOutlined,} from '@ant-design/icons';
import {Button, Drawer, message, Modal, Select, Switch} from 'antd';
import React, {useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import type {ActionType, ProColumns} from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import ProDescriptions, {ProDescriptionsItemProps} from '@ant-design/pro-descriptions';
import CreateHomeBrandForm from './components/CreateHomeBrandForm';
import SetSortForm from './components/SetSortForm';
import type {HomeBrandListItem} from './data.d';
import {addHomeBrand, queryHomeBrandList, removeHomeBrand, updateHomeBrandSort} from './service';

const {confirm} = Modal;

/**
 * 添加节点
 * @param brandIds
 */
const handleAdd = async (brandIds: number[]) => {
  const hide = message.loading('正在添加');
  if (brandIds.length <= 0) {
    hide();
    return true;
  }
  try {
    await addHomeBrand(brandIds);
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    return false;
  }
};

/**
 * 更新节点
 * @param fields
 */
const handleUpdate = async (fields: HomeBrandListItem) => {
  const hide = message.loading('正在更新');
  try {
    await updateHomeBrandSort(fields);
    hide();

    message.success('更新成功');
    return true;
  } catch (error) {
    hide();
    return false;
  }
};


/**
 * 更新推荐状态
 * @param brandIds
 */
const handleStatus = async (brandIds: number[]) => {
  const hide = message.loading('正在更新品牌推荐状态');
  if (brandIds.length == 0) {
    hide();
    return true;
  }
  try {
    await removeHomeBrand(brandIds);
    hide();
    message.success('更新品牌推荐状态成功');
    return true;
  } catch (error) {
    hide();
    return false;
  }
};


const HomeBrandList: React.FC = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<HomeBrandListItem>();

  const showStatusConfirm = (item: HomeBrandListItem, status: number, brandIds: number[]) => {
    confirm({
      title: `确定${status == 1 ? "推荐" : "不推荐"}${item.name}品牌吗？`,
      icon: <ExclamationCircleOutlined/>,
      async onOk() {
        await handleStatus([item.id])
        actionRef.current?.reload?.();
      },
      onCancel() {
      },
    });
  };

  const columns: ProColumns<HomeBrandListItem>[] = [
    {
      title: '编号',
      dataIndex: 'id',
      hideInSearch: true,
    },
    {
      title: '品牌名称',
      dataIndex: 'name',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '推荐状态',
      dataIndex: 'recommendStatus',
      hideInSearch: true,
      renderFormItem: (text, row) => {
        return <Select
          value={row.value}
          options={[
            {value: '1', label: '推荐'},
            {value: '0', label: '不推荐'},
          ]}
        />

      },
      render: (dom, entity) => {
        return (
          <Switch checked={entity.recommendStatus == 1} onChange={(flag) => {
            showStatusConfirm(entity, flag ? 1 : 0, [entity.brandId])
          }}/>
        );
      },
    },
    {
      title: '排序',
      dataIndex: 'sort',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 220,
      render: (_, record) => (
        <>
          <a
            key="sort"
            onClick={() => {
              handleUpdateModalVisible(true);
              setCurrentRow(record);
            }}
          >
            设置排序
          </a>
        </>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<HomeBrandListItem>
        headerTitle="品牌推荐列表"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button type="primary" onClick={() => handleModalVisible(true)}>
            <PlusOutlined/> 选择品牌
          </Button>,
        ]}
        request={queryHomeBrandList}
        columns={columns}
        rowSelection={{}}
        pagination={{pageSize: 10}}
        tableAlertRender={false}
      />

      <CreateHomeBrandForm
        key={'CreateHomeBrandForm'}
        onSubmit={async (brandIds) => {
          const success = await handleAdd(brandIds);
          if (success) {
            handleModalVisible(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleModalVisible(false);
          if (!showDetail) {
            setCurrentRow(undefined);
          }
        }}
        createModalVisible={createModalVisible}
      />

      <SetSortForm
        key={'UpdateHomeBrandForm'}
        onSubmit={async (value) => {
          const success = await handleUpdate(value);
          if (success) {
            handleUpdateModalVisible(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalVisible(false);
          if (!showDetail) {
            setCurrentRow(undefined);
          }
        }}
        updateModalVisible={updateModalVisible}
        values={currentRow || {}}
      />

      <Drawer
        width={600}
        visible={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.id && (
          <ProDescriptions<HomeBrandListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.id,
            }}
            columns={columns as ProDescriptionsItemProps<HomeBrandListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default HomeBrandList;
