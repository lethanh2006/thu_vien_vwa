import { ETrangThaiBienMuc } from '@/services/SachTaiLieu/constant';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, Popconfirm, Row, Spin, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';

const FormBienMucChiTiet = (props: any) => {
	const { getData } = props;
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, setVisibleForm, putBienMucChiTietModel, formSubmiting, visibleForm } =
		useModel('sachtailieu.anpham.anpham');

	const { danhSach, loading } = useModel('sachtailieu.anpham.thongtinanpham');
	const [actionType, setActionType] = useState<ETrangThaiBienMuc>(ETrangThaiBienMuc.CHO_BIEN_MUC);

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
		} else if (record?._id) {
			const mappedValues = record?.mauBienMuc?.thongTinKhaiBao.map((item, index) => {
				const matchedItem = danhSach.find((dsItem) => dsItem.tagCode === item.tag);
				return {
					ind1: matchedItem?.ind1 || '',
					ind2: matchedItem?.ind2 || '',
					danhSachThuocTinh: matchedItem?.thuocTinhAnPham || [],
				};
			});

			form.setFieldsValue({ danhSachBienMucChiTiet: mappedValues });
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: any) => {
		const data = {
			danhSachBienMucChiTiet: values.danhSachBienMucChiTiet.map((item: any, index: number) => ({
				...item,

				tagCode: record?.mauBienMuc?.thongTinKhaiBao?.[index]?.tag || null,
				_id: record?.mauBienMuc?.thongTinKhaiBao?.[index]?._id || null,
			})),
			trangThai: actionType,
		};

		putBienMucChiTietModel(record?._id ?? '', data, getData)
			.then(() => setVisibleForm(false))
			.catch((er) => console.log(er));
	};

	return (
		<Spin spinning={loading}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				{record?.mauBienMuc?.thongTinKhaiBao?.map((item, index) => (
					<div key={item._id || index}>
						<Card
							size='small'
							headStyle={{ padding: '0px 24px' }}
							bodyStyle={{ padding: '8px 24px' }}
							title={`${item.tag} - ${item.ten}`}
						>
							<>
								<Form.Item label='Chỉ mục 1' name={['danhSachBienMucChiTiet', index, 'ind1']}>
									<Input placeholder='Nhập chỉ mục 1' />
								</Form.Item>
								<Form.Item label='Chỉ mục 2' name={['danhSachBienMucChiTiet', index, 'ind2']}>
									<Input placeholder='Nhập chỉ mục 2' />
								</Form.Item>
								<Form.List
									name={['danhSachBienMucChiTiet', index, 'danhSachThuocTinh']}
									rules={[
										{
											validator: async (_, names) => {
												if (!names || names.length < 1) {
													return Promise.reject(new Error('Ít nhất 1 thuộc tính'));
												}
												return '';
											},
										},
									]}
								>
									{(fields, { add, remove }, { errors }) => (
										<>
											{fields.map((field, thuocTinhIndex) => (
												<div key={field.key}>
													<Card
														size='small'
														headStyle={{ padding: '0px 12px' }}
														bodyStyle={{ padding: '8px 12px' }}
														title={
															<>
																<div style={{ float: 'left' }}>Thuộc tính {thuocTinhIndex + 1}</div>
																<Tooltip title='Xóa'>
																	<CloseOutlined
																		style={{ float: 'right', marginTop: 4, marginLeft: 8 }}
																		onClick={() => remove(field.name)}
																	/>
																</Tooltip>
															</>
														}
													>
														<Row gutter={[12, 0]}>
															<Col md={12} lg={16}>
																<Form.Item label='Code' name={[field.name, 'code']} rules={[...rules.required]}>
																	<Input placeholder='Nhập code' />
																</Form.Item>
															</Col>
															<Col md={12} lg={8}>
																<Form.Item label='Value' name={[field.name, 'value']} rules={[...rules.required]}>
																	<Input placeholder='Nhập value' />
																</Form.Item>
															</Col>
														</Row>
													</Card>
													<br />
												</div>
											))}
											<Form.Item>
												<Button
													type='dashed'
													onClick={() => add()}
													style={{ width: '100%' }}
													icon={<PlusOutlined />}
													size='small'
												>
													Thêm thuộc tính
												</Button>
												<Form.ErrorList errors={errors} />
											</Form.Item>
										</>
									)}
								</Form.List>
							</>
						</Card>
						<br />
					</div>
				))}

				<div className='form-footer'>
					<Button
						loading={formSubmiting}
						type='primary'
						onClick={() => {
							setActionType(ETrangThaiBienMuc.CHO_BIEN_MUC);
							form.submit();
						}}
					>
						Lưu lại
					</Button>
					<Popconfirm
						onConfirm={() => {
							setActionType(ETrangThaiBienMuc.DA_BIEN_MUC);
							form.submit();
						}}
						title='Xác nhận hoàn thành biên mục chi tiết, lưu ý khi hoàn thành sẽ không được chỉnh sửa lại biên mục?'
						placement='topRight'
					>
						<Button loading={formSubmiting} type='primary'>
							Hoàn thành
						</Button>
					</Popconfirm>
					<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>
		</Spin>
	);
};

export default FormBienMucChiTiet;
