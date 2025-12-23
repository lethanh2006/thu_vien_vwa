import ExpandText from '@/components/ExpandText';
import PrintTemplate from '@/components/PrintTemplate';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { EOperatorType } from '@/components/Table/constant';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import { ETrangThaiDangKyCaBiet, ETrangThaiDuyetMuonSach, EVaiTroMuonTra } from '@/services/SachTaiLieu/constant';
import type { MuonSach } from '@/services/SachTaiLieu/MuonSach/typing';
import type { PhieuMuonTra } from '@/services/SachTaiLieu/PhieuMuonTra/typing';
import dayjs from '@/utils/dayjs';
import { resetFieldsForm } from '@/utils/utils';
import { DeleteOutlined, EditOutlined, InfoCircleOutlined, PrinterOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, message, Modal, Popconfirm, Row, Segmented, Space, Spin } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useIntl, useModel } from 'umi';
import ChiTietAnPham from '../../AnPham/components/ChiTiet';
import InforNguoiMuon from '../GhiTraSach/components/Infor';
import StatNguoiDungAnPham from '../GhiTraSach/components/Stat';
import ModalNguoiMuon from '../NguoiMuon';
import ConfirmMuonQuaHan from './ConfirmQuaHan';
import FormMuonTra from './FormMuonTra';
import ModalTimKiem from './ModalTimKiem';
import TitlePrintMuonTra from './TitlePrintMuonTra';

const FormMuonTraSach = (props: any) => {
	const { getData } = props;
	const intl = useIntl();
	const [form] = Form.useForm();
	const { visibleForm, setVisibleForm, formSubmiting, edit, postPhieuMuonTraSachModel, record } = useModel(
		'sachtailieu.muontra.phieumuontra',
	);
	const { getModel, settingMuonTra, loading, thongKeMuonTraSachModel } = useModel('sachtailieu.muontra.muontra');
	const {
		getModel: getAnPhamXepGia,
		danhSach,
		setDanhSach,
		handleEdit,
		loading: loadDKCB,
	} = useModel('sachtailieu.anpham.anphamxepgia');
	const { record: recSinhVien, setRecord: setRecSinhVien } = useModel('sinhvien.sinhvien');
	const { record: recCanBo, setRecord: setRecCanBo } = useModel('tochucnhansu.nhansu');
	const { getAllModel } = useModel('sachtailieu.anpham.thongtinanpham');
	const { visibleForm: visibleAnPham, setVisibleForm: setVisibleAnPham } = useModel('sachtailieu.anpham.anpham');
	const [visibleTimKiem, setVisibleTimKiem] = useState<boolean>(false);
	const [visibleQuaHan, setVisibleQuaHan] = useState<boolean>(false);
	const dkcb: string = Form.useWatch('dkcb', form);
	const soThe: string = Form.useWatch('soThe', form);
	const vaiTro: EVaiTroMuonTra = Form.useWatch('vaiTro', form);
	const isSinhVien = vaiTro === EVaiTroMuonTra.SINHVIEN;
	const isCanBo = vaiTro === EVaiTroMuonTra.CANBO;
	const setBorrowerInfo = isSinhVien ? setRecSinhVien : setRecCanBo;
	const [visibleTimTen, setVisibleTimTen] = useState<boolean>(false);

	const componentRef = useRef(null);
	const soTheInputRef = useRef<any>(null);
	const dkcbInputRef = useRef<any>(null);

	const handlePrintPhieu = useReactToPrint({ contentRef: componentRef });

	const slConMuonDuoc = Math.max(
		0,
		(isSinhVien ? (settingMuonTra?.soLuongMuonToiDa ?? 7) : (settingMuonTra?.soLuongMuonToiDaCanBo ?? 5)) -
			Number((isSinhVien ? recSinhVien : recCanBo)?.thongKe?.dangThueMuon ?? 0),
	);

	const isOverLimit = danhSach?.length > slConMuonDuoc;

	const isOverQuota = useCallback(
		(rec: MuonSach.IRecord) => {
			const currentIndex = danhSach?.findIndex((item) => item.soDangKyCaBiet === rec.soDangKyCaBiet) ?? -1;
			return currentIndex >= slConMuonDuoc;
		},
		[danhSach, slConMuonDuoc],
	);

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
			tenLopHanhChinh: recSinhVien?.tenLopHanhChinhVirtual ?? '',

			//Cán bộ, giảng viên
			maDonViNguoiMuon: recCanBo?.maDonVi ?? '',
			tenDonViNguoiMuon: recCanBo?.donViChinh?.ten ?? '',
		};

		postPhieuMuonTraSachModel(data as any, () => {
			thongKeMuonTraSachModel();
			getData();
		})
			.then(() => {
				resetFieldsForm(form, { vaiTro: EVaiTroMuonTra.SINHVIEN });
				setRecSinhVien(undefined);
				setRecCanBo(undefined);
				setDanhSach([]);
			})
			.catch((err) => console.log(err));
	};

	const handleDeleteItem = (sodkcb: string) => {
		let updatedList = danhSach.filter((item) => item.soDangKyCaBiet !== sodkcb);

		updatedList = updatedList.map((item, index) => {
			if (index < slConMuonDuoc && item.ghiChu === 'Mượn vượt quá hạn ngạch cho phép') {
				return { ...item, ghiChu: '' };
			}
			return item;
		});

		setDanhSach(updatedList);
	};

	const onCell = (rec: MuonSach.IRecord) => {
		if (isOverQuota(rec)) {
			return {
				style: {
					backgroundColor: '#ff8080',
				},
			};
		}
		return {};
	};

	const columns: IColumn<MuonSach.IRecord>[] = [
		{
			title: 'ĐKCB',
			dataIndex: 'soDangKyCaBiet',
			align: 'center',
			width: 100,
			filterType: 'string',
		},
		{
			title: 'Nhan đề',
			width: 250,
			render: (val, rec) => (
				<ExpandText>
					<ButtonExtend
						size='small'
						type='link'
						icon={<InfoCircleOutlined />}
						onClick={(e) => {
							e.stopPropagation();
							getAllModel(undefined, undefined, { anPhamId: rec?.anPhamId });
							setVisibleAnPham(true);
						}}
					/>
					{[rec?.anPham?.nhanDe, rec?.anPham?.soThuTuCuaTap, rec?.anPham?.tacGia].filter(Boolean).join(', ')}
				</ExpandText>
			),
			filterType: 'string',
		},
		{
			title: 'Nhà xuất bản',
			align: 'center',
			render: (val, rec) => rec?.anPham?.nhaXuatBan,
			width: 140,
			filterType: 'string',
		},
		{
			title: 'Năm xuất bản',
			align: 'center',
			render: (val, rec) => rec?.anPham?.namXuatBan,
			width: 90,
			filterType: 'string',
		},
		{
			title: 'Thời gian mượn',
			dataIndex: 'thoiGianMuon',
			align: 'center',
			render: (val, rec) => val && dayjs(val).format('DD/MM/YYYY'),
			width: 120,
		},
		{
			title: 'Hạn trả',
			dataIndex: 'expired',
			align: 'center',
			render: (val, rec) => val && dayjs(val).format('DD/MM/YYYY'),
			width: 120,
		},
		{
			title: 'Ghi chú',
			dataIndex: 'ghiChu',
			width: 180,
			onCell,
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
						onConfirm={() => handleDeleteItem(rec?.soDangKyCaBiet)}
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

		const filter = [
			{
				active: true,
				field: 'soDangKyCaBiet',
				values: [dkcb],
				operator: EOperatorType.CONTAIN,
			},
			// {
			// 	active: true,
			// 	field: 'thanhLy',
			// 	values: [false],
			// 	operator: EOperatorType.EQUAL,
			// },
		];

		const anPhamData = await getAnPhamXepGia(undefined, filter as any, undefined, 1, 50, undefined, undefined, false);

		if (!anPhamData?.length) {
			message.error('Không tồn tại ấn phẩm!');
			form.resetFields(['dkcb']);
			return;
		}

		const dkcbNormalized = dkcb.toLocaleUpperCase().trim();

		let itemChon = anPhamData.find((i) => i?.soDangKyCaBiet?.toLocaleUpperCase().trim() === dkcbNormalized);

		if (!itemChon) {
			itemChon = anPhamData.find((i) => i?.soDangKyCaBiet?.toLocaleUpperCase().trim().startsWith(dkcbNormalized));
		}

		if (!itemChon) itemChon = anPhamData[0];

		if (itemChon?.trangThai === ETrangThaiDangKyCaBiet.BAN) {
			message.error('Ấn phẩm đang được mượn!');
			return;
		}

		if (
			danhSach?.find(
				(i) => i?.soDangKyCaBiet.toLocaleUpperCase().trim() === itemChon.soDangKyCaBiet.toLocaleUpperCase().trim(),
			)
		) {
			message.error('Ấn phẩm đã tồn tại trong danh sách!');
			return;
		}

		const newItem = {
			...itemChon,
			soDangKyCaBiet: itemChon.soDangKyCaBiet.trim(),
			thoiGianMuon: dayjs(),
			expired: dayjs().add(
				isSinhVien ? (settingMuonTra?.thoiHanMuonTraSach ?? 150) : (settingMuonTra?.thoiHanMuonTraSachCanBo ?? 7),
				'd',
			),

			ghiChu: danhSach?.length >= slConMuonDuoc ? 'Mượn vượt quá hạn ngạch cho phép' : '',
		};

		setDanhSach((prev) => [...prev, newItem] as any);

		form.resetFields(['dkcb']);

		// Giữ focus ở input đăng ký cá biệt sau khi thêm
		requestAnimationFrame(() => {
			dkcbInputRef.current?.focus();
		});
	};

	const handleLuuSinhVien = async () => {
		const filter = [
			{
				active: true,
				field: isSinhVien ? 'ma' : 'maCanBo',
				values: [soThe],
				operator: EOperatorType.CONTAIN,
			},
		];

		const nguoiMuon = await getModel(
			undefined,
			filter as any,
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
					<Col span={24} md={4}>
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
								<Form.Item
									name='soThe'
									label={isSinhVien ? 'Mã sinh viên' : 'Mã cán bộ'}
									extra={
										<a type='link' onClick={() => setVisibleTimTen(true)}>
											Tìm kiếm theo tên
										</a>
									}
								>
									<Input
										ref={soTheInputRef}
										placeholder='Nhập mã định danh'
										allowClear
										onPressEnter={(e) => {
											e.preventDefault();
											handleLuuSinhVien();
										}}
										onChange={(e) => {
											if (e.target.value === '') {
												setBorrowerInfo(undefined);
												setDanhSach([]);
											}
										}}
									/>
								</Form.Item>
							</Col>
							<Col span={24}>
								<Form.Item
									name='dkcb'
									label='Đăng ký cá biệt'
									extra={
										<Space>
											<a type='link' onClick={handleLuuDKCB}>
												Thêm
											</a>{' '}
											{/* |{' '}
											<a type='link' onClick={() => setVisibleTimKiem(true)}>
												Tìm
											</a> */}
										</Space>
									}
								>
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
							</Col>
						</Row>
					</Col>

					<Col span={24} md={20}>
						<Row gutter={[12, 0]}>
							<Col span={24}>
								<Spin spinning={loading}>
									<InforNguoiMuon isSinhVien={isSinhVien} />
								</Spin>
							</Col>

							<Col xs={24}>
								<StatNguoiDungAnPham isSinhVien={isSinhVien} />
							</Col>
							<Col span={24}>
								<div className='fw500' style={{ marginTop: 12 }}>
									Danh sách ấn phẩm ghi mượn
								</div>

								<TableStaticData
									loading={loadDKCB}
									columns={columns}
									data={danhSach ?? []}
									size='small'
									addStt
									hasTotal
								/>
							</Col>
						</Row>
					</Col>
				</Row>

				<div className='form-footer'>
					{isOverLimit ? (
						<Button type='primary' onClick={() => setVisibleQuaHan(true)}>
							Ghi mượn
						</Button>
					) : (
						<Button loading={formSubmiting} onClick={() => form.submit()} type='primary'>
							Ghi mượn
						</Button>
					)}

					<ButtonExtend icon={<PrinterOutlined />} tooltip='Phiếu' onClick={() => handlePrintPhieu()}>
						Phiếu
					</ButtonExtend>

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
						otherProps={{ pagination: false, scroll: undefined }}
					/>
				</div>
			</PrintTemplate>

			<ModalTimKiem
				visibleForm={visibleTimKiem}
				setVisibleForm={setVisibleTimKiem}
				vaiTro={vaiTro}
				slConMuonDuoc={slConMuonDuoc}
			/>

			<FormMuonTra />

			<ConfirmMuonQuaHan visible={visibleQuaHan} setVisible={setVisibleQuaHan} onOk={() => form.submit()} />

			<ModalNguoiMuon
				visible={visibleTimTen}
				setVisible={setVisibleTimTen}
				activeKey={isSinhVien ? 'sinh-vien' : 'can-bo'}
			/>

			<Modal
				title='Chi tiết ấn phẩm'
				open={visibleAnPham}
				onCancel={() => setVisibleAnPham(false)}
				width={900}
				footer={
					<div className='form-footer'>
						<Button onClick={() => setVisibleAnPham(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
					</div>
				}
			>
				<ChiTietAnPham />
			</Modal>
		</Card>
	);
};

export default FormMuonTraSach;
