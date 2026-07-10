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
import { Button, Card, Col, Form, Input, message, Modal, Popconfirm, Row, Segmented, Space, Spin, Tabs } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useIntl, useModel } from 'umi';
import ChiTietAnPham from '../../AnPham/components/ChiTiet';
import FormGhiTraSach from '../GhiTraSach/components/Form';
import InforNguoiMuon from '../GhiTraSach/components/Infor';
import StatNguoiDungAnPham from '../GhiTraSach/components/Stat';
import ModalNguoiMuon from '../NguoiMuon';
import '../style.less';
import { getMaSinhVienFromCardText, isAutoSubmitDangKyCaBiet, isAutoSubmitMaSinhVien } from '../utils';
import ConfirmMuonQuaHan from './ConfirmQuaHan';
import FormMuonTra from './FormMuonTra';
import ModalTimKiem from './ModalTimKiem';
import TitlePrintMuonTra from './TitlePrintMuonTra';

const FormMuonTraSach = (props: any) => {
	const { getData, hideCard } = props;
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
	const [parsingSoThe, setParsingSoThe] = useState(false);
	const dkcb: string = Form.useWatch('dkcb', form);
	const soThe: string = Form.useWatch('soThe', form);
	const vaiTro: EVaiTroMuonTra = Form.useWatch('vaiTro', form);
	const isSinhVien = vaiTro === EVaiTroMuonTra.SINHVIEN;
	const isCanBo = vaiTro === EVaiTroMuonTra.CANBO;
	const setBorrowerInfo = isSinhVien ? setRecSinhVien : setRecCanBo;
	const [visibleTimTen, setVisibleTimTen] = useState<boolean>(false);
	const [tabActive, setTabActive] = useState<string>('1');

	const componentRef = useRef(null);
	const soTheInputRef = useRef<any>(null);
	const dkcbInputRef = useRef<any>(null);
	const parseSoTheTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const autoLuuDKCBTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
		form.setFieldsValue({ vaiTro: EVaiTroMuonTra.SINHVIEN });
		setTimeout(() => {
			if (soTheInputRef.current) {
				soTheInputRef.current.focus();
			}
		}, 100);
	}, []);

	useEffect(
		() => () => {
			if (parseSoTheTimeoutRef.current) {
				clearTimeout(parseSoTheTimeoutRef.current);
			}

			if (autoLuuDKCBTimeoutRef.current) {
				clearTimeout(autoLuuDKCBTimeoutRef.current);
			}
		},
		[],
	);

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form, { vaiTro: EVaiTroMuonTra.SINHVIEN });
			setDanhSach([]);
			setRecSinhVien(undefined);
			setRecCanBo(undefined);
		}

		form.setFieldsValue({ vaiTro: EVaiTroMuonTra.SINHVIEN });
		setTimeout(() => {
			if (soTheInputRef.current) {
				soTheInputRef.current.focus();
			}
		}, 100);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: PhieuMuonTra.IRecord) => {
		if (isSinhVien && !recSinhVien?.ssoId) {
			message.error('Không tồn tại thông tin sinh viên!');
			return;
		}

		if (isCanBo && !recCanBo?.ssoId) {
			message.error('Không tồn tại thông tin cán bộ!');
			return;
		}

		if (!danhSach?.length) {
			message.error('Không tồn tại ấn phẩm ghi mượn!');
			return;
		}

		const nguoiMuon = isSinhVien ? recSinhVien : recCanBo;

		const hoTenNguoiMuon = isSinhVien ? recSinhVien?.ten : [recCanBo?.hoDem, recCanBo?.ten].filter(Boolean).join(' ');

		const danhSachAnPhamMuonTra = danhSach.map((item: any) => ({
			anPhamId: item?.anPhamId,
			soDangKyCaBiet: item?.soDangKyCaBiet,
			thoiGianMuon: item?.thoiGianMuon,
			expired: item?.expired,
			ghiChu: item?.ghiChu,
		}));

		const data = {
			danhSachAnPhamMuonTra,

			hoTenNguoiMuon,
			maDinhDanhNguoiMuon: isSinhVien ? recSinhVien?.ma : recCanBo?.maCanBo,
			ssoIdNguoiMuon: nguoiMuon?.ssoId,
			ngaySinh: nguoiMuon?.ngaySinh,
			trangThaiDuyet: ETrangThaiDuyetMuonSach.DA_DUYET,

			vaiTro: values?.vaiTro,

			maNganhNguoiMuon: recSinhVien?.maNganh ?? '',
			tenNganhNguoiMuon: recSinhVien?.nganh?.ten ?? '',
			maKhoaSinhVienNguoiMuon: recSinhVien?.maKhoaSinhVien ?? '',
			tenKhoaSinhVienNguoiMuon: recSinhVien?.khoaSinhVien?.ten ?? '',
			maKhoaNguoiMuon: recSinhVien?.maKhoaNganh ?? '',
			tenKhoaNguoiMuon: recSinhVien?.khoaNganh?.ten ?? '',
			tenLopHanhChinh: recSinhVien?.tenLopHanhChinhVirtual ?? '',

			maDonViNguoiMuon: recCanBo?.maDonVi ?? '',
			tenDonViNguoiMuon: recCanBo?.donViChinh?.ten ?? '',
		};

		try {
			await postPhieuMuonTraSachModel(data as any);

			resetFieldsForm(form, { vaiTro: EVaiTroMuonTra.SINHVIEN });
			setDanhSach([]);
			setRecSinhVien(undefined);
			setRecCanBo(undefined);
			setTimeout(() => {
				if (soTheInputRef.current) {
					soTheInputRef.current.focus();
				}
			}, 100);

			thongKeMuonTraSachModel();
			getData();
		} catch (err) {
			console.error(err);
		}
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
			title: 'Ngày mượn',
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

	const handleLuuDKCB = async (dkcbValue?: string) => {
		if (autoLuuDKCBTimeoutRef.current) {
			clearTimeout(autoLuuDKCBTimeoutRef.current);
		}

		const currentDKCB = (dkcbValue ?? form.getFieldValue('dkcb') ?? dkcb)?.trim();

		if (!currentDKCB) {
			message.error('Vui lòng nhập đăng ký cá biệt trước khi thêm!');
			return;
		}

		const filter = [
			{
				active: true,
				field: 'soDangKyCaBiet',
				values: [currentDKCB],
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

		const dkcbNormalized = currentDKCB.toLocaleUpperCase().trim();

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

	const handleLuuSinhVien = async (soTheValue?: string) => {
		if (parseSoTheTimeoutRef.current) {
			clearTimeout(parseSoTheTimeoutRef.current);
		}
		setParsingSoThe(false);
		const currentSoThe = soTheValue ?? soThe;
		const maDinhDanh = isSinhVien ? getMaSinhVienFromCardText(currentSoThe) : currentSoThe?.trim();

		if (!maDinhDanh?.trim()) {
			return;
		}

		if (maDinhDanh !== currentSoThe) {
			form.setFieldsValue({ soThe: maDinhDanh });
		}

		const filter = [
			{
				active: true,
				field: isSinhVien ? 'ma' : 'maCanBo',
				values: [maDinhDanh],
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

	const handleDKCBChange = (value: string) => {
		if (autoLuuDKCBTimeoutRef.current) {
			clearTimeout(autoLuuDKCBTimeoutRef.current);
		}

		if (!value?.trim()) {
			return;
		}

		if (!isAutoSubmitDangKyCaBiet(value)) {
			return;
		}

		autoLuuDKCBTimeoutRef.current = setTimeout(() => {
			handleLuuDKCB(value);
		}, 300);
	};

	const content = (
		<>
			{tabActive === '1' ? (
				<Form onFinish={onFinish} form={form} layout='vertical'>
					<div className='borrow-form-body'>
						<Row gutter={[12, 0]} wrap>
							<Col span={24} md={5}>
								<Row gutter={[12, 0]}>
									<Col span={24}>
										<Form.Item name='vaiTro'>
											<Segmented
												options={Object.values(EVaiTroMuonTra)?.map((item) => ({
													value: item,
													label: item,
												}))}
												onChange={() => {
													if (parseSoTheTimeoutRef.current) {
														clearTimeout(parseSoTheTimeoutRef.current);
													}
													setParsingSoThe(false);
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
											label={isSinhVien ? 'Mã sinh viên' : 'Mã cán bộ'}
											extra={
												<a type='link' onClick={() => setVisibleTimTen(true)}>
													Tìm kiếm theo tên
												</a>
											}
										>
											<div className='qr-input-wrapper'>
												<Form.Item name='soThe' noStyle>
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
																setParsingSoThe(false);
																setBorrowerInfo(undefined);
																setDanhSach([]);
															}

															if (parseSoTheTimeoutRef.current) {
																clearTimeout(parseSoTheTimeoutRef.current);
															}

															if (isSinhVien) {
																setParsingSoThe(/^\s*M/i.test(e.target.value));
																parseSoTheTimeoutRef.current = setTimeout(() => {
																	const currentValue = form.getFieldValue('soThe');
																	const maSinhVien = getMaSinhVienFromCardText(currentValue, {
																		requireNextLabel: true,
																	});

																	if (maSinhVien !== currentValue) {
																		form.setFieldsValue({ soThe: maSinhVien });
																	}

																	setParsingSoThe(false);
																	if (isAutoSubmitMaSinhVien(maSinhVien)) {
																		handleLuuSinhVien(maSinhVien);
																	}
																}, 300);
															}
														}}
													/>
												</Form.Item>
												{parsingSoThe && (
													<div className='qr-input-loading' aria-live='polite'>
														<Spin size='small' />
														<span>Hệ thống đang xử lý...</span>
													</div>
												)}
											</div>
										</Form.Item>
									</Col>
									<Col span={24}>
										<Form.Item
											name='dkcb'
											label='Đăng ký cá biệt'
											extra={
												<Space>
													<a type='link' onClick={() => handleLuuDKCB()}>
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
												onChange={(e) => handleDKCBChange(e.target.value)}
												allowClear
											/>
										</Form.Item>
									</Col>
								</Row>
							</Col>

							<Col span={24} md={19}>
								<Row gutter={[12, 12]}>
									<Col span={24}>
										<Spin spinning={loading}>
											<InforNguoiMuon isSinhVien={isSinhVien} />
										</Spin>
									</Col>

									<Col xs={24}>
										<StatNguoiDungAnPham isSinhVien={isSinhVien} />
									</Col>

									<Col span={24}>
										<TableStaticData
											loading={loadDKCB}
											columns={columns}
											data={danhSach ?? []}
											size='small'
											addStt
											hasTotal
											otherButtons={[<div className='fw500'>Danh sách ấn phẩm ghi mượn</div>]}
										/>
									</Col>
								</Row>
							</Col>
						</Row>
					</div>

					<div className='form-footerthuivien'>
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
			) : (
				<FormGhiTraSach hideCard />
			)}

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
		</>
	);

	return hideCard ? (
		content
	) : (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} sinh viên mượn sách`}>
			<Tabs
				onChange={(tab) => {
					setTabActive(tab);
					resetFieldsForm(form, { vaiTro: EVaiTroMuonTra.SINHVIEN });

					setTimeout(() => {
						if (soTheInputRef.current) {
							soTheInputRef.current.focus();
						}
					}, 100);
				}}
				activeKey={tabActive}
				style={{ marginTop: -23 }}
			>
				<Tabs.TabPane tab='Ghi mượn' key='1' />
				<Tabs.TabPane tab='Ghi trả' key='2' />
			</Tabs>
			{content}
		</Card>
	);
};

export default FormMuonTraSach;
