import MyDateRangePicker from '@/components/MyDatePicker/RangePicker';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { EOperatorType } from '@/components/Table/constant';
import type { IColumn } from '@/components/Table/typing';
import { ETrangThaiMuonSach, EVaiTroMuonTra } from '@/services/SachTaiLieu/constant';
import type { MuonSach } from '@/services/SachTaiLieu/MuonSach/typing';
import dayjs from '@/utils/dayjs';
import { ExportOutlined } from '@ant-design/icons';
import { Card, Select, Space, Tabs } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import RenderHanTra from '../MuonTraSach/components/RenderHanTra';
import ModalExportAnPham from '../ThongKeAnPham/ModalExport';
import StatThongKeMuonTra from './Stat';

const ThongKeMuonTraPage = () => {
	const { getModel, page, limit } = useModel('sachtailieu.muontra.muontra');
	const [trangThai, setTrangThai] = useState<ETrangThaiMuonSach>(ETrangThaiMuonSach.DANG_THUE_MUON);
	const [vaiTro, setVaiTro] = useState<EVaiTroMuonTra>(EVaiTroMuonTra.SINHVIEN);
	const [datePicker, setDatePicker] = useState<any>();
	const [modalExport, setModalExport] = useState<boolean>(false);

	const filter = [
		{
			active: true,
			field: 'trangThai',
			values: [trangThai],
			operator: EOperatorType.INCLUDE,
		},
		{
			active: true,
			field: ['phieuMuonTra', 'vaiTro'],
			values: [vaiTro],
			operator: EOperatorType.INCLUDE,
		},
		datePicker && {
			active: true,
			field: trangThai === ETrangThaiMuonSach.DANG_THUE_MUON ? 'thoiGianMuon' : 'thoiGianTra',
			values: [dayjs(datePicker?.[0]).startOf('date'), dayjs(datePicker?.[1]).endOf('date')],
			operator: EOperatorType.BETWEEN,
		},
	];

	const getData = () => {
		getModel(undefined, filter?.filter(Boolean)?.length ? filter?.filter(Boolean) : undefined);
	};

	const columns: IColumn<MuonSach.IRecord>[] = [
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
			title: 'ĐKCB',
			dataIndex: 'soDangKyCaBiet',
			width: 120,
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
			title: 'Ngày mượn',
			dataIndex: 'thoiGianMuon',
			align: 'center',
			width: 120,
			render: (val, rec) => val && dayjs(val).format('DD/MM/YYYY'),
			filterType: 'date',
			sortable: true,
			hide: trangThai === ETrangThaiMuonSach.DA_TRA,
			fixed: 'right',
		},
		{
			title: 'Thời gian trả',
			dataIndex: 'thoiGianTra',
			align: 'center',
			width: 120,
			render: (val, rec) => val && dayjs(val).format('DD/MM/YYYY'),
			filterType: 'date',
			sortable: true,
			hide: trangThai === ETrangThaiMuonSach.DANG_THUE_MUON,
			fixed: 'right',
		},
		// {
		// 	title: 'Ghi chú',
		// 	dataIndex: 'ghiChu',
		// 	width: 220,
		// 	render: (val, rec) => <ExpandText>{val}</ExpandText>,
		// },
		// {
		// 	title: 'Ghi chú trả',
		// 	dataIndex: 'ghiChuTra',
		// 	width: 220,
		// 	render: (val, rec) => <ExpandText>{val}</ExpandText>,
		// },
		{
			title: 'Trạng thái',
			align: 'center',
			width: 140,
			render: (_, rec) => <RenderHanTra rec={rec} />,
			fixed: 'right',
		},
	];

	return (
		<Card title='Thống kê mượn trả'>
			<Tabs onChange={(tab) => setTrangThai(tab as ETrangThaiMuonSach)} activeKey={trangThai}>
				<Tabs.TabPane tab='Lịch sử đang mượn' key={ETrangThaiMuonSach.DANG_THUE_MUON} />
				<Tabs.TabPane tab='Lịch sử đã trả' key={ETrangThaiMuonSach.DA_TRA} />
			</Tabs>

			<Space style={{ marginBottom: 12 }} align='center'>
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

				<div style={{ display: 'flex', alignItems: 'center' }}>
					<span style={{ marginRight: 8, whiteSpace: 'nowrap' }}>
						{trangThai === ETrangThaiMuonSach.DANG_THUE_MUON ? 'Ngày mượn:' : 'Thời gian trả:'}
					</span>
					<MyDateRangePicker
						value={datePicker}
						onChange={(val) => setDatePicker(val)}
						allowClear
						style={{ width: 300 }}
						placeholder={['Từ ngày', 'Đến ngày']}
						ranges={{
							'Hôm nay': [dayjs().startOf('date'), dayjs().endOf('date')],
							'Tuần này': [dayjs().startOf('week'), dayjs().endOf('week')],
							'Tháng này': [dayjs().startOf('M'), dayjs().endOf('M')],
						}}
						format='DD/MM/YYYY'
					/>
				</div>
			</Space>

			<div style={{ marginBottom: 12 }}>
				{/* <StatMuonTraSach /> */}
				<StatThongKeMuonTra filter={filter} trangThai={trangThai} />
			</div>

			<TableBase
				getData={getData}
				columns={columns}
				params={filter}
				dependencies={[page, limit, trangThai, datePicker, vaiTro]}
				modelName='sachtailieu.muontra.muontra'
				buttons={{ create: false }}
				hideCard
				otherButtons={[
					<ButtonExtend key={'1'} icon={<ExportOutlined />} onClick={() => setModalExport(true)}>
						Xuất dữ liệu
					</ButtonExtend>,
				]}
			/>

			<ModalExportAnPham
				title='Xuất dữ liệu thống kê mượn trả'
				visible={modalExport}
				setVisible={setModalExport}
				trangThai={trangThai}
				vaiTro={vaiTro}
			/>
		</Card>
	);
};

export default ThongKeMuonTraPage;
