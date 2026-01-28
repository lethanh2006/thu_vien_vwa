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
		const filesToUpload: {
			field: keyof QuanLyThuVien.IQuanLyDanhSachNop;
			idField: keyof QuanLyThuVien.IQuanLyDanhSachNop;
		}[] = [
			{ field: 'urlTaiLieu', idField: 'idTaiLieu' },
			{ field: 'urlTomTat', idField: 'idTomTat' },
			{ field: 'urlTaiLieuMinhChung', idField: 'idTaiLieuMinhChung' },
		];

		try {
			setFormSubmiting(true);

			// Tạo danh sách các promise tải file
			const uploadPromises = filesToUpload.map(async ({ field, idField }) => {
				const fileData = values[field]?.fileList?.[0];
				if (fileData?.originFileObj) {
					const res = await uploadFile({
						file: fileData.originFileObj,
						scope: EFileScope.PUBLIC,
					});
					values[field] = res?.data?.data?.url;
					values[idField] = res?.data?.data?.file?._id;
				} else {
					values[field] = fileData?.url;
				}
			});

			await Promise.allSettled(uploadPromises);

			const data = {
				...values,
				loai,
			};

			if (edit) {
				await putModel(record?._id ?? '', data as any, getData);
			} else {
				await postModel(data as any, getData);
			}
		} catch (error) {
			console.log(error);
			return Promise.reject(error);
		} finally {
			setFormSubmiting(false);
		}
	};

	return (
		<Card
			title={`${edit ? intl.formatMessage({ id: 'global.button.chinhsua' }) : intl.formatMessage({ id: 'global.button.themmoi' })} ${title?.toLowerCase()}`}
		>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={16}>
					{loai !== ELoaiDotQuanLyThuvien.LUAN_AN && (
						<Col span={24}>
							<Form.Item
								label={intl.formatMessage({ id: 'luananluanvankhoaluan.label.dot' })}
								name='idDot'
								initialValue={recDot?._id}
								rules={[...rules.required]}
							>
								<SelectDotThuVien disabled />
							</Form.Item>
						</Col>
					)}
					<Col span={24}>
						<Form.Item
							label={intl.formatMessage({ id: 'luananluanvankhoaluan.label.tenDeTai' })}
							name='tenDeTai'
							rules={[...rules.required, ...rules.text]}
						>
							<Input.TextArea
								placeholder={intl.formatMessage({ id: 'luananluanvankhoaluan.label.tenDeTai' })}
								style={{ width: '100%' }}
								disabled={edit}
							/>
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item
							label={intl.formatMessage({ id: 'luananluanvankhoaluan.label.nguoiHuongDan' })}
							name='nguoiHuongDan'
							rules={[...rules.required, ...rules.text, ...rules.length(200)]}
						>
							<Input
								placeholder={intl.formatMessage({ id: 'luananluanvankhoaluan.label.nguoiHuongDan' })}
								style={{ width: '100%' }}
							/>
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item
							label={intl.formatMessage({ id: 'luananluanvankhoaluan.label.thoiGianNop' })}
							name='thoiGianNop'
							rules={[...rules.required]}
						>
							<MyDatePicker disabled={edit} />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item
							label={intl.formatMessage({ id: 'luananluanvankhoaluan.label.maSinhVien' })}
							name='maSinhVien'
							rules={[...rules.required]}
						>
							<SelectSinhVienDebounce selectMa onChange={(val) => onChangeSinhVien(val as string)} disabled={edit} />
						</Form.Item>
					</Col>
					<Col span={12}>
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
							<Input placeholder={intl.formatMessage({ id: 'luananluanvankhoaluan.label.soDienThoai' })} disabled />
						</Form.Item>
					</Col>
					<Col span={8}>
						<Form.Item label={intl.formatMessage({ id: 'luananluanvankhoaluan.label.chucDanh' })} name='chucDanh'>
							<Input placeholder={intl.formatMessage({ id: 'luananluanvankhoaluan.label.chucDanh' })} disabled />
						</Form.Item>
					</Col>
					<Col span={8}>
						<Form.Item label={intl.formatMessage({ id: 'luananluanvankhoaluan.label.noiCongTac' })} name='noiCongTac'>
							<Input placeholder={intl.formatMessage({ id: 'luananluanvankhoaluan.label.noiCongTac' })} disabled />
						</Form.Item>
					</Col>
					<Col span={8}>
						<Form.Item label={intl.formatMessage({ id: 'luananluanvankhoaluan.label.hocVi' })} name='hocVi'>
							<Input placeholder={intl.formatMessage({ id: 'luananluanvankhoaluan.label.hocVi' })} disabled />
						</Form.Item>
					</Col>
					<Col span={8}>
						<Form.Item label={intl.formatMessage({ id: 'luananluanvankhoaluan.label.chuyenNganh' })} name='maNganh'>
							<SelectNganhCoSo selectMa disabled />
						</Form.Item>
					</Col>
					<Col span={8}>
						<Form.Item
							label={intl.formatMessage({ id: 'luananluanvankhoaluan.label.trangThai' })}
							name='trangThai'
							rules={[...rules.required]}
						>
							<Select
								placeholder={intl.formatMessage({ id: 'luananluanvankhoaluan.label.chonDoAn' })}
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
							label={intl.formatMessage({ id: 'luananluanvankhoaluan.label.taiLieuToanBoDeTai' }) + ' (docx)'}
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
							label={intl.formatMessage({ id: 'luananluanvankhoaluan.label.taiLieuTomTat' }) + ' (docx)'}
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
							label={intl.formatMessage({ id: 'luananluanvankhoaluan.label.taiLieuMinhChung' }) + ' (pdf)'}
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
