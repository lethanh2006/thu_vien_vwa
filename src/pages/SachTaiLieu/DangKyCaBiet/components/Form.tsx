import MyDatePicker from '@/components/MyDatePicker';
import SelectSinhVienDebounce from '@/pages/SinhVien/component/Select';
import { ETrangThaiMuonSach } from '@/services/SachTaiLieu/constant';
import type { MuonSach } from '@/services/SachTaiLieu/MuonSach/typing';
import dayjs from '@/utils/dayjs';
import rules from '@/utils/rules';
import { inputFormat, resetFieldsForm } from '@/utils/utils';
import { Button, Card, Checkbox, Col, Descriptions, Form, Input, Row } from 'antd';
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
				thoiGianMuon: dayjs().toISOString(),
				expired: dayjs()
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
		// values.thoiGianDangKy = dayjs().toISOString();

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
		<Card title={intl.formatMessage({ id: 'sachtailieu.dkcb.themMoiSinhVien' })}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginTop: 12 }}>
					<Col span={24}>
						<Descriptions column={1}>
							<Descriptions.Item label={intl.formatMessage({ id: 'sachtailieu.anpham.nhanDe' })}>
								{recDKCB?.anPham?.nhanDeConverse ?? '--'}
							</Descriptions.Item>
							<Descriptions.Item label={intl.formatMessage({ id: 'sachtailieu.anpham.tacGia' })}>
								{recDKCB?.anPham?.tacGiaConverse ?? '--'}
							</Descriptions.Item>
							<Descriptions.Item label={intl.formatMessage({ id: 'sachtailieu.anpham.dangKyCaBiet' })}>
								{recDKCB?.soDangKyCaBiet ?? '--'}
							</Descriptions.Item>
							<Descriptions.Item label={intl.formatMessage({ id: 'sachtailieu.anpham.donGia' })}>{`${inputFormat(
								recDKCB?.thongTinXepGia?.donGia ?? 0,
							)} VNĐ`}</Descriptions.Item>
						</Descriptions>
					</Col>

					<Col xs={24} md={12}>
						<Form.Item
							name='ssoIdNguoiMuon'
							label={intl.formatMessage({ id: 'sachtailieu.dkcb.sinhVien' })}
							rules={[...rules.required]}
						>
							<SelectSinhVienDebounce />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item
							name='thoiGianMuon'
							label={intl.formatMessage({ id: 'sachtailieu.dkcb.thoiGianMuon' })}
							rules={[...rules.required]}
						>
							<MyDatePicker />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item
							name='expired'
							label={intl.formatMessage({ id: 'sachtailieu.dkcb.hanTra' })}
							rules={[...rules.required]}
						>
							<MyDatePicker />
						</Form.Item>
					</Col>
					<Col xs={24}>
						<Form.Item
							name='ghiChu'
							label={intl.formatMessage({ id: 'sachtailieu.dkcb.ghiChu' })}
							rules={[...rules.text]}
						>
							<Input placeholder={intl.formatMessage({ id: 'sachtailieu.dkcb.nhapGhiChu' })} />
						</Form.Item>
					</Col>
					<Col xs={24}>
						<Form.Item name='daLaySach' valuePropName='checked' initialValue={true}>
							<Checkbox>{intl.formatMessage({ id: 'sachtailieu.dkcb.sinhVienDaLaySach' })}</Checkbox>
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
