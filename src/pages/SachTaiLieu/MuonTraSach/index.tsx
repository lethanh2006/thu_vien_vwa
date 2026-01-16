import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { EOperatorType } from '@/components/Table/constant';
import ModalImport from '@/components/Table/Import';
import type { IColumn } from '@/components/Table/typing';
import { colorTrangThaiDuyeMuonSach, ETrangThaiDuyetMuonSach, EVaiTroMuonTra } from '@/services/SachTaiLieu/constant';
import type { PhieuMuonTra } from '@/services/SachTaiLieu/PhieuMuonTra/typing';
import dayjs from '@/utils/dayjs';
import { DeleteOutlined, PlusCircleOutlined, SettingOutlined } from '@ant-design/icons';
import { Card, Popconfirm, Select, Tabs, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import CauHinhThoiHanMuonTra from './components/CauHinh';
import Form from './components/Form';
import StatMuonTraSach from './components/Stat';
import MuonTraSachPage from './MuonTra';

const PhieuMuonTraSachPage = () => {
	const {
		page,
		limit,
		getModel,
		handleView,
		setEdit,
		setIsView,
		isView,
		setRecord,
		setVisibleForm,
		deleteModel,
		// ngoaiThoiGian,
	} = useModel('sachtailieu.muontra.phieumuontra');
	const { getSettingModel, settingMuonTra, thongKeMuonTraSachModel } = useModel('sachtailieu.muontra.muontra');
	const { setDanhSach } = useModel('sachtailieu.anpham.anphamxepgia');
	const [visibleCauHinh, setVisibleCauHinh] = useState<boolean>(false);
	const [visibleImport, setVisibleImport] = useState(false);
	const [tabActive, setTabActive] = useState<string>('1');
	const [vaiTro, setVaiTro] = useState<EVaiTroMuonTra>(EVaiTroMuonTra.SINHVIEN);

	// useEffect(() => {
	// 	if (ngoaiThoiGian) {
	// 		Modal.info({
	// 			bodyStyle: { padding: 0 },
	// 			icon: null,
	// 			okButtonProps: { hidden: true },
	// 			content: (
	// 				<>
	// 					<div style={{ marginTop: -8 }}>
	// 						<img style={{ width: '100%' }} src='/logi-thong-bao.png' alt={'image'} />
	// 					</div>
	// 					<div style={{ padding: '20px 16px' }}>
	// 						<div style={{ color: '#1890ff', fontSize: 20, fontWeight: 600, textAlign: 'center' }}>
	// 							⏰ Thời gian mượn – trả sách: 08:00 - 17:00 hằng ngày 📚
	// 						</div>
	// 					</div>
	// 					<div className='form-footer'>
	// 						<Button
	// 							type={'primary'}
	// 							onClick={() => {
	// 								Modal.destroyAll();
	// 								history.push('/');
	// 							}}
	// 						>
	// 							Đóng
	// 						</Button>
	// 					</div>
	// 				</>
	// 			),
	// 		});
	// 	}
	// }, [ngoaiThoiGian]);

	useEffect(() => {
		if (!settingMuonTra) getSettingModel();
	}, []);

	const filter = [
		{
			active: true,
			field: 'vaiTro',
			values: [vaiTro],
			operator: EOperatorType.INCLUDE,
		},
	];

	const getData = () => {
		getModel(undefined, filter as any);
	};

	const onCell = (rec: PhieuMuonTra.IRecord) => ({
		onClick: () => handleView(rec),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<PhieuMuonTra.IRecord>[] = [
		{
			title: 'Mã định danh',
			dataIndex: 'maDinhDanhNguoiMuon',
			align: 'center',
			width: 120,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Họ tên',
			dataIndex: 'hoTenNguoiMuon',
			width: 150,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Khóa sinh viên',
			dataIndex: 'tenKhoaSinhVienNguoiMuon',
			width: 90,
			filterType: 'string',
			onCell,
			hide: vaiTro === EVaiTroMuonTra.CANBO,
		},
		{
			title: 'Khóa ngành',
			dataIndex: 'tenNganhNguoiMuon',
			width: 120,
			filterType: 'string',
			onCell,
			hide: vaiTro === EVaiTroMuonTra.CANBO,
		},
		// {
		// 	title: 'Lớp hành chính',
		// 	dataIndex: 'tenLopHanhChinh',
		// 	width: 120,
		// 	render: (val, rec) => val ?? rec?.tenLopHanhChinhNguoiMuon,
		// 	filterType: 'string',
		// 	onCell,
		// 	hide: vaiTro === EVaiTroMuonTra.CANBO,
		// },
		{
			title: 'Đơn vị',
			dataIndex: 'tenDonViNguoiMuon',
			width: 120,
			filterType: 'string',
			onCell,
			hide: vaiTro === EVaiTroMuonTra.SINHVIEN,
		},
		{
			title: 'Thời gian đăng ký',
			dataIndex: 'thoiGianDangKy',
			align: 'center',
			width: 120,
			render: (val, rec) => val && dayjs(val).format('DD/MM/YYYY'),
			filterType: 'date',
			sortable: true,
			onCell,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThaiDuyet',
			align: 'center',
			width: 120,
			render: (val, rec) => <Tag color={colorTrangThaiDuyeMuonSach[val as ETrangThaiDuyetMuonSach]}>{val}</Tag>,
			filterType: 'select',
			filterData: Object.values(ETrangThaiDuyetMuonSach),
			onCell,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 60,
			fixed: 'right',
			render: (val, rec) => (
				<Popconfirm
					onConfirm={() =>
						deleteModel(rec._id).then(() => {
							thongKeMuonTraSachModel();
						})
					}
					title='Bạn có chắc chắn muốn xóa thông tin này?'
					placement='topRight'
				>
					<ButtonExtend tooltip='Xóa' danger type='link' icon={<DeleteOutlined />} />
				</Popconfirm>
			),
		},
	];

	return (
		<Card
			title='Danh sách phiếu mượn'
			extra={
				<ButtonExtend
					tooltip='Cấu hình'
					onClick={() => setVisibleCauHinh(true)}
					icon={<SettingOutlined />}
					type='link'
				/>
			}
		>
			<Tabs onChange={(tab) => setTabActive(tab)} activeKey={tabActive}>
				<Tabs.TabPane tab='Phiếu mượn' key='1' />
				<Tabs.TabPane tab='Lịch sử mượn' key='2' />
			</Tabs>

			<div style={{ marginBottom: 12 }}>
				<Select
					style={{ width: 250 }}
					value={vaiTro}
					placeholder='Chọn đối tượng'
					options={Object.values(EVaiTroMuonTra).map((item) => ({
						value: item,
						label: item,
					}))}
					onChange={(val) => setVaiTro(val)}
				/>
			</div>

			{tabActive === '1' ? (
				<>
					<TableBase
						getData={getData}
						columns={columns}
						dependencies={[page, limit, vaiTro]}
						modelName='sachtailieu.muontra.phieumuontra'
						widthDrawer={isView ? 1000 : 'full'}
						Form={isView ? MuonTraSachPage : Form}
						hideCard
						buttons={{ create: false }}
						otherButtons={[
							<ButtonExtend
								key={'1'}
								onClick={() => {
									setRecord({} as PhieuMuonTra.IRecord);
									setEdit(false);
									setIsView(false);
									setVisibleForm(true);

									//Set danhSach đăng ký cá biệt rỗng
									setDanhSach([]);
								}}
								icon={<PlusCircleOutlined />}
								type='primary'
								notHideText
								tooltip='Ghi mượn'
							>
								Ghi mượn
							</ButtonExtend>,
							// <ButtonExtend key={'import'} icon={<ImportOutlined />} onClick={() => setVisibleImport(true)}>
							// 	Nhập dữ liệu
							// </ButtonExtend>,
						]}
					/>
				</>
			) : (
				<>
					<div style={{ marginBottom: 12 }}>
						<StatMuonTraSach vaiTro={vaiTro} />
					</div>
					<MuonTraSachPage tatCaLichSu vaiTro={vaiTro} />
				</>
			)}

			<CauHinhThoiHanMuonTra visible={visibleCauHinh} setVisible={setVisibleCauHinh} />

			<ModalImport
				visible={visibleImport}
				modelName='sachtailieu.muontra.phieumuontra'
				onCancel={() => setVisibleImport(false)}
				titleTemplate={'Biểu mẫu phiếu mượn.xlsx'}
				onOk={() => getData()}
			/>
		</Card>
	);
};

export default PhieuMuonTraSachPage;
