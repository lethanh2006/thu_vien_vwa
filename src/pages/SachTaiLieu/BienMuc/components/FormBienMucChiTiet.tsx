import ButtonExtend from '@/components/Table/ButtonExtend';
import SelectNgonNgu from '@/pages/DanhMuc/DanhMucNgonNgu/components/Select';
import SelectHocPhan from '@/pages/DaoTao/HocPhan/Select';
import { ETrangThaiBienMuc } from '@/services/SachTaiLieu/constant';
import { resetFieldsForm } from '@/utils/utils';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, Row, Spin, Tooltip, Typography } from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { history, useIntl, useModel } from 'umi';

const { Title } = Typography;

const FormBienMucChiTiet = (props: any) => {
	const { getData, isBienMuc } = props;
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, setVisibleForm, putBienMucChiTietModel, formSubmiting, visibleForm } =
		useModel('sachtailieu.anpham.anpham');
	const { danhSach, loading } = useModel('sachtailieu.anpham.thongtinanpham');

	const [actionType, setActionType] = useState<ETrangThaiBienMuc>(ETrangThaiBienMuc.CHO_BIEN_MUC);
	const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
			setActiveTagIndex(null);
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
							value: null,
							ten: tp.ten,
						}));

					return {
						...item,
						ten: item.tag?.noiDung,
						thuocTinhAnPham: [
							...(item?.thuocTinhAnPham || []).map((tp) => ({
								...tp,
								value: tp.value ?? null,
								ten: item?.tag?.thuocTinh?.find((i) => i?.code === tp?.code)?.tieuDe,
							})),
							...additionalAttributes,
						],
					};
				}),
				...khaiBaoMoi.map((item) => ({
					thuocTinhAnPham: (item?.thuocTinhDuLieu || []).map((tp) => ({
						...tp,
						value: null,
						ten: tp.ten,
					})),
					tagCode: item.tag,
					ten: item.ten,
					_id: null,
				})),
			];
			const sortedData = _.orderBy(mergedData, 'tagCode');
			form.setFieldsValue({ danhSachBienMucChiTiet: sortedData });

			if (sortedData.length > 0) {
				setActiveTagIndex(0);
			} else {
				setActiveTagIndex(null);
			}
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

		setActiveTagIndex(index + 1);
	};

	const currentActiveTagData =
		activeTagIndex !== null ? form.getFieldValue(['danhSachBienMucChiTiet', activeTagIndex]) : null;

	return (
		<Spin spinning={loading}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Form.List name='danhSachBienMucChiTiet'>
					{(fields, { remove }, { errors }) => {
						const columns = fields.length <= 9 ? 3 : fields.length <= 16 ? 4 : 6;

						return (
							<div>
								<div
									style={{
										display: 'grid',
										gridTemplateColumns: `repeat(${columns}, 1fr)`,
										gap: '8px',
										marginBottom: '16px',
									}}
								>
									{fields.map((field, index) => {
										const tagItemData = form.getFieldValue(['danhSachBienMucChiTiet', index]);
										if (!tagItemData) return null;

										return (
											<Tooltip title={`${tagItemData.tagCode} - ${tagItemData.ten}`} key={field.key}>
												<div
													onClick={() => setActiveTagIndex(index)}
													style={{
														padding: '8px',
														cursor: 'pointer',
														backgroundColor: activeTagIndex === index ? '#ff4d4d' : '#f0f0f0',
														color: activeTagIndex === index ? '#fff' : '#333',
														fontWeight: activeTagIndex === index ? 600 : 'normal',
														borderRadius: '4px',
														textAlign: 'center',
														fontSize: '12px',
														whiteSpace: 'nowrap',
														overflow: 'hidden',
														textOverflow: 'ellipsis',
														transition: 'all 0.2s',
														border: '1px solid #e8e8e8',
														minHeight: '32px',
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
													}}
												>
													{tagItemData.tagCode}
													{tagItemData.isNewTag && <PlusOutlined style={{ fontSize: '10px', marginLeft: '4px' }} />}
												</div>
											</Tooltip>
										);
									})}
								</div>

								{activeTagIndex !== null && fields[activeTagIndex] && currentActiveTagData ? (
									<Card
										size='small'
										headStyle={{ padding: '0px 16px', backgroundColor: '#fafafa' }}
										bodyStyle={{ padding: '16px' }}
										title={
											<Title level={5} style={{ margin: 0, fontWeight: 600 }}>
												{`${currentActiveTagData.tagCode} - ${currentActiveTagData.ten || 'Chưa có tên'}`}
											</Title>
										}
										extra={
											currentActiveTagData.isNewTag ? (
												<Tooltip title='Xóa'>
													<Button
														type='text'
														danger
														icon={<CloseOutlined />}
														onClick={() => {
															const indexToRemove = activeTagIndex;
															remove(fields[indexToRemove].name);

															setActiveTagIndex(activeTagIndex - 1);
														}}
													/>
												</Tooltip>
											) : null
										}
									>
										<Row gutter={[12, 0]}>
											<Col span={24} md={12}>
												<Form.Item label='Chỉ mục 1' name={[fields[activeTagIndex].name, 'ind1']}>
													<Input placeholder='Nhập chỉ mục 1' />
												</Form.Item>
											</Col>
											<Col span={24} md={12}>
												<Form.Item label='Chỉ mục 2' name={[fields[activeTagIndex].name, 'ind2']}>
													<Input placeholder='Nhập chỉ mục 2' />
												</Form.Item>
											</Col>
											{currentActiveTagData?.thuocTinhAnPham?.length > 0 ? (
												<Col span={24}>
													<Row gutter={[12, 12]}>
														{_.orderBy(currentActiveTagData.thuocTinhAnPham, 'code').map((item: any, i: number) => {
															const fieldCode = `${currentActiveTagData.tagCode}${item?.code}`;
															return (
																// eslint-disable-next-line react/no-array-index-key
																<Col xs={24} md={12} key={`${fields[activeTagIndex].key}-thuocTinh-${i}`}>
																	<Form.Item
																		label={`${item.ten || 'Thuộc tính'} [${fieldCode}]`}
																		name={[fields[activeTagIndex].name, 'thuocTinhAnPham', i, 'value']}
																	>
																		{fieldCode === '041$a' ? (
																			<SelectNgonNgu selectMa allowClear />
																		) : fieldCode === '913$a' ? (
																			<SelectHocPhan selectMa allowClear />
																		) : (
																			<Input placeholder={`Nhập ${item.ten || ''}`} />
																		)}
																	</Form.Item>
																</Col>
															);
														})}
													</Row>

													<Form.Item style={{ marginTop: '16px' }}>
														<Button
															type='dashed'
															onClick={() => addTag(activeTagIndex)}
															style={{ width: '100%' }}
															icon={<PlusOutlined />}
															size='small'
														>
															{`Bổ sung thông tin "${currentActiveTagData.ten}"`}
														</Button>
													</Form.Item>
												</Col>
											) : (
												<Col span={24}>
													<Form.Item name={[fields[activeTagIndex].name, 'value']}>
														<Input.TextArea rows={4} placeholder='Nhập thông tin' />
													</Form.Item>
												</Col>
											)}
										</Row>
									</Card>
								) : (
									<div style={{ padding: '20px', textAlign: 'center', color: '#888' }}>
										{fields.length > 0
											? 'Chọn một mục biên mục từ danh sách bên phải để chỉnh sửa.'
											: 'Không có mục biên mục nào.'}
									</div>
								)}
							</div>
						);
					}}
				</Form.List>

				<div className='form-footer'>
					{isBienMuc === true && (
						<ButtonExtend
							loading={formSubmiting}
							type='primary'
							onClick={() => {
								setActionType(ETrangThaiBienMuc.CHO_BIEN_MUC);
								form.submit();
							}}
							style={{ marginRight: 8 }}
						>
							Lưu lại
						</ButtonExtend>
					)}
					<ButtonExtend
						loading={formSubmiting}
						type='primary'
						onClick={() => {
							setActionType(ETrangThaiBienMuc.DA_BIEN_MUC);
							form.submit();
						}}
						style={{ marginRight: 8 }}
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
