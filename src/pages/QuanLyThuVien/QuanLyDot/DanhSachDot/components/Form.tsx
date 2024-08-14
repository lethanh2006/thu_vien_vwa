import MyDatePicker from '@/components/MyDatePicker';
import SelectNganhCoSo from '@/pages/DaoTao/Nganh/Select';
import SelectSinhVienDebounce from '@/pages/SinhVien/component/Select';
import { ETrangThaiNopThuVien } from '@/services/QuanLyThuVien/constants';
import type { QuanLyThuVien } from '@/services/QuanLyThuVien/typing';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Row, Select } from 'antd';
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
				},
				getData,
			)
				.then()
				.catch((er) => console.log(er));
	};

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title?.toLowerCase()}`}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col span={24}>
						<Form.Item label='Tên Khoá luận/Đồ án' name='tenDeTai' rules={[...rules.required, ...rules.text]}>
							<Input.TextArea rows={3} placeholder='Nhập tên khóa luận, đồ án' />
						</Form.Item>
					</Col>
					<Col span={24} md={8}>
						<Form.Item
							label='Người hướng dẫn'
							name='nguoiHuongDan'
							rules={[...rules.required, ...rules.text, ...rules.length(200)]}
						>
							<Input placeholder='Nhập người hướng dẫn' />
						</Form.Item>
					</Col>
					<Col span={24} md={8}>
						<Form.Item label='Học viên' name='maSinhVien' rules={[...rules.required]}>
							<SelectSinhVienDebounce keyValue='ma' onChange={(val) => onChangeSinhVien(val as string)} />
						</Form.Item>
					</Col>
					<Col span={8}>
						<Form.Item name='ssoId' hidden />
						<Form.Item label='Họ và tên' name='hoTenTacGia'>
							<Input placeholder='Nhập họ và tên' disabled />
						</Form.Item>
					</Col>
					<Col span={8}>
						<Form.Item label='Ngày sinh' name='ngaySinh'>
							<MyDatePicker disabled />
						</Form.Item>
					</Col>
					<Col span={8}>
						<Form.Item label='Số điện thoại' name='soDienThoai'>
							<Input placeholder='Nhập số điện thoại' disabled />
						</Form.Item>
					</Col>
					<Col span={8}>
						<Form.Item label='Chức danh' name='chucDanh'>
							<Input placeholder='Nhập chức danh' disabled />
						</Form.Item>
					</Col>
					<Col span={8}>
						<Form.Item label='Nơi công tác' name='noiCongTac'>
							<Input placeholder='Nhập nơi công tác' disabled />
						</Form.Item>
					</Col>
					<Col span={8}>
						<Form.Item label='Học vị' name='hocVi'>
							<Input placeholder='Nhập học vị' disabled />
						</Form.Item>
					</Col>
					<Col span={8}>
						<Form.Item label='Chuyên ngành' name='maNganh'>
							<SelectNganhCoSo selectMa disabled />
						</Form.Item>
					</Col>
					<Col span={8}>
						<Form.Item label='Trạng thái' name='trangThai' rules={[...rules.required]}>
							<Select
								placeholder='Chọn đồ án'
								options={Object.values([ETrangThaiNopThuVien.CHO_XY_LY, ETrangThaiNopThuVien.DA_DUYET])?.map(
									(item) => ({
										value: item,
										label: item,
									}),
								)}
							/>
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
