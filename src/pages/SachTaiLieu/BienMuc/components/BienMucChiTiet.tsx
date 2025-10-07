import ButtonExtend from '@/components/Table/ButtonExtend';
import SelectDangTaiLieu from '@/pages/DanhMuc/DangTaiLieu/components/Select';
import SelectNgonNgu from '@/pages/DanhMuc/DanhMucNgonNgu/components/Select';
import SelectVatMangTin from '@/pages/DanhMuc/VatMangTin/components/Select';
import SelectHocPhan from '@/pages/DaoTao/HocPhan/Select';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Col, Form, type FormInstance, Input, Row, Select, Space, Table } from 'antd';
import _ from 'lodash';

const BienMucChiTiet = (props: { form: FormInstance }) => {
	const { form } = props;

	const handleAddRepeatableTag = (
		addOperation: (defaultValue?: any, insertIndex?: number) => void,
		fieldIndex: number,
	) => {
		const allValues = form.getFieldValue('danhSachBienMucChiTiet');
		const originalTagData = allValues[fieldIndex];

		if (originalTagData) {
			const newTag = {
				...originalTagData,
				isNewTag: true,
				_id: null,
				thuocTinhAnPham: (originalTagData.thuocTinhAnPham || []).map((tp: any) => ({
					...tp,
					value: null,
				})),
				value: originalTagData.thuocTinhAnPham?.length ? undefined : '',
			};
			addOperation(newTag, fieldIndex + 1);
		}
	};

	const columns = (
		fields: unknown,
		addOperation: (defaultValue?: any, insertIndex?: number) => void,
		removeOperation: (index: number | number[]) => void,
	) => [
		{
			title: 'Tên trường',
			key: 'tag',
			width: 200,
			render: (val: any, field: any, index: number) => {
				const tagItem = form.getFieldValue(['danhSachBienMucChiTiet', field.name]);
				return [tagItem?.tagCode, tagItem?.ten].filter(Boolean).join(' - ');
			},
		},
		{
			title: 'Chỉ mục 1',
			dataIndex: 'ind1',
			key: 'ind1',
			width: 80,
			render: (val: any, field: any) => (
				<Form.Item name={[field.name, 'ind1']} noStyle>
					<Input placeholder='Nhập chỉ mục 1' />
				</Form.Item>
			),
		},
		{
			title: 'Chỉ mục 2',
			dataIndex: 'ind2',
			key: 'ind2',
			width: 80,
			render: (val: any, field: any) => (
				<Form.Item name={[field.name, 'ind2']} noStyle>
					<Input placeholder='Nhập chỉ mục 2' />
				</Form.Item>
			),
		},
		{
			title: 'Trường con',
			key: 'data',
			width: 320,
			render: (val: any, field: any, rowIndex: number) => {
				const currentTagData = form.getFieldValue(['danhSachBienMucChiTiet', field.name]);
				const tagCode = currentTagData.tagCode;

				if (currentTagData?.thuocTinhAnPham?.length) {
					const isMultiple = currentTagData.thuocTinhAnPham.length > 1;

					const sortedSubFields = _.orderBy(currentTagData.thuocTinhAnPham, 'code');

					return (
						<Row gutter={[12, 0]} style={{ width: '100%' }}>
							{sortedSubFields.map((item: any, i: number) => {
								const fieldCode = `${currentTagData.tagCode}${item?.code}`;

								const originalIndex = currentTagData.thuocTinhAnPham.findIndex(
									(subField: any) => subField.code === item.code,
								);

								return (
									<Col
										// eslint-disable-next-line react/no-array-index-key
										key={`${field.name}-thuocTinh-${i}`}
										span={isMultiple ? 12 : 24}
									>
										<Form.Item
											label={`${item.ten ?? ''} [${item.code}]`}
											name={[field.name, 'thuocTinhAnPham', originalIndex, 'value']}
											labelCol={{ span: 24 }}
											wrapperCol={{ span: 24 }}
											style={{ marginBottom: 8 }}
										>
											{(() => {
												if (fieldCode === '041$a') {
													return <SelectNgonNgu selectMa allowClear />;
												}

												if (fieldCode === '913$a') {
													return (
														<SelectHocPhan
															selectMa
															allowClear
															onChange={(value, option) => {
																const bSubFieldOriginalIndex = currentTagData.thuocTinhAnPham.findIndex(
																	(tp: any) => tp.code === '$b',
																);

																if (bSubFieldOriginalIndex > -1) {
																	const tenHocPhan = option?.record?.ten ?? null;
																	const allValues = form.getFieldValue('danhSachBienMucChiTiet');
																	const newValues = _.cloneDeep(allValues);

																	newValues[rowIndex].thuocTinhAnPham[bSubFieldOriginalIndex].value = tenHocPhan;

																	form.setFieldsValue({
																		danhSachBienMucChiTiet: newValues,
																	});
																}
															}}
														/>
													);
												}

												if (fieldCode === '913$b') {
													return <Input placeholder='Tên học phần (tự động)' disabled />;
												}

												return <Input placeholder={`Nhập ${item.ten || ''}`} />;
											})()}
										</Form.Item>
									</Col>
								);
							})}
						</Row>
					);
				}

				return (
					<Form.Item name={[field.name, 'value']} noStyle>
						{tagCode === '925' ? (
							<SelectVatMangTin selectMa />
						) : tagCode === '926' ? (
							<Select placeholder='Chọn độ mật' style={{ width: '100%' }}>
								{Array.from({ length: 11 }, (__, i) => (
									<Select.Option key={i} value={i}>
										{i}
									</Select.Option>
								))}
							</Select>
						) : tagCode === '927' ? (
							<SelectDangTaiLieu selectMa />
						) : (
							<Input placeholder='Nhập thông tin' />
						)}
					</Form.Item>
				);
			},
		},
		{
			title: 'Thao tác',
			key: 'action',
			width: 60,
			align: 'center' as const,
			render: (val: any, field: any, rowIndex: number) => {
				const currentTagData = form.getFieldValue(['danhSachBienMucChiTiet', field.name]);
				const canRepeat = currentTagData?.thuocTinhAnPham?.length > 0;
				return (
					<Space>
						{canRepeat && (
							<ButtonExtend
								type='link'
								tooltip={`Bổ sung trường "${currentTagData?.ten}"`}
								icon={<PlusOutlined />}
								size='small'
								onClick={() => handleAddRepeatableTag(addOperation, field.name)}
							/>
						)}
						{currentTagData?.isNewTag && (
							<ButtonExtend
								type='link'
								tooltip='Xóa trường lặp'
								danger
								icon={<DeleteOutlined />}
								size='small'
								onClick={() => removeOperation(field.name)}
							/>
						)}
					</Space>
				);
			},
		},
	];

	return (
		<Form.List name='danhSachBienMucChiTiet'>
			{(fields, { add, remove }, { errors }) => {
				return (
					<Table
						columns={columns(fields, add, remove)}
						dataSource={fields}
						rowKey='key'
						pagination={false}
						bordered
						size='small'
						locale={{
							emptyText: 'Không có dữ liệu trường biên mục',
						}}
					/>
				);
			}}
		</Form.List>
	);
};

export default BienMucChiTiet;
