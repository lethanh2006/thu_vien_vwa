import ExpandText from '@/components/ExpandText';
import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import { EOperatorType } from '@/components/Table/constant';
import type { IColumn } from '@/components/Table/typing';
import type { MuonSach } from '@/services/SachTaiLieu/MuonSach/typing';
import {
	colorTrangThaiMuonSach,
	ETrangThaiMuonSach,
	EVaiTroMuonTra,
	mapNameTrangThaiMuonSach,
} from '@/services/SachTaiLieu/constant';
import { resetFieldsForm } from '@/utils/utils';
import { CheckOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, message, Popconfirm, Row, Segmented, Space, Spin, Tag } from 'antd';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { useIntl, useModel } from 'umi';
import GhiTraAnPham from '../../components/GhiTraSach';
import InforNguoiMuon from './Infor';
import StatNguoiDungAnPham from './Stat';
import RenderHanTra from '../../components/RenderHanTra';

const FormGhiTraSach = (props: any) => {
	const { getData } = props;
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
	const { record: recSinhVien, setRecord: setRecSinhVien } = useModel('sinhvien.sinhvien');
	const { record: recCanBo, setRecord: setRecCanBo } = useModel('tochucnhansu.nhansu');

	const [danhSach, setDanhSach] = useState<MuonSach.IRecord[]>([]);
	const [visibleGhiTra, setVisibleGhiTra] = useState(false);

	const dkcb = Form.useWatch('dkcb', form);
	const soThe = Form.useWatch('soThe', form);
	const vaiTro = Form.useWatch('vaiTro', form) as EVaiTroMuonTra;

	const isSinhVien = vaiTro === EVaiTroMuonTra.SINHVIEN;
	const borrowerInfo = isSinhVien ? recSinhVien : recCanBo;
	const setBorrowerInfo = isSinhVien ? setRecSinhVien : setRecCanBo;

	const soTheInputRef = useRef<any>(null);
	const dkcbInputRef = useRef<any>(null);

	const getAnPhanThueMuon = async () => {
		if (!borrowerInfo?.ssoId) return;

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
			`nguoi-muon/${borrowerInfo.ssoId}/page`,
			undefined,
			false,
		);

		setDanhSach(res || []);
	};

	const getBorrower = async () => {
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

		setBorrowerInfo(nguoiMuon[0] as any);
	};

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
				operator: EOperatorType.INCLUDE,
			},
			{
				active: true,
				field: 'trangThai',
				values: [ETrangThaiMuonSach.DANG_THUE_MUON],
				operator: EOperatorType.INCLUDE,
			},
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
			getData();
			getAnPhanThueMuon();
			getBorrower();
		} catch (err) {
			message.error('Có lỗi xảy ra khi ghi trả.');
		}
	};

	const columns: IColumn<MuonSach.IRecord>[] = [
		{
			title: 'Nhan đề',
			dataIndex: ['anPham', 'nhanDe'],
			width: 220,
			render: (val, rec) => <ExpandText>{rec?.anPham?.nhanDe}</ExpandText>,
			filterType: 'string',
		},
		{
			title: 'Tác giả',
			dataIndex: ['anPham', 'tacGia'],
			width: 180,
			render: (val, rec) => rec?.anPham?.tacGia,
			filterType: 'string',
		},
		{
			title: 'ĐKCB',
			dataIndex: 'soDangKyCaBiet',
			align: 'center',
			width: 120,
			filterType: 'string',
		},
		{
			title: 'Thời gian mượn',
			dataIndex: 'thoiGianMuon',
			align: 'center',
			width: 150,
			render: (val, rec) => val && moment(val).format('DD/MM/YYYY'),
			filterType: 'date',
			sortable: true,
		},
		{
			title: 'Thời gian trả',
			dataIndex: 'thoiGianTra',
			width: 150,
			render: (val, rec) => val && moment(val).format('DD/MM/YYYY'),
			filterType: 'date',
			sortable: true,
		},
		{
			title: 'Ghi chú',
			dataIndex: 'ghiChu',
			width: 220,
			render: (val) => <ExpandText>{val}</ExpandText>,
		},
		{
			title: 'Ghi chú trả',
			dataIndex: 'ghiChuTra',
			width: 220,
			render: (val) => <ExpandText>{val}</ExpandText>,
		},
		{
			title: 'Hạn trả',
			align: 'center',
			width: 140,
			render: (_, rec) => <RenderHanTra rec={rec} />,
			fixed: 'right',
		},
		{
			title: 'Trạng thái',
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
			title: 'Thao tác',
			align: 'center',
			width: 60,
			fixed: 'right',
			render: (val, rec) => (
				<ButtonExtend
					onClick={() => {
						setRecord(rec);
						setVisibleGhiTra(true);
					}}
					tooltip='Ghi trả'
					className='text-success'
					type='link'
					icon={<CheckOutlined />}
				/>
			),
		},
	];

	useEffect(() => {
		getAnPhanThueMuon();
	}, [borrowerInfo?.ssoId]);

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
			setDanhSach([]);
			setBorrowerInfo(undefined);
		} else {
			form.setFieldsValue({ vaiTro: EVaiTroMuonTra.SINHVIEN });
			soTheInputRef.current?.focus();
		}
	}, [visibleForm]);

	return (
		<Card title='Ghi trả sinh viên mượn sách'>
			<Form form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					<Col span={24} md={6}>
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
										placeholder='Nhập mã định danh'
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
								<Form.Item name='dkcb' label='Đăng ký cá biệt'>
									<Input
										ref={dkcbInputRef}
										placeholder='Nhập đăng ký cá biệt'
										onPressEnter={handleLuuDKCB}
										allowClear
									/>
								</Form.Item>
								<Space>
									<a onClick={handleLuuDKCB}>Ghi trả</a>
								</Space>
							</Col>
						</Row>
					</Col>

					<Col span={24} md={18}>
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
								<div className='fw500' style={{ marginTop: 12, marginBottom: 12 }}>
									Danh sách ấn phẩm đang mượn
								</div>

								<TableStaticData
									columns={columns}
									data={danhSach}
									loading={loading}
									addStt
									hasTotal
									otherProps={{
										rowKey: (rec: MuonSach.IRecord) => rec._id,
										rowSelection: {
											type: 'checkbox',
											selectedRowKeys: selectedIds ?? [],
											onChange: setSelectedIds,
											columnWidth: 40,
										},
									}}
								>
									<Popconfirm
										title={
											selectedIds?.length
												? `Bạn có chắc chắn muốn ghi trả ${selectedIds.length} ấn phẩm đã chọn?`
												: 'Không có bản ghi nào được chọn. Bạn có muốn ghi trả tất cả?'
										}
										onConfirm={handleGhiTra}
										okText='Đồng ý'
										cancelText='Hủy'
									>
										<ButtonExtend disabled={!danhSach.length} type='primary'>
											Ghi trả {selectedIds?.length ? `(${selectedIds.length})` : ''}
										</ButtonExtend>
									</Popconfirm>
								</TableStaticData>
							</Col>
						</Row>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>

			<GhiTraAnPham
				visible={visibleGhiTra}
				setVisible={setVisibleGhiTra}
				getData={() => {
					getData();
					getAnPhanThueMuon();
					getBorrower();
				}}
				isThongTin
			/>
		</Card>
	);
};

export default FormGhiTraSach;
