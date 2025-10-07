import MyDatePicker from '@/components/MyDatePicker';
import SelectSinhVienDebounce from '@/pages/SinhVien/component/Select';
import { ETrangThaiMuonSach } from '@/services/SachTaiLieu/constant';
import type { MuonSach } from '@/services/SachTaiLieu/MuonSach/typing';
import rules from '@/utils/rules';
import { inputFormat, resetFieldsForm } from '@/utils/utils';
import { Button, Card, Checkbox, Col, Descriptions, Form, Input, Row } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormDangKyCaBiet = (props: any) => {
	const { getData: getDataExtenal } = props;
	const intl = useIntl();
	const [form] = Form.useForm();
	const { formSubmiting, edit, putModel, postModel, record, settingMuonTra } = useModel('sachtailieu.muontra.muontra');
	const { danhSach: danhSachSinhVien } = useModel('sinhvien.sinhvien');
	const {
		record: recDKCB,
		thongKeDangKyCaBietModel,
		visibleForm,
		setVisibleForm,
	} = useModel('sachtailieu.anpham.anphamxepgia');

	const getData = () => {
		getDataExtenal();
		thongKeDangKyCaBietModel();
	};

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
		} else if (recDKCB?._id) {
			form.setFieldsValue({
				thoiGianMuon: moment().toISOString(),
				expired: moment()
					.add(settingMuonTra?.thoiHanMuonTraSach || 150, 'days')
					.toISOString(),
			});
		}
	}, [visibleForm, recDKCB?._id]);

	const onFinish = async (values: MuonSach.IRecord) => {
		values.trangThai = ETrangThaiMuonSach.DANG_THUE_MUON;
		// values.trangThaiDuyet = ETrangThaiDuyetMuonSach.DA_DUYET;

		// const sinhVien = danhSachSinhVien?.find((item) => item?.ssoId === values?.ssoIdNguoiMuon);
		// values.maDinhDanhNguoiMuon = sinhVien?.ma ?? '';
		// values.hotenNguoiMuon = sinhVien?.ten ?? '';
		// values.thoiGianDangKy = moment().toISOString();

		values.anPhamId = recDKCB?.anPhamId ?? '';
		values.soDangKyCaBiet = recDKCB?.soDangKyCaBiet ?? '';

		if (edit) {
			putModel(record?._id ?? '', values, getData)
				.then(() => setVisibleForm(false))
				.catch((er) => console.log(er));
		} else
			postModel(values, getData)
				.then(() => setVisibleForm(false))
				.catch((er) => console.log(er));
	};

	return (
		<Card title='Thêm mới sinh viên mượn sách'>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginTop: 12 }}>
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

					<Col xs={24} md={12}>
						<Form.Item name='ssoIdNguoiMuon' label='Sinh viên' rules={[...rules.required]}>
							<SelectSinhVienDebounce />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='thoiGianMuon' label='Thời gian mượn' rules={[...rules.required]}>
							<MyDatePicker />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='expired' label='Hạn trả' rules={[...rules.required]}>
							<MyDatePicker />
						</Form.Item>
					</Col>
					<Col xs={24}>
						<Form.Item name='ghiChu' label='Ghi chú' rules={[...rules.text]}>
							<Input placeholder='Nhập ghi chú' />
						</Form.Item>
					</Col>
					<Col xs={24}>
						<Form.Item name='daLaySach' valuePropName='checked' initialValue={true}>
							<Checkbox>Sinh viên đã lấy sách</Checkbox>
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{intl.formatMessage({ id: 'global.button.themmoi' })}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormDangKyCaBiet;
