import MyDateRangePicker from '@/components/MyDatePicker/RangePicker';
import { thongKeDangKyTongQuat } from '@/services/SachTaiLieu/AnPham';
import rules from '@/utils/rules';
import { Button, Form, message, Modal } from 'antd';
import fileDownload from 'js-file-download';
import moment from 'moment';
import React, { useEffect } from 'react';

type TProps = {
	visible: boolean;
	setVisible: (visible: boolean) => void;
};

const ModalExportDangKyTongQuat: React.FC<TProps> = ({ visible, setVisible }) => {
	const [loading, setLoading] = React.useState(false);
	const [form] = Form.useForm();

	useEffect(() => {
		form.setFieldsValue({ thoiGian: [moment().startOf('month'), moment().endOf('month')] });
	}, []);

	const handleCancel = () => {
		setVisible(false);
	};

	const handleExport = async (values: any) => {
		if (!values.thoiGian) {
			message.error('Vui lòng chọn thời gian thống kê');
			return;
		}
		setLoading(true);

		thongKeDangKyTongQuat({ thoiGianBatDau: values.thoiGian[0], thoiGianKetThuc: values.thoiGian[1] })
			.then((res) => {
				fileDownload(res.data, 'Thống kê đăng ký tổng quát.xlsx');
			})
			.catch((error) => console.error('Export failed:', error))
			.finally(() => {
				setLoading(false);
			});
	};

	return (
		<Modal visible={visible} onCancel={handleCancel} footer={null} title='Thống kê đăng ký tổng quát Đợt nhập sách'>
			<Form form={form} layout='vertical' onFinish={handleExport}>
				<Form.Item name='thoiGian' label='Thời gian cần thống kê' rules={[...rules.required]}>
					<MyDateRangePicker format='DD/MM/YYYY' />
				</Form.Item>

				<div className='form-footer'>
					<Button type='primary' htmlType='submit' loading={loading}>
						Thống kê
					</Button>
					<Button onClick={handleCancel}>Hủy</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default ModalExportDangKyTongQuat;
