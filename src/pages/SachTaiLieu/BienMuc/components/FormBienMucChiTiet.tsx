import ButtonExtend from '@/components/Table/ButtonExtend';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Row, Select } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormBienMucChiTiet = () => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, setVisibleForm, putBienMucChiTietModel, formSubmiting, visibleForm } =
		useModel('sachtailieu.anpham.anpham');

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: any) => {
		const thongTinTaiLieu = record?.thongTinTaiLieu?.map((item, index) => ({
			...item,
			value: values?.thongTinTaiLieu?.[index]?.value || null,
		}));

		putBienMucChiTietModel(record?._id ?? '', {
			thongTinTaiLieu: thongTinTaiLieu,
		})
			.then(() => setVisibleForm(false))
			.catch((er) => console.log(er));
	};

	return (
		<Form onFinish={onFinish} form={form} layout='vertical'>
			<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
				<Col span={24}>
					<div className='ant-col ant-form-item-control'>
						<Form.List
							name='thongTinTaiLieu'
							rules={[
								{
									validator: async (item, names) => {
										if (!names || names.length < 1) {
											return Promise.reject(new Error('Nhập ít nhất 1 chỉ mục'));
										}
										return '';
									},
								},
							]}
						>
							{(fields, { add, remove }, { errors }) => (
								<>
									{fields.map((field, index) => (
										<Row gutter={[12, 12]} key={field.key}>
											<Col span={7}>
												<Form.Item label='Trường biên mục' name={[index, 'value']} rules={[...rules.required]}>
													<Select
														placeholder='Chọn trường biên mục'
														// options={}
													/>
												</Form.Item>
											</Col>
											<Col span={14}>
												<Form.Item label='Nội dung' name={[index, 'chuThich']} rules={[...rules.required]}>
													<Input placeholder='Nhập tên thuộc tính' />
												</Form.Item>
											</Col>

											<Col span={3}>
												<Button
													danger
													type='link'
													title='Xóa thuộc tính'
													icon={<DeleteOutlined />}
													onClick={() => remove(field.name)}
													style={{ marginTop: 30 }}
												/>
											</Col>
											<Form.ErrorList errors={errors} />
										</Row>
									))}
									<Form.ErrorList errors={errors} />
									<Row>
										<Col span={22} push={1}>
											<ButtonExtend notHideText type='dashed' onClick={() => add()} icon={<PlusOutlined />} block>
												Thêm phần tử
											</ButtonExtend>
										</Col>
									</Row>
								</>
							)}
						</Form.List>
					</div>
				</Col>
			</Row>

			<div className='form-footer'>
				<Button loading={formSubmiting} htmlType='submit' type='primary'>
					{intl.formatMessage({ id: 'global.button.luulai' })}
				</Button>
				<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
			</div>
		</Form>
	);
};

export default FormBienMucChiTiet;
