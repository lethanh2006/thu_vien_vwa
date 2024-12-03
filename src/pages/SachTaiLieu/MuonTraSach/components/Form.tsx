import MyDatePicker from '@/components/MyDatePicker';
import SelectSinhVienDebounce from '@/pages/SinhVien/component/Select';
import { ETrangThaiDuyeMuonSach, ETrangThaiMuonSach } from '@/services/SachTaiLieu/constant';
import type { MuonSach } from '@/services/SachTaiLieu/MuonSach/typing';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormMuonTraSach = (props: any) => {
	const { getData } = props;
	const intl = useIntl();
	const [form] = Form.useForm();
	const record: any = {};
	const { visibleForm, setVisibleForm, formSubmiting, edit, putModel, postModel, settingMuonTra } =
		useModel('sachtailieu.muontra.muontra');
	const { danhSach: danhSachSinhVien } = useModel('sinhvien.sinhvien');
	const thoiGianMuon: Date = Form.useWatch('thoiGianMuon', form);

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	useEffect(() => {
		form.setFieldsValue({ thoiGianTra: moment(thoiGianMuon).add(settingMuonTra?.thoiHanMuonTraSach, 'day') });
	}, [thoiGianMuon]);

	const onFinish = async (values: MuonSach.IRecord) => {
		values.trangThai = values.trangThai ?? ETrangThaiMuonSach.CHO_XU_LY;
		values.trangThaiDuyet = values.trangThaiDuyet ?? ETrangThaiDuyeMuonSach.CHO_DUYET;

		const sinhVien = danhSachSinhVien?.find((item) => item?.ssoId === values?.ssoIdNguoiMuon);
		values.maDinhDanhNguoiMuon = sinhVien?.ma ?? '';
		values.hotenNguoiMuon = sinhVien?.ten ?? '';

		if (edit) {
			putModel(record?._id ?? '', values, getData)
				.then()
				.catch((er) => console.log(er));
		} else
			postModel(values, getData)
				.then()
				.catch((er) => console.log(er));
	};

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} sinh viên mượn sách`}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					<Col xs={24}>
						<Form.Item name='ssoIdNguoiMuon' label='Sinh viên' rules={[...rules.required]}>
							<SelectSinhVienDebounce />
						</Form.Item>
					</Col>
					<Col xs={24}>
						<Form.Item name='soDangKyCaBiet' label='Đăng ký cá biệt' rules={[...rules.required]}>
							<Input placeholder='Nhập đăng ký cá biệt' />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='thoiGianMuon' label='Thời gian mượn' rules={[...rules.required]}>
							<MyDatePicker format='DD/MM/YYYY HH:mm' showTime={{ minuteStep: 5 }} />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='thoiGianTra' label='Thời gian trả' rules={[...rules.required]}>
							<MyDatePicker format='DD/MM/YYYY HH:mm' showTime={{ minuteStep: 5 }} disabled />
						</Form.Item>
						<div style={{ marginTop: -10 }}>
							<small style={{ color: '#333' }}>
								<i>Thời gian trả sẽ được cộng từ thời gian mượn và {settingMuonTra?.thoiHanMuonTraSach} ngày</i>
							</small>
						</div>
					</Col>
					<Col xs={24}>
						<Form.Item name='ghiChu' label='Ghi chú' rules={[...rules.text]}>
							<Input.TextArea rows={3} placeholder='Nhập ghi chú' />
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
		</Card>
	);
};

export default FormMuonTraSach;
