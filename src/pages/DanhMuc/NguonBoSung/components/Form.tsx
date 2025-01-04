import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormKhoSach = (props: any) => {
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } =
		useModel('danhmuc.nguonbosung');
	const intl = useIntl();
	const [form] = Form.useForm();
	const { title } = props;

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: NguonBoSung.IRecord) => {
		if (edit) {
			putModel(record?._id ?? '', values)
				.then()
				.catch((er) => console.log(er));
		} else {
			postModel(values)
				.then()
				.catch((er) => console.log(er));
		}
	};

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title?.toLowerCase()}`}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					<Col span={24}>
						<Form.Item
							label='Mã nguồn bổ sung'
							name='ma'
							rules={[...rules.required, ...rules.text, ...rules.length(20)]}
						>
							<Input placeholder='Nhập mã nguồn bổ sung' disabled={edit} />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item
							label='Tên nguồn bổ sung'
							name='ten'
							rules={[...rules.required, ...rules.text, ...rules.length(250)]}
						>
							<Input placeholder='Nhập tên nguồn bổ sung' />
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

export default FormKhoSach;
