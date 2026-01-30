import ExpandText from '@/components/ExpandText';
import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import { EOperatorType } from '@/components/Table/constant';
import type { IColumn } from '@/components/Table/typing';
import ChiTietAnPham from '@/pages/SachTaiLieu/AnPham/components/ChiTiet';
import type { MuonSach } from '@/services/SachTaiLieu/MuonSach/typing';
import {
	colorTrangThaiMuonSach,
	ETrangThaiMuonSach,
	EVaiTroMuonTra,
	mapNameTrangThaiMuonSach,
} from '@/services/SachTaiLieu/constant';
import dayjs from '@/utils/dayjs';
import { resetFieldsForm } from '@/utils/utils';
import { CheckOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, message, Modal, Row, Segmented, Space, Spin, Tabs, Tag } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useIntl, useModel } from 'umi';
import FormMuonTraSach from '../../components/Form';
import GhiTraAnPham from '../../components/GhiTraSach';
import RenderHanTra from '../../components/RenderHanTra';
import '../../style.less';
import InforNguoiMuon from './Infor';
import StatNguoiDungAnPham from './Stat';

const FormGhiTraSach = (props: any) => {
	const { getData, hideCard } = props;
	const intl = useIntl();
	const [form] = Form.useForm();

	const {
		getModel,
		loading,
		visibleForm,
		setVisibleForm,
		setRecord,
		selectedIds,
		setSelectedIds,
		ghiTraThueMuonAnPhamModel,
	} = useModel('sachtailieu.muontra.muontra');
	const { setRecord: setRecSinhVien } = useModel('sinhvien.sinhvien');
	const { setRecord: setRecCanBo } = useModel('tochucnhansu.nhansu');
	const { getAllModel } = useModel('sachtailieu.anpham.thongtinanpham');
	const { visibleForm: visibleAnPham, setVisibleForm: setVisibleAnPham } = useModel('sachtailieu.anpham.anpham');

	const [danhSach, setDanhSach] = useState<MuonSach.IRecord[]>([]);
	const [visibleGhiTra, setVisibleGhiTra] = useState(false);
	const [tabActive, setTabActive] = useState<string>('1');

	const dkcb = Form.useWatch('dkcb', form);
	const soThe = Form.useWatch('soThe', form);
	const vaiTro = Form.useWatch('vaiTro', form) as EVaiTroMuonTra;

	const isSinhVien = vaiTro === EVaiTroMuonTra.SINHVIEN;
	const setBorrowerInfo = isSinhVien ? setRecSinhVien : setRecCanBo;

	const soTheInputRef = useRef<any>(null);
	const dkcbInputRef = useRef<any>(null);

	const getBorrower = async () => {
		try {
			const filter = [
				{
					active: true,
					field: isSinhVien ? 'ma' : 'maCanBo',
					values: [soThe],
					operator: EOperatorType.CONTAIN,
				},
			];

			const nguoiMuon: any = await getModel(
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
				message.error(intl.formatMessage({ id: 'sachtailieu.error.khongtontaisinhvien' }));
				setBorrowerInfo(undefined);
				setDanhSach([]);
				return;
			}

			const info = nguoiMuon[0];
			setBorrowerInfo(info);

			const res = await getModel(
				undefined,
				[
					{
						active: true,
						field: 'trangThai',
						operator: EOperatorType.INCLUDE,
						values: [ETrangThaiMuonSach.DANG_THUE_MUON],
					},
				],
				undefined,
				undefined,
				100,
				`nguoi-muon/${info?.ssoId}/page`,
				undefined,
				false,
			);

			setDanhSach(res || []);
		} catch (err) {
			console.error(err);
			message.error('Có lỗi xảy ra khi lấy thông tin người mượn!');
		}
	};

	const handleLuuDKCB = async () => {
		if (!dkcb) {
			message.error(intl.formatMessage({ id: 'sachtailieu.muontra.form.error.nhapdkcb' }));
			return;
		}

		const filter = [
			{
				active: true,
				field: 'soDangKyCaBiet',
				values: [dkcb],
				operator: EOperatorType.INCLUDE,
			},
			{
				active: true,
				field: 'trangThai',
				values: [ETrangThaiMuonSach.DANG_THUE_MUON],
				operator: EOperatorType.INCLUDE,
			},
			// {
			// 	active: true,
			// 	field: 'thanhLy',
			// 	values: [false],
			// 	operator: EOperatorType.EQUAL,
			// },
		];

		const anPhamData = await getModel(
			undefined,
			filter as any,
			undefined,
			undefined,
			undefined,
			undefined,
			undefined,
			false,
		);

		if (!anPhamData?.length) {
			message.error('Không tìm thấy ấn phẩm!');
			form.resetFields(['dkcb']);
			return;
		}

		setRecord(anPhamData[0]);
		setVisibleGhiTra(true);
		dkcbInputRef.current?.focus();
	};

	const handleGhiTra = async () => {
		try {
			const idsToProcess = selectedIds?.length ? selectedIds : danhSach.map((item) => item._id);
			await Promise.all(idsToProcess.map((id) => ghiTraThueMuonAnPhamModel(id)));
			message.success(`Đã ghi trả ${idsToProcess.length} ấn phẩm.`);

			getBorrower();
			getData();
		} catch (err) {
			console.log(err);
		}
	};

	const columns: IColumn<MuonSach.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'sachtailieu.muontra.column.dkcb' }),
			dataIndex: 'soDangKyCaBiet',
			align: 'center',
			width: 100,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.muontra.column.nhande' }),
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
			title: intl.formatMessage({ id: 'sachtailieu.muontra.column.nhaxuatban' }),
			align: 'center',
			render: (val, rec) => rec?.anPham?.nhaXuatBan,
			width: 140,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.muontra.column.namxuatban' }),
			align: 'center',
			render: (val, rec) => rec?.anPham?.namXuatBan,
			width: 90,
			filterType: 'string',
		},
		{
			title: 'Ngày mượn',
			dataIndex: 'thoiGianMuon',
			align: 'center',
			width: 150,
			render: (val, rec) => val && dayjs(val).format('DD/MM/YYYY'),
			filterType: 'date',
			sortable: true,
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.muontra.column.thoigiantra' }),
			dataIndex: 'thoiGianTra',
			width: 150,
			render: (val, rec) => val && dayjs(val).format('DD/MM/YYYY'),
			filterType: 'date',
			sortable: true,
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.muontra.column.ghichu' }),
			dataIndex: 'ghiChu',
			width: 220,
			render: (val) => <ExpandText>{val}</ExpandText>,
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.muontra.column.ghichutra' }),
			dataIndex: 'ghiChuTra',
			width: 220,
			render: (val) => <ExpandText>{val}</ExpandText>,
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.muontra.column.hantra' }),
			align: 'center',
			width: 140,
			render: (_, rec) => <RenderHanTra rec={rec} />,
			fixed: 'right',
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.muontra.column.trangthai' }),
			dataIndex: 'trangThai',
			align: 'center',
			width: 130,
			render: (val) => (
				<Tag color={colorTrangThaiMuonSach[val as ETrangThaiMuonSach]}>
					{mapNameTrangThaiMuonSach[val as ETrangThaiMuonSach]}
				</Tag>
			),
			fixed: 'right',
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.muontra.column.thaoTac' }),
			align: 'center',
			width: 60,
			fixed: 'right',
			render: (val, rec) => (
				<ButtonExtend
					onClick={() => {
						setRecord(rec);
						setVisibleGhiTra(true);
					}}
					tooltip={intl.formatMessage({ id: 'sachtailieu.ghitra.tooltip.ghitra' })}
					className='text-success'
					type='link'
					icon={<CheckOutlined />}
				/>
			),
		},
	];

	useEffect(() => {
		form.setFieldsValue({ vaiTro: EVaiTroMuonTra.SINHVIEN });
		setTimeout(() => {
			if (soTheInputRef.current) {
				soTheInputRef.current.focus();
			}
		}, 100);
	}, []);

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form, { vaiTro: EVaiTroMuonTra.SINHVIEN });
			setBorrowerInfo(undefined);
			setDanhSach([]);
		}

		form.setFieldsValue({ vaiTro: EVaiTroMuonTra.SINHVIEN });
		setTimeout(() => {
			if (soTheInputRef.current) {
				soTheInputRef.current.focus();
			}
		}, 100);
	}, [visibleForm]);

	const content = (
		<>
			{tabActive === '1' ? (
				<Form form={form} layout='vertical'>
					<div className='borrow-form-body'>
						<Row gutter={[12, 0]} wrap>
							<Col span={24} md={5}>
								<Row gutter={[12, 0]}>
									<Col span={24}>
										<Form.Item name='vaiTro'>
											<Segmented
												options={Object.values(EVaiTroMuonTra).map((item) => ({
													value: item,
													label: item,
												}))}
												onChange={() => {
													form.resetFields(['soThe']);
													setTimeout(() => soTheInputRef.current?.focus(), 100);
												}}
											/>
										</Form.Item>
									</Col>

									<Col span={24}>
										<Form.Item name='soThe' label={isSinhVien ? 'Mã sinh viên' : 'Mã cán bộ'}>
											<Input
												ref={soTheInputRef}
												placeholder={intl.formatMessage({ id: 'sachtailieu.muontra.form.placeholder.nhapmadinhdanh' })}
												onPressEnter={() => getBorrower()}
												allowClear
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
											label={intl.formatMessage({ id: 'sachtailieu.muontra.form.label.dangkycabiet' })}
										>
											<Input
												ref={dkcbInputRef}
												placeholder={intl.formatMessage({ id: 'sachtailieu.muontra.form.placeholder.nhapdkcb' })}
												onPressEnter={handleLuuDKCB}
												allowClear
											/>
										</Form.Item>
										<Space>
											<a onClick={handleLuuDKCB}>{intl.formatMessage({ id: 'sachtailieu.muontra.button.ghitra' })}</a>
										</Space>
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
											columns={columns}
											data={danhSach}
											loading={loading}
											size='small'
											addStt
											hasTotal
											otherProps={{
												rowKey: (rec: MuonSach.IRecord) => rec._id,
												rowSelection: {
													type: 'checkbox',
													selectedRowKeys: selectedIds ?? [],
													onChange: (selectedRowKeys: any[]) => setSelectedIds(selectedRowKeys),
													columnWidth: 40,
												},
											}}
											otherButtons={[
												<div className='fw500'>
													{intl.formatMessage({ id: 'sachtailieu.muontra.danhsach.dangmuon' })}
												</div>,
											]}
											onReload={getBorrower}
										/>
									</Col>
								</Row>
							</Col>
						</Row>
					</div>

					<div className='form-footerthuivien'>
						{/* <Popconfirm
							title={
								selectedIds?.length
									? `Bạn có chắc chắn muốn ghi trả ${selectedIds.length} ấn phẩm đã chọn?`
									: 'Không có bản ghi nào được chọn. Bạn có muốn ghi trả tất cả?'
							}
							onConfirm={handleGhiTra}
							okText='Đồng ý'
							cancelText='Hủy'
						> */}
						<ButtonExtend disabled={!danhSach.length} type='primary' onClick={handleGhiTra}>
							{intl.formatMessage({ id: 'sachtailieu.muontra.button.ghitra' })}{' '}
							{selectedIds?.length ? `(${selectedIds.length})` : ''}
						</ButtonExtend>
						{/* </Popconfirm> */}
						<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
					</div>
				</Form>
			) : (
				<FormMuonTraSach hideCard />
			)}

			<GhiTraAnPham
				visible={visibleGhiTra}
				setVisible={setVisibleGhiTra}
				getData={() => {
					getData();
					getBorrower();
				}}
				isThongTin
			/>

			<Modal
				title={intl.formatMessage({ id: 'sachtailieu.modal.chitietanpham' })}
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
		<Card title={intl.formatMessage({ id: 'sachtailieu.ghitra.title' })}>
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
				<Tabs.TabPane tab='Ghi trả' key='1' />
				<Tabs.TabPane tab='Ghi mượn' key='2' />
			</Tabs>
			{content}
		</Card>
	);
};

export default FormGhiTraSach;
