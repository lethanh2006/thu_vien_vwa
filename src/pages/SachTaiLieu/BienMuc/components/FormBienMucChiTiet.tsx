import ButtonExtend from '@/components/Table/ButtonExtend';
import SelectNgonNgu from '@/pages/DanhMuc/DanhMucNgonNgu/components/Select';
import SelectHocPhan from '@/pages/DaoTao/HocPhan/Select';
import { ETrangThaiBienMuc } from '@/services/SachTaiLieu/constant';
import { resetFieldsForm } from '@/utils/utils';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Space, Spin, Table } from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { history, useIntl, useModel } from 'umi';

const FormBienMucChiTiet = (props: any) => {
	const { getData, isBienMuc } = props;
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
				return `${tagItem?.tagCode ?? ''} - ${tagItem?.ten ?? ''}`;
			},
		},
		{
			title: 'Chỉ mục 1',
			dataIndex: 'ind1',
			key: 'ind1',
			width: 90,
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
			width: 90,
			render: (val: any, field: any) => (
				<Form.Item name={[field.name, 'ind2']} noStyle>
					<Input placeholder='Nhập chỉ mục 2' />
				</Form.Item>
			),
		},
		{
			title: 'Trường con',
			key: 'data',
			width: 300,
			render: (val: any, field: any, rowIndex: number) => {
				const currentTagData = form.getFieldValue(['danhSachBienMucChiTiet', field.name]);

				if (currentTagData?.thuocTinhAnPham?.length) {
					return (
						<div style={{ width: '100%' }}>
							{currentTagData.thuocTinhAnPham.map((item: any, i: number) => {
								const fieldCode = `${currentTagData.tagCode}${item?.code}`;
								return (
									<Form.Item
										// eslint-disable-next-line react/no-array-index-key
										key={`${field.name}-thuocTinh-${i}`}
										label={`${item.ten ?? ''} [${item.code}]`}
										name={[field.name, 'thuocTinhAnPham', i, 'value']}
										labelCol={{ span: 24 }}
										wrapperCol={{ span: 24 }}
										style={{ marginBottom: 8 }}
									>
										{fieldCode === '041$a' ? (
											<SelectNgonNgu selectMa allowClear />
										) : fieldCode === '913$a' ? (
											<SelectHocPhan selectMa allowClear />
										) : (
											<Input placeholder={`Nhập ${item.ten || ''}`} />
										)}
									</Form.Item>
								);
							})}
						</div>
					);
				}
				return (
					<Form.Item name={[field.name, 'value']} noStyle>
						<Input.TextArea placeholder='Nhập thông tin' autoSize={{ minRows: 1, maxRows: 3 }} />
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
		<Spin spinning={loading}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
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

				<div className='form-footer'>
					{isBienMuc === true && (
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
					)}

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
