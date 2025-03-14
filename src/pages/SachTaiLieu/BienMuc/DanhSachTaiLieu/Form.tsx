import UploadFile from '@/components/Upload/UploadFile';
import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import { buildUpLoadFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Col, Form, Input, Row } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormTaiLieuSo = (props: { onOk: (val: AnPham.TDanhSachTaiLieuTrucTuyen) => void }) => {
	const [form] = Form.useForm();
	const { onOk } = props;
	const { setVisibleForm, visibleForm, record, edit, isView, setFormSubmiting } = useModel(
		'sachtailieu.anpham.danhsachtailieu',
	);

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?.index)
			form.setFieldsValue({
				...record,
			});
	}, [visibleForm, record?.index]);

	const onFinish = async (values: AnPham.TDanhSachTaiLieuTrucTuyen) => {
		setFormSubmiting(true);
		const url = await buildUpLoadFile(values, 'url');
		values.url = url;
		setFormSubmiting(false);

		onOk({ ...values });
	};

	return (
		<Form onFinish={onFinish} form={form} layout='vertical'>
			<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
				<Col span={24}>
					<Form.Item name='ten' label='Tên tài liệu' rules={[...rules.required]}>
						<Input disabled={isView} placeholder='Nhập tên tài liệu' />
					</Form.Item>
				</Col>
				<Col span={24}>
					<Form.Item name='url' label='File đính kèm' rules={[...rules.required]}>
						<UploadFile />
					</Form.Item>
				</Col>
				<Col span={24}>
					<Form.Item name='moTa' label='Mô tả' rules={[...rules.text, ...rules.length(250)]}>
						<Input.TextArea rows={2} placeholder='Nhập mô tả' />
					</Form.Item>
				</Col>
			</Row>

			<div className='form-footer'>
				{!isView ? (
					<Button htmlType='submit' type='primary'>
						{!edit ? 'Thêm mới ' : 'Lưu lại'}
					</Button>
				) : null}

				<Button onClick={() => setVisibleForm(false)}>Hủy</Button>
			</div>
		</Form>
	);
};

export default FormTaiLieuSo;
