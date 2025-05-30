import ExpandText from '@/components/ExpandText';
import PrintTemplate from '@/components/PrintTemplate';
import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import { ETrangThaiDangKyCaBiet, ETrangThaiDuyetMuonSach, EVaiTroMuonTra } from '@/services/SachTaiLieu/constant';
import type { MuonSach } from '@/services/SachTaiLieu/MuonSach/typing';
import type { PhieuMuonTra } from '@/services/SachTaiLieu/PhieuMuonTra/typing';
import { colorTrangThaiHocSv, type ETrangThaiHocSv } from '@/services/SinhVien/constant';
import type { SinhVien } from '@/services/SinhVien/typings';
import { type ETrangThaiNhanSu, MapColorETrangThaiNhanSu } from '@/services/ToChucNhanSu/constant';
import type { ToChucNhanSu } from '@/services/ToChucNhanSu/typing';
import { resetFieldsForm } from '@/utils/utils';
import { DeleteOutlined, EditOutlined, PrinterOutlined } from '@ant-design/icons';
import {
	Button,
	Card,
	Col,
	Descriptions,
	Form,
	Input,
	message,
	Popconfirm,
	Row,
	Segmented,
	Space,
	Spin,
	Tag,
} from 'antd';
import moment from 'moment';
import { useCallback, useEffect, useRef, useState } from 'react';
import ReactToPrint from 'react-to-print';
import { useIntl, useModel } from 'umi';
import LichSuThueMuonPage from '../LichSu';
import FormMuonTra from './FormMuonTra';
import ModalTimKiem from './ModalTimKiem';
import TitlePrintMuonTra from './TitlePrintMuonTra';

const FormMuonTraSach = (props: any) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const {
		getModel: getData,
		visibleForm,
		setVisibleForm,
		formSubmiting,
		edit,
		postPhieuMuonTraSachModel,
		record,
	} = useModel('sachtailieu.muontra.phieumuontra');
	const { getModel, settingMuonTra, loading, thongKeMuonTraSachModel } = useModel('sachtailieu.muontra.muontra');
	const { getModel: getAnPhamXepGia, danhSach, setDanhSach, handleEdit } = useModel('sachtailieu.anpham.anphamxepgia');
	const [visibleTimKiem, setVisibleTimKiem] = useState<boolean>(false);
	const [recSinhVien, setRecSinhVien] = useState<SinhVien.IRecord>();
	const [recCanBo, setRecCanBo] = useState<ToChucNhanSu.INhanSu>();
	const [visibleModal, setVisibleModal] = useState<boolean>(false);
	const dkcb: string = Form.useWatch('dkcb', form);
	const soThe: string = Form.useWatch('soThe', form);
	const vaiTro: EVaiTroMuonTra = Form.useWatch('vaiTro', form);
	const isSinhVien = vaiTro === EVaiTroMuonTra.SINHVIEN;
	const isCanBo = vaiTro === EVaiTroMuonTra.CANBO;

	const componentRef = useRef(null);
	const soTheInputRef = useRef<any>(null);
	const dkcbInputRef = useRef<any>(null);

	const reactToPrintContent = useCallback(() => componentRef.current, [componentRef.current]);

	const reactToPrintTrigger = useCallback(
		() => (
			<ButtonExtend icon={<PrinterOutlined />} tooltip='Phiếu'>
				Phiếu
			</ButtonExtend>
		),
		[],
	);

	const slConMuonDuoc = Math.max(
		0,
		(isSinhVien ? settingMuonTra?.soLuongMuonToiDa ?? 7 : settingMuonTra?.soLuongMuonToiDaCanBo ?? 5) -
			Number((isSinhVien ? recSinhVien : recCanBo)?.thongKe?.dangThueMuon ?? 0),
	);

	const isOverLimit = danhSach?.length > slConMuonDuoc;

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
			setRecSinhVien(undefined);
			setRecCanBo(undefined);
			setDanhSach([]);
		} else {
			form.setFieldsValue({ vaiTro: EVaiTroMuonTra.SINHVIEN });

			setTimeout(() => {
				if (soTheInputRef.current) {
					soTheInputRef.current.focus();
				}
			}, 100);
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: PhieuMuonTra.IRecord) => {
		if (!recSinhVien?.ssoId && isSinhVien) {
			message.error('Không tồn tại thông tin sinh viên!');
			return;
		}

		if (!recCanBo?.ssoId && isCanBo) {
			message.error('Không tồn tại thông tin cán bộ!');
			return;
		}

		if (!danhSach?.length) {
			message.error('Không tồn tại ấn phẩm ghi mượn!');
			return;
		}

		const data = {
			danhSachAnPhamMuonTra: (danhSach as any)?.map((item: any) => ({
				anPhamId: item?.anPhamId,
				soDangKyCaBiet: item?.soDangKyCaBiet,
				thoiGianMuon: item?.thoiGianMuon,
				expired: item?.expired,
				ghiChu: item?.ghiChu,
			})),

			hoTenNguoiMuon: isSinhVien ? recSinhVien?.ten : [recCanBo?.hoDem, recCanBo?.ten]?.filter(Boolean).join(' '),
			maDinhDanhNguoiMuon: isSinhVien ? recSinhVien?.ma : recCanBo?.maCanBo,
			ssoIdNguoiMuon: isSinhVien ? recSinhVien?.ssoId : recCanBo?.ssoId,
			ngaySinh: isSinhVien ? recSinhVien?.ngaySinh : recCanBo?.ngaySinh,
			trangThaiDuyet: ETrangThaiDuyetMuonSach.DA_DUYET,

			vaiTro: values?.vaiTro,

			//Sinh Viên
			maNganhNguoiMuon: recSinhVien?.maNganh ?? '',
			tenNganhNguoiMuon: recSinhVien?.nganh?.ten ?? '',
			maKhoaSinhVienNguoiMuon: recSinhVien?.maKhoaSinhVien ?? '',
			tenKhoaSinhVienNguoiMuon: recSinhVien?.khoaSinhVien?.ten ?? '',
			maKhoaNguoiMuon: recSinhVien?.maKhoaNganh ?? '',
			tenKhoaNguoiMuon: recSinhVien?.khoaNganh?.ten ?? '',

			//Cán bộ, giảng viên
			maDonViNguoiMuon: recCanBo?.maDonVi ?? '',
			tenDonViNguoiMuon: recCanBo?.donViChinh?.ten ?? '',
		};

		postPhieuMuonTraSachModel(data as any, () => {
			thongKeMuonTraSachModel();
			getData();
		})
			.then(() => {
				resetFieldsForm(form);
				setRecSinhVien(undefined);
				setRecCanBo(undefined);
				setDanhSach([]);
			})
			.catch((err) => console.log(err));
	};

	const handleDeleteItem = (itemId: string) => {
		const updatedList = danhSach.filter((item) => item._id !== itemId);
		setDanhSach(updatedList);
	};

	const columns: IColumn<MuonSach.IRecord>[] = [
		{
			title: 'ĐKCB',
			dataIndex: 'soDangKyCaBiet',
			align: 'center',
			width: 120,
		},
		{
			title: 'Nhan đề',
			width: 220,
			render: (val, rec) => <ExpandText>{rec?.anPham?.nhanDe}</ExpandText>,
		},
		{
			title: 'Tác giả',
			width: 150,
			render: (val, rec) => rec?.anPham?.tacGia,
		},
		{
			title: 'Thời gian mượn',
			dataIndex: 'thoiGianMuon',
			align: 'center',
			render: (val, rec) => val && moment(val).format('DD/MM/YYYY'),
			width: 120,
		},
		{
			title: 'Hạn trả',
			dataIndex: 'expired',
			align: 'center',
			render: (val, rec) => val && moment(val).format('DD/MM/YYYY'),
			width: 120,
		},
		{
			title: 'Ghi chú',
			dataIndex: 'ghiChu' as any,
			width: 220,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<ButtonExtend
						tooltip='Chỉnh sửa'
						type='link'
						icon={<EditOutlined />}
						onClick={() => handleEdit(rec as any)}
					/>

					<Popconfirm
						onConfirm={() => handleDeleteItem(rec?._id)}
						title='Bạn có chắc chắn muốn xóa ấn phẩm này?'
						placement='topRight'
					>
						<ButtonExtend tooltip='Xóa' type='link' danger icon={<DeleteOutlined />} />
					</Popconfirm>
				</>
			),
		},
	];

	const columnsPrint = columns.filter((col) => col.title !== 'Thao tác');

	const handleLuuDKCB = async () => {
		if (!dkcb) {
			message.error('Vui lòng nhập đăng ký cá biệt trước khi thêm!');
			return;
		}

		const anPhamData = await getAnPhamXepGia(
			{ soDangKyCaBiet: dkcb },
			undefined,
			undefined,
			undefined,
			undefined,
			undefined,
			undefined,
			false,
		);

		if (anPhamData?.[0]?.trangThai === ETrangThaiDangKyCaBiet.BAN) {
			message.error('Ấn phẩm đang được mượn!');
			return;
		}

		if (danhSach?.find((i) => i?.soDangKyCaBiet === anPhamData?.[0]?.soDangKyCaBiet)) {
			message.error('Ấn phẩm đã tồn tại trong danh sách!');
			return;
		}

		setDanhSach(
			(prev) =>
				[
					...prev,
					{
						...anPhamData?.[0],
						soDangKyCaBiet: dkcb,
						thoiGianMuon: moment(),
						expired: moment().add(
							isSinhVien ? settingMuonTra?.thoiHanMuonTraSach ?? 150 : settingMuonTra?.thoiHanMuonTraSachCanBo ?? 7,
							'd',
						),
					},
				] as any,
		);

		form.resetFields(['dkcb']);

		// Giữ focus ở input đăng ký cá biệt sau khi thêm
		if (dkcbInputRef.current) {
			dkcbInputRef.current.focus();
		}
	};

	const handleLuuSinhVien = async () => {
		const nguoiMuon = await getModel(
			isSinhVien ? ({ ma: soThe } as any) : ({ maCanBo: soThe } as any),
			undefined,
			undefined,
			undefined,
			undefined,
			`thong-ke/${isSinhVien ? 'sinh-vien' : 'can-bo'}`,
			undefined,
			false,
		);

		if (!nguoiMuon?.length) {
			message.error('Không tìm thấy người mượn!');
			return;
		}

		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		isSinhVien ? setRecSinhVien(nguoiMuon?.[0] as any) : setRecCanBo(nguoiMuon?.[0] as any);

		// Focus vào input đăng ký cá biệt sau khi tìm thấy người mượn
		if (dkcbInputRef.current) {
			dkcbInputRef.current.focus();
		}
	};

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} sinh viên mượn sách`}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					<Col span={24} md={6}>
						<Row gutter={[12, 0]}>
							<Col span={24}>
								<Form.Item name='vaiTro'>
									<Segmented
										options={Object.values(EVaiTroMuonTra)?.map((item) => ({
											value: item,
											label: item,
										}))}
										onChange={() => {
											form.resetFields(['soThe']);
											// Focus lại vào input mã định danh khi thay đổi vai trò
											setTimeout(() => {
												if (soTheInputRef.current) {
													soTheInputRef.current.focus();
												}
											}, 100);
										}}
									/>
								</Form.Item>
							</Col>
							<Col span={24}>
								<Form.Item name='soThe' label={isSinhVien ? 'Mã sinh viên' : 'Mã cán bộ'}>
									<Input
										ref={soTheInputRef}
										placeholder='Nhập mã định danh'
										onPressEnter={(e) => {
											e.preventDefault();
											handleLuuSinhVien();
										}}
										allowClear
									/>
								</Form.Item>
							</Col>
							<Col span={24}>
								<Form.Item name='dkcb' label='Đăng ký cá biệt'>
									<Input
										ref={dkcbInputRef}
										placeholder='Nhập đăng ký cá biệt'
										onPressEnter={(e) => {
											e.preventDefault();
											handleLuuDKCB();
										}}
										allowClear
									/>
								</Form.Item>
								<Space>
									<a type='link' onClick={handleLuuDKCB}>
										Thêm
									</a>{' '}
									|{' '}
									<a type='link' onClick={() => setVisibleTimKiem(true)}>
										Tìm
									</a>
								</Space>
							</Col>
						</Row>
					</Col>

					<Col span={24} md={18}>
						<Row gutter={[12, 0]}>
							<Col span={24}>
								<Spin spinning={loading}>
									<Descriptions column={{ xs: 1, sm: 1, md: 4 }} title='Thông tin người mượn'>
										{isSinhVien ? (
											<>
												<Descriptions.Item label='Mã SV'>{recSinhVien?.ma ?? '--'}</Descriptions.Item>
												<Descriptions.Item label='Họ tên'>{recSinhVien?.ten ?? '--'}</Descriptions.Item>
												<Descriptions.Item label='Ngày sinh'>
													{recSinhVien?.ngaySinh ? moment(recSinhVien?.ngaySinh).format('DD/MM/YYYY') : '--'}
												</Descriptions.Item>
												<Descriptions.Item label='Lớp'>{recSinhVien?.tenLopHanhChinhVirtual ?? '--'}</Descriptions.Item>
												<Descriptions.Item label='Khóa sinh viên'>
													{recSinhVien?.khoaSinhVien?.ten ?? '--'}
												</Descriptions.Item>
												<Descriptions.Item label='Khóa ngành'>{recSinhVien?.khoaNganh?.ten ?? '--'}</Descriptions.Item>
												<Descriptions.Item label='Trạng thái học'>
													<Tag color={colorTrangThaiHocSv[recSinhVien?.trangThaiHoc as ETrangThaiHocSv]}>
														{recSinhVien?.trangThaiHoc ?? '--'}
													</Tag>
												</Descriptions.Item>
											</>
										) : (
											<>
												<Descriptions.Item label='Mã cán bộ'>{recCanBo?.maCanBo ?? '--'}</Descriptions.Item>
												<Descriptions.Item label='Họ tên'>
													{[recCanBo?.hoDem, recCanBo?.ten]?.filter(Boolean).join(' ')}
												</Descriptions.Item>
												<Descriptions.Item label='Ngày sinh'>
													{recCanBo?.ngaySinh ? moment(recCanBo?.ngaySinh).format('DD/MM/YYYY') : '--'}
												</Descriptions.Item>
												<Descriptions.Item label='Đơn vị'>{recCanBo?.donViChinh?.ten ?? '--'}</Descriptions.Item>
												<Descriptions.Item label='Trạng thái'>
													<Tag color={MapColorETrangThaiNhanSu[recCanBo?.trangThai as ETrangThaiNhanSu]}>
														{recCanBo?.trangThai ?? '--'}
													</Tag>
												</Descriptions.Item>
											</>
										)}
									</Descriptions>
								</Spin>
							</Col>
							{(recSinhVien?.ma || recCanBo?.maCanBo) && (
								<Col xs={24}>
									<Row gutter={[12, 0]}>
										<Col span={24} md={6}>
											<Card
												className='card-stat-small'
												style={{ cursor: 'pointer' }}
												onClick={() => setVisibleModal(true)}
											>
												<span className='num' style={{ color: 'blue' }}>
													{isSinhVien
														? settingMuonTra?.soLuongMuonToiDa ?? 7
														: settingMuonTra?.soLuongMuonToiDaCanBo ?? 5}
												</span>
												<span>Hạn ngạch mượn</span>
											</Card>
										</Col>
										<Col span={24} md={6}>
											<Card
												className='card-stat-small'
												style={{ cursor: 'pointer' }}
												onClick={() => setVisibleModal(true)}
											>
												<span className='num' style={{ color: 'orange' }}>
													{(isSinhVien ? recSinhVien : recCanBo)?.thongKe?.dangThueMuon ?? 0}
												</span>
												<span>Đang mượn</span>
											</Card>
										</Col>
										<Col span={24} md={6}>
											<Card
												className='card-stat-small'
												style={{ cursor: 'pointer' }}
												onClick={() => setVisibleModal(true)}
											>
												<span className='num' style={{ color: 'rec' }}>
													{(isSinhVien ? recSinhVien : recCanBo)?.thongKe?.quaHan ?? 0}
												</span>
												<span>Quá hạn mượn</span>
											</Card>
										</Col>
										<Col span={24} md={6}>
											<Card
												className='card-stat-small'
												style={{ cursor: 'pointer' }}
												onClick={() => setVisibleModal(true)}
											>
												<span className='num' style={{ color: 'green' }}>
													{slConMuonDuoc}
												</span>
												<span>Còn mượn được</span>
											</Card>
										</Col>
									</Row>
								</Col>
							)}
							<Col span={24}>
								<div className='fw500' style={{ marginTop: 12 }}>
									Danh sách ấn phẩm ghi mượn
								</div>

								<TableStaticData
									columns={columns}
									data={danhSach ?? []}
									size='small'
									addStt
									hasTotal
									otherProps={{ pagination: true }}
								/>
							</Col>
						</Row>
					</Col>
				</Row>

				<div className='form-footer'>
					{isOverLimit ? (
						<Popconfirm title='Đã quá hạn ngạch mượn. Bạn có chắc chắn muốn ghi mượn?' onConfirm={() => form.submit()}>
							<Button type='primary' loading={formSubmiting}>
								Ghi mượn
							</Button>
						</Popconfirm>
					) : (
						<Button loading={formSubmiting} onClick={() => form.submit()} type='primary'>
							Ghi mượn
						</Button>
					)}

					<ReactToPrint
						content={reactToPrintContent}
						documentTitle='Phiếu'
						trigger={reactToPrintTrigger}
						removeAfterPrint
					/>
					<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>

			<PrintTemplate
				ref={componentRef}
				footer={
					<Row gutter={[5, 5]}>
						<Col span={12} push={12} style={{ textAlign: 'center' }}>
							<b>Chữ ký người mượn</b>
						</Col>
					</Row>
				}
			>
				<TitlePrintMuonTra vaiTro={vaiTro} recSinhVien={recSinhVien} recCanBo={recCanBo} />
				<div className='to-print'>
					<TableStaticData
						columns={columnsPrint}
						data={danhSach ?? []}
						size='small'
						otherProps={{ pagination: false, scroll: false }}
					/>
				</div>
			</PrintTemplate>

			<ModalTimKiem visibleForm={visibleTimKiem} setVisibleForm={setVisibleTimKiem} vaiTro={vaiTro} />

			<FormMuonTra />

			<LichSuThueMuonPage
				visible={visibleModal}
				setVisible={setVisibleModal}
				title={`Danh sách lịch sử mượn trả sách người mượn ${
					isSinhVien ? recSinhVien?.ten : [recCanBo?.hoDem, recCanBo?.ten]?.filter(Boolean).join(' ')
				}`}
				width={1000}
				ssoId={isSinhVien ? recSinhVien?.ssoId : recCanBo?.ssoId}
			/>
		</Card>
	);
};

export default FormMuonTraSach;
