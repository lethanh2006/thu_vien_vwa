import { colorTrangThaiMuonSach, ETrangThaiMuonSach, mapNameTrangThaiMuonSach } from '@/services/SachTaiLieu/constant';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Descriptions, Form, Row, Tag } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const ChiTietMuonTraSach = (props: any) => {
	const { getData: getDataExternal, trangThai, setVisibleGhiTra } = props;
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, setVisibleForm, visibleForm, xuLyThueMuonAnPhamModel, thongKeMuonTraSachModel } =
		useModel('sachtailieu.muontra.muontra');
	const { selectedIds, setSelectedIds, danhSach } = useModel('sachtailieu.anpham.anpham');

	const getData = () => {
		thongKeMuonTraSachModel();
		getDataExternal();
	};

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
			setSelectedIds([]);
		}
	}, [visibleForm]);

	// const onFinish = async (values: any) => {
	// 	if (!selectedIds?.length) {
	// 		message.error('Vui lòng chọn thông tin ấn phẩm cho mượn!');
	// 		return;
	// 	}

	// 	const data = {
	// 		...values,
	// 		trangThaiDuyet: ETrangThaiDuyetMuonSach.DA_DUYET,
	// 		soDangKyCaBiet: danhSach?.find((item) => item?._id === selectedIds[0])?.soDangKyCaBiet,
	// 	};

	// 	xuLyThueMuonAnPhamModel(record?._id ?? '', data as any, getData)
	// 		.then(() => {
	// 			setVisibleForm(false);
	// 		})
	// 		.catch((err) => console.log(err));
	// };

	return (
		<Card title='Chi tiết sinh viên mượn sách'>
			<Row gutter={[12, 0]}>
				<Col xs={24}>
					<Descriptions column={1}>
						<Descriptions.Item label='Mã'>{record?.phieuMuonTra?.maDinhDanhNguoiMuon ?? '--'}</Descriptions.Item>
						<Descriptions.Item label='Họ tên'>{record?.phieuMuonTra?.hoTenNguoiMuon ?? '--'}</Descriptions.Item>
						<Descriptions.Item label='Nhan đề'>{record?.anPham?.nhanDe ?? '--'}</Descriptions.Item>
						<Descriptions.Item label='Tác giả'>{record?.anPham?.tacGia ?? '--'}</Descriptions.Item>

						{/* {trangThai !== ETrangThaiMuonSach.CHO_XU_LY && ( */}
						<>
							<Descriptions.Item label='Đăng ký cá biệt'>{record?.soDangKyCaBiet ?? '--'}</Descriptions.Item>
							<Descriptions.Item label='Thời gian mượn'>
								{record?.thoiGianMuon ? moment(record?.thoiGianMuon).format('DD/MM/YYYY') : '--'}
							</Descriptions.Item>
							<Descriptions.Item label='Hạn trả'>
								{record?.expired ? moment(record?.expired).format('DD/MM/YYYY') : '--'}
							</Descriptions.Item>

							{/* <Descriptions.Item label='Trạng thái'>
								{record?.daLaySach ? <Tag color='green'>Đã lấy</Tag> : <Tag color='red'>Chưa lấy</Tag>}
							</Descriptions.Item>

							<Descriptions.Item label='Gia hạn'>
								{record?.giaHan ? <Tag color='green'>Có gian hạn</Tag> : <Tag color='red'>Không gia hạn</Tag>}
							</Descriptions.Item> */}

							<Descriptions.Item label='Thời gian gia hạn'>
								{record?.thoiGianGiaHan ? moment(record?.thoiGianGiaHan).format('DD/MM/YYYY') : '--'}
							</Descriptions.Item>

							<Descriptions.Item label='Thời gian trả'>
								{record?.thoiGianTra ? moment(record?.thoiGianTra).format('DD/MM/YYYY') : '--'}
							</Descriptions.Item>
						</>
						{/* )} */}

						{/* <Descriptions.Item label='Thời gian dự kiến mượn'>
							{record?.thoiGianMuonDuKien ? moment(record?.thoiGianMuonDuKien).format('DD/MM/YYYY') : '--'}
						</Descriptions.Item>
						<Descriptions.Item label='Thời gian dự kiến trả'>
							{record?.thoiGianTraDuKien ? moment(record?.thoiGianTraDuKien).format('DD/MM/YYYY') : '--'}
						</Descriptions.Item>

						<Descriptions.Item label='Ghi chú đăng ký'>{record?.ghiChuDangKy ?? '--'}</Descriptions.Item> */}

						{/* {trangThai !== ETrangThaiMuonSach.CHO_XU_LY && ( */}
						<>
							<Descriptions.Item label='Ghi chú'>{record?.ghiChu ?? '--'}</Descriptions.Item>
							<Descriptions.Item label='Ghi chú trả'>{record?.ghiChuTra ?? '--'}</Descriptions.Item>
						</>
						{/* )} */}

						<Descriptions.Item label='Trạng thái'>
							<Tag color={colorTrangThaiMuonSach[record?.trangThai as ETrangThaiMuonSach]}>
								{mapNameTrangThaiMuonSach[record?.trangThai as ETrangThaiMuonSach]}
							</Tag>
						</Descriptions.Item>
					</Descriptions>
				</Col>
				{/* {record?.trangThai === ETrangThaiMuonSach.CHO_XU_LY ? (
					<Col xs={24}>
						<Form onFinish={onFinish} form={form} layout='vertical'>
							<FormDuyet form={form} />
						</Form>
					</Col>
				) : null} */}
			</Row>

			<div className='form-footer'>
				{/* {record?.trangThai === ETrangThaiMuonSach.CHO_XU_LY ? (
					<Popconfirm
						onConfirm={() => form.submit()}
						title='Bạn có chắc chắn muốn xác nhận cho mượn thông tin ấn phẩm này?'
						placement='topRight'
					>
						<Button type='primary'>Duyệt</Button>
					</Popconfirm>
				) : null} */}

				{record?.trangThai === ETrangThaiMuonSach.DANG_THUE_MUON ? (
					<Button
						type='primary'
						onClick={() => {
							setVisibleForm(false);
							setVisibleGhiTra(true);
						}}
					>
						Ghi trả
					</Button>
				) : null}

				<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
			</div>
		</Card>
	);
};

export default ChiTietMuonTraSach;
