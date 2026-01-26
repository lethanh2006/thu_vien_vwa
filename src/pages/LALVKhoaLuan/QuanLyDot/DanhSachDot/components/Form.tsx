import MyDatePicker from '@/components/MyDatePicker';
import SelectNganhCoSo from '@/pages/DaoTao/Nganh/Select';
import SelectSinhVienDebounce from '@/pages/SinhVien/component/Select';
import { ETrangThaiNopThuVien } from '@/services/QuanLyThuVien/constants';
import type { QuanLyThuVien } from '@/services/QuanLyThuVien/typing';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormDanhSachNop = (props: any) => {
	const { title, getData } = props;
	const [form] = Form.useForm();
	const intl = useIntl();
	const { record: recDot } = useModel('quanlythuvien.quanlydot');
	const { record, edit, formSubmiting, visibleForm, setVisibleForm, putModel, postModel } =
		useModel('quanlythuvien.danhsachdot');
	const { danhSach: danhSachSinhVien } = useModel('sinhvien.sinhvien');

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id)
			form.setFieldsValue({
				...record,
				ngaySinh: record?.sinhVien?.ngaySinh,
				soDienThoai: record?.sinhVien?.soDienThoai,
			});
	}, [record?._id, visibleForm]);

	const onChangeSinhVien = (maSV: string) => {
		const ns = danhSachSinhVien.find((item) => item?.ma === maSV);
		form.setFieldsValue({
			ssoId: ns?.ssoId,
			hoTenTacGia: ns?.ten,
			ngaySinh: ns?.ngaySinh,
			soDienThoai: ns?.soDienThoai,
			chucDanh: '',
			noiCongTac: '',
			hocVi: ns?.trinhDoDaoTao?.ten,
			maNganh: ns?.maNganh,
		});
	};

	const onFinish = async (values: QuanLyThuVien.IQuanLyDanhSachNop) => {
		if (edit) {
			putModel(record?._id ?? '', values, getData)
				.then()
				.catch((er) => console.log(er));
		} else
			postModel(
				{
					...values,
					idDot: recDot?._id,
					loai: recDot?.loai,
					trangThai: ETrangThaiNopThuVien.CHO_XY_LY,
				},
				getData,
			)
				.then()
				.catch((er) => console.log(er));
	};

	return (
		<Card
			title={`${edit ? intl.formatMessage({ id: 'global.button.chinhsua' }) : intl.formatMessage({ id: 'global.button.themmoi' })} ${title?.toLowerCase()}`}
		>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col span={24}>
						<Form.Item
							label={intl.formatMessage({ id: 'luananluanvankhoaluan.label.tenKhoaLuan' })}
							name='tenDeTai'
							rules={[...rules.required, ...rules.text]}
						>
							<Input.TextArea
								rows={3}
								placeholder={intl.formatMessage({ id: 'luananluanvankhoaluan.label.nhapTenKhoaLuan' })}
							/>
						</Form.Item>
					</Col>
					<Col span={24} md={8}>
						<Form.Item
							label={intl.formatMessage({ id: 'luananluanvankhoaluan.label.nguoiHuongDan' })}
							name='nguoiHuongDan'
							rules={[...rules.required, ...rules.text, ...rules.length(200)]}
						>
							<Input placeholder={intl.formatMessage({ id: 'luananluanvankhoaluan.label.nhapNguoiHuongDan' })} />
						</Form.Item>
					</Col>
					<Col span={24} md={8}>
						<Form.Item
							label={intl.formatMessage({ id: 'luananluanvankhoaluan.label.sinhVien' })}
							name='maSinhVien'
							rules={[...rules.required]}
						>
							<SelectSinhVienDebounce selectMa onChange={(val) => onChangeSinhVien(val as string)} />
						</Form.Item>
					</Col>
					<Col span={8}>
						<Form.Item name='ssoId' hidden />
						<Form.Item label={intl.formatMessage({ id: 'luananluanvankhoaluan.label.hoVaTen' })} name='hoTenTacGia'>
							<Input placeholder={intl.formatMessage({ id: 'luananluanvankhoaluan.label.nhapHoVaTen' })} disabled />
						</Form.Item>
					</Col>
					<Col span={8}>
						<Form.Item label={intl.formatMessage({ id: 'luananluanvankhoaluan.label.ngaySinh' })} name='ngaySinh'>
							<MyDatePicker disabled />
						</Form.Item>
					</Col>
					<Col span={8}>
						<Form.Item label={intl.formatMessage({ id: 'luananluanvankhoaluan.label.soDienThoai' })} name='soDienThoai'>
							<Input placeholder={intl.formatMessage({ id: 'luananluanvankhoaluan.label.nhapSoDienThoai' })} disabled />
						</Form.Item>
					</Col>
					<Col span={8}>
						<Form.Item label={intl.formatMessage({ id: 'luananluanvankhoaluan.label.chucDanh' })} name='chucDanh'>
							<Input placeholder={intl.formatMessage({ id: 'luananluanvankhoaluan.label.nhapChucDanh' })} disabled />
						</Form.Item>
					</Col>
					<Col span={8}>
						<Form.Item label={intl.formatMessage({ id: 'luananluanvankhoaluan.label.noiCongTac' })} name='noiCongTac'>
							<Input placeholder={intl.formatMessage({ id: 'luananluanvankhoaluan.label.nhapNoiCongTac' })} disabled />
						</Form.Item>
					</Col>
					<Col span={8}>
						<Form.Item label={intl.formatMessage({ id: 'luananluanvankhoaluan.label.hocVi' })} name='hocVi'>
							<Input placeholder={intl.formatMessage({ id: 'luananluanvankhoaluan.label.nhapHocVi' })} disabled />
						</Form.Item>
					</Col>
					<Col span={8}>
						<Form.Item label={intl.formatMessage({ id: 'luananluanvankhoaluan.label.chuyenNganh' })} name='maNganh'>
							<SelectNganhCoSo selectMa disabled />
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

export default FormDanhSachNop;
