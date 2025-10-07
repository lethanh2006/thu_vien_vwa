import MyDatePicker from '@/components/MyDatePicker';
import dayjs from '@/utils/dayjs';
import { resetFieldsForm } from '@/utils/utils';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Button, Col, Form, Modal, Row } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const ConfirmGiaHan = (props: { visible: boolean; setVisible: (val: boolean) => void; getData?: () => void }) => {
	const { visible, setVisible, getData } = props;
	const [form] = Form.useForm();

	const { record, giaHanThueMuonAnPhamModel, formSubmiting } = useModel('sachtailieu.muontra.muontra');

	useEffect(() => {
		if (!visible) {
			resetFieldsForm(form);
		}
	}, [visible]);

	const onFinish = async (values: any) => {
		giaHanThueMuonAnPhamModel(record?._id ?? '', values, getData)
			.then(() => {
				setVisible(false);
			})
			.catch((err) => console.log(err));
	};

	return (
		<Modal
			open={visible}
			onCancel={() => setVisible(false)}
			title='Xác nhận gia hạn mượn sách'
			footer={null}
			width={600}
		>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					<Col xs={24}>
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								gap: 8,
								alignItems: 'center',
								marginBottom: 24,
							}}
						>
							<div style={{ color: 'orange', fontSize: 48 }}>
								<ExclamationCircleFilled />
							</div>
							<div>Bạn có chắc chắn xác nhận gia hạn mượn sách?</div>
						</div>
					</Col>

					<Col xs={24} md={24}>
						<Form.Item name='thoiGianGiaHan' label='Thời gian gia hạn'>
							<MyDatePicker disabledDate={(cur) => dayjs(cur).isBefore(record?.expired)} />
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						Xác nhận
					</Button>
					<Button onClick={() => setVisible(false)}>Hủy</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default ConfirmGiaHan;
