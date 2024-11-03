import styles from './CreateTicketModal.module.css';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../../stores/hooks';
import {
  addDetailedTicket,
  getOpenCreateTicketModal,
  setOpenCreateTicketModal,
} from '../../../reducers/ticketSlice';
import {
  CreateTicketFieldType,
} from '../../../types/common.types';
import { Form, Input, message, Modal, Row } from 'antd';
import { createTicketApi } from '../../../apis/ticket';
import { Ticket } from '@acme/shared-models';
import { AppDispatch } from '../../../stores/stores';
import React, { useCallback } from 'react';


/**
 * A modal component for creating a new ticket.
 *
 * @component
 * @function CreateTicketModal
 * @returns {JSX.Element} The rendered modal component for creating a ticket.
 */
export const CreateTicketModal = React.memo(() => {
  const isModalOpen = useAppSelector(getOpenCreateTicketModal); // Selects modal visibility status from the Redux store.
  const dispatch = useDispatch<AppDispatch>(); // Dispatch instance for handling async thunks.

  const [form] = Form.useForm();
  const [_, contextHolder] = message.useMessage();

  /**
   * Handles form submission to create a new ticket.
   * Validates form data, sends an API request, and updates the store if successful.
   *
   * @async
   * @function handleOk
   */
  const handleOk = useCallback(async () => {
    try {
      const data = await form.validateFields();
      const result = await createTicketApi(data);
      if (!result.success) {
        message.error(result.message);
        return;
      }
      dispatch(addDetailedTicket(result.data as Ticket));
      message.success('Create ticket success');
      form.resetFields();
      dispatch(setOpenCreateTicketModal(false));
    } catch (error) {
      console.log('Validation or API error:', error);
    }
  }, [dispatch, form]);

  /**
   * Closes the modal and resets the form fields.
   *
   * @function handleCancel
   */
  const handleCancel = useCallback(() => {
    form.resetFields();
    dispatch(setOpenCreateTicketModal(false));
  }, [dispatch, form]);

  return (
    <Modal
      title="Create Ticket"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      {contextHolder}
      <Form
        form={form}
        name="createNewTicket"
        initialValues={{ remember: true }}
        layout="vertical"
        autoComplete="off"
      >
        <Row>
          <Form.Item<CreateTicketFieldType>
            className={styles['createTicketItem']}
            label="Description"
            name="description"
            rules={[
              {
                required: true,
                message: 'This field is required',
              },
            ]}
          >
            <Input
              size="large"
              placeholder="Eg: Install a monitor arm"
              className={styles['createTicketInputText']}
            />
          </Form.Item>
        </Row>
      </Form>
    </Modal>
  );
})

export default CreateTicketModal;
