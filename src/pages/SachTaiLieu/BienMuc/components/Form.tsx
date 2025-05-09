import ButtonExtend from '@/components/Table/ButtonExtend';
import TinyEditor from '@/components/TinyEditor';
import SelectCapThuMuc from '@/pages/DanhMuc/CapThuMuc/components/Select';
import SelectDangTaiLieu from '@/pages/DanhMuc/DangTaiLieu/components/Select';
import SelectKieuBanGhi from '@/pages/DanhMuc/KieuBanGhi/components/Select';
import SelectMauBienMuc from '@/pages/DanhMuc/MauBienMuc/components/Select';
import SelectVatMangTin from '@/pages/DanhMuc/VatMangTin/components/Select';
import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import { ETrangThaiBienMuc } from '@/services/SachTaiLieu/constant';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Checkbox, Col, Form, Input, InputNumber, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import SelectDotNhapSach from '../../DotNhapSach/components/Select';
import FormItemTaiLieuSo from '../DanhSachTaiLieu/FormItem';
import Z3950Page from '../Z2950';

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
	} = useModel('sachtailieu.anpham.anpham');
	const { getAllModel, danhSach } = useModel('sachtailieu.anpham.thongtinanpham');
	const { record: recDot } = useModel('sachtailieu.anpham.dotnhapsach');
	const { afterAddNew, tabActive } = props;
	const online: boolean = Form.useWatch('online', form);
	const isSachHay: boolean = Form.useWatch('isSachHay', form);
	const [visibleModal, setVisibleModal] = useState<boolean>(false);

	const getData = async (): Promise<AnPham.IRecord[]> => {
		const response = await getModel({
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
		values.namXuatBan = Number(values.namXuatBan);
		values.soTrang = Number(values.soTrang);

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
			<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
				<Col xs={24}>
					<ButtonExtend size='small' type='primary' onClick={() => setVisibleModal(true)}>
						Tải về qua Z39.50
					</ButtonExtend>
				</Col>
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
					<Form.Item name='ISBN' label='ISBN [020$a]'>
						<Input placeholder='Nhập ISBN' />
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item name='ISSN' label='ISSN [022$a]'>
						<Input placeholder='Nhập ISSN' />
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item name='tacGia' label='Tác giả [100$a]' rules={[...rules.required]}>
						<Input placeholder='Nhập tác giả' />
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
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
				<Col xs={24} md={12}>
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
				<Col xs={24} md={12}>
					<Form.Item name='nhaXuatBan' label='Nhà xuất bản [260$b]'>
						<Input placeholder='Nhập nhà xuất bản' />
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item name='soTrang' label='Số trang [300$a]'>
						<InputNumber style={{ width: '100%' }} placeholder='Nhập số trang' />
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
				<Col xs={24}>
					<Row gutter={[12, 0]}>
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
				</Col>

				{online ? (
					<Col xs={24}>
						<Form.Item name='thongTinAnPhamTrucTuyen' label='Danh sách tài liệu ấn phẩm số' rules={[...rules.required]}>
							<FormItemTaiLieuSo />
						</Form.Item>
					</Col>
				) : null}

				{isSachHay ? (
					<Col xs={24}>
						<Form.Item name='moTa' label='Nội dung sách hay' rules={[...rules.text]}>
							<TinyEditor height={300} hideMenubar miniToolbar />
						</Form.Item>
					</Col>
				) : null}
			</Row>

			<div className='form-footer'>
				<Button loading={formSubmiting} htmlType='submit' type='primary'>
					{!edit ? 'Biên mục' : `${intl.formatMessage({ id: 'global.button.luulai' })}`}
				</Button>
				<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
			</div>

			<Z3950Page visible={visibleModal} setVisible={setVisibleModal} form={form} />
		</Form>
	);
};

export default FormBienMucSachTaiLieu;
