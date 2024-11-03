import {
  Button,
  Card,
  Col,
  Divider,
  message,
  Row,
  Select,
  Skeleton,
  Space,
  Typography,
  Avatar,
  Tag,
} from 'antd';
import styles from './ticket-details.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppSelector } from '../stores/hooks';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  assignUserToTicketApi,
  getTicketApi,
  markTicketAsCompleteApi,
  markTicketAsIncompleteApi,
  unassignUserFromTicketApi,
} from '../apis/ticket';
import { Ticket } from '@acme/shared-models';
import { UserOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { getUsers } from '../reducers/userSlice';
import { getStatusSelectOptions, isNumeric } from '../utils/utils';
import { useDispatch } from 'react-redux';
import {
  addAssigneeToTicket,
  getCurrentDetailedTicket,
  setCurrentDetailedTicket,
  setStatusOfTicket,
  unassignUserFromTicket,
} from '../reducers/ticketSlice';
import React from 'react';

/**
 * Component to display and manage ticket details, including assignee and status changes.
 *
 * @component
 * @returns JSX.Element
 */
export const TicketDetails = React.memo(() => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [_, contextHolder] = message.useMessage();
  const users = useAppSelector(getUsers);
  const currentDetailTicket = useAppSelector(getCurrentDetailedTicket);
  const assigneeOptions = useMemo(() => {
    return users
      ? users.map((user) => ({
          label: user.name,
          value: user.id,
        }))
      : [];
  }, [users]);
  const statusOptions = useMemo(() => getStatusSelectOptions(), []);

  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch ticket details when component mounts or dependencies change
  useEffect(() => {
    const callGetTicketAPI = async (ticketId: number) => {
      try {
        const result = await getTicketApi(ticketId);
        setIsLoading(false);

        if (!result.success) {
          message.error(result.message);
          return;
        }
        const ticket = result.data as Ticket;
        const user = users?.find((user) => user.id === ticket.assigneeId);
        dispatch(
          setCurrentDetailedTicket({
            ticket,
            assignee: user || null,
          })
        );
      } catch (e) {
        setIsLoading(false);
      }
    };

    if (id && isNumeric(id) && users?.length) {
      setIsLoading(true);
      callGetTicketAPI(parseInt(id));
    } else {
      dispatch(setCurrentDetailedTicket(undefined));
    }
  }, [id, users, dispatch]);

  /**
   * Handles assigning a user to the ticket.
   *
   * @param {number} assigneeId - The ID of the assignee to be assigned to the ticket.
   */
  const handleAssigneeSelectChange = useCallback(
    async (assigneeId: number) => {
      if (!id) return;

      const result = await assignUserToTicketApi(parseInt(id), assigneeId);
      if (result.success) {
        message.success('Assign success');
        const user = users?.find((item) => item.id === assigneeId);
        if (!user) return;

        dispatch(addAssigneeToTicket({ ticketId: parseInt(id), user }));
      } else {
        message.error('Assign Fail');
      }
    },
    [id, users, dispatch]
  );


  /**
   * Handles unassigning the user from the ticket.
   */
  const handleUnAssigneeClick = useCallback(async () => {
    if (!id) return;

    const result = await unassignUserFromTicketApi(parseInt(id));
    if (result.success) {
      message.success('Unassign success');
      dispatch(unassignUserFromTicket(parseInt(id)));
    } else {
      message.error('Unassign Fail');
    }
  }, [id, dispatch]);

  /**
   * Sets the ticket status to complete.
   */
  const handleCompleteTicket = useCallback(async () => {
    if (!id) return;

    const result = await markTicketAsCompleteApi(parseInt(id));
    if (result.success) {
      message.success('Set Complete Success');
      dispatch(setStatusOfTicket({ ticketId: parseInt(id), status: true }));
    } else {
      message.error('Set Complete Fail');
    }
  }, [id, dispatch]);

  /**
   * Sets the ticket status to incomplete.
   */
  const handleInCompleteTicket = useCallback(async () => {
    if (!id) return;

    const result = await markTicketAsIncompleteApi(parseInt(id));
    if (result.success) {
      message.success('Set Incomplete Success');
      dispatch(setStatusOfTicket({ ticketId: parseInt(id), status: false }));
    } else {
      message.error('Set Incomplete Fail');
    }
  }, [id, dispatch]);

  /**
   * Handles the status change by toggling between complete and incomplete.
   *
   * @param {boolean} value - The new status of the ticket (true for complete, false for incomplete).
   */
  const handleStatusSelectChange = useCallback(
    (value: boolean) => {
      value ? handleCompleteTicket() : handleInCompleteTicket();
    },
    [handleCompleteTicket, handleInCompleteTicket]
  );

  return (
    <div className={styles['container']}>
      {contextHolder}
      <Row className={styles['backBtnRow']}>
        <Button type="link" onClick={() => navigate(`/`)}>
          {`<- Back to the Tickets Table`}
        </Button>
      </Row>

      {isLoading ? (
        <Skeleton avatar paragraph={{ rows: 4 }} />
      ) : currentDetailTicket ? (
        <Card>
          <Row>
            <Col
              className={`${styles['leftCol']} ${styles['detailCol']}`}
              xs={10}
            >
              <Typography.Text>Task Id</Typography.Text>
            </Col>
            <Col xs={14} className={styles['detailCol']}>
              <Typography.Text>
                #{currentDetailTicket.ticket.id}
              </Typography.Text>
            </Col>
          </Row>
          <Divider
            style={{ margin: '2px 0px', backgroundColor: 'whitesmoke' }}
          />

          <Row>
            <Col
              className={`${styles['leftCol']} ${styles['detailCol']}`}
              xs={10}
            >
              <Typography.Text>Description</Typography.Text>
            </Col>
            <Col xs={14} className={styles['detailCol']}>
              <Typography.Text>
                {currentDetailTicket.ticket.description}
              </Typography.Text>
            </Col>
          </Row>
          <Divider
            style={{ margin: '2px 0px', backgroundColor: 'whitesmoke' }}
          />

          <Row>
            <Col
              className={`${styles['leftCol']} ${styles['detailCol']}`}
              xs={10}
            >
              <Typography.Text>Assignee</Typography.Text>
            </Col>
            <Col xs={14} className={styles['detailCol']}>
              {currentDetailTicket.assignee ? (
                <Space>
                  <Space>
                    <Avatar size="small" icon={<UserOutlined />} />
                    <Typography.Text>
                      {currentDetailTicket.assignee?.name}
                    </Typography.Text>
                  </Space>
                  <Button
                    type="text"
                    onClick={handleUnAssigneeClick}
                    aria-label="unAssignedBtn"
                  >
                    <Space size={2}>
                      <MinusCircleOutlined
                        style={{ fontSize: '16px', color: 'red' }}
                      />
                      <Typography.Text className={styles['unassignedTextBtn']}>
                        Unassigned
                      </Typography.Text>
                    </Space>
                  </Button>
                </Space>
              ) : (
                <Select<number>
                  style={{ width: '100%' }}
                  placeholder="Select one assignee"
                  onChange={handleAssigneeSelectChange}
                  value={currentDetailTicket.ticket.assigneeId}
                  aria-label="selectAssignee"
                >
                  {assigneeOptions.map((option) => (
                    <Select.Option
                      key={`assigneeOption_${option.value}`}
                      value={option.value}
                      aria-label={`selectAssigneeOption${option.value}`}
                    >
                      <Space>
                        <Avatar size="small" icon={<UserOutlined />} />
                        <Typography.Text>{option.label}</Typography.Text>
                      </Space>
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Col>
          </Row>

          <Divider
            style={{ margin: '2px 0px', backgroundColor: 'whitesmoke' }}
          />

          <Row>
            <Col
              className={`${styles['leftCol']} ${styles['detailCol']}`}
              xs={10}
            >
              <Typography.Text>Status</Typography.Text>
            </Col>
            <Col xs={14} className={styles['detailCol']}>
              <Select
                style={{ width: '100%' }}
                placeholder="Select one status"
                onChange={handleStatusSelectChange}
                value={currentDetailTicket.ticket.completed}
                data-testid="selectStatusTicket"
              >
                {statusOptions.map((option) => (
                  <Select.Option
                    key={`status_${option.value}`}
                    value={option.value}
                    data-testid={`selectStatusTicketOption${option.label}`}
                  >
                    <Tag color={option.color}>
                      <Typography.Text>{option.label}</Typography.Text>
                    </Tag>
                  </Select.Option>
                ))}
              </Select>
            </Col>
          </Row>
        </Card>
      ) : (
        <div>Not Found ticket</div>
      )}
    </div>
  );
});

export default TicketDetails;
