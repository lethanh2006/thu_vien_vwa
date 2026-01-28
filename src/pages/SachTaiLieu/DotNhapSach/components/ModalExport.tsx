import MyDateRangePicker from '@/components/MyDatePicker/RangePicker';
import { thongKeDangKyTongQuat } from '@/services/SachTaiLieu/AnPham';
import rules from '@/utils/rules';
import { Button, Form, message, Modal } from 'antd';
import fileDownload from 'js-file-download';
import React from 'react';
import { useIntl, useModel } from 'umi';

type TProps = {
	visible: boolean;
	setVisible: (visible: boolean) => void;
};

const ModalExportDangKyTongQuat: React.FC<TProps> = ({ visible, setVisible }) => {
	const intl = useIntl();
	const { record } = useModel('daotao.hocky');
	const [loading, setLoading] = React.useState(false);
	const [form] = Form.useForm();

	const handleCancel = () => {
		setVisible(false);
	};

	const handleExport = async (values: any) => {
		if (!values.thoiGian) {
			message.error(intl.formatMessage({ id: 'sachtailieu.dotnhapsach.vuiLongNhapThoiGian' }));
			return;
		}
		setLoading(true);

		thongKeDangKyTongQuat(record?.ma, {
			thoiGianBatDau: values.thoiGian[0],
			thoiGianKetThuc: values.thoiGian[1],
		})
			.then((res) => {
				fileDownload(res.data, 'Thống kê đăng ký tổng quát.xlsx');
			})
			.catch((error) => console.error('Export failed:', error))
			.finally(() => {
				setLoading(false);
			});
	};

	return (
		<Modal
			open={visible}
			onCancel={handleCancel}
			footer={null}
			title={intl.formatMessage({ id: 'sachtailieu.thongKeDangKyMuon' })}
		>
			<Form form={form} layout='vertical' onFinish={handleExport}>
				<Form.Item
					name='thoiGian'
					label={intl.formatMessage({ id: 'sachtailieu.dotnhapsach.thoiGianCanThongKe' })}
					rules={[...rules.required]}
				>
					<MyDateRangePicker format='DD/MM/YYYY' />
				</Form.Item>

				<div className='form-footer'>
					<Button type='primary' htmlType='submit' loading={loading}>
						{intl.formatMessage({ id: 'sachtailieu.button.thongke' })}
					</Button>
					<Button onClick={handleCancel}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default ModalExportDangKyTongQuat;
