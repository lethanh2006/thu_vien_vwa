import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import type { IColumn } from '@/components/Table/typing';
import { colorTrangThaiDuyeMuonSach, ETrangThaiDuyetMuonSach, EVaiTroMuonTra } from '@/services/SachTaiLieu/constant';
import type { PhieuMuonTra } from '@/services/SachTaiLieu/PhieuMuonTra/typing';
import { DeleteOutlined, PlusCircleOutlined, SettingOutlined } from '@ant-design/icons';
import { Card, Popconfirm, Tabs, Tag } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import CauHinhThoiHanMuonTra from './components/CauHinh';
import Form from './components/Form';
import StatMuonTraSach from './components/Stat';
import MuonTraSachPage from './MuonTra';

const PhieuMuonTraSachPage = () => {
	const { page, limit, handleView, setEdit, setIsView, isView, setRecord, setVisibleForm, deleteModel } = useModel(
		'sachtailieu.muontra.phieumuontra',
	);
	const { getSettingModel, settingMuonTra, thongKeMuonTraSachModel } = useModel('sachtailieu.muontra.muontra');
	const { setDanhSach } = useModel('sachtailieu.anpham.anphamxepgia');
	const [visibleCauHinh, setVisibleCauHinh] = useState<boolean>(false);
	const [tabActive, setTabActive] = useState<string>('1');

	useEffect(() => {
		if (!settingMuonTra) getSettingModel();
	}, []);

	const onCell = (rec: PhieuMuonTra.IRecord) => ({
		onClick: () => handleView(rec),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<PhieuMuonTra.IRecord>[] = [
		{
			title: 'Vai trò',
			dataIndex: 'vaiTro',
			align: 'center',
			width: 90,
			filterType: 'select',
			filterData: Object.values(EVaiTroMuonTra),
			onCell,
		},
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
			title: 'Thời gian đăng ký',
			dataIndex: 'thoiGianDangKy',
			align: 'center',
			width: 120,
			render: (val, rec) => val && moment(val).format('DD/MM/YYYY'),
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
			<div style={{ marginBottom: 12 }}>
				<StatMuonTraSach />
			</div>

			<Tabs onChange={(tab) => setTabActive(tab)} activeKey={tabActive}>
				<Tabs.TabPane tab='Phiếu mượn' key='1' />
				<Tabs.TabPane tab='Tất cả lịch sử' key='2' />
			</Tabs>

			{tabActive === '1' ? (
				<TableBase
					columns={columns}
					dependencies={[page, limit]}
					modelName='sachtailieu.muontra.phieumuontra'
					widthDrawer={1100}
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
					]}
				/>
			) : (
				<MuonTraSachPage tatCaLichSu />
			)}

			<CauHinhThoiHanMuonTra visible={visibleCauHinh} setVisible={setVisibleCauHinh} />
		</Card>
	);
};

export default PhieuMuonTraSachPage;
