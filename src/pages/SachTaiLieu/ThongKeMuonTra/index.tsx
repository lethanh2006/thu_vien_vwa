import ExpandText from '@/components/ExpandText';
import MyDateRangePicker from '@/components/MyDatePicker/RangePicker';
import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import { ETrangThaiMuonSach, EVaiTroMuonTra } from '@/services/SachTaiLieu/constant';
import type { MuonSach } from '@/services/SachTaiLieu/MuonSach/typing';
import { Card, Space, Tabs } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { useModel } from 'umi';
import StatMuonTraSach from '../MuonTraSach/components/Stat';
import { EOperatorType } from '@/components/Table/constant';

const ThongKeMuonTraPage = () => {
	const [datePicker, setDatePicker] = useState<any>();
	const [tabActive, setTabActive] = useState<ETrangThaiMuonSach>(ETrangThaiMuonSach.DANG_THUE_MUON);
	const { getModel, page, limit } = useModel('sachtailieu.muontra.muontra');

	const getData = () => {
		const filter = [
			{
				active: true,
				field: 'thoiGianMuon',
				values: [moment(datePicker?.[0]).startOf('date'), moment(datePicker?.[1]).endOf('date')],
				operator: EOperatorType.BETWEEN,
			},
		];

		getModel({ trangThai: tabActive }, datePicker ? filter : (undefined as any));
	};

	const columns: IColumn<MuonSach.IRecord>[] = [
		{
			title: 'Vai trò',
			dataIndex: ['phieuMuonTra', 'vaiTro'],
			align: 'center',
			width: 90,
			render: (val, rec) => rec?.phieuMuonTra?.vaiTro,
			filterType: 'select',
			filterData: Object.values(EVaiTroMuonTra),
		},
		{
			title: 'Mã định danh',
			dataIndex: ['phieuMuonTra', 'maDinhDanhNguoiMuon'],
			align: 'center',
			width: 120,
			render: (val, rec) => rec?.phieuMuonTra?.maDinhDanhNguoiMuon,
			filterType: 'string',
		},
		{
			title: 'Họ tên',
			dataIndex: ['phieuMuonTra', 'hoTenNguoiMuon'],
			width: 180,
			render: (val, rec) => rec?.phieuMuonTra?.hoTenNguoiMuon,
			filterType: 'string',
		},
		{
			title: 'Nhan đề',
			dataIndex: ['anPham', 'nhanDe'],
			width: 220,
			render: (val, rec) => rec?.anPham?.nhanDe,
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
			width: 120,
			filterType: 'string',
		},
		{
			title: 'Thời gian mượn',
			dataIndex: 'thoiGianMuon',
			align: 'center',
			width: 150,
			render: (val, rec) => {
				if (!val) return null;
				const formattedTime = moment(val).startOf('day').format('DD/MM/YYYY');
				const expirationTime = rec?.expired ? moment(rec.expired).startOf('day') : moment().startOf('day');
				const now = moment().startOf('day');
				const isOverdue = now.isAfter(expirationTime);
				const isApproachingDeadline = !isOverdue && expirationTime.diff(now, 'days') <= 7;
				const color = isOverdue ? 'red' : isApproachingDeadline ? 'orange' : 'inherit';
				const fontWeight = isOverdue || isApproachingDeadline ? 600 : 'normal';
				return <span style={{ color, fontWeight }}>{formattedTime}</span>;
			},
			filterType: 'date',
			sortable: true,
		},

		{
			title: 'Hạn trả',
			align: 'center',
			dataIndex: 'expired',
			width: 130,
			render: (val, rec) => val && moment(val).format('DD/MM/YYYY'),
			filterType: 'date',
			sortable: true,
		},
		{
			title: 'Thời gian trả',
			dataIndex: 'thoiGianTra',
			width: 150,
			render: (val, rec) => {
				if (!val) return null;
				const formattedTime = moment(val).startOf('day').format('DD/MM/YYYY');
				const expirationTime = rec?.expired ? moment(rec.expired).startOf('day') : moment().startOf('day');
				const isOverdue = moment().startOf('day').isAfter(expirationTime);
				return (
					<span style={{ color: isOverdue ? 'red' : 'inherit', fontWeight: isOverdue ? 600 : 0 }}>{formattedTime}</span>
				);
			},
			filterType: 'date',
			sortable: true,
		},
		{
			title: 'Ghi chú',
			dataIndex: 'ghiChu',
			width: 220,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
		},
		{
			title: 'Ghi chú trả',
			dataIndex: 'ghiChuTra',
			width: 220,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
		},
	];

	return (
		<Card title='Thống kê mượn trả'>
			<div style={{ marginBottom: 12 }}>
				<StatMuonTraSach />
			</div>

			<Space style={{ marginBottom: 12 }}>
				<MyDateRangePicker
					value={datePicker}
					onChange={(val) => setDatePicker(val)}
					allowClear
					style={{ width: 300 }}
				/>
			</Space>
			<Tabs onChange={(tab) => setTabActive(tab as ETrangThaiMuonSach)} activeKey={tabActive}>
				<Tabs.TabPane tab='Lịch sử đang mượn' key={ETrangThaiMuonSach.DANG_THUE_MUON} />
				<Tabs.TabPane tab='Lịch sử đã mượn' key={ETrangThaiMuonSach.DA_TRA} />
			</Tabs>

			<TableBase
				getData={getData}
				columns={columns}
				dependencies={[page, limit, tabActive, datePicker]}
				modelName='sachtailieu.muontra.muontra'
				buttons={{ create: false }}
				hideCard
			/>
		</Card>
	);
};

export default ThongKeMuonTraPage;
