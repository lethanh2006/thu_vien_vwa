import MyDatePicker from '@/components/MyDatePicker';
import UploadFile from '@/components/Upload/UploadFile';
import SelectNganhCoSo from '@/pages/DaoTao/Nganh/Select';
import SelectSinhVienDebounce from '@/pages/SinhVien/component/Select';
import { ELoaiDotQuanLyThuvien, ETrangThaiNopThuVien } from '@/services/QuanLyThuVien/constants';
import type { QuanLyThuVien } from '@/services/QuanLyThuVien/typing';
import { EFileScope, uploadFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Row, Select } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import SelectDotThuVien from '../../QuanLyDot/components/Select';

const FormQuanLyThuVien = (props: any) => {
	const { title, loai, getData } = props;
	const [form] = Form.useForm();
	const intl = useIntl();
	const { record: recDot } = useModel('quanlythuvien.quanlydot');
	const { edit, record, formSubmiting, visibleForm, setVisibleForm, putModel, postModel, setFormSubmiting } =
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
		const urlTaiLieu = values.urlTaiLieu?.fileList?.[0];
		if (urlTaiLieu?.originFileObj) {
			try {
				setFormSubmiting(true);
				const res = await uploadFile({
					file: urlTaiLieu.originFileObj,
					scope: EFileScope.PUBLIC,
				});
				values.urlTaiLieu = res?.data?.data?.url;
				values.idTaiLieu = res?.data?.data?.file?._id;
			} catch (error) {
				return Promise.reject(error);
			} finally {
				setFormSubmiting(false);
			}
		} else {
			values.urlTaiLieu = urlTaiLieu?.url;
		}

		const urlTomTat = values.urlTomTat?.fileList?.[0];
		if (urlTomTat?.originFileObj) {
			try {
				setFormSubmiting(true);
				const res = await uploadFile({
					file: urlTomTat.originFileObj,
					scope: EFileScope.PUBLIC,
				});
				values.urlTomTat = res?.data?.data?.url;
				values.idTomTat = res?.data?.data?.file?._id;
			} catch (error) {
				return Promise.reject(error);
			} finally {
				setFormSubmiting(false);
			}
		} else {
			values.urlTomTat = urlTomTat?.url;
		}

		const urlTaiLieuMinhChung = values.urlTaiLieuMinhChung?.fileList?.[0];
		if (urlTaiLieuMinhChung?.originFileObj) {
			try {
				setFormSubmiting(true);
				const res = await uploadFile({
					file: urlTaiLieuMinhChung.originFileObj,
					scope: EFileScope.PUBLIC,
				});
				values.urlTaiLieuMinhChung = res?.data?.data?.url;
				values.idTaiLieuMinhChung = res?.data?.data?.file?._id;
			} catch (error) {
				return Promise.reject(error);
			} finally {
				setFormSubmiting(false);
			}
		} else {
			values.urlTaiLieuMinhChung = urlTaiLieuMinhChung?.url;
		}

		const data = {
			...values,
			loai,
			urlTaiLieu,
			urlTomTat,
			urlTaiLieuMinhChung,
		};
		if (edit) {
			putModel(record?._id ?? '', data as any, getData)
				.then()
				.catch((er) => console.log(er));
		} else
			postModel(data as any, getData)
				.then()
				.catch((er) => console.log(er));
	};

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title?.toLowerCase()}`}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={16}>
					{loai !== ELoaiDotQuanLyThuvien.LUAN_AN && (
						<Col span={24}>
							<Form.Item label='Đợt' name='idDot' initialValue={recDot?._id} rules={[...rules.required]}>
								<SelectDotThuVien disabled />
							</Form.Item>
						</Col>
					)}
					<Col span={24}>
						<Form.Item label='Tên đề tài' name='tenDeTai' rules={[...rules.required, ...rules.text]}>
							<Input.TextArea placeholder='Tên đề tài' style={{ width: '100%' }} disabled={edit} />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item
							label='Người hướng dẫn'
							name='nguoiHuongDan'
							rules={[...rules.required, ...rules.text, ...rules.length(200)]}
						>
							<Input placeholder='Nhập họ tên người hướng dẫn' style={{ width: '100%' }} />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item label='Thời gian nộp' name='thoiGianNop' rules={[...rules.required]}>
							<MyDatePicker disabled={edit} />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item label='Mã học viên' name='maSinhVien' rules={[...rules.required]}>
							<SelectSinhVienDebounce selectMa onChange={(val) => onChangeSinhVien(val as string)} disabled={edit} />
						</Form.Item>
					</Col>
					<Col span={12}>
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
								options={Object.values(ETrangThaiNopThuVien)?.map((item) => ({
									value: item,
									label: item,
								}))}
							/>
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item
							rules={[...rules.required, ...rules.fileRequired]}
							name='urlTaiLieu'
							label='Tài liệu toàn bộ đề tài (docx)'
						>
							<UploadFile
								otherProps={{
									maxCount: 1,
									accept: '.docx',
									multiple: false,
									showUploadList: { showDownloadIcon: false },
								}}
							/>
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item
							rules={[...rules.required, ...rules.fileRequired]}
							name='urlTomTat'
							label='Tài liệu tóm tắt đề tài (docx)'
						>
							<UploadFile
								otherProps={{
									maxCount: 1,
									accept: '.docx',
									multiple: false,
									showUploadList: { showDownloadIcon: false },
								}}
							/>
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item
							rules={[...rules.required, ...rules.fileRequired]}
							name='urlTaiLieuMinhChung'
							label='Tài liệu minh chứng đề tài (pdf)'
						>
							<UploadFile
								otherProps={{
									maxCount: 1,
									accept: '.pdf',
									multiple: false,
									showUploadList: { showDownloadIcon: false },
								}}
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

export default FormQuanLyThuVien;
