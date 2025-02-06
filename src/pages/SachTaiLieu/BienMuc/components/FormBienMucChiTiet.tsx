import ButtonExtend from '@/components/Table/ButtonExtend';
import { ETrangThaiBienMuc } from '@/services/SachTaiLieu/constant';
import { resetFieldsForm } from '@/utils/utils';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, Row, Spin, Tooltip } from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { history, useIntl, useModel } from 'umi';

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
			const danhSachTags = danhSach.map((dsItem) => dsItem.tagCode);

			const khaiBaoMoi = (record?.mauBienMuc?.thongTinKhaiBao || []).filter((item) => !danhSachTags.includes(item.tag));

			const mergedData = [
				...danhSach.map((item) => {
					const thongTinKhaiBao = record?.mauBienMuc?.thongTinKhaiBao?.find((kb) => kb.tag === item.tagCode);

					const existingCodes = new Set(item?.thuocTinhAnPham?.map((tp) => tp.code));

					const additionalAttributes = (thongTinKhaiBao?.thuocTinhDuLieu || [])
						.filter((tp) => tp.code && !existingCodes.has(tp.code))
						.map((tp) => ({
							...tp,
							value: '',
							ten: tp.ten,
						}));

					return {
						...item,
						ten: item.tag?.noiDung,
						thuocTinhAnPham: [
							...(item?.thuocTinhAnPham || []).map((tp) => ({
								...tp,
								value: tp.value,
								ten: item?.tag?.thuocTinh?.find((i) => i?.code === tp?.code)?.tieuDe,
							})),
							...additionalAttributes,
						],
					};
				}),
				...khaiBaoMoi.map((item) => ({
					thuocTinhAnPham: (item?.thuocTinhDuLieu || []).map((tp) => ({
						...tp,
						value: '',
						ten: tp.ten,
					})),
					tagCode: item.tag,
					ten: item.ten,
					_id: null,
				})),
			];

			form.setFieldsValue({ danhSachBienMucChiTiet: _.orderBy(mergedData, 'tagCode') });
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: any) => {
		const data = {
			danhSachBienMucChiTiet: values.danhSachBienMucChiTiet.map((item: any) => ({
				_id: item._id ?? null,
				ind1: item.ind1 ?? null,
				ind2: item.ind2 ?? null,
				tagCode: item.tagCode,
				value: item.value ?? null,
				thuocTinhAnPham: (item.thuocTinhAnPham || []).map((thuocTinh: any) => ({
					code: thuocTinh.code,
					value: thuocTinh.value ?? '',
				})),
			})),
			trangThai: actionType,
		};

		putBienMucChiTietModel(record?._id ?? '', data, getData)
			.then(() => {
				setVisibleForm(false);
				if (actionType === ETrangThaiBienMuc.DA_BIEN_MUC) {
					history.push('/sach-tai-lieu/an-pham');
				}
			})
			.catch((er) => console.log(er));
	};

	const addTag = (index: number) => {
		const values = form.getFieldValue('danhSachBienMucChiTiet') || [];
		const newTag = {
			...values[index],
			isNewTag: true,
			_id: null,
		};
		const updatedValues = [...values];
		updatedValues.splice(index + 1, 0, newTag);
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
												<Col span={24}>
													<Row gutter={[12, 0]}>
														{_.orderBy(
															form.getFieldValue('danhSachBienMucChiTiet')?.[index]?.thuocTinhAnPham,
															'code',
														)?.map((item: any, i: number) => (
															// eslint-disable-next-line react/no-array-index-key
															<Col md={12} key={`${field.name}-thuocTinh-${i}`}>
																<Form.Item
																	label={`${item.ten ?? ''} [${
																		form.getFieldValue('danhSachBienMucChiTiet')?.[index]?.tagCode
																	}${item?.code}]`}
																	name={[field.name, 'thuocTinhAnPham', i, 'value']}
																>
																	<Input placeholder={`Nhập ${item.ten}`} />
																</Form.Item>
															</Col>
														))}
													</Row>
												</Col>

												<Col span={24}>
													<Form.Item>
														<Button
															type='dashed'
															onClick={() => addTag(index)}
															style={{ width: '100%' }}
															icon={<PlusOutlined />}
															size='small'
														>
															{/* eslint-disable-next-line react/no-unescaped-entities */}
															Bổ sung thông tin "{form.getFieldValue('danhSachBienMucChiTiet')?.[index]?.ten}"
														</Button>
													</Form.Item>
												</Col>
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

					<ButtonExtend
						loading={formSubmiting}
						type='primary'
						onClick={() => {
							setActionType(ETrangThaiBienMuc.DA_BIEN_MUC);
							form.submit();
						}}
					>
						Hoàn thành
					</ButtonExtend>

					<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>
		</Spin>
	);
};

export default FormBienMucChiTiet;
