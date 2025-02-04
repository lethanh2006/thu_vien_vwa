import ButtonExtend from '@/components/Table/ButtonExtend';
import { ETrangThaiBienMuc } from '@/services/SachTaiLieu/constant';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, Popconfirm, Row, Spin, Tooltip } from 'antd';
import _ from 'lodash';
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
			const mappedValues = record?.mauBienMuc?.thongTinKhaiBao.map((item) => {
				const matchedItem = danhSach.find((dsItem) => dsItem.tagCode === item.tag);

				const mergedThuocTinh = _.uniqBy(
					[...(item?.thuocTinhDuLieu || []), ...(matchedItem?.thuocTinhAnPham || [])],
					'code',
				).map((thuocTinh) => ({
					...thuocTinh,
					value: matchedItem?.thuocTinhAnPham?.find((tp) => tp.code === thuocTinh.code)?.value || '',
				}));

				return {
					ind1: matchedItem?.ind1,
					ind2: matchedItem?.ind2,
					value: matchedItem?.value,
					thuocTinhAnPham: mergedThuocTinh,
					tagCode: matchedItem?.tag?.ma ?? item?.tag,
					ten: matchedItem?.tag?.noiDung ?? item?.ten,
				};
			});

			form.setFieldsValue({ danhSachBienMucChiTiet: mappedValues });
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: any) => {
		const data = {
			danhSachBienMucChiTiet: values.danhSachBienMucChiTiet.map((item: any, index: number) => {
				delete item.ten;
				delete item.isNewTag;

				const updatedThuocTinhAnPham = item.thuocTinhAnPham.map((thuocTinh: any) => {
					delete thuocTinh.kieuDuLieu;
					delete thuocTinh.ten;
					return thuocTinh;
				});

				return {
					...item,
					thuocTinhAnPham: updatedThuocTinhAnPham,
					_id: record?.mauBienMuc?.thongTinKhaiBao?.[index]?._id || null,
				};
			}),
			trangThai: actionType,
		};

		putBienMucChiTietModel(record?._id ?? '', data, getData)
			.then(() => setVisibleForm(false))
			.catch((er) => console.log(er));
	};

	const addTag = (index: number) => {
		const values = form.getFieldValue('danhSachBienMucChiTiet') || [];
		const newTag = {
			...values[index],
			isNewTag: true, // Thêm thuộc tính này để nhận diện tag mới
		};
		const updatedValues = [...values];
		updatedValues.splice(index + 1, 0, newTag); // Add new tag after the current one
		form.setFieldsValue({ danhSachBienMucChiTiet: updatedValues });
	};

	return (
		<Spin spinning={loading}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Form.List name='danhSachBienMucChiTiet'>
					{(fields, { add, remove, move }, { errors }) => {
						return fields.map((field, index) => (
							<div key={field.key}>
								<Card
									size='small'
									headStyle={{ padding: '0px 24px' }}
									bodyStyle={{ padding: '8px 24px' }}
									title={`${form.getFieldValue('danhSachBienMucChiTiet')?.[index]?.tagCode} - ${
										form.getFieldValue('danhSachBienMucChiTiet')?.[index]?.ten
									}`}
									extra={
										form.getFieldValue('danhSachBienMucChiTiet')?.[index]?.isNewTag ? (
											<Tooltip title='Xóa'>
												<CloseOutlined onClick={() => remove(field.name)} />
											</Tooltip>
										) : null
									}
								>
									<Row gutter={[12, 0]}>
										<Col span={24} md={12}>
											<Form.Item label='Chỉ mục 1' name={[field.name, 'ind1']}>
												<Input placeholder='Nhập chỉ mục 1' />
											</Form.Item>
										</Col>
										<Col span={24} md={12}>
											<Form.Item label='Chỉ mục 2' name={[field.name, 'ind2']}>
												<Input placeholder='Nhập chỉ mục 2' />
											</Form.Item>
										</Col>
										{form.getFieldValue('danhSachBienMucChiTiet')?.[index]?.thuocTinhAnPham?.length ? (
											<Col span={24}>
												<Form.List name={[field.name, 'thuocTinhAnPham']}>
													{/* eslint-disable-next-line @typescript-eslint/no-shadow */}
													{(fields, { add, remove }) => (
														<>
															{/* eslint-disable-next-line @typescript-eslint/no-shadow */}
															{fields.map((field) => (
																<div key={field.key}>
																	<Row gutter={[12, 0]}>
																		<Col md={12} lg={7}>
																			<Form.Item label='Code' name={[field.name, 'code']} rules={[...rules.required]}>
																				<Input placeholder='Nhập code' />
																			</Form.Item>
																		</Col>
																		<Col md={12} lg={16}>
																			<Form.Item label='Value' name={[field.name, 'value']} rules={[...rules.required]}>
																				<Input placeholder='Nhập value' />
																			</Form.Item>
																		</Col>
																		<Col lg={1}>
																			<Form.Item label=' '>
																				<Tooltip title='Xóa'>
																					<CloseOutlined
																						style={{ float: 'right', marginTop: 4, marginLeft: 8 }}
																						onClick={() => remove(field.name)}
																					/>
																				</Tooltip>
																			</Form.Item>
																		</Col>
																	</Row>
																</div>
															))}
															<Row gutter={[12, 0]}>
																<Col span={12}>
																	<Form.Item>
																		<Button
																			type='dashed'
																			onClick={() => add()}
																			style={{ width: '100%' }}
																			icon={<PlusOutlined />}
																			size='small'
																		>
																			Thêm thông tin
																		</Button>
																	</Form.Item>
																</Col>
																<Col span={12}>
																	<Form.Item>
																		<Button
																			type='dashed'
																			onClick={() => addTag(index)}
																			style={{ width: '100%' }}
																			icon={<PlusOutlined />}
																			size='small'
																		>
																			Thêm tag {form.getFieldValue('danhSachBienMucChiTiet')?.[index]?.tagCode}
																		</Button>
																	</Form.Item>
																</Col>
															</Row>
														</>
													)}
												</Form.List>
											</Col>
										) : (
											<Col span={24}>
												<Form.Item name={[field.name, 'value']}>
													<Input placeholder='Nhập thông tin' />
												</Form.Item>
											</Col>
										)}
									</Row>
								</Card>
								<br />
							</div>
						));
					}}
				</Form.List>

				<div className='form-footer'>
					<ButtonExtend
						loading={formSubmiting}
						type='primary'
						onClick={() => {
							setActionType(ETrangThaiBienMuc.CHO_BIEN_MUC);
							form.submit();
						}}
					>
						Lưu lại
					</ButtonExtend>
					<Popconfirm
						onConfirm={() => {
							setActionType(ETrangThaiBienMuc.DA_BIEN_MUC);
							form.submit();
						}}
						title='Xác nhận hoàn thành biên mục chi tiết, lưu ý khi hoàn thành sẽ không được chỉnh sửa lại biên mục?'
						placement='topRight'
					>
						<ButtonExtend loading={formSubmiting} type='primary'>
							Hoàn thành
						</ButtonExtend>
					</Popconfirm>
					<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>
		</Spin>
	);
};

export default FormBienMucChiTiet;
