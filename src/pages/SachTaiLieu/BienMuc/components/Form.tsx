import TinyEditor from '@/components/TinyEditor';
import UploadFile from '@/components/Upload/UploadFile';
import SelectCapThuMuc from '@/pages/DanhMuc/CapThuMuc/components/Select';
import SelectDangTaiLieu from '@/pages/DanhMuc/DangTaiLieu/components/Select';
import SelectNgonNgu from '@/pages/DanhMuc/DanhMucNgonNgu/components/Select';
import SelectKieuBanGhi from '@/pages/DanhMuc/KieuBanGhi/components/Select';
import SelectMauBienMuc from '@/pages/DanhMuc/MauBienMuc/components/Select';
import SelectVatMangTin from '@/pages/DanhMuc/VatMangTin/components/Select';
import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import { ETrangThaiBienMuc } from '@/services/SachTaiLieu/constant';
import { buildUpLoadFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Checkbox, Col, Form, Input, InputNumber, Row, Select } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import SelectDotNhapSach from '../../DotNhapSach/components/Select';
import FormItemTaiLieuSo from '../DanhSachTaiLieu/FormItem';

const FormBienMucSachTaiLieu = (props: { afterAddNew: (rec: AnPham.IRecord) => void; tabActive: string }) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const {
		record,
		setVisibleForm,
		edit,
		postBienMucSoLuocModel,
		putBienMucSoLuocModel,
		formSubmiting,
		setRecord,
		setEdit,
		visibleForm,
		getModel,
		setFormSubmiting,
	} = useModel('sachtailieu.anpham.anpham');
	const { getAllModel, danhSach } = useModel('sachtailieu.anpham.thongtinanpham');
	const { record: recDot } = useModel('sachtailieu.anpham.dotnhapsach');
	const { afterAddNew, tabActive } = props;
	const online: boolean = Form.useWatch('online', form);
	const isSachHay: boolean = Form.useWatch('isSachHay', form);

	const getData = async (): Promise<AnPham.IRecord[]> => {
		const response = await getModel({
			dotNhapSachId: recDot?._id,
			trangThai: ETrangThaiBienMuc.CHO_BIEN_MUC,
			online: tabActive === '1' ? false : true,
		});
		return response;
	};

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
		} else if (record?._id) {
			const fieldMapping = {
				ISBN: { tagCode: '020', subCode: '$a' },
				ISSN: { tagCode: '022', subCode: '$a' },
				tacGia: { tagCode: '100', subCode: '$a' },
				nhanDe: { tagCode: '245', subCode: '$a' },
				soThuTuCuaTap: { tagCode: '245', subCode: '$n' },
				tenTap: { tagCode: '245', subCode: '$p' },
				nhanDeSongSong: { tagCode: '245', subCode: '$b' },
				phuDe: { tagCode: '245', subCode: '$b' },
				thongTinTrachNhiem: { tagCode: '245', subCode: '$c' },
				lanXuatBan: { tagCode: '250', subCode: '$a' },
				noiXuatBan: { tagCode: '260', subCode: '$a' },
				namXuatBan: { tagCode: '260', subCode: '$c' },
				nhaXuatBan: { tagCode: '260', subCode: '$b' },
				soTrang: { tagCode: '300', subCode: '$a' },
				dacDiemVatLy: { tagCode: '300', subCode: '$b' },
				khuonKho: { tagCode: '300', subCode: '$c' },
				tuLieuDiKem: { tagCode: '300', subCode: '$e' },
				maNgonNgu: { tagCode: '041', subCode: '$a' },
			};

			const formValues: Record<string, any> = {};
			Object.entries(fieldMapping).forEach(([fieldName, { tagCode, subCode }]) => {
				const tag = danhSach?.find((item) => item?.tagCode === tagCode);
				let value = tag?.thuocTinhAnPham?.find((i) => i.code === subCode)?.value;

				// Gán giá trị mặc định từ `record` nếu không tìm thấy giá trị từ `tag`
				if (!value && (fieldName === 'tacGia' || fieldName === 'nhanDe')) {
					value = record?.[fieldName];
				}

				if (value) {
					formValues[fieldName] = value;
				}
			});

			// Gán giá trị cho form
			form.setFieldsValue({
				...record,
				...formValues,
			});
		} else {
			form.setFieldsValue({
				online: tabActive === '1' ? false : true,
				dotNhapSachId: recDot?._id,
			});
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: AnPham.IRecord) => {
		setFormSubmiting(true);
		const urlScanBia = await buildUpLoadFile(values, 'urlScanBia').finally(() => setFormSubmiting(false));
		values.urlScanBia = urlScanBia ?? '';
		values.namXuatBan = Number(values.namXuatBan);

		if (edit) {
			putBienMucSoLuocModel(record?._id ?? '', values, getData)
				.then((rec) => setVisibleForm(false))
				.catch((er) => console.log(er));
		} else
			postBienMucSoLuocModel({ ...values, trangThai: ETrangThaiBienMuc.CHO_BIEN_MUC })
				.then(async (res) => {
					const updatedList = await getData();

					const index = updatedList?.find((item) => item?._id === res?._id);
					setRecord(index);
					setEdit(true);
					if (index && afterAddNew) afterAddNew(index);

					getAllModel(undefined, undefined, { anPhamId: res?._id });
				})
				.catch((er) => console.log(er));
	};

	return (
		<Form onFinish={onFinish} form={form} layout='vertical'>
			<Row gutter={[16, 16]}>
				{/* Phần thông tin cơ bản */}
				<Col span={24}>
					<Card title='Thông tin cơ bản' size='small'>
						<Row gutter={[16, 8]}>
							<Col xs={24} md={12}>
								<Form.Item name='dotNhapSachId' label='Sổ đăng ký tổng quát' rules={[...rules.required]}>
									<SelectDotNhapSach />
								</Form.Item>
							</Col>
							<Col xs={24} md={12}>
								<Form.Item name='maKieuBanGhi' label='Kiểu bản ghi' rules={[...rules.required]}>
									<SelectKieuBanGhi selectMa />
								</Form.Item>
							</Col>
							<Col xs={24} md={12}>
								<Form.Item name='maDangTaiLieu' label='Dạng tài liệu' rules={[...rules.required]}>
									<SelectDangTaiLieu selectMa />
								</Form.Item>
							</Col>
							<Col xs={24} md={12}>
								<Form.Item name='maCapThuMuc' label='Cấp thư mục' rules={[...rules.required]}>
									<SelectCapThuMuc selectMa />
								</Form.Item>
							</Col>
							<Col xs={24} md={12}>
								<Form.Item name='maVatMangTin' label='Vật mang tin' rules={[...rules.required]}>
									<SelectVatMangTin selectMa />
								</Form.Item>
							</Col>
							<Col xs={24} md={12}>
								<Form.Item name='mauBienMucId' label='Mẫu biên mục' rules={[...rules.required]}>
									<SelectMauBienMuc />
								</Form.Item>
							</Col>
							<Col xs={24} md={12}>
								<Form.Item name='doMat' label='Độ mật' rules={[...rules.required]}>
									<Select placeholder='Chọn độ mật' style={{ width: '100%' }}>
										{Array.from({ length: 11 }, (_, i) => (
											<Select.Option key={i} value={i}>
												{i}
											</Select.Option>
										))}
									</Select>
								</Form.Item>
							</Col>
							<Col xs={24} md={12}>
								<Form.Item name='maNgonNgu' label='Mã ngôn ngữ [041$a]' rules={[...rules.required]}>
									<SelectNgonNgu selectMa />
								</Form.Item>
							</Col>
						</Row>
					</Card>
				</Col>

				{/* Phần thông tin xuất bản */}
				<Col span={24}>
					<Card title='Thông tin xuất bản' size='small'>
						<Row gutter={[16, 8]}>
							<Col xs={24} md={12}>
								<Form.Item name='ISBN' label='ISBN [020$a]'>
									<Input placeholder='Nhập ISBN' />
								</Form.Item>
							</Col>
							<Col xs={24} md={12}>
								<Form.Item name='ISSN' label='ISSN [022$a]'>
									<Input placeholder='Nhập ISSN' />
								</Form.Item>
							</Col>
							<Col xs={24}>
								<Form.Item name='tacGia' label='Tác giả [100$a]' rules={[...rules.required]}>
									<Input placeholder='Nhập tác giả' />
								</Form.Item>
							</Col>
							<Col xs={24}>
								<Form.Item name='nhanDe' label='Nhan đề chính [245$a]' rules={[...rules.required]}>
									<Input placeholder='Nhập nhan đề chính' />
								</Form.Item>
							</Col>
							<Col xs={24} md={12}>
								<Form.Item name='soThuTuCuaTap' label='Số thứ tự của tập [245$n]'>
									<Input placeholder='Nhập số thứ tự của tập' />
								</Form.Item>
							</Col>
							<Col xs={24} md={12}>
								<Form.Item name='tenTap' label='Tên tập [245$p]'>
									<Input placeholder='Nhập tên tập' />
								</Form.Item>
							</Col>
							<Col xs={24}>
								<Form.Item name='phuDe' label='Phụ đề [245$b]'>
									<Input placeholder='Nhập phụ đề' />
								</Form.Item>
							</Col>
							<Col xs={24}>
								<Form.Item name='thongTinTrachNhiem' label='Thông tin trách nhiệm [245$c]'>
									<Input placeholder='Nhập thông tin trách nhiệm' />
								</Form.Item>
							</Col>
							<Col xs={24} md={8}>
								<Form.Item name='lanXuatBan' label='Lần xuất bản [250$a]'>
									<Input placeholder='Nhập lần xuất bản' />
								</Form.Item>
							</Col>
							<Col xs={24} md={8}>
								<Form.Item name='noiXuatBan' label='Nơi xuất bản [260$a]'>
									<Input placeholder='Nhập nơi xuất bản' />
								</Form.Item>
							</Col>
							<Col xs={24} md={8}>
								<Form.Item name='namXuatBan' label='Năm xuất bản [260$c]'>
									<InputNumber style={{ width: '100%' }} placeholder='Nhập năm xuất bản' />
								</Form.Item>
							</Col>
							<Col xs={24}>
								<Form.Item name='nhaXuatBan' label='Nhà xuất bản [260$b]'>
									<Input placeholder='Nhập nhà xuất bản' />
								</Form.Item>
							</Col>
						</Row>
					</Card>
				</Col>

				{/* Phần mô tả vật lý */}
				<Col span={24}>
					<Card title='Mô tả vật lý' size='small'>
						<Row gutter={[16, 8]}>
							<Col xs={24} md={12}>
								<Form.Item name='soTrang' label='Số trang [300$a]'>
									<Input placeholder='Nhập số trang' />
								</Form.Item>
							</Col>
							<Col xs={24} md={12}>
								<Form.Item name='dacDiemVatLy' label='Đặc điểm vật lý [300$b]'>
									<Input placeholder='Nhập đặc điểm vật lý' />
								</Form.Item>
							</Col>
							<Col xs={24} md={12}>
								<Form.Item name='khuonKho' label='Khuôn khổ [300$c]'>
									<Input placeholder='Nhập khuôn khổ' />
								</Form.Item>
							</Col>
							<Col xs={24} md={12}>
								<Form.Item name='tuLieuDiKem' label='Tư liệu đi kèm [300$e]'>
									<Input placeholder='Nhập tư liệu đi kèm' />
								</Form.Item>
							</Col>
						</Row>
					</Card>
				</Col>

				{/* Phần tùy chọn */}
				<Col span={24}>
					<Card title='Tùy chọn' size='small'>
						<Row gutter={[16, 8]}>
							<Col xs={24} md={12}>
								<Form.Item name='online' valuePropName='checked' initialValue={false}>
									<Checkbox>Ấn phẩm số</Checkbox>
								</Form.Item>
							</Col>
							<Col xs={24} md={12}>
								<Form.Item name='isSachHay' valuePropName='checked' initialValue={false}>
									<Checkbox>Sách hay</Checkbox>
								</Form.Item>
							</Col>
						</Row>
					</Card>
				</Col>

				{/* Phần ấn phẩm số (hiển thị khi chọn) */}
				{online && (
					<Col span={24}>
						<Card title='Ấn phẩm số' size='small'>
							<Form.Item
								name='thongTinAnPhamTrucTuyen'
								label='Danh sách tài liệu ấn phẩm số'
								rules={[...rules.required]}
							>
								<FormItemTaiLieuSo />
							</Form.Item>
						</Card>
					</Col>
				)}

				{/* Phần sách hay (hiển thị khi chọn) */}
				{isSachHay && (
					<Col span={24}>
						<Card title='Sách hay' size='small'>
							<Row gutter={[16, 16]}>
								<Col xs={24} md={6}>
									<Form.Item name='urlScanBia' label=''>
										<UploadFile isPortraitAvatar buttonDescription='Thêm ảnh bìa' />
									</Form.Item>
								</Col>
								<Col xs={24} md={18}>
									<Form.Item name='moTa' label='Nội dung sách hay' rules={[...rules.text]}>
										<TinyEditor height={300} hideMenubar miniToolbar />
									</Form.Item>
								</Col>
							</Row>
						</Card>
					</Col>
				)}

				{/* Phần nút submit */}
				<Col span={24}>
					<div className='form-footer' style={{ textAlign: 'right' }}>
						<Button loading={formSubmiting} htmlType='submit' type='primary' style={{ marginRight: 8 }}>
							{!edit ? 'Biên mục' : `${intl.formatMessage({ id: 'global.button.luulai' })}`}
						</Button>
						<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
					</div>
				</Col>
			</Row>
		</Form>
	);
};

export default FormBienMucSachTaiLieu;
