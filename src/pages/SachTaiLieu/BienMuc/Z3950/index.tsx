import ExpandText from '@/components/ExpandText';
import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { CheckOutlined } from '@ant-design/icons';
import { Button, Col, Empty, Form, Input, InputNumber, Modal, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import SelectMayChu from './Select';
import FormZ3950 from './components/Form';

const { Option } = Select;

const Z3950Page = () => {
	const [form] = Form.useForm();
	const { timKiemZ3950Model, dsAnPhamZ3950, setDSAnPhamZ3950, loading, visibleZ3950, setVisibleZ3950, setRecord } =
		useModel('sachtailieu.anpham.anpham');
	const { danhSach } = useModel('danhmuc.thuvienquocte');
	const [visibleModal, setVisibleModal] = useState<boolean>(false);

	useEffect(() => {
		if (!visibleZ3950) {
			resetFieldsForm(form);
			setDSAnPhamZ3950([]);
		} else {
			form.setFieldsValue({
				field: 'title',
			});
		}
	}, [visibleZ3950]);

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
			nhanDe: z390Data.title || '',
			tacGia: z390Data.author || '',
			ISBN: z390Data.isbn?.[0] || '',
			namXuatBan: parseInt(z390Data.publication_year) || new Date().getFullYear(),
			nhaXuatBan: z390Data.publisher || '',
		};

		// Định nghĩa mapping các trường đặc biệt
		const fieldMappings = {
			ISBN: { tagCode: '020', subCode: 'a' },
			ISSN: { tagCode: '022', subCode: 'a' },
			tacGia: { tagCode: '100', subCode: 'a' },
			nhanDe: { tagCode: '245', subCode: 'a' },
			soThuTuCuaTap: { tagCode: '245', subCode: 'n' },
			tenTap: { tagCode: '245', subCode: 'p' },
			nhanDeSongSong: { tagCode: '245', subCode: 'b' },
			phuDe: { tagCode: '245', subCode: 'b' },
			thongTinTrachNhiem: { tagCode: '245', subCode: 'c' },
			lanXuatBan: { tagCode: '250', subCode: 'a' },
			noiXuatBan: { tagCode: '260', subCode: 'a' },
			namXuatBan: { tagCode: '260', subCode: 'c' },
			nhaXuatBan: { tagCode: '260', subCode: 'b' },
			soTrang: { tagCode: '300', subCode: 'a' },
			dacDiemVatLy: { tagCode: '300', subCode: 'b' },
			khuonKho: { tagCode: '300', subCode: 'c' },
			tuLieuDiKem: { tagCode: '300', subCode: 'e' },
			maNgonNgu: { tagCode: '041', subCode: 'a' },
		};

		// Hàm helper để lấy giá trị từ data_fields
		const getFieldValue = (tagCode: string, subCode: string): string => {
			const field = z390Data.data_fields?.find((f: any) => f.tag === tagCode);
			if (!field) return '';

			const subfield = field.subfields?.find((sf: any) => sf.code === subCode);
			return subfield?.value || '';
		};

		// Chỉ lấy từ fieldMappings nếu giá trị hiện tại là rỗng
		Object.entries(fieldMappings).forEach(([fieldName, mapping]) => {
			// Bỏ qua nếu đã có giá trị từ z390Data
			if (anPhamRecord[fieldName as keyof AnPham.IRecord]) return;

			const value = getFieldValue(mapping.tagCode, mapping.subCode);
			if (value) {
				// Xử lý đặc biệt cho trường namXuatBan (chuyển sang number)
				if (fieldName === 'namXuatBan') {
					anPhamRecord[fieldName as keyof AnPham.IRecord] = parseInt(value);
				} else {
					anPhamRecord[fieldName as keyof AnPham.IRecord] = value;
				}
			}
		});

		// Xử lý ISBN đặc biệt (chỉ lấy từ data_fields nếu chưa có ISBN)
		if (!anPhamRecord.ISBN) {
			const isbnField = z390Data.data_fields?.find((f: any) => f.tag === '020');
			if (isbnField) {
				const firstIsbn = isbnField.subfields?.find((sf: any) => sf.code === 'a')?.value;
				if (firstIsbn) {
					anPhamRecord.ISBN = firstIsbn;
				}
			}
		}

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
			title: 'Tác giả',
			dataIndex: 'author',
			width: 150,
			filterType: 'string',
		},
		{
			title: 'Nhan đề',
			dataIndex: 'title',
			width: 180,
			filterType: 'string',
		},
		{
			title: 'Mã ISBN',
			dataIndex: 'isbn',
			width: 90,
			filterType: 'string',
		},
		{
			title: 'Mã ISSN',
			dataIndex: 'issn',
			width: 90,
			filterType: 'string',
		},
		{
			title: 'Nhà xuất bản',
			dataIndex: 'publisher',
			width: 120,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
			filterType: 'string',
		},
		{
			title: 'Năm xuất bản',
			dataIndex: 'publication_year',
			align: 'center',
			width: 90,
			filterType: 'string',
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 60,
			fixed: 'right',
			render: (val, rec) => (
				<ButtonExtend
					onClick={() => {
						const anPhamRecord = mapZ390ToAnPham(rec);

						setRecord(anPhamRecord);
						setVisibleModal(true);
					}}
					tooltip='Xác nhận'
					className='text-success'
					type='link'
					icon={<CheckOutlined />}
				/>
			),
		},
	];

	return (
		<Modal
			title='Tải dữ liệu qua giao thức Z39.50'
			visible={visibleZ3950}
			onCancel={() => setVisibleZ3950(false)}
			footer={null}
			width={900}
		>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					<Col span={24}>
						<Form.Item name='mayChu' label='Thư viện' rules={[...rules.required]}>
							<SelectMayChu />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item label='Tìm kiếm' required>
							<Input.Group compact>
								<Form.Item name='field' noStyle>
									<Select style={{ width: '20%' }}>
										{/* <Option value='any'>Tất cả trường</Option> */}
										<Option value='title'>Nhan đề</Option>
										<Option value='author'>Tác giả</Option>
										<Option value='subject'>Chủ đề</Option>
										<Option value='isbn'>ISBN</Option>
										{/* <Option value='issn'>ISSN</Option> */}
										<Option value='publisher'>Nhà xuất bản</Option>
										<Option value='date'>Năm xuất bản</Option>
									</Select>
								</Form.Item>
								<Form.Item name='query' noStyle rules={[...rules.required]}>
									<Input style={{ width: '80%' }} placeholder='Nhập từ khóa tìm kiếm' />
								</Form.Item>
							</Input.Group>
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item
							name='max_records'
							label='Số lượng kết quả tối đa'
							rules={[...rules.required, ...rules.number(undefined, 0)]}
						>
							<InputNumber style={{ width: '100%' }} placeholder='Nhập số lượng bản ghi' min={1} />
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button loading={loading} htmlType='submit' type='primary'>
						Tìm kiếm
					</Button>
				</div>

				<div className='fw500'>Kết quả tìm kiếm</div>
				{dsAnPhamZ3950?.length ? (
					<TableStaticData
						columns={columns}
						data={dsAnPhamZ3950 ?? []}
						loading={loading}
						size='small'
						otherProps={{ pagination: true }}
						hasTotal
						addStt
					/>
				) : (
					<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='Không tìm thấy kết quả nào' />
				)}
			</Form>

			<FormZ3950 visibleForm={visibleModal} setVisibleForm={setVisibleModal} />
		</Modal>
	);
};

export default Z3950Page;
