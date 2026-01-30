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
import { useIntl, useModel } from 'umi';
import RenderHanTra from '../MuonTraSach/components/RenderHanTra';
import ModalExportAnPham from '../ThongKeAnPham/ModalExport';
import StatThongKeMuonTra from './Stat';

const ThongKeMuonTraPage = () => {
	const { getModel, page, limit } = useModel('sachtailieu.muontra.muontra');
	const [trangThai, setTrangThai] = useState<ETrangThaiMuonSach>(ETrangThaiMuonSach.DANG_THUE_MUON);
	const [vaiTro, setVaiTro] = useState<EVaiTroMuonTra>(EVaiTroMuonTra.SINHVIEN);
	const [datePicker, setDatePicker] = useState<any>();
	const [modalExport, setModalExport] = useState<boolean>(false);

	const intl = useIntl();

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
			title: intl.formatMessage({ id: 'sachtailieu.thongke.column.madinhdanh' }),
			dataIndex: ['phieuMuonTra', 'maDinhDanhNguoiMuon'],
			align: 'center',
			width: 120,
			render: (val, rec) => rec?.phieuMuonTra?.maDinhDanhNguoiMuon,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.thongke.column.hoten' }),
			dataIndex: ['phieuMuonTra', 'hoTenNguoiMuon'],
			width: 180,
			render: (val, rec) => rec?.phieuMuonTra?.hoTenNguoiMuon,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.thongke.column.dkcb' }),
			dataIndex: 'soDangKyCaBiet',
			width: 120,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.thongke.column.nhande' }),
			dataIndex: ['anPham', 'nhanDe'],
			width: 220,
			render: (val, rec) => rec?.anPham?.nhanDe,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.thongke.column.tacgia' }),
			dataIndex: ['anPham', 'tacGia'],
			width: 180,
			render: (val, rec) => rec?.anPham?.tacGia,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.thongke.column.thoigianmuon' }),
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
			title: intl.formatMessage({ id: 'sachtailieu.thongke.column.thoigiantra' }),
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
			title: intl.formatMessage({ id: 'sachtailieu.thongke.column.trangthai' }),
			align: 'center',
			width: 140,
			render: (_, rec) => <RenderHanTra rec={rec} />,
			fixed: 'right',
		},
	];

	return (
		<Card title={intl.formatMessage({ id: 'sachtailieu.thongke.title' })}>
			<Tabs onChange={(tab) => setTrangThai(tab as ETrangThaiMuonSach)} activeKey={trangThai}>
				<Tabs.TabPane
					tab={intl.formatMessage({ id: 'sachtailieu.thongke.tab.lichsudangmuon' })}
					key={ETrangThaiMuonSach.DANG_THUE_MUON}
				/>
				<Tabs.TabPane
					tab={intl.formatMessage({ id: 'sachtailieu.thongke.tab.lichsudatra' })}
					key={ETrangThaiMuonSach.DA_TRA}
				/>
			</Tabs>

			<Space style={{ marginBottom: 12 }} align='center'>
				<Select
					style={{ width: 250 }}
					value={vaiTro}
					placeholder={intl.formatMessage({ id: 'sachtailieu.muontra.placeholder.chondoituong' })}
					options={Object.values(EVaiTroMuonTra).map((item) => ({
						value: item,
						label: item,
					}))}
					onChange={(val) => setVaiTro(val)}
				/>

				<div style={{ display: 'flex', alignItems: 'center' }}>
					<span style={{ marginRight: 8, whiteSpace: 'nowrap' }}>
						{intl.formatMessage({
							id:
								trangThai === ETrangThaiMuonSach.DANG_THUE_MUON
									? 'sachtailieu.thongke.label.thoigianmuon'
									: 'sachtailieu.thongke.label.thoigiantra',
						})}
					</span>
					<MyDateRangePicker
						value={datePicker}
						onChange={(val) => setDatePicker(val)}
						allowClear
						style={{ width: 300 }}
						placeholder={[
							intl.formatMessage({ id: 'sachtailieu.thongke.datepicker.tungay' }),
							intl.formatMessage({ id: 'sachtailieu.thongke.datepicker.denngay' }),
						]}
						ranges={{
							[intl.formatMessage({ id: 'sachtailieu.thongke.datepicker.homnay' })]: [
								dayjs().startOf('date'),
								dayjs().endOf('date'),
							],
							[intl.formatMessage({ id: 'sachtailieu.thongke.datepicker.tuannay' })]: [
								dayjs().startOf('week'),
								dayjs().endOf('week'),
							],
							[intl.formatMessage({ id: 'sachtailieu.thongke.datepicker.thangnay' })]: [
								dayjs().startOf('M'),
								dayjs().endOf('M'),
							],
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
						{intl.formatMessage({ id: 'sachtailieu.thongke.button.xuatdulieu' })}
					</ButtonExtend>,
				]}
			/>

			<ModalExportAnPham
				title={intl.formatMessage({ id: 'sachtailieu.thongke.modal.title' })}
				visible={modalExport}
				setVisible={setModalExport}
				trangThai={trangThai}
				vaiTro={vaiTro}
			/>
		</Card>
	);
};

export default ThongKeMuonTraPage;
