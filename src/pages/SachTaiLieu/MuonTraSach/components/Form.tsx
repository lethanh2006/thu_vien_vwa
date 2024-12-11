import ExpandText from '@/components/ExpandText';
import MyDatePicker from '@/components/MyDatePicker';
import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import SelectSinhVienDebounce from '@/pages/SinhVien/component/Select';
import { ETrangThaiDuyeMuonSach, ETrangThaiMuonSach } from '@/services/SachTaiLieu/constant';
import type { MuonSach } from '@/services/SachTaiLieu/MuonSach/typing';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Descriptions, Form, Input, InputNumber, message, Row } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormMuonTraSach = (props: any) => {
	const { getData, setTrangThai } = props;
	const intl = useIntl();
	const [form] = Form.useForm();
	const { visibleForm, setVisibleForm, formSubmiting, edit, putModel, postModel, settingMuonTra, record } =
		useModel('sachtailieu.muontra.muontra');
	const { danhSach: danhSachSinhVien } = useModel('sinhvien.sinhvien');
	const { getModel, loading, page, limit, setDanhSach, danhSach, selectedIds, setSelectedIds } = useModel(
		'sachtailieu.anpham.thongtinanpham',
	);
	const thoiGianMuon: Date = Form.useWatch('thoiGianMuon', form);
	const nhanDe: string = Form.useWatch('nhanDe', form);
	const tacGia: string = Form.useWatch('tacGia', form);
	const dangKyCaBiet: string = Form.useWatch('dangKyCaBiet', form);

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
			setSelectedIds([]);
		} else if (record?._id) form.setFieldsValue(record);
		else {
			form.setFieldsValue({
				expired: settingMuonTra?.thoiHanMuonTraSach,
				thoiGianMuon: moment(),
			});
		}

		setDanhSach([]);
	}, [record?._id, visibleForm]);

	useEffect(() => {
		form.setFieldsValue({ thoiGianTra: moment(thoiGianMuon).add(settingMuonTra?.thoiHanMuonTraSach, 'day') });
	}, [thoiGianMuon]);

	const onFinish = async (values: MuonSach.IRecord) => {
		if (!selectedIds?.length && !edit) {
			message.error('Vui lòng chọn thông tin ấn phẩm cho mượn!');
			return;
		}

		values.trangThai = values.trangThai ?? ETrangThaiMuonSach.DANG_THUE_MUON;
		values.trangThaiDuyet = values.trangThaiDuyet ?? ETrangThaiDuyeMuonSach.DA_DUYET;

		const sinhVien = danhSachSinhVien?.find((item) => item?.ssoId === values?.ssoIdNguoiMuon);
		values.maDinhDanhNguoiMuon = sinhVien?.ma ?? '';
		values.hotenNguoiMuon = sinhVien?.ten ?? '';
		values.thoiGianDangKy = moment().toDate();

		const thongTinAnPham = danhSach?.find((item) => item?._id === selectedIds?.[0]);

		values.anPhamId = thongTinAnPham?.anPhamId ?? '';
		values.thongTinAnPhamId = thongTinAnPham?._id ?? '';
		values.soDangKyCaBiet = `${thongTinAnPham?.tagCode}$j`;

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
		if (!nhanDe && !tacGia && !dangKyCaBiet) {
			message.error('Vui lòng điền ít nhất 1 thông tin!');
			return;
		}

		const searchParams: Record<string, any> = {};
		if (nhanDe) searchParams.nhanDe = nhanDe;
		if (tacGia) searchParams.tacGia = tacGia;
		if (dangKyCaBiet) searchParams.dangKyCaBiet = dangKyCaBiet;

		getModel(searchParams, undefined, undefined, undefined, undefined, 'search', undefined)
			.then()
			.catch((err) => console.log(err));
	};

	const handleTimKiem = () => {
		getDataExternal();
	};

	const columns: IColumn<AnPham.IThongTinAnPham>[] = [
		{
			title: 'Ấn phẩm',
			dataIndex: 'anPhamId',
			width: 120,
			render: (val, rec) => rec?.anPham?.ten ?? 'Không có thông tin',
		},
		{
			title: 'Nhan đề',
			width: 180,
			render: (val, rec) => <ExpandText>{rec?.anPham?.nhanDe}</ExpandText>,
		},
		{
			title: 'Tác giả',
			width: 150,
			render: (val, rec) => rec?.anPham?.tacGia,
		},
		{
			title: 'Nhãn',
			width: 80,
			render: (val, rec) => rec?.tagCode,
		},
	];

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
								<Form.Item name='nhanDe' label='Nhan đề'>
									<Input placeholder='Nhập đăng ký cá biệt' />
								</Form.Item>
							</Col>
							<Col span={24} md={8}>
								<Form.Item name='tacGia' label='Tác giả'>
									<Input placeholder='Nhập đăng ký cá biệt' />
								</Form.Item>
							</Col>
							<Col span={24} md={8}>
								<Form.Item name='dangKyCaBiet' label='Đăng ký cá biệt'>
									<Input placeholder='Nhập đăng ký cá biệt' />
								</Form.Item>
							</Col>
						</Row>

						<div className='form-footer'>
							<Button loading={loading} onClick={handleTimKiem}>
								Tìm kiếm
							</Button>
						</div>

						{danhSach?.length ? (
							<TableBase
								getData={getDataExternal}
								columns={columns}
								dependencies={[page, limit]}
								modelName='sachtailieu.anpham.thongtinanpham'
								buttons={{ create: false }}
								hideCard
								otherProps={{
									rowKey: (rec: AnPham.IThongTinAnPham) => rec._id,
									rowSelection: {
										type: 'checkbox',
										selectedRowKeys: selectedIds,
										preserveSelectedRowKeys: true,
										onChange: (selectedRowKeys: string[]) => {
											setSelectedIds(selectedRowKeys.slice(-1));
										},
										columnWidth: 40,
										hideSelectAll: true,
									},
								}}
							/>
						) : null}
					</>
				) : (
					<Descriptions column={1}>
						<Descriptions.Item label='Ấn phẩm'>{record?.anPham?.ten ?? '--'}</Descriptions.Item>
						<Descriptions.Item label='Nhan đề'>{record?.anPham?.nhanDe ?? '--'}</Descriptions.Item>
						<Descriptions.Item label='Tác giả'>{record?.anPham?.tacGia ?? '--'}</Descriptions.Item>
					</Descriptions>
				)}

				<Row gutter={[12, 0]}>
					<Col xs={24}>
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
							<InputNumber style={{ width: '100%' }} placeholder='Nhập hạn mượn trả sách' addonAfter='Ngày' />
						</Form.Item>
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
