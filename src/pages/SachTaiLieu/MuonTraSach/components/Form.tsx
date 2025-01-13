import MyDatePicker from '@/components/MyDatePicker';
import { EOperatorType } from '@/components/Table/constant';
import SelectSinhVienDebounce from '@/pages/SinhVien/component/Select';
import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import { ETrangThaiDuyeMuonSach, ETrangThaiMuonSach } from '@/services/SachTaiLieu/constant';
import type { MuonSach } from '@/services/SachTaiLieu/MuonSach/typing';
import rules from '@/utils/rules';
import { inputFormat, resetFieldsForm } from '@/utils/utils';
import { Button, Card, Checkbox, Col, Descriptions, Form, Input, message, Row } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import ModalTimKiem from './ModalTimKiem';

const FormMuonTraSach = (props: any) => {
	const { getData: getDataEx, setTrangThai } = props;
	const intl = useIntl();
	const [form] = Form.useForm();
	const {
		visibleForm,
		setVisibleForm,
		formSubmiting,
		edit,
		putModel,
		postModel,
		record,
		settingMuonTra,
		thongKeMuonTraSachModel,
	} = useModel('sachtailieu.muontra.muontra');
	const { danhSach: danhSachSinhVien } = useModel('sinhvien.sinhvien');
	const { getModel, loading, setDanhSach, setRecord } = useModel('sachtailieu.anpham.thongtinanpham');
	const { record: recDKCB, setRecord: setRecDKCB } = useModel('sachtailieu.anpham.anphamxepgia');
	const [visibleTimKiem, setVisibleTimKiem] = useState<boolean>(false);
	const nhanDeConverse: string = Form.useWatch('nhanDeConverse', form);
	const tacGiaConverse: string = Form.useWatch('tacGiaConverse', form);
	const dangKyCaBiet: string = Form.useWatch('dangKyCaBiet', form);
	const thoiGianMuon: Date = Form.useWatch('thoiGianMuon', form);
	const expired: Date = Form.useWatch('expired', form);

	const getData = () => {
		thongKeMuonTraSachModel();
		getDataEx();
	};

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
			setRecDKCB({} as AnPham.IAnPhamXepGia);
		} else if (record?._id) form.setFieldsValue(record);
		else {
			form.setFieldsValue({
				thoiGianMuon: moment().toISOString(),
				expired: moment()
					.add(settingMuonTra?.thoiHanMuonTraSach || 150, 'days')
					.toISOString(),
			});
		}

		setDanhSach([]);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: MuonSach.IRecord) => {
		delete values.nhanDeConverse;
		delete values.tacGiaConverse;
		delete values.dangKyCaBiet;

		if (!recDKCB?._id && !edit) {
			message.error('Vui lòng chọn thông tin ấn phẩm cho mượn!');
			return;
		}

		values.trangThai = values.trangThai ?? ETrangThaiMuonSach.DANG_THUE_MUON;
		values.trangThaiDuyet = values.trangThaiDuyet ?? ETrangThaiDuyeMuonSach.DA_DUYET;

		const sinhVien = danhSachSinhVien?.find((item) => item?.ssoId === values?.ssoIdNguoiMuon);
		values.maDinhDanhNguoiMuon = sinhVien?.ma ?? '';
		values.hotenNguoiMuon = sinhVien?.ten ?? '';
		values.thoiGianDangKy = moment().toISOString();

		values.anPhamId = recDKCB?.anPhamId ?? '';
		values.soDangKyCaBiet = recDKCB?.soDangKyCaBiet ?? '';

		if (edit) {
			putModel(record?._id ?? '', values, getData)
				.then()
				.catch((er) => console.log(er));
		} else
			postModel(values, getData)
				.then(() => setTrangThai(ETrangThaiMuonSach.DANG_THUE_MUON))
				.catch((er) => console.log(er));
	};

	const getDataExternal = () => {
		const conditions = [
			{ field: 'nhanDeConverse', value: nhanDeConverse },
			{ field: 'tacGiaConverse', value: tacGiaConverse },
			{ field: 'dangKyCaBiet', value: dangKyCaBiet },
		];

		const searchParams = conditions
			.filter((condition) => condition.value)
			.map((condition) => ({
				active: true,
				field: condition.field,
				operator: EOperatorType.CONTAIN,
				values: [condition.value],
			}));

		getModel(undefined, searchParams as any, undefined, undefined, undefined, 'an-pham/kha-dung', {
			thoiGianBatDau: thoiGianMuon,
			thoiGianKetThuc: expired,
		})
			.then((res: any) => setRecord(res?.[0]))
			.catch((err) => console.error('Error:', err));
	};

	const handleTimKiem = () => {
		if (!nhanDeConverse && !tacGiaConverse && !dangKyCaBiet) {
			message.error('Vui lòng điền ít nhất 1 thông tin!');
			return;
		}
		setVisibleTimKiem(true);
		getDataExternal();
	};

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} sinh viên mượn sách`}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				{!edit ? (
					<>
						<Row gutter={[12, 0]}>
							<Col span={24}>
								<div className='fw500'>Tìm kiếm thông tin ấn phẩm ấn phẩm</div>
							</Col>
							<Col span={24} md={8}>
								<Form.Item name='nhanDeConverse' label='Nhan đề'>
									<Input placeholder='Nhập đăng ký cá biệt' allowClear />
								</Form.Item>
							</Col>
							<Col span={24} md={8}>
								<Form.Item name='tacGiaConverse' label='Tác giả'>
									<Input placeholder='Nhập đăng ký cá biệt' allowClear />
								</Form.Item>
							</Col>
							<Col span={24} md={8}>
								<Form.Item name='dangKyCaBiet' label='Đăng ký cá biệt'>
									<Input placeholder='Nhập đăng ký cá biệt' allowClear />
								</Form.Item>
							</Col>
						</Row>

						<div className='form-footer'>
							<Button loading={loading} onClick={handleTimKiem}>
								Tìm kiếm
							</Button>
						</div>
					</>
				) : (
					<Descriptions column={1}>
						<Descriptions.Item label='Nhan đề'>{record?.anPham?.nhanDeConverse ?? '--'}</Descriptions.Item>
						<Descriptions.Item label='Tác giả'>{record?.anPham?.tacGiaConverse ?? '--'}</Descriptions.Item>
					</Descriptions>
				)}

				<Row gutter={[12, 0]} style={{ marginTop: 12 }}>
					{recDKCB?._id && (
						<Col span={24}>
							<Descriptions column={1}>
								<Descriptions.Item label='Nhan đề'>{recDKCB?.anPham?.nhanDeConverse ?? '--'}</Descriptions.Item>
								<Descriptions.Item label='Tác giả'>{recDKCB?.anPham?.tacGiaConverse ?? '--'}</Descriptions.Item>
								<Descriptions.Item label='Đăng ký cá biệt'>{recDKCB?.soDangKyCaBiet ?? '--'}</Descriptions.Item>
								<Descriptions.Item label='Đơn giá'>{`${inputFormat(
									recDKCB?.thongTinXepGia?.donGia ?? 0,
								)} VNĐ`}</Descriptions.Item>
							</Descriptions>
						</Col>
					)}
					<Col xs={24} md={12}>
						<Form.Item name='ssoIdNguoiMuon' label='Sinh viên' rules={[...rules.required]}>
							<SelectSinhVienDebounce />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='thoiGianMuon' label='Thời gian mượn' rules={[...rules.required]}>
							<MyDatePicker format='DD/MM/YYYY HH:mm' showTime={{ minuteStep: 5 }} />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='expired' label='Hạn trả' rules={[...rules.required]}>
							<MyDatePicker format='DD/MM/YYYY HH:mm' showTime={{ minuteStep: 5 }} />
						</Form.Item>
					</Col>
					<Col xs={24}>
						<Form.Item name='ghiChu' label='Ghi chú' rules={[...rules.text]}>
							<Input placeholder='Nhập ghi chú' />
						</Form.Item>
					</Col>
					<Col xs={24}>
						<Form.Item name='daLaySach' valuePropName='checked' initialValue={false}>
							<Checkbox>Sinh viên đã lấy sách</Checkbox>
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{!edit
							? `${intl.formatMessage({ id: 'global.button.themmoi' })}`
							: `${intl.formatMessage({ id: 'global.button.luulai' })}`}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>

			<ModalTimKiem visibleForm={visibleTimKiem} setVisibleForm={setVisibleTimKiem} getData={getDataExternal} />
		</Card>
	);
};

export default FormMuonTraSach;
