import TinyEditor from '@/components/TinyEditor';
import UploadFile from '@/components/Upload/UploadFile';
import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import { buildUpLoadFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Col, Form, Modal, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const ModalSachHay = (props: { visible: boolean; setVisible: (val: boolean) => void; getData: () => void }) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, putBienMucSoLuocModel, setFormSubmiting, formSubmiting } = useModel('sachtailieu.anpham.anpham');
	const { visible, setVisible, getData } = props;

	useEffect(() => {
		if (!visible) {
			resetFieldsForm(form);
		} else if (record?._id) {
			form.setFieldsValue(record);
		}
	}, [record?._id, visible]);

	const onFinish = async (values: AnPham.IRecord) => {
		setFormSubmiting(true);
		const urlScanBia = await buildUpLoadFile(values, 'urlScanBia').finally(() => setFormSubmiting(false));
		values.urlScanBia = urlScanBia ?? '';

		putBienMucSoLuocModel(
			record?._id ?? '',
			{ moTa: values.moTa ?? '', urlScanBia: values.urlScanBia, isSachHay: true },
			getData,
		)
			.then((rec) => setVisible(false))
			.catch((er) => console.log(er));
	};

	return (
		<Modal
			title='Chỉnh sửa nội dung sách hay'
			open={visible}
			onCancel={() => setVisible(false)}
			footer={null}
			width={800}
		>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[16, 16]}>
					<Col xs={24} md={6}>
						<Form.Item name='urlScanBia' label=''>
							<UploadFile isLandscapeAvatar buttonDescription='Thêm ảnh bìa' />
						</Form.Item>
					</Col>
					<Col xs={24} md={18}>
						<Form.Item name='moTa' label='Nội dung sách hay' rules={[...rules.text]}>
							<TinyEditor height={300} hideMenubar miniToolbar stickyToolbar={false} />
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer' style={{ textAlign: 'right' }}>
					<Button loading={formSubmiting} htmlType='submit' type='primary' style={{ marginRight: 8 }}>
						{intl.formatMessage({ id: 'global.button.luulai' })}
					</Button>
					<Button onClick={() => setVisible(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default ModalSachHay;
