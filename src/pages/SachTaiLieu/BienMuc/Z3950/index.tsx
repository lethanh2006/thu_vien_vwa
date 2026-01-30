import ExpandText from '@/components/ExpandText';
import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { CheckOutlined } from '@ant-design/icons';
import { Button, Col, Empty, Form, Input, InputNumber, Modal, Row, Select } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import SelectMayChu from '../../../DanhMuc/ThuVienQuocTe/components/Select';
import ModalBienMucZ3950 from './components/Modal';

const { Option } = Select;

const Z3950Page = (props: { getData: () => void }) => {
	const intl = useIntl();
	const { getData } = props;
	const [form] = Form.useForm();
	const {
		timKiemZ3950Model,
		dsAnPhamZ3950,
		setDSAnPhamZ3950,
		loading,
		setRecord,
		setVisibleZ3950,
		visibleTimKiemZ3950,
		setVisibleTimKiemZ3950,
	} = useModel('sachtailieu.anpham.anpham');
	const { danhSach } = useModel('danhmuc.thuvienquocte');
	const { initialState } = useModel('@@initialState');
	const { record: recDot } = useModel('sachtailieu.anpham.dotnhapsach');

	const fullName = initialState?.currentUser?.family_name
		? `${initialState?.currentUser.family_name} ${initialState?.currentUser?.given_name ?? ''}`
		: (initialState?.currentUser?.name ?? (initialState?.currentUser?.preferred_username || ''));

	useEffect(() => {
		if (!visibleTimKiemZ3950) {
			resetFieldsForm(form);
			setDSAnPhamZ3950([]);
		} else {
			form.setFieldsValue({
				field: 'title',
				max_records: 10,
			});
		}
	}, [visibleTimKiemZ3950]);

	const onFinish = async (values: any) => {
		const mayChu = danhSach?.find((item) => item?.host === values.mayChu);

		timKiemZ3950Model(
			values.query,
			mayChu?.host ?? '',
			mayChu?.port ?? 0,
			mayChu?.database ?? '',
			values.field,
			values.max_records,
		)
			.then()
			.catch((er) => console.log(er));
	};

	const mapZ390ToAnPham = (z390Data: Z3950.IRecord): AnPham.IRecord => {
		const anPhamRecord: Partial<AnPham.IRecord | any> = {
			nhanDe: z390Data.title || null,
			tacGia: z390Data.author || null,
			ISBN: z390Data.isbn?.map((item) => item).join('; ') || null,
			namXuatBan: z390Data.publication_year || null,
			nhaXuatBan: z390Data.publisher || null,
			canBoBienMuc: fullName,
			dotNhapSachId: recDot?._id,

			ISSN: z390Data.data_fields?.find((item) => item?.tag === '022')?.subfields?.find((item) => item?.code === 'a')
				?.value,
			soThuTuCuaTap: z390Data.data_fields
				?.find((item) => item?.tag === '245')
				?.subfields?.find((item) => item?.code === 'n')?.value,
			phuDe: z390Data.data_fields?.find((item) => item?.tag === '245')?.subfields?.find((item) => item?.code === 'b')
				?.value,
			thongTinTrachNhiem: z390Data.data_fields
				?.find((item) => item?.tag === '245')
				?.subfields?.find((item) => item?.code === 'c')?.value,
			lanXuatBan: z390Data.data_fields
				?.find((item) => item?.tag === '250')
				?.subfields?.find((item) => item?.code === 'a')?.value,
			noiXuatBan: z390Data.data_fields
				?.find((item) => item?.tag === '260')
				?.subfields?.find((item) => item?.code === 'a')?.value,
			soTrang: z390Data.data_fields?.find((item) => item?.tag === '300')?.subfields?.find((item) => item?.code === 'a')
				?.value,
			dacDiemVatLy: z390Data.data_fields
				?.find((item) => item?.tag === '300')
				?.subfields?.find((item) => item?.code === 'b')?.value,
			khuonKho: z390Data.data_fields?.find((item) => item?.tag === '300')?.subfields?.find((item) => item?.code === 'c')
				?.value,
			tuLieuDiKem: z390Data.data_fields
				?.find((item) => item?.tag === '300')
				?.subfields?.find((item) => item?.code === 'e')?.value,
			maNgonNgu: z390Data.data_fields
				?.find((item) => item?.tag === '401')
				?.subfields?.find((item) => item?.code === 'a')?.value,
			chiSoPhanLoai: z390Data.data_fields
				?.find((item) => item?.tag === '082')
				?.subfields?.find((item) => item?.code === 'a')?.value,
		};

		// Xử lý danhSachThongTin từ tất cả data_fields
		if (z390Data.data_fields && Array.isArray(z390Data.data_fields)) {
			anPhamRecord.danhSachThongTin = z390Data.data_fields.map((field: any) => {
				const thongTin: AnPham.IThongTinAnPham = {
					tagCode: field.tag,
					ind1: field.indicators?.[0] || ' ',
					ind2: field.indicators?.[1] || ' ',
					thuocTinhAnPham:
						field.subfields?.map((sf: any) => ({
							code: `$${sf.code}`,
							value: sf.value,
						})) || [],
				};
				return thongTin;
			});
		}

		return anPhamRecord as AnPham.IRecord;
	};

	const columns: IColumn<Z3950.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'sachtailieu.anpham.tacGia' }),
			dataIndex: 'author',
			width: 120,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.anpham.nhanDe' }),
			dataIndex: 'title',
			width: 180,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.anpham.maISBN' }),
			dataIndex: 'isbn',
			width: 120,
			render: (val, rec) => rec?.isbn?.map((item) => item).join('; '),
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.anpham.maISSN' }),
			dataIndex: 'issn',
			width: 120,
			render: (val, rec) => rec?.isbn?.map((item) => item).join('; '),
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.anpham.nhaXuatBan' }),
			dataIndex: 'publisher',
			width: 120,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.anpham.namXuatBan' }),
			dataIndex: 'publication_year',
			align: 'center',
			width: 90,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.table.thaoTac' }),
			align: 'center',
			width: 60,
			fixed: 'right',
			render: (val, rec) => (
				<ButtonExtend
					onClick={() => {
						const anPhamRecord = mapZ390ToAnPham(rec);

						setRecord(anPhamRecord);
						setVisibleZ3950(true);
					}}
					tooltip={intl.formatMessage({ id: 'global.button.xacnhan' })}
					className='text-success'
					type='link'
					icon={<CheckOutlined />}
				/>
			),
		},
	];

	return (
		<Modal
			title={intl.formatMessage({ id: 'sachtailieu.bienmuc.taiDuLieuZ3950' })}
			open={visibleTimKiemZ3950}
			onCancel={() => setVisibleTimKiemZ3950(false)}
			footer={null}
			width={900}
		>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					<Col span={24}>
						<Form.Item
							name='mayChu'
							label={intl.formatMessage({ id: 'sachtailieu.anpham.thuVien' })}
							rules={[...rules.required]}
						>
							<SelectMayChu />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item label={intl.formatMessage({ id: 'sachtailieu.anpham.timKiem' })} required>
							<Input.Group compact>
								<Form.Item name='field' noStyle>
									<Select style={{ width: '20%' }}>
										{/* <Option value='any'>Tất cả trường</Option> */}
										<Option value='title'>{intl.formatMessage({ id: 'sachtailieu.anpham.nhanDe' })}</Option>
										<Option value='author'>{intl.formatMessage({ id: 'sachtailieu.anpham.tacGia' })}</Option>
										<Option value='subject'>{intl.formatMessage({ id: 'sachtailieu.anpham.chuDe' })}</Option>
										<Option value='isbn'>{intl.formatMessage({ id: 'sachtailieu.anpham.maISBN' })}</Option>
										{/* <Option value='issn'>ISSN</Option> */}
										<Option value='publisher'>{intl.formatMessage({ id: 'sachtailieu.anpham.nhaXuatBan' })}</Option>
										<Option value='date'>{intl.formatMessage({ id: 'sachtailieu.anpham.namXuatBan' })}</Option>
									</Select>
								</Form.Item>
								<Form.Item name='query' noStyle rules={[...rules.required]}>
									<Input
										style={{ width: '80%' }}
										placeholder={intl.formatMessage({ id: 'sachtailieu.anpham.nhapTimKiem' })}
									/>
								</Form.Item>
							</Input.Group>
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item
							name='max_records'
							label={intl.formatMessage({ id: 'sachtailieu.anpham.soLuongBanGhi' })}
							rules={[...rules.required, ...rules.number(1000, 0)]}
						>
							<InputNumber
								style={{ width: '100%' }}
								placeholder={intl.formatMessage({ id: 'sachtailieu.anpham.nhapSoLuongBanGhi' })}
								min={1}
							/>
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button loading={loading} htmlType='submit' type='primary'>
						{intl.formatMessage({ id: 'sachtailieu.anpham.timKiem' })}
					</Button>
				</div>

				<div className='fw500'>{intl.formatMessage({ id: 'sachtailieu.anpham.ketQuaTimKiem' })}</div>
				{dsAnPhamZ3950?.length ? (
					<TableStaticData
						columns={columns}
						data={dsAnPhamZ3950 ?? []}
						loading={loading}
						size='small'
						hasTotal
						addStt
					/>
				) : (
					<Empty
						image={Empty.PRESENTED_IMAGE_SIMPLE}
						description={intl.formatMessage({ id: 'sachtailieu.anpham.khongTimThayKetQua' })}
					/>
				)}
			</Form>

			<ModalBienMucZ3950 getData={getData} />
		</Modal>
	);
};

export default Z3950Page;
