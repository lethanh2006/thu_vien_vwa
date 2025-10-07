import MyDatePicker from '@/components/MyDatePicker';
import type { MuonSach } from '@/services/SachTaiLieu/MuonSach/typing';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Col, Form, Input, Modal, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormMuonTra = () => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { danhSach, setDanhSach, visibleForm, setVisibleForm, record } = useModel('sachtailieu.anpham.anphamxepgia');

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
		} else if (record?.soDangKyCaBiet) {
			form.setFieldsValue(record);
		}
	}, [record?.soDangKyCaBiet, visibleForm]);

	const onFinish = async (values: MuonSach.IRecord) => {
		const newData = danhSach.map((item) =>
			item.soDangKyCaBiet === record?.soDangKyCaBiet ? { ...item, ...values } : item,
		);

		setDanhSach(newData as any);
		setVisibleForm(false);
	};

	return (
		<Modal
			title='Thông tin ấn phẩm tìm kiếm'
			open={visibleForm}
			onCancel={() => setVisibleForm(false)}
			width={600}
			footer={null}
		>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					<Col xs={24}>
						<Form.Item name='thoiGianMuon' label='Thời gian mượn' rules={[...rules.required]}>
							<MyDatePicker />
						</Form.Item>
					</Col>
					<Col xs={24}>
						<Form.Item name='expired' label='Hạn trả' rules={[...rules.required]}>
							<MyDatePicker />
						</Form.Item>
					</Col>
					<Col xs={24}>
						<Form.Item name='ghiChu' label='Ghi chú'>
							<Input.TextArea rows={3} placeholder='Nhập ghi chú' />
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button htmlType='submit' type='primary'>
						{intl.formatMessage({ id: 'global.button.luulai' })}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default FormMuonTra;
