import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormTruongBienMuc = (props: { afterAddNew?: (rec: TruongBienMuc.IRecord) => void; getData: () => void }) => {
	const { afterAddNew, getData } = props;
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm, isView, setRecord, setEdit } =
		useModel('danhmuc.truongbienmuc');

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: TruongBienMuc.IRecord) => {
		if (edit) {
			putModel(record?._id ?? '', values, getData)
				.then()
				.catch((er) => console.log(er));
		} else
			postModel(values, getData, false)
				.then((rec) => {
					setRecord(rec);
					setEdit(true);
					if (afterAddNew) afterAddNew(rec);
				})
				.catch((er) => console.log(er));
	};
	return (
		<Form onFinish={onFinish} form={form} layout='vertical'>
			<Row gutter={[12, 0]}>
				<Col xs={24}>
					<Form.Item
						name='ma'
						label={intl.formatMessage({ id: 'danhmuc.truongbienmuc.form.label.matrongbienmuc' })}
						rules={[...rules.required, ...rules.text]}
					>
						<Input
							placeholder={intl.formatMessage({ id: 'danhmuc.truongbienmuc.form.placeholder.nhapma' })}
							disabled={edit || isView}
						/>
					</Form.Item>
				</Col>
				<Col xs={24}>
					<Form.Item
						name='noiDung'
						label={intl.formatMessage({ id: 'danhmuc.truongbienmuc.form.label.noidungtruongbienmuc' })}
						rules={[...rules.required, ...rules.text]}
					>
						<Input placeholder={intl.formatMessage({ id: 'danhmuc.truongbienmuc.form.placeholder.nhapnoidung' })} />
					</Form.Item>
				</Col>
				<Col span={24}>
					<div className='ant-col ant-form-item-label'>
						<label className='ant-form-item'>
							{intl.formatMessage({ id: 'danhmuc.truongbienmuc.form.label.chimuc1' })}
						</label>
					</div>
					<div className='ant-col ant-form-item-control'>
						<Form.List name='thongTinChiMuc1'>
							{(fields, { add, remove }, { errors }) => (
								<>
									{fields.map((field, index) => (
										<Row gutter={[12, 12]} key={field.key}>
											<Col span={7}>
												<Form.Item
													label={intl.formatMessage({ id: 'danhmuc.truongbienmuc.form.placeholder.nhaptenhienthi' })}
													name={[index, 'value']}
													rules={[...rules.required]}
												>
													<Input
														disabled={isView}
														placeholder={intl.formatMessage({
															id: 'danhmuc.truongbienmuc.form.placeholder.nhaptenhienthi',
														})}
													/>
												</Form.Item>
											</Col>
											<Col span={14}>
												<Form.Item
													label={intl.formatMessage({ id: 'danhmuc.truongbienmuc.form.placeholder.nhaptenchutinh' })}
													name={[index, 'chuThich']}
													rules={[...rules.required]}
												>
													<Input
														disabled={isView}
														placeholder={intl.formatMessage({
															id: 'danhmuc.truongbienmuc.form.placeholder.nhaptenchutinh',
														})}
													/>
												</Form.Item>
											</Col>

											<Col span={3}>
												<Button
													disabled={isView}
													danger
													type='link'
													title={intl.formatMessage({ id: 'danhmuc.truongbienmuc.form.button.xoathuoctinh' })}
													icon={<DeleteOutlined />}
													onClick={() => remove(field.name)}
													style={{ marginTop: 30 }}
												/>
											</Col>
											<Form.ErrorList errors={errors} />
										</Row>
									))}
									<Form.ErrorList errors={errors} />
									<Button disabled={isView} onClick={() => add()} icon={<PlusOutlined />} size='small' type='default'>
										{intl.formatMessage({ id: 'danhmuc.truongbienmuc.form.button.themthuoctinh' })}
									</Button>
								</>
							)}
						</Form.List>
					</div>
				</Col>
				<Col span={24}>
					<div className='ant-col ant-form-item-label'>
						<label className='ant-form-item'>
							{intl.formatMessage({ id: 'danhmuc.truongbienmuc.form.label.chimuc2' })}
						</label>
					</div>
					<div className='ant-col ant-form-item-control'>
						<Form.List name='thongTinChiMuc2'>
							{(fields, { add, remove }, { errors }) => (
								<>
									{fields.map((field, index) => (
										<Row gutter={[12, 12]} key={field.key}>
											<Col span={7}>
												<Form.Item label={`Phần tử ${index + 1}`} name={[index, 'value']} rules={[...rules.required]}>
													<Input
														placeholder={intl.formatMessage({
															id: 'danhmuc.truongbienmuc.form.placeholder.nhapphantu',
														})}
													/>
												</Form.Item>
											</Col>
											<Col span={14}>
												<Form.Item
													label={intl.formatMessage({ id: 'danhmuc.truongbienmuc.form.placeholder.nhapnoidung' })}
													name={[index, 'chuThich']}
													rules={[...rules.required]}
												>
													<Input
														placeholder={intl.formatMessage({
															id: 'danhmuc.truongbienmuc.form.placeholder.nhapnoidung',
														})}
													/>
												</Form.Item>
											</Col>

											<Col span={3}>
												<Button
													danger
													type='link'
													title={intl.formatMessage({ id: 'danhmuc.truongbienmuc.form.button.xoathuoctinh' })}
													icon={<DeleteOutlined />}
													onClick={() => remove(field.name)}
													style={{ marginTop: 30 }}
												/>
											</Col>
											<Form.ErrorList errors={errors} />
										</Row>
									))}
									<Form.ErrorList errors={errors} />
									<Button disabled={isView} onClick={() => add()} icon={<PlusOutlined />} size='small' type='default'>
										{intl.formatMessage({ id: 'danhmuc.truongbienmuc.form.button.themthuoctinh' })}
									</Button>
								</>
							)}
						</Form.List>
					</div>
				</Col>
				<Col xs={24}>
					<Form.Item
						name='ghiChu'
						label={intl.formatMessage({ id: 'danhmuc.truongbienmuc.form.label.ghichu' })}
						rules={[...rules.text]}
					>
						<Input.TextArea
							rows={3}
							placeholder={intl.formatMessage({ id: 'danhmuc.truongbienmuc.form.placeholder.nhapghichu' })}
						/>
					</Form.Item>
				</Col>
			</Row>

			<div className='form-footer'>
				<Button loading={formSubmiting} htmlType='submit' type='primary'>
					{!edit
						? `${intl.formatMessage({ id: 'global.button.themmoi' })}`
						: `${intl.formatMessage({ id: 'global.button.luulai' })}`}
				</Button>
				<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
			</div>
		</Form>
	);
};

export default FormTruongBienMuc;
