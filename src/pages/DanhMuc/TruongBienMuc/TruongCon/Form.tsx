import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Col, Form, Input, Row } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormTruongCon = (props: { onOk: (val: TruongBienMuc.TDanhSachTruongCon) => void }) => {
	const [form] = Form.useForm();
	const { onOk } = props;
	const { setVisibleForm, visibleForm, record, edit, formSubmiting } = useModel('danhmuc.truongcon');

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (edit && record?.index) form.setFieldsValue(record);
	}, [visibleForm, record?.index]);

	const onFinish = async (values: TruongBienMuc.TDanhSachTruongCon) => {
		onOk(values);
	};

	return (
		<Form onFinish={onFinish} form={form} layout='vertical'>
			<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
				<Col span={24}>
					<Form.Item name='tagCode' label='Tag code' rules={[...rules.required, ...rules.text]}>
						<Input disabled={edit} placeholder='Nhập tag code' />
					</Form.Item>
				</Col>
				<Col span={24}>
					<Form.Item name='code' label='Code' rules={[...rules.required, ...rules.text]}>
						<Input placeholder='Nhập code' />
					</Form.Item>
				</Col>
				<Col span={24}>
					<Form.Item name='tieuDe' label='Tiêu đề' rules={[...rules.required, ...rules.text]}>
						<Input placeholder='Nhập tiêu đề' />
					</Form.Item>
				</Col>
			</Row>

			<div className='form-footer'>
				<Button htmlType='submit' type='primary' loading={formSubmiting}>
					{!edit ? 'Thêm mới ' : 'Lưu lại'}
				</Button>

				<Button onClick={() => setVisibleForm(false)}>Hủy</Button>
			</div>
		</Form>
	);
};

export default FormTruongCon;
