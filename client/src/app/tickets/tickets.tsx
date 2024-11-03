import { Ticket } from '@acme/shared-models';
import styles from './tickets.module.css';
import { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import {
  Avatar,
  Button,
  message,
  Row,
  Space,
  Table,
  TableColumnType,
  TableProps,
  Tag,
  Typography,
} from 'antd';
import { getAllTicketsApi } from '../apis/ticket';
import { useAppSelector } from '../stores/hooks';
import {
  getDetailedTickets,
  setDetailedTickets,
  setOpenCreateTicketModal,
} from '../reducers/ticketSlice';
import { DetailTicket } from '../types/common.types';
import { UserOutlined } from '@ant-design/icons';
import CreateTicketModal from '../components/modals/CreateTicketModal/CreateTicketModal';
import { AppDispatch } from '../stores/stores';
import { useNavigate } from 'react-router-dom';
import { getStatusOptionFromValue } from '../utils/utils';
import React from 'react';

/**
 * Component to display the list of tickets with options to view, filter, and create tickets.
 *
 * @component
 * @returns JSX.Element
 */
const Tickets = React.memo(() => {
  const detailedTickets = useAppSelector(getDetailedTickets);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [_, contextHolder] = message.useMessage();

  const columns: TableColumnType<DetailTicket>[] = useMemo(() => {
    const columnsConfig = [
      {
        key: 'id',
        title: 'Ticket Id',
        dataIndex: ['ticket', 'id'],
        render(value: number) {
          return <Tag>{`Ticket #${value}`}</Tag>;
        },
      },
      {
        key: 'description',
        title: 'Description',
        dataIndex: ['ticket', 'description'],
      },
      {
        key: 'assigneeId',
        title: 'Assignee',
        dataIndex: ['assignee', 'name'],
        render(value: string) {
          return value ? (
            <Space>
              <Avatar size="small" icon={<UserOutlined />} />
              <Typography.Text>{value}</Typography.Text>
            </Space>
          ) : (
            <Typography.Text>Not Assigned</Typography.Text>
          );
        },
      },
      {
        key: 'completed',
        title: (
          <Typography.Text aria-label="completedHeader">
            Completed
          </Typography.Text>
        ),
        dataIndex: ['ticket', 'completed'],
        render(value: boolean) {
          const status = getStatusOptionFromValue(value);
          return <Tag color={status.color}>{status.label}</Tag>;
        },
        filters: [
          {
            text: (
              <Typography.Text aria-label="completedOption">
                Completed
              </Typography.Text>
            ),
            value: true,
          },
          {
            text: (
              <Typography.Text aria-label="uncompletedOption">
                Uncompleted
              </Typography.Text>
            ),
            value: false,
          },
        ],
        onFilter: (value: any, record: { ticket: { completed: boolean } }) =>
          record.ticket.completed === value,
      },
      {
        title: 'Action',
        dataIndex: '',
        key: 'detail',
        render: (_: any, record: { ticket: { id: number } }) => (
          <Button type="link" onClick={() => navigate(`/${record.ticket.id}`)}>
            View Detail
          </Button>
        ),
      },
    ];
    return columnsConfig;
  }, [navigate]);

  /**
   * Fetches all tickets from the API when the component mounts.
   * Updates the Redux store with the fetched tickets.
   */
  useEffect(() => {
    const callGetAllTicketAPI = async () => {
      try {
        const result = await getAllTicketsApi();
        if (!result.success) {
          message.error(result.message);
          return;
        }
        const tickets = result.data as Ticket[];
        dispatch(setDetailedTickets(tickets));
      } catch (error) {
        console.error(error);
      }
    };
    callGetAllTicketAPI();
  }, [dispatch]);

  /**
   * Row selection configuration for the table.
   */
  const rowSelection: TableProps<DetailTicket>['rowSelection'] = useMemo(
    () => ({
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(
          `selectedRowKeys: ${selectedRowKeys}`,
          'selectedRows: ',
          selectedRows
        );
      },
      getCheckboxProps: (record) => ({
        disabled: false,
        id: record.ticket.id.toString(),
      }),
    }),
    []
  );

  return (
    <div className={styles['tickets']}>
      {contextHolder}
      <Row className={styles['createTicketRow']} justify="end">
        <Button
          type="primary"
          onClick={() => dispatch(setOpenCreateTicketModal(true))}
        >
          Create Ticket
        </Button>
      </Row>

      <Table<DetailTicket>
        dataSource={detailedTickets}
        columns={columns}
        rowSelection={rowSelection}
        rowKey={(record) => record.ticket.id.toString()}
      />
      <CreateTicketModal />
    </div>
  );
})

export default Tickets;

