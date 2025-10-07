import { EPhuongGiaSach } from '@/services/DanhMuc/constant';
import type { GiaSach } from '@/services/DanhMuc/GiaSach/typing';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, InputNumber, Row, Select } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import SelectKhoSach from '../../KhoSach/components/Select';

const FormGiaSach = (props: any) => {
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } = useModel('danhmuc.giasach');
	const intl = useIntl();
	const [form] = Form.useForm();
	const { title } = props;

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: GiaSach.IRecord) => {
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
					<Col span={24} md={12}>
						<Form.Item label='Kho sách' name='maKhoSach' rules={[...rules.required]}>
							<SelectKhoSach selectMa />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item label='Tên giá sách' name='ten' rules={[...rules.required, ...rules.text, ...rules.length(250)]}>
							<Input placeholder='Nhập tên giá sách' />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item label='Chiều dài' name='chieuDai' rules={[...rules.required]}>
							<InputNumber style={{ width: '100%' }} placeholder='Nhập chiều dài' />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item label='Chiều rộng' name='chieuRong' rules={[...rules.required]}>
							<InputNumber style={{ width: '100%' }} placeholder='Nhập chiều rộng' />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item label='Phương' name='phuong' rules={[...rules.required]}>
							<Select
								placeholder='Chọn phương'
								options={Object.values(EPhuongGiaSach).map((item) => ({ label: item, value: item }))}
							/>
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item label='Tung độ' name='tungDo' rules={[...rules.required]}>
							<InputNumber style={{ width: '100%' }} placeholder='Nhập tung độ' />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item label='Hoạch độ' name='hoachDo' rules={[...rules.required]}>
							<InputNumber style={{ width: '100%' }} placeholder='Nhập hoạch độ' />
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

export default FormGiaSach;
