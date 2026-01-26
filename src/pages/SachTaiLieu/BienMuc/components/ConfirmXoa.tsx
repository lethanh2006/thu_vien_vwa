import { resetFieldsForm } from '@/utils/utils';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Button, Checkbox, Form, Modal } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const ConfirmXoaAnPham = (props: { visible: boolean; setVisible: (val: boolean) => void; getData: () => void }) => {
	const [form] = Form.useForm();
	const { visible, setVisible, getData } = props;
	const intl = useIntl();

	const { record, formSubmiting, deleteModel, deleteAnPhamSoModel } = useModel('sachtailieu.anpham.anpham');

	useEffect(() => {
		if (!visible) {
			resetFieldsForm(form);
		}
	}, [visible]);

	const onFinish = async (values: any) => {
		try {
			if (values.anPhamSo) {
				await deleteAnPhamSoModel(record?._id ?? '');
			}

			await deleteModel(record?._id ?? '', () => {});

			getData();

			setVisible(false);
		} catch (error) {
			console.error('Lỗi khi xóa:', error);
		}
	};

	return (
		<Modal
			open={visible}
			onCancel={() => setVisible(false)}
			width={600}
			footer={null}
			title={intl.formatMessage({ id: 'sachtailieu.anpham.xacNhan' })}
			maskClosable={false}
		>
			<Form onFinish={onFinish} form={form} layout='vertical'>
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
					<div style={{ fontSize: 18, fontWeight: 600 }}>
						{intl.formatMessage({ id: 'sachtailieu.confirm.xoaAnPhamSo2' })}
					</div>
				</div>

				<Form.Item name='anPhamSo' valuePropName='checked' initialValue={false}>
					<Checkbox>{intl.formatMessage({ id: 'sachtailieu.confirm.xoaDongThoiTaiLieu' })}</Checkbox>
				</Form.Item>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{intl.formatMessage({ id: 'global.button.xacnhan' })}
					</Button>
					<Button onClick={() => setVisible(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default ConfirmXoaAnPham;
