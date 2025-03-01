import type { MauDinhDang } from '@/services/DanhMuc/MauDinhDang/typing';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormMauDinhDang = (props: any) => {
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } =
		useModel('danhmuc.maudinhdang');
	const intl = useIntl();
	const [form] = Form.useForm();
	const { title, getData, tabActive } = props;

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: MauDinhDang.IRecord) => {
		values.loai = tabActive;
		if (edit) {
			putModel(record?._id ?? '', values, getData)
				.then()
				.catch((er) => console.log(er));
		} else {
			postModel(values, getData)
				.then()
				.catch((er) => console.log(er));
		}
	};

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title?.toLowerCase()}`}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					<Col span={24}>
						<Form.Item label='Mẫu in'>
							<Input value={tabActive} disabled />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item label='Mã định dạng' name='ma' rules={[...rules.required, ...rules.text, ...rules.length(20)]}>
							<Input placeholder='Nhập mã kho' disabled={edit} />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item label='Tên mẫu' name='ten' rules={[...rules.required, ...rules.text, ...rules.length(250)]}>
							<Input placeholder='Nhập tên kho' />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item label='Nội dung' name='noiDungMau' rules={[...rules.required]}>
							<Input.TextArea rows={3} placeholder='Nhập nội dung' />
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer' style={{ marginTop: 24 }}>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{!edit
							? `${intl.formatMessage({ id: 'global.button.themmoi' })}`
							: `${intl.formatMessage({ id: 'global.button.luulai' })}`}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormMauDinhDang;
